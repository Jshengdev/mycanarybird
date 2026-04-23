'use client';

/**
 * CanaryMascot — the bird that "watches" you read the page.
 *
 * Round B — scroll-driven, per-section behavior (replaces the time-based
 * focus-point cycle of earlier rounds).
 *
 * Motion model, summarized per section:
 *   hero            → sits on top edge of the H1 headline bounding box.
 *   flow-install    → initial perch on the "01 · Install" numberRow. Then a
 *                     one-shot cinematic fires (cursor flies in from offscreen
 *                     right, morphs to a hand, grabs the bird, curves into
 *                     the Install visual panel). Post-cinematic the bird
 *                     stays inside the panel via `birdAnchorRef`.
 *   flow-see        → rides the playhead scrub inside SeeVisual; continuous
 *                     rAF tracks the playhead every frame.
 *   flow-stop       → bounces off the four walls of the [data-stop-cage].
 *                     Mini physics loop, trapped-bird feel.
 *   flow-learn      → perches on the "Add rule" button inside LearnVisual.
 *   use-cases       → perches on the active tab; moves on tab click.
 *   closer          → flies to the "Get early access →" submit button.
 *   view-source     → sits on the "View source code" headline.
 *   session-log     → sits on the "Caught you." headline.
 *
 * Unified perch math (§"Perch math"): bird sits ON TOP of the perch's
 * bounding box (not above it). Horizontally centered on the rect, vertically
 * offset by BIRD_SIZE + OUTLINE_OFFSET so the body sits exactly on the
 * outline drawn by `.cw-perched`.
 *
 * Per-frame recalc: while a section is active and no cinematic/bounce is
 * overriding the position, a continuous rAF loop recomputes the bird's
 * position every frame. This keeps the bird glued to animating perches
 * (SeeVisual's playhead moves 60fps) without a separate scroll-based rAF.
 *
 * birdHeldPos (cursor-actor override) still works: during the install
 * cinematic the cinematic drives the bird's position directly, and the
 * per-frame recalc skips itself.
 *
 * Reduced-motion:
 *   - no continuous rAF (scroll-only recalc)
 *   - no install cinematic (bird just snaps to panel)
 *   - no bounce physics (bird just sits in the cage)
 *   - no transforms/transitions (snap positions)
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { useCanaryWatch } from './context';
import styles from './CanaryMascot.module.css';

const BIRD_SIZE = 28;
/** Matches `outline-offset` on `.cw-perched` — bird sits ON the outline. */
const OUTLINE_OFFSET = 6;

const SWITCH_HYSTERESIS_PX = 60;
const SCROLL_IDLE_MS = 180;
const TRAVEL_MS = 820;
const WIGGLE_DURATION_MS = 1200;

/** Bounce physics (flow-stop). px per second, constant magnitude. */
const BOUNCE_SPEED = 120;

/** Install cinematic timings. */
const CINE_CURSOR_FLY_MS = 600;     // cursor flies in from offscreen right
const CINE_MORPH_MS = 200;          // cursor → hand cross-fade
const CINE_GLIDE_APEX_MS = 500;     // first half of the curved glide (ease-out)
const CINE_GLIDE_LAND_MS = 500;     // second half (ease-in)
const CINE_DROP_MS = 120;           // settle into the panel
const CINE_HAND_EXIT_MS = 500;      // hand flies back offscreen right

/**
 * After the bird settles inside the Install panel post-cinematic, land it
 * a little inset from the top edge of the visualFrame so it reads as
 * "inside the panel," not "outlined on top of it."
 */
const PANEL_INSET_X = 24;
const PANEL_INSET_Y = 24;

/**
 * Cascades narrate what Canary "observes" + "learns" when dropped into each
 * product step. Kept (Install-only now; see/stop/learn entries preserved for
 * future slots but unused by this round).
 */
const DROP_CASCADES: Record<string, Array<{ delay: number; type: 'OBSERVED' | 'LEARNED' | 'SUGGESTED'; target: string }>> = {
  install: [
    { delay: 120, type: 'OBSERVED', target: 'Canary · canary init --watch · hooked' },
    { delay: 900, type: 'LEARNED', target: 'Stack · claude-code, browser-use, openclaw, hermes' },
    { delay: 1800, type: 'SUGGESTED', target: 'Rule · emit events to :7171 · no config' },
  ],
};

export function CanaryMascot() {
  const {
    sections,
    activeSectionId,
    setActiveSection,
    perchOverrides,
    alertKey,
    birdHeldPos,
    setBirdHeldPos,
    logEvent,
  } = useCanaryWatch();
  const reduce = useReducedMotion() === true;

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [wiggle, setWiggle] = useState(false);

  /** Install cinematic phase — drives cursor visibility and bird class. */
  const [cinePhase, setCinePhase] = useState<
    'idle' | 'cursor-in' | 'morph' | 'gliding-apex' | 'gliding-land' | 'installed'
  >('idle');
  /** Cursor/hand absolute viewport position (separate from bird). */
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  /** Which SVG the phantom-pointer is showing right now. */
  const [pointerVariant, setPointerVariant] = useState<'arrow' | 'hand'>('arrow');

  /** Traveling — true for ~820ms after the active section changes. Enables
   *  the `.mascot.traveling` CSS transition so the bird glides from old
   *  perch to new perch instead of snapping. Outside this window the bird
   *  snaps each rAF tick (sticky-to-perch). */
  const [traveling, setTraveling] = useState(false);

  /** Timer refs — all cleared on unmount to avoid orphaned setState calls. */
  const cascadeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cineTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wiggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arriveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** One-shot guards — each cinematic fires at most once per session. */
  const demoPlayedRef = useRef(false);
  const releasePlayedRef = useRef(false);

  /** Mirror of `pos` for effects that shouldn't re-run on every position change. */
  const posRef = useRef<{ x: number; y: number } | null>(null);

  /**
   * Post-cinematic "stay here" anchor. When non-null, the per-frame recalc
   * reads this element's rect and centers the bird INSIDE it instead of
   * using the active section's perchAnchor. Set at the end of the install
   * cinematic to the Install panel's visualFrame; cleared when the user
   * scrolls away from flow-install.
   */
  const birdAnchorRef = useRef<HTMLElement | null>(null);
  /** Triggers a re-render when birdAnchorRef changes so recalc picks it up. */
  const [, setBirdAnchorTick] = useState(0);

  const perchOriginXRef = useRef<number | null>(null);
  const firstPlacementRef = useRef(true);

  /** Element carrying the `.cw-perched` outline right now. */
  const perchedElRef = useRef<HTMLElement | null>(null);
  /** Element carrying `.cw-caged` — only used for Install post-cinematic
   *  (the panel gets the cage outline after the drop). */
  const cagedFrameElRef = useRef<HTMLElement | null>(null);

  /** Swap the `.cw-perched` outline from previous perch to the new one. */
  const lockPerchOutline = (el: HTMLElement) => {
    if (perchedElRef.current && perchedElRef.current !== el) {
      perchedElRef.current.classList.remove('cw-perched');
    }
    el.classList.add('cw-perched');
    perchedElRef.current = el;
  };

  const unlockPerchOutline = () => {
    if (perchedElRef.current) {
      perchedElRef.current.classList.remove('cw-perched');
      perchedElRef.current = null;
    }
    if (cagedFrameElRef.current) {
      cagedFrameElRef.current.classList.remove('cw-caged');
      cagedFrameElRef.current = null;
    }
  };

  const setCagedFrame = (frame: HTMLElement | null) => {
    if (cagedFrameElRef.current && cagedFrameElRef.current !== frame) {
      cagedFrameElRef.current.classList.remove('cw-caged');
    }
    if (frame) {
      frame.classList.add('cw-caged');
      cagedFrameElRef.current = frame;
    } else {
      cagedFrameElRef.current = null;
    }
  };

  const fireWiggle = () => {
    if (wiggleTimerRef.current) clearTimeout(wiggleTimerRef.current);
    setWiggle(true);
    wiggleTimerRef.current = setTimeout(() => {
      setWiggle(false);
      wiggleTimerRef.current = null;
    }, WIGGLE_DURATION_MS);
  };

  /** Which section is closest to the reading focus line. */
  const computeFocus = () => {
    if (sections.length === 0) {
      return { bestId: null as string | null, currentDist: Infinity, bestDist: Infinity };
    }
    const focusY = window.innerHeight * 0.38;
    let bestId: string | null = null;
    let bestDist = Infinity;
    let currentDist = Infinity;
    for (const s of sections) {
      if (!s.anchor) continue;
      const rect = s.anchor.getBoundingClientRect();
      const midY = rect.top + rect.height * 0.3;
      const dist = Math.abs(midY - focusY);
      if (s.id === activeSectionId) currentDist = dist;
      if (dist < bestDist) {
        bestDist = dist;
        bestId = s.id;
      }
    }
    return { bestId, currentDist, bestDist };
  };

  /**
   * Sub-pixel-quantized setState for position. Only triggers a React render
   * when the rounded viewport coords actually change — prevents 60fps
   * re-renders when the perch element isn't moving.
   */
  const commitPos = (x: number, y: number) => {
    const qx = Math.round(x);
    const qy = Math.round(y);
    const prev = posRef.current;
    if (prev && prev.x === qx && prev.y === qy) return;
    setPos({ x: qx, y: qy });
  };

  /**
   * Position the bird for the current frame.
   *
   * Priority:
   *   1. `birdHeldPos` — cinematic/override is driving the position.
   *   2. Active section is flow-stop (and not reduced-motion) — bounce
   *      physics owns the position via its own rAF loop. Skip.
   *   3. `birdAnchorRef` — post-cinematic "stay here" anchor (Install panel).
   *      Center the bird INSIDE it.
   *   4. Default — bird sits ON TOP of the perchAnchor's bounding box,
   *      horizontally centered, vertically offset by BIRD_SIZE + OUTLINE_OFFSET
   *      so its body sits exactly on the outline rendered by `.cw-perched`.
   */
  const recalcPosition = () => {
    if (birdHeldPos) {
      commitPos(birdHeldPos.x, birdHeldPos.y);
      return;
    }
    if (activeSectionId === 'flow-stop' && !reduce) {
      return;
    }

    const anchor = birdAnchorRef.current;
    if (anchor && document.body.contains(anchor)) {
      const rect = anchor.getBoundingClientRect();
      commitPos(rect.left + PANEL_INSET_X, rect.top + PANEL_INSET_Y);
      return;
    }

    const active = sections.find((s) => s.id === activeSectionId);
    if (!active) return;

    const perchEl =
      perchOverrides.get(active.id) ??
      active.perchAnchor ??
      active.focusPoints?.[0] ??
      active.anchor;
    if (!perchEl) return;

    const rect = perchEl.getBoundingClientRect();
    commitPos(
      rect.left + rect.width / 2 - BIRD_SIZE / 2,
      rect.top - BIRD_SIZE - OUTLINE_OFFSET
    );
  };

  /** Ref-mirror of recalcPosition so listeners see the latest closure. */
  const recalcRef = useRef<() => void>(() => {});
  useEffect(() => {
    recalcRef.current = recalcPosition;
  });

  // Scroll listener — commits section switches on idle; the bird is
  // sticky-to-perch by default (no transition) so no scroll-lock class
  // is needed. Outline is cleared while scrolling to avoid jitter; the
  // active-section effect below re-locks it after TRAVEL_MS.
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const evaluateSwitch = () => {
      const { bestId, currentDist, bestDist } = computeFocus();
      if (activeSectionId === null) {
        if (bestId !== null) setActiveSection(bestId);
        return;
      }
      if (bestId !== null && bestId !== activeSectionId && currentDist - bestDist > SWITCH_HYSTERESIS_PX) {
        setActiveSection(bestId);
      }
    };

    const onIdle = () => {
      evaluateSwitch();
    };

    const onScroll = () => {
      unlockPerchOutline();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(onIdle, SCROLL_IDLE_MS);
      // Per-frame recalc (below) keeps the bird glued to its perch while
      // scrolling — no need to double-schedule one here.
    };

    const onResize = () => {
      recalcRef.current?.();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    evaluateSwitch();
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, activeSectionId]);

  // Continuous per-frame recalc while a section is active. Skipped under
  // reduced-motion — scroll/resize listeners handle those users.
  useEffect(() => {
    if (reduce) {
      recalcRef.current?.();
      return;
    }
    if (!activeSectionId) return;
    let raf = 0;
    const tick = () => {
      recalcRef.current?.();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeSectionId, reduce]);

  // Traveling window — set true on every active-section change so the
  // `.mascot.traveling` CSS transition engages for the flight. After
  // TRAVEL_MS, clear it so the bird goes back to per-frame snap-tracking.
  useEffect(() => {
    if (!activeSectionId) return;
    setTraveling(true);
    const t = setTimeout(() => setTraveling(false), TRAVEL_MS);
    return () => clearTimeout(t);
  }, [activeSectionId]);

  // Active section changed — fly to the new perch and wiggle on arrival.
  useEffect(() => {
    // Clear the post-cinematic anchor + cage class whenever we leave
    // flow-install so the bird can perch normally in the next section.
    if (activeSectionId !== 'flow-install') {
      birdAnchorRef.current = null;
      if (cagedFrameElRef.current) {
        cagedFrameElRef.current.classList.remove('cw-caged');
        cagedFrameElRef.current = null;
      }
    }

    const active = sections.find((s) => s.id === activeSectionId);
    if (!active) return;
    const perchEl =
      perchOverrides.get(active.id) ?? active.perchAnchor ?? active.anchor;
    if (!perchEl) return;
    const rect = perchEl.getBoundingClientRect();
    const nextOriginX = rect.left + rect.width / 2 - BIRD_SIZE / 2;

    if (perchOriginXRef.current !== null) {
      if (nextOriginX < perchOriginXRef.current - 4) setFacing('left');
      else if (nextOriginX > perchOriginXRef.current + 4) setFacing('right');
    }
    perchOriginXRef.current = nextOriginX;

    recalcPosition();

    if (arriveTimerRef.current) clearTimeout(arriveTimerRef.current);
    const delay = firstPlacementRef.current ? 240 : TRAVEL_MS;
    firstPlacementRef.current = false;
    arriveTimerRef.current = setTimeout(() => {
      fireWiggle();
      lockPerchOutline(perchEl);
      arriveTimerRef.current = null;
    }, delay);

    return () => {
      if (arriveTimerRef.current) clearTimeout(arriveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionId, perchOverrides]);

  // In-section perch changes (e.g. UseCases active tab swaps, or Install's
  // numberRow → visualFrame after the cinematic). Same activeSectionId but
  // a different perchAnchor — move the outline to the new element.
  const activePerchAnchor =
    sections.find((s) => s.id === activeSectionId)?.perchAnchor ?? null;
  useEffect(() => {
    if (!activePerchAnchor) return;
    // birdAnchorRef overrides — don't touch the outline while we're
    // anchored to the post-cinematic panel.
    if (birdAnchorRef.current) return;
    const handoff = setTimeout(() => {
      lockPerchOutline(activePerchAnchor);
    }, TRAVEL_MS);
    return () => clearTimeout(handoff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePerchAnchor]);

  // BLOCKED alert — bird flaps immediately when a policy violation fires.
  useEffect(() => {
    if (alertKey === 0) return;
    fireWiggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertKey]);

  // Cursor actor drives the bird's pos while `birdHeldPos` is set. When it
  // clears, recompute perch pos and fire a wiggle (bird "just got dropped").
  useEffect(() => {
    if (birdHeldPos) {
      setPos(birdHeldPos);
      unlockPerchOutline();
    } else {
      recalcPosition();
      // If a post-cinematic anchor is set (Install panel), let the caller
      // apply the outline — don't overwrite with the section's default
      // perchAnchor (that's the numberRow, which is no longer where the
      // bird sits).
      if (birdAnchorRef.current) {
        fireWiggle();
        return;
      }
      const active = sections.find((s) => s.id === activeSectionId);
      const perchEl = active
        ? (perchOverrides.get(active.id) ??
            active.perchAnchor ??
            active.focusPoints?.[0] ??
            active.anchor)
        : null;
      if (perchEl) {
        fireWiggle();
        lockPerchOutline(perchEl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birdHeldPos]);

  // Unmount cleanup — clear outline, drain all timers. No rAF to cancel
  // here — the continuous rAF and bounce rAF have their own effect cleanups.
  useEffect(() => {
    return () => {
      unlockPerchOutline();
      cascadeTimersRef.current.forEach(clearTimeout);
      cascadeTimersRef.current = [];
      cineTimersRef.current.forEach(clearTimeout);
      cineTimersRef.current = [];
      if (wiggleTimerRef.current) clearTimeout(wiggleTimerRef.current);
      if (arriveTimerRef.current) clearTimeout(arriveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror pos → posRef.
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // ─────────────────────────────────────────────────────────────────────
  // flow-stop bounce physics — bird trapped inside [data-stop-cage].
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduce) return;
    if (activeSectionId !== 'flow-stop') return;
    if (birdHeldPos) return;

    const cage = document.querySelector<HTMLElement>('[data-stop-cage]');
    if (!cage) return;

    // Initial position: bird's current pos (or cage center if unknown),
    // clamped inside the cage walls.
    const seedRect = cage.getBoundingClientRect();
    const initial = posRef.current ?? {
      x: seedRect.left + seedRect.width / 2 - BIRD_SIZE / 2,
      y: seedRect.top + seedRect.height / 2 - BIRD_SIZE / 2,
    };
    let px = Math.max(
      seedRect.left,
      Math.min(seedRect.right - BIRD_SIZE, initial.x)
    );
    let py = Math.max(
      seedRect.top,
      Math.min(seedRect.bottom - BIRD_SIZE, initial.y)
    );
    // Random initial angle, constant speed.
    const angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle) * BOUNCE_SPEED;
    let vy = Math.sin(angle) * BOUNCE_SPEED;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); // cap dt on tab-switch
      last = now;
      // Re-read the cage each frame — it might resize on scroll (sticky layout).
      const r = cage.getBoundingClientRect();
      const minX = r.left;
      const minY = r.top;
      const maxX = r.right - BIRD_SIZE;
      const maxY = r.bottom - BIRD_SIZE;

      px += vx * dt;
      py += vy * dt;

      if (px <= minX) {
        px = minX;
        vx = Math.abs(vx);
        if (facing !== 'right') setFacing('right');
      } else if (px >= maxX) {
        px = maxX;
        vx = -Math.abs(vx);
        if (facing !== 'left') setFacing('left');
      }
      if (py <= minY) {
        py = minY;
        vy = Math.abs(vy);
      } else if (py >= maxY) {
        py = maxY;
        vy = -Math.abs(vy);
      }

      commitPos(px, py);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionId, reduce, birdHeldPos]);

  // ─────────────────────────────────────────────────────────────────────
  // Install cinematic — cursor in from right, morphs to hand, curves into
  // the Install visual panel.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduce) {
      demoPlayedRef.current = true;
      return;
    }
    if (activeSectionId !== 'flow-install') return;
    if (demoPlayedRef.current) return;
    if (!posRef.current) return;

    const panel = document.querySelector<HTMLElement>(
      '[data-canary-drop="install"]'
    );
    if (!panel) return;

    demoPlayedRef.current = true;
    playInstallCinematic(panel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionId, reduce, pos]);

  // Release-at-Learn: log line only (Round B drops the cage-break visual;
  // Learn's perch is the Add-rule button and uses default above-button math).
  useEffect(() => {
    if (activeSectionId !== 'flow-learn') return;
    if (releasePlayedRef.current) return;
    releasePlayedRef.current = true;
    logEvent('OBSERVED', 'Canary · released · free to perch');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionId]);

  /** Play the drop cascade once the bird lands inside the Install panel. */
  const runDropCascade = (zoneKey: string, zoneEl: HTMLElement) => {
    const rows = DROP_CASCADES[zoneKey] ?? DROP_CASCADES.install;
    cascadeTimersRef.current.forEach(clearTimeout);
    cascadeTimersRef.current = rows.map((row) =>
      setTimeout(() => {
        logEvent(row.type, row.target);
      }, row.delay)
    );
    setCagedFrame(zoneEl);
    fireWiggle();
  };

  /**
   * Four-beat install cinematic:
   *   1. cursor-in   — arrow SVG materializes offscreen right, glides to
   *                    just above+right of the bird's current position.
   *   2. morph       — arrow → hand cross-fade (bird starts "held").
   *   3. glide-apex  — bird + hand move to the curve's apex (mid-way,
   *                    slightly above the line between start and panel).
   *   4. glide-land  — bird + hand settle inside the panel.
   * After: hand flies back offscreen right; bird's anchor is pinned to
   * the panel via `birdAnchorRef`; cascade logs fire.
   */
  const playInstallCinematic = (panel: HTMLElement) => {
    const start = posRef.current;
    if (!start) return;
    cineTimersRef.current.forEach(clearTimeout);
    cineTimersRef.current = [];

    const panelRect = panel.getBoundingClientRect();
    const landX = panelRect.left + PANEL_INSET_X;
    const landY = panelRect.top + PANEL_INSET_Y;

    // Apex midpoint — halfway across, lifted by ~60px for an arc.
    const apexX = (start.x + landX) / 2;
    const apexY = Math.min(start.y, landY) - 60;

    // Beat 1 — arrow cursor flies in from offscreen right to just above the bird.
    setPointerVariant('arrow');
    setCursorPos({ x: window.innerWidth + 60, y: start.y });
    setCinePhase('cursor-in');
    // Kick the CSS transition by moving to the target position on the next frame.
    cineTimersRef.current.push(
      setTimeout(() => {
        setCursorPos({ x: start.x + BIRD_SIZE - 4, y: start.y - 12 });
      }, 16)
    );

    // Beat 2 — morph arrow → hand, grab the bird.
    cineTimersRef.current.push(
      setTimeout(() => {
        setCinePhase('morph');
        setPointerVariant('hand');
        // Bird starts "held" — the dangle animation plays on `.held`.
        setBirdHeldPos({ x: start.x, y: start.y });
      }, CINE_CURSOR_FLY_MS)
    );

    // Beat 3 — curved glide to apex. Hand travels with the bird (offset above-right).
    cineTimersRef.current.push(
      setTimeout(() => {
        setCinePhase('gliding-apex');
        setBirdHeldPos({ x: apexX, y: apexY });
        setCursorPos({ x: apexX + BIRD_SIZE - 4, y: apexY - 12 });
      }, CINE_CURSOR_FLY_MS + CINE_MORPH_MS)
    );

    // Beat 4 — settle down into the panel.
    cineTimersRef.current.push(
      setTimeout(() => {
        setCinePhase('gliding-land');
        setBirdHeldPos({ x: landX, y: landY });
        setCursorPos({ x: landX + BIRD_SIZE - 4, y: landY - 12 });
      }, CINE_CURSOR_FLY_MS + CINE_MORPH_MS + CINE_GLIDE_APEX_MS)
    );

    // After the landing transition completes: drop the bird (hand releases),
    // anchor it to the panel, hand exits offscreen right, cascade fires.
    cineTimersRef.current.push(
      setTimeout(
        () => {
          setCinePhase('installed');
          // Anchor the bird to the panel so scroll keeps it riding the panel rect.
          birdAnchorRef.current = panel;
          setBirdAnchorTick((t) => t + 1);
          // Release cursor-actor position — recalc will read birdAnchorRef.
          setBirdHeldPos(null);
          // Hand flies back offscreen right.
          setCursorPos({ x: window.innerWidth + 60, y: landY });
          runDropCascade('install', panel);
          // Hide the pointer after it exits.
          cineTimersRef.current.push(
            setTimeout(() => {
              setCinePhase('idle');
              setCursorPos(null);
            }, CINE_HAND_EXIT_MS)
          );
        },
        CINE_CURSOR_FLY_MS +
          CINE_MORPH_MS +
          CINE_GLIDE_APEX_MS +
          CINE_GLIDE_LAND_MS +
          CINE_DROP_MS
      )
    );
  };

  if (!pos) return null;

  const pointerVisible =
    cinePhase !== 'idle' && cursorPos !== null;

  // Split transitions:
  //   - default (.mascot) = no transition (per-frame snap-tracking; sticky)
  //   - .traveling        = 820ms ease-in-out-ish (section-switch flight)
  //   - .cinematicApex    = 500ms ease-out (rise to apex)
  //   - .cinematicLand    = 500ms ease-in (fall to panel)
  //   - .cinematicSettle  = 120ms ease-out (drop into panel)
  let cinematicClass = '';
  if (cinePhase === 'gliding-apex') cinematicClass = styles.cinematicApex;
  else if (cinePhase === 'gliding-land') cinematicClass = styles.cinematicLand;
  else if (cinePhase === 'installed') cinematicClass = styles.cinematicSettle;

  const bouncing = activeSectionId === 'flow-stop' && !reduce && !birdHeldPos;

  return (
    <>
      <div
        className={[
          styles.mascot,
          facing === 'left' ? styles.faceLeft : '',
          wiggle ? styles.wiggle : '',
          traveling ? styles.traveling : '',
          bouncing ? styles.bouncing : '',
          birdHeldPos ? styles.held : '',
          cinePhase !== 'idle' ? styles.cinePlay : '',
          cinematicClass,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          // @ts-expect-error — CSS custom props
          '--cx': `${pos.x}px`,
          '--cy': `${pos.y}px`,
        }}
        aria-hidden="true"
      >
        <div className={styles.inner}>
          <div className={styles.sway}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.logo} src="/canary-mascot.svg" alt="" draggable={false} />
          </div>
        </div>
      </div>

      {/* Phantom pointer — cursor SVG in from offscreen right, morphs into
          a hand for the glide, then exits offscreen right. */}
      {pointerVisible && cursorPos && (
        <div
          className={[
            styles.pointer,
            cinematicClass,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            // @ts-expect-error — CSS custom props
            '--cx': `${cursorPos.x}px`,
            '--cy': `${cursorPos.y}px`,
          }}
          aria-hidden="true"
        >
          <div
            className={[
              styles.pointerSvg,
              pointerVariant === 'arrow'
                ? styles.pointerArrow
                : styles.pointerHand,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <svg
              className={styles.pointerArrowSvg}
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
            >
              <path
                d="M2 1.5L2 17.5L6.5 13.5L9.5 20L12 18.8L9 12.5L15 12L2 1.5Z"
                fill="var(--text-black)"
                stroke="var(--text-white)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className={styles.pointerHandSvg}
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
            >
              {/* Grabbing hand — rounded fist (palm) with a thumb stub
                  sticking out to the upper left. Detail is deliberately
                  low so it reads at 24px. */}
              <rect
                x="4"
                y="8"
                width="15"
                height="14"
                rx="5"
                fill="var(--text-black)"
                stroke="var(--text-white)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <ellipse
                cx="5"
                cy="11"
                rx="3"
                ry="2.5"
                transform="rotate(-35 5 11)"
                fill="var(--text-black)"
                stroke="var(--text-white)"
                strokeWidth="1"
              />
              {/* Knuckle dimples — three small ticks across the top of the fist. */}
              <line x1="8" y1="9.5" x2="8" y2="11" stroke="var(--text-white)" strokeWidth="0.9" strokeLinecap="round" />
              <line x1="12" y1="9" x2="12" y2="10.5" stroke="var(--text-white)" strokeWidth="0.9" strokeLinecap="round" />
              <line x1="15.5" y1="9.5" x2="15.5" y2="11" stroke="var(--text-white)" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

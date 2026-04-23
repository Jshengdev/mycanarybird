'use client';

/**
 * CanaryMascot — the bird that sits on the active section and flies to
 * the next one when the reader scrolls past.
 *
 * Model:
 *   sit   — bird is fixed-positioned above the active section's perch
 *           element. Re-reads the perch rect on scroll/resize so the bird
 *           stays attached while the page scrolls beneath it.
 *   fly   — on active-section change, rAF drives a parabolic arc from the
 *           previous position to the new perch over FLIGHT_MS. After
 *           landing, the bird returns to `sit` mode.
 *
 * Reduced-motion: skip the arc, snap to new perch. No idle animations.
 *
 * Shift+click (handled in context.tsx) lets you retarget the active
 * section's perch at runtime — still supported.
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

import { useCanaryWatch } from './context';
import styles from './CanaryMascot.module.css';

const BIRD_SIZE = 28;
/** Matches `outline-offset` on `.cw-perched` — bird sits ON the outline. */
const OUTLINE_OFFSET = 6;

/** Base flight duration — slow and chill. Scaled further by distance. */
const FLIGHT_MAX_MS = 1200;
const FLIGHT_MIN_MS = 560;
/** Below this linear distance, bird just snaps — no arc. */
const FLIGHT_SNAP_DISTANCE_PX = 24;
/** Landing wiggle duration (CSS animation). */
const WIGGLE_DURATION_MS = 1000;

/**
 * Fractions along the top edge the bird can hover at. Pure center (0)
 * feels mechanical; off-center spots give each landing a different
 * silhouette. Slot picked deterministically per perch element (see
 * `perchSlotFor`) so revisiting a section parks the bird in the same
 * spot instead of hopping around.
 */
const PERCH_SLOTS = [-0.32, -0.14, 0, 0.14, 0.32];

/** Cheap stable hash of a string — pinned on element id / text to pick
 *  a `PERCH_SLOTS` index per perch. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function perchSlotFor(el: HTMLElement): number {
  const key =
    el.id ||
    (el.getAttribute('data-section-id') ?? '') +
      (el.textContent?.slice(0, 20) ?? '') +
      el.tagName;
  return PERCH_SLOTS[hashString(key) % PERCH_SLOTS.length];
}

/**
 * eased sine — gentler than cubic, floaty takeoff and landing. The
 * bird is never meant to feel in a hurry.
 */
const easeInOutSine = (t: number): number =>
  -(Math.cos(Math.PI * t) - 1) / 2;

/** Viewport coords where the bird hovers above `el`. */
function perchPos(el: HTMLElement): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const slot = perchSlotFor(el);
  return {
    x: r.left + r.width / 2 - BIRD_SIZE / 2 + r.width * slot,
    y: r.top - BIRD_SIZE - OUTLINE_OFFSET,
  };
}

export function CanaryMascot() {
  const { sections, activeSectionId, setActiveSection, perchOverrides, alertKey } =
    useCanaryWatch();
  const reduce = useReducedMotion() === true;

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [flying, setFlying] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [wiggle, setWiggle] = useState(false);

  /** Element currently carrying the `.cw-perched` outline. */
  const outlineElRef = useRef<HTMLElement | null>(null);
  /** Mirror of `pos` for the flight driver's `from` capture. */
  const posRef = useRef<{ x: number; y: number } | null>(null);
  /** Current flight's cancel handle. Non-null means the driver owns pos. */
  const flightRafRef = useRef<number | null>(null);
  /** Wiggle timer (cleared on unmount or re-fire). */
  const wiggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstPlaceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolve the active section's perch element, honouring Shift+click overrides.
  const activePerchEl = (() => {
    if (!activeSectionId) return null;
    const active = sections.find((s) => s.id === activeSectionId);
    if (!active) return null;
    return (
      perchOverrides.get(active.id) ??
      active.perchAnchor ??
      active.anchor ??
      null
    );
  })();

  // Mirror pos → posRef for flight-start capture.
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Helpers — outline lock/unlock, wiggle fire.
  const lockOutline = (el: HTMLElement) => {
    if (outlineElRef.current && outlineElRef.current !== el) {
      outlineElRef.current.classList.remove('cw-perched');
    }
    el.classList.add('cw-perched');
    outlineElRef.current = el;
  };
  const unlockOutline = () => {
    if (outlineElRef.current) {
      outlineElRef.current.classList.remove('cw-perched');
      outlineElRef.current = null;
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

  const cancelFlight = () => {
    if (flightRafRef.current !== null) {
      cancelAnimationFrame(flightRafRef.current);
      flightRafRef.current = null;
    }
    setFlying(false);
  };

  // Fly to the active perch whenever it changes. On first ever placement
  // or under reduced-motion, snap instead.
  useEffect(() => {
    if (!activePerchEl) return;

    const to = perchPos(activePerchEl);
    const from = posRef.current;

    // No previous position (first ever placement) — snap and wiggle after
    // a beat so the outline has time to render before the bird lands on it.
    if (!from) {
      cancelFlight();
      unlockOutline();
      setPos(to);
      if (firstPlaceTimerRef.current) clearTimeout(firstPlaceTimerRef.current);
      firstPlaceTimerRef.current = setTimeout(() => {
        lockOutline(activePerchEl);
        fireWiggle();
        firstPlaceTimerRef.current = null;
      }, 220);
      return;
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);

    // Short hops or reduced-motion: just snap.
    if (reduce || distance < FLIGHT_SNAP_DISTANCE_PX) {
      cancelFlight();
      setPos(to);
      lockOutline(activePerchEl);
      return;
    }

    // Arc flight.
    if (dx < -6) setFacing('left');
    else if (dx > 6) setFacing('right');

    cancelFlight();
    unlockOutline();
    setFlying(true);

    const duration = Math.min(
      FLIGHT_MAX_MS,
      Math.max(FLIGHT_MIN_MS, distance * 1.7 + 320)
    );
    /** Parabolic arc amplitude — taller for longer flights, capped.
     *  Slightly over-lifted vs. a straight parabola so the bird reads as
     *  taking its time, not racing from A to B. */
    const amplitude = Math.min(180, distance * 0.38);
    const start = performance.now();
    /** Capture the target element so we re-read its rect on land (it may
     *  have scrolled during the flight). */
    const targetEl = activePerchEl;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOutSine(t);
      const x = from.x + (to.x - from.x) * e;
      const arcLift = 4 * e * (1 - e) * amplitude;
      const y = from.y + (to.y - from.y) * e - arcLift;
      setPos({ x, y });
      if (t < 1) {
        flightRafRef.current = requestAnimationFrame(tick);
      } else {
        flightRafRef.current = null;
        setFlying(false);
        // Re-read the perch rect in case it scrolled during the flight.
        setPos(perchPos(targetEl));
        lockOutline(targetEl);
        fireWiggle();
      }
    };
    flightRafRef.current = requestAnimationFrame(tick);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePerchEl, reduce]);

  // Sit — while not flying, keep the bird glued to the perch as the page
  // scrolls. Scroll + resize events drive the updates; no continuous rAF.
  useEffect(() => {
    if (!activePerchEl) return;
    const update = () => {
      if (flightRafRef.current !== null) return;
      setPos(perchPos(activePerchEl));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [activePerchEl]);

  // Section detection — on scroll idle, pick the section whose anchor
  // midpoint is closest to the reading focus line (viewport 38%). With
  // scroll-snap mandatory + stop: always, each swipe lands the user
  // firmly in one section, so there's no ambiguity to hysteresis-out.
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const pickActive = () => {
      if (sections.length === 0) return;
      const focusY = window.innerHeight * 0.38;
      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const s of sections) {
        if (!s.anchor) continue;
        const r = s.anchor.getBoundingClientRect();
        const midY = r.top + r.height * 0.3;
        const d = Math.abs(midY - focusY);
        if (d < bestDist) {
          bestDist = d;
          bestId = s.id;
        }
      }
      if (bestId && bestId !== activeSectionId) setActiveSection(bestId);
    };

    const onScroll = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(pickActive, 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    pickActive();
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [sections, activeSectionId, setActiveSection]);

  // BLOCKED events — bird flaps when a policy violation fires.
  useEffect(() => {
    if (alertKey === 0) return;
    fireWiggle();
  }, [alertKey]);

  // Unmount cleanup.
  useEffect(() => {
    return () => {
      unlockOutline();
      cancelFlight();
      if (wiggleTimerRef.current) clearTimeout(wiggleTimerRef.current);
      if (firstPlaceTimerRef.current) clearTimeout(firstPlaceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pos) return null;

  return (
    <div
      className={[
        styles.mascot,
        facing === 'left' ? styles.faceLeft : '',
        wiggle ? styles.wiggle : '',
        flying ? styles.flying : '',
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
  );
}

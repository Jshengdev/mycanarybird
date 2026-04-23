'use client';

/**
 * CanaryWatchProvider — the shared state store for the watching system.
 *
 * Holds: session start, event log, registered sections, active section,
 * highlight pulse trigger. All sections and the log consume this via
 * the useCanaryWatch hook.
 *
 * Design principle: this file knows nothing about specific content.
 * Event templates embed only metadata (displayName) or read from DOM.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type {
  CanarySectionRegistration,
  LogEvent,
  LogEventType,
} from './types';
import { useInputTracker } from './useInputTracker';

interface HighlightPulse {
  sectionId: string;
  key: number;  // changes on each pulse so listeners can distinguish
}

interface CanaryWatchContextValue {
  sessionStart: number;
  events: LogEvent[];
  sections: CanarySectionRegistration[];
  activeSectionId: string | null;
  highlightPulse: HighlightPulse | null;
  /**
   * Runtime perch overrides — set via Shift+click during design.
   * Takes precedence over each section's declared perchAnchor.
   */
  perchOverrides: Map<string, HTMLElement>;
  /** Set of section ids the reader has visited (reactive snapshot). */
  sectionsSeen: ReadonlySet<string>;
  /**
   * Captured top-of-funnel intent (e.g. "compliance-score" when the reader
   * clicked "View compliance score"). Form reads this on submit.
   */
  intent: string | null;
  /**
   * Bumps whenever a BLOCKED event is logged. CanaryMascot subscribes to
   * trigger an alert-wiggle — makes the bird feel like the policy enforcer.
   */
  alertKey: number;
  /**
   * When set, the bird's position is overridden to this viewport (x, y) and
   * its transform transition is disabled — used by the cursor-actor intro
   * to "carry" the bird during the drag-and-drop choreography.
   */
  birdHeldPos: { x: number; y: number } | null;

  registerSection: (reg: CanarySectionRegistration) => () => void;
  setActiveSection: (id: string | null) => void;
  triggerHighlight: (sectionId: string) => void;
  logEvent: (type: LogEventType, target: string) => void;
  setPerchOverride: (sectionId: string, el: HTMLElement | null) => void;
  setIntent: (source: string | null) => void;
  setBirdHeldPos: (pos: { x: number; y: number } | null) => void;
}

const Ctx = createContext<CanaryWatchContextValue | null>(null);

function fmtClockTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

let nextEventId = 0;

/**
 * Shallow-by-reference compare two focus-point arrays. null/null === equal.
 * Null vs array is NOT equal. Different lengths or any differing element
 * reference is NOT equal.
 */
function arrayRefsEqual(
  a: HTMLElement[] | null,
  b: HTMLElement[] | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function CanaryWatchProvider({ children }: { children: ReactNode }) {
  const sessionStart = useMemo(() => Date.now(), []);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [highlightPulse, setHighlightPulse] = useState<HighlightPulse | null>(null);
  const [perchOverrides, setPerchOverridesState] = useState<Map<string, HTMLElement>>(() => new Map());
  const sectionsRef = useRef<CanarySectionRegistration[]>([]);
  const [sectionsVersion, setSectionsVersion] = useState(0);
  const [sectionsSeen, setSectionsSeen] = useState<ReadonlySet<string>>(() => new Set());
  const [intent, setIntentState] = useState<string | null>(null);
  const [alertKey, setAlertKey] = useState(0);
  const [birdHeldPos, setBirdHeldPosState] = useState<{ x: number; y: number } | null>(null);

  const registerSection = useCallback((reg: CanarySectionRegistration) => {
    // Idempotency check — if the new registration is identical to the
    // previous one (same element refs, same metadata), skip the state
    // update. Without this, inline ref callbacks in sections (which are
    // recreated every render) cause an infinite re-registration loop.
    const existing = sectionsRef.current.findIndex((s) => s.id === reg.id);
    const prev = existing >= 0 ? sectionsRef.current[existing] : null;
    const isDifferent =
      !prev ||
      prev.anchor !== reg.anchor ||
      prev.perchAnchor !== reg.perchAnchor ||
      prev.order !== reg.order ||
      prev.displayName !== reg.displayName ||
      !arrayRefsEqual(prev.focusPoints, reg.focusPoints);

    if (isDifferent) {
      if (existing >= 0) {
        sectionsRef.current[existing] = reg;
      } else {
        sectionsRef.current.push(reg);
        sectionsRef.current.sort((a, b) => a.order - b.order);
      }
      setSectionsVersion((v) => v + 1);
    }

    return () => {
      sectionsRef.current = sectionsRef.current.filter((s) => s.id !== reg.id);
      setSectionsVersion((v) => v + 1);
    };
  }, []);

  const setActiveSection = useCallback((id: string | null) => {
    setActiveSectionId(id);
  }, []);

  const logEvent = useCallback((type: LogEventType, target: string) => {
    const tOffset = Date.now() - sessionStart;
    const event: LogEvent = {
      id: `ev-${nextEventId++}`,
      type,
      target,
      tOffset,
      time: fmtClockTime(tOffset),
    };
    setEvents((prev) => [...prev, event]);
    // BLOCKED events pull the bird's attention — bird alerts.
    if (type === 'BLOCKED') setAlertKey((k) => k + 1);
  }, [sessionStart]);

  const setIntent = useCallback((source: string | null) => {
    setIntentState(source);
  }, []);

  const setBirdHeldPos = useCallback(
    (pos: { x: number; y: number } | null) => {
      setBirdHeldPosState(pos);
    },
    []
  );

  const triggerHighlight = useCallback((sectionId: string) => {
    setHighlightPulse({ sectionId, key: Date.now() });
  }, []);

  const setPerchOverride = useCallback(
    (sectionId: string, el: HTMLElement | null) => {
      setPerchOverridesState((prev) => {
        const next = new Map(prev);
        if (el) next.set(sectionId, el);
        else next.delete(sectionId);
        return next;
      });
    },
    []
  );

  // Shift+click design mode: click any element with Shift held to set
  // that element as the bird's perch for its containing section.
  useEffect(() => {
    const describeEl = (el: HTMLElement): string => {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      const cls =
        typeof el.className === 'string' && el.className
          ? '.' + el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.')
          : '';
      const text = el.textContent?.trim().slice(0, 24) ?? '';
      return `${tag}${id}${cls}${text ? ` "${text}"` : ''}`;
    };

    const onClick = (e: MouseEvent) => {
      if (!e.shiftKey) return;
      if (!(e.target instanceof HTMLElement)) return;
      const clicked = e.target;
      // Winner: the section whose anchor contains `clicked` and has no
      // other registered anchor nested inside it (i.e. the most specific).
      let winner: CanarySectionRegistration | null = null;
      for (const section of sectionsRef.current) {
        if (!section.anchor?.contains(clicked)) continue;
        const hasMoreSpecific = sectionsRef.current.some(
          (other) =>
            other !== section &&
            other.anchor &&
            section.anchor!.contains(other.anchor) &&
            other.anchor.contains(clicked)
        );
        if (!hasMoreSpecific) {
          winner = section;
          break;
        }
      }

      if (!winner) return;

      e.preventDefault();
      e.stopPropagation();
      setPerchOverride(winner.id, clicked);
      // Dev affordance — no log pollution. Console breadcrumb only.
      if (typeof console !== 'undefined') {
        console.info(`[canary-watch] perch override · ${winner.id} → ${describeEl(clicked)}`);
      }
    };

    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [setPerchOverride, sessionStart]);

  // Seed event — session opened
  useEffect(() => {
    logEvent('OBSERVED', 'Session opened · canary observing');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mount global input tracker — logs clicks, keystrokes, scrolls, etc.
  useInputTracker({ logEvent });

  // Track section-first-seen + dwell-anomaly timer. Reader parked on one
  // section for > DWELL_FLAG_MS → FLAGGED (same pattern you'd want to catch
  // from an agent looping on one view).
  //
  // `seenRef` is the authoritative first-entry guard; `sectionsSeen` is a
  // REACTIVE mirror consumers (SessionLog) can read. We keep `sectionsSeen`
  // OUT of the effect deps so that updating the mirror doesn't retrigger
  // the effect (which would double-log "Entered section").
  const DWELL_FLAG_MS = 30_000;
  const seenRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!activeSectionId) return;
    const section = sectionsRef.current.find((s) => s.id === activeSectionId);
    const sectionName = section?.displayName ?? activeSectionId;
    if (!seenRef.current.has(activeSectionId)) {
      seenRef.current.add(activeSectionId);
      setSectionsSeen(new Set(seenRef.current));
      if (section) {
        logEvent('OBSERVED', `Entered section · ${section.displayName}`);
        triggerHighlight(activeSectionId);
      }
    }
    // Dwell timer — if reader stays on this section too long, flag it.
    const timer = setTimeout(() => {
      const secs = Math.round(DWELL_FLAG_MS / 1000);
      logEvent('FLAGGED', `Dwell anomaly · ${sectionName} · ${secs}s on one section`);
    }, DWELL_FLAG_MS);
    return () => clearTimeout(timer);
  }, [activeSectionId, logEvent, triggerHighlight]);

  const value: CanaryWatchContextValue = useMemo(
    () => ({
      sessionStart,
      events,
      sections: sectionsRef.current,
      activeSectionId,
      highlightPulse,
      perchOverrides,
      sectionsSeen,
      intent,
      alertKey,
      birdHeldPos,
      registerSection,
      setActiveSection,
      triggerHighlight,
      logEvent,
      setPerchOverride,
      setIntent,
      setBirdHeldPos,
    }),
    // sectionsVersion in deps so consumers re-render when section list changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      sessionStart,
      events,
      activeSectionId,
      highlightPulse,
      perchOverrides,
      sectionsSeen,
      intent,
      alertKey,
      birdHeldPos,
      registerSection,
      setActiveSection,
      triggerHighlight,
      logEvent,
      setPerchOverride,
      setIntent,
      setBirdHeldPos,
      sectionsVersion,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCanaryWatch(): CanaryWatchContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      'useCanaryWatch must be used inside <CanaryWatchProvider>'
    );
  }
  return ctx;
}

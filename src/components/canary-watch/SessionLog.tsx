'use client';

/**
 * SessionLog — live-updating action log rendered at the bottom of the page.
 *
 * Self-referential joke: the page's section reports exactly the same kind
 * of log Canary produces for real agent sessions. The agent here is you.
 *
 * Reads everything from CanaryWatchProvider. No props, no hardcoded
 * content — content-agnostic.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCanaryWatch } from './context';
import { useCanarySection } from './useCanarySection';
import type { LogEventType } from './types';
import styles from './SessionLog.module.css';

function fmtElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  const mm = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Attention score — tuned to reward real engagement, penalize anomalies,
 * and start at zero so a visitor who barely arrives doesn't get a free 40%.
 * A reader who moves through most sections and actually interacts lands
 * in the 70–95 range; rage-clickers and tab-switchers drop.
 */
function computeAttentionScore(params: {
  sectionsSeen: number;
  sectionsTotal: number;
  flagged: number;
  blocked: number;
  learned: number;
  observedMeaningful: number;
  hasEvents: boolean;
}): string {
  if (!params.hasEvents) return '—';
  const sectionRatio = params.sectionsTotal > 0
    ? params.sectionsSeen / params.sectionsTotal
    : 0;
  const raw =
    sectionRatio * 55 +
    Math.min(25, params.observedMeaningful * 2.5) +
    params.learned * 6 -
    params.flagged * 7 -
    params.blocked * 4;
  const clamped = Math.max(0, Math.min(100, Math.round(raw)));
  return `${clamped}%`;
}

const EVENT_TYPE_CLASS: Record<LogEventType, string> = {
  OBSERVED: 'typeObserved',
  FLAGGED: 'typeFlagged',
  BLOCKED: 'typeBlocked',
  LEARNED: 'typeLearned',
  SUGGESTED: 'typeSuggested',
};

/** Events that count as meaningful engagement (not scroll/key noise). */
function isMeaningful(target: string): boolean {
  return (
    target.startsWith('CLICK') ||
    target.startsWith('Selected tab') ||
    target.startsWith('Dwelled on stat') ||
    target.startsWith('Waitlist submitted') ||
    target.startsWith('Intent captured') ||
    target.startsWith('Entered section')
  );
}

export function SessionLog() {
  const { events, sessionStart, sectionsSeen, sections } = useCanaryWatch();
  const [elapsed, setElapsed] = useState('00:00');

  // Final stop in the bird's journey — it lands here next to "Caught you."
  const { ref: sectionRef, perchRef, highlight } = useCanarySection({
    id: 'session-log',
    order: 6,
    displayName: 'Session log · Caught you',
  });

  // Stable combined ref — inline arrows re-create every render, which would
  // drive React to call the ref with null then element on each render, each
  // call triggers reregister → setSectionsVersion → re-render → loop.
  const headlineRef = useCallback(
    (el: HTMLElement | null) => {
      perchRef(el);
      highlight('headline')(el);
    },
    [perchRef, highlight]
  );

  // Scrollable log container — capped visible height; auto-follows the
  // newest entry while leaving the user free to scroll back into history.
  const logScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = logScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [events.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(fmtElapsed(Date.now() - sessionStart));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const dateStr = useMemo(() => {
    const d = new Date(sessionStart);
    return d.toISOString().slice(0, 10);
  }, [sessionStart]);

  const stats = useMemo(() => {
    let flagged = 0;
    let blocked = 0;
    let learned = 0;
    let meaningful = 0;
    for (const ev of events) {
      if (ev.type === 'FLAGGED') flagged++;
      else if (ev.type === 'BLOCKED') blocked++;
      else if (ev.type === 'LEARNED') learned++;
      if (ev.type === 'OBSERVED' && isMeaningful(ev.target)) meaningful++;
    }
    return {
      events: events.length,
      sections: sectionsSeen.size,
      flags: flagged + blocked,
      score: computeAttentionScore({
        sectionsSeen: sectionsSeen.size,
        sectionsTotal: Math.max(sections.length, 1),
        flagged,
        blocked,
        learned,
        observedMeaningful: meaningful,
        hasEvents: events.length > 0,
      }),
    };
  }, [events, sectionsSeen, sections.length]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} cw-dark-perch`}
      data-section-name="session-log"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.title}>
            <span className={styles.liveDot} aria-hidden="true" /> Canary session log · live
          </span>
          <span className={styles.meta}>
            <span className={styles.metaValue}>{elapsed}</span>
            <span className={styles.metaValue}>{dateStr}</span>
          </span>
        </div>

        <h2
          ref={headlineRef}
          className={styles.headline}
        >Caught you.</h2>
        <p className={styles.sub}>
          Same action log we&apos;d show you for a real agent session. Except
          the agent is you, and what you clicked was this page.
        </p>

        <div className={styles.hint} aria-hidden="true">
          Try it · watch the canary install itself into the Install panel
          · rage-click a CTA · cycle the use-case tabs fast · click
          &ldquo;Access source code.&rdquo; · switch tabs for 10s.
        </div>

        <div
          ref={logScrollRef}
          className={styles.logScroll}
          role="log"
          aria-live="polite"
        >
          <ul className={styles.log}>
            {events.length === 0 ? (
              <li className={styles.empty}>
                No events yet. Scroll up.
              </li>
            ) : (
              events.map((ev) => (
                <li key={ev.id} className={styles.row}>
                  <span className={styles.time}>{ev.time}</span>
                  <span className={`${styles.type} ${styles[EVENT_TYPE_CLASS[ev.type]]}`}>{ev.type}</span>
                  <span className={styles.target}>{ev.target}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className={styles.summary}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Events observed</span>
            <span className={styles.statValue}>{stats.events}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Sections visited</span>
            <span className={styles.statValue}>{stats.sections}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Flags raised</span>
            <span className={styles.statValue}>{stats.flags}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Attention score</span>
            <span className={styles.statValue}>{stats.score}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

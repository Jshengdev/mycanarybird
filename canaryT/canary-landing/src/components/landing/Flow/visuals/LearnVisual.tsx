'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { FlowVisualProps } from '../FlowStep';
import styles from './LearnVisual.module.css';

/**
 * Learn panel — session-replay video (auto-suggested rules) fills the
 * background; the "Add rule" button floats on top and remains the bird's
 * perch anchor.
 *
 * The button keeps its pulse → ✓ Added loop so the bird has something
 * visibly changing to "help click." `focusRef(0)` is wired to the button
 * too for log-cascade compatibility (no per-card DOM exists anymore).
 */
export function LearnVisual({ perchRef, focusRef }: FlowVisualProps) {
  const reduce = useReducedMotion() === true;
  const [added, setAdded] = useState(false);

  // Stable ref callback for the Add-rule button — the bird rides this.
  const addBtnRef = useCallback(
    (el: HTMLButtonElement | null) => {
      perchRef(el);
      focusRef(0)(el);
      focusRef(1)(el);
    },
    [perchRef, focusRef]
  );

  useEffect(() => {
    if (reduce) {
      setAdded(true);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const loop = () => {
      if (cancelled) return;
      setAdded(false);
      const t1 = window.setTimeout(() => {
        if (cancelled) return;
        setAdded(true);
        const t2 = window.setTimeout(loop, 2800);
        timers.push(t2);
      }, 3200);
      timers.push(t1);
    };
    loop();
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduce]);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <video
        className={styles.replay}
        src="/replays/rules.mov"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <button
        ref={addBtnRef}
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={`${styles.addBtn} ${styles.addBtnFloating} ${
          added ? styles.addBtnAdded : styles.addBtnPulse
        }`}
      >
        {added ? (
          <>
            <span className={styles.check}>✓</span> ADDED
          </>
        ) : (
          <>+ ADD RULE</>
        )}
      </button>
    </div>
  );
}

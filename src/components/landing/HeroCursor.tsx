'use client';

import { useEffect, useState } from 'react';
import styles from './HeroCursor.module.css';

export interface HeroCursorProps {
  /** Optional ref attached to the cursor span — used as a bird focus point. */
  cursorRef?: (el: HTMLElement | null) => void;
}

/**
 * Blinking cursor appended after the hero headline.
 * Blinks 4 times, then stays solid (muted).
 * Honors prefers-reduced-motion — rendered static.
 */
export function HeroCursor({ cursorRef }: HeroCursorProps = {}) {
  const [phase, setPhase] = useState<'blinking' | 'static'>('blinking');

  useEffect(() => {
    // 4 blinks × 800ms cycle = 3.2s
    const t = window.setTimeout(() => setPhase('static'), 3200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <span
      ref={cursorRef}
      className={`${styles.cursor} ${phase === 'blinking' ? styles.blinking : styles.static}`}
      aria-hidden="true"
    >
      ▊
    </span>
  );
}

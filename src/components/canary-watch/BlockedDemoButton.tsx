'use client';

/**
 * BlockedDemoButton — a CTA that looks like it does something (e.g.
 * "Access source code") and always gets denied. Click → BLOCKED event
 * in the session log + button visibly rejects the action + bird reacts.
 *
 * Meta-demo: this is what happens when an agent tries to take an action
 * your policy doesn't allow. The canary sees it and blocks it.
 */

import { useEffect, useRef, useState } from 'react';

import { useCanaryWatch } from './context';
import styles from './BlockedDemoButton.module.css';

export interface BlockedDemoButtonProps {
  /** User-visible label in the idle state. */
  label: string;
  /** Policy reason rendered both in the session log and inline after click. */
  reason: string;
  className?: string;
}

const BLOCK_FEEDBACK_MS = 2400;

export function BlockedDemoButton({ label, reason, className }: BlockedDemoButtonProps) {
  const { logEvent } = useCanaryWatch();
  const [blocked, setBlocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    logEvent('BLOCKED', `${label} · policy violation · ${reason}`);
    setBlocked(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setBlocked(false);
      timerRef.current = null;
    }, BLOCK_FEEDBACK_MS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={[styles.btn, blocked ? styles.blocked : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.label}>
        {blocked ? `✕  BLOCKED · ${reason}` : label}
      </span>
    </button>
  );
}

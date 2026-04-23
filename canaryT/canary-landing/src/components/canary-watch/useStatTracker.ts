'use client';

/**
 * useStatTracker — hook for tracking hover dwell time on a key stat.
 *
 * Usage:
 *   const ref = useStatTracker({ label: '10ms' });
 *   return <span ref={ref}>10ms</span>;
 *
 * When the user hovers for > 800ms, logs an OBSERVED event with the
 * dwell time. Reads text content from the DOM so copy changes are safe.
 */

import { useCallback, useEffect, useRef } from 'react';

import { useCanaryWatch } from './context';

export interface UseStatTrackerOptions {
  label?: string;  // optional explicit label; otherwise reads textContent
  minDwellMs?: number;
}

export function useStatTracker(
  opts: UseStatTrackerOptions = {}
): (el: HTMLElement | null) => void {
  const { logEvent } = useCanaryWatch();
  const elRef = useRef<HTMLElement | null>(null);
  const hoverStartRef = useRef<number | null>(null);
  const minDwellMs = opts.minDwellMs ?? 800;
  const explicitLabel = opts.label;

  const handleEnter = useCallback(() => {
    hoverStartRef.current = Date.now();
    elRef.current?.classList.add('cw-stat-hover');
  }, []);

  const handleLeave = useCallback(() => {
    elRef.current?.classList.remove('cw-stat-hover');
    const start = hoverStartRef.current;
    hoverStartRef.current = null;
    if (!start) return;
    const dwell = Date.now() - start;
    if (dwell < minDwellMs) return;
    const label = explicitLabel ?? elRef.current?.textContent?.trim() ?? 'stat';
    logEvent(
      'OBSERVED',
      `Dwelled on stat · ${label} (${(dwell / 1000).toFixed(1)}s)`
    );
  }, [logEvent, minDwellMs, explicitLabel]);

  // Attach / detach listeners when ref changes.
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [handleEnter, handleLeave]);

  return useCallback((el: HTMLElement | null) => {
    elRef.current = el;
  }, []);
}

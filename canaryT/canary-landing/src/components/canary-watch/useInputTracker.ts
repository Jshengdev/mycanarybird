'use client';

/**
 * useInputTracker — global input listeners that log reader behavior as the
 * same action-log lines Canary produces for an agent session.
 *
 * Mounted ONCE from CanaryWatchProvider.
 *
 * Observability surface:
 *   - OBSERVED  CLICK target="..."
 *   - OBSERVED  KEY name=...
 *   - OBSERVED  TYPE field=... (N chars)
 *   - OBSERVED  SCROLL Δ=±Npx
 *   - OBSERVED  FOCUS field=...
 *   - OBSERVED  COPY "..."
 *   - FLAGGED   RIGHT-CLICK target=...
 *   - FLAGGED   Repeat behavior · Nx target="..." within Ms
 *   - FLAGGED   Extended tab-hidden · Ns
 *
 * Grammar: every line uses `·` as the primary separator and `key=value`
 * for structured fields. One consistent shape across the log.
 */

import { useEffect, useRef } from 'react';

import type { LogEventType } from './types';

export interface InputTrackerDeps {
  logEvent: (type: LogEventType, target: string) => void;
}

function describeTarget(el: EventTarget | null): string {
  if (!(el instanceof HTMLElement)) return 'unknown';
  const tag = el.tagName.toLowerCase();
  const text = el.textContent?.trim().slice(0, 30);
  if ((tag === 'button' || tag === 'a') && text) {
    return `${tag} "${text}"`;
  }
  const name = el.getAttribute('aria-label') || el.id || el.getAttribute('name');
  return name ? `${tag} ${name}` : tag;
}

function fieldLabel(el: HTMLElement): string {
  return (
    el.getAttribute('id') ||
    el.getAttribute('name') ||
    el.getAttribute('aria-label') ||
    el.getAttribute('placeholder') ||
    el.tagName.toLowerCase()
  );
}

function escapeForLog(s: string): string {
  return s.replace(/"/g, '\\"').slice(0, 60);
}

/** Windows for behavioral-anomaly detection. */
const REPEAT_WINDOW_MS = 8_000;
const REPEAT_THRESHOLD = 3;
const REPEAT_COOLDOWN_MS = 4_000;
const CLICK_FOCUS_SUPPRESS_MS = 350;
const TAB_HIDDEN_FLAG_MS = 8_000;

export function useInputTracker({ logEvent }: InputTrackerDeps) {
  const typingBufferRef = useRef<{ field: string; count: number; timer: ReturnType<typeof setTimeout> | null }>({
    field: '',
    count: 0,
    timer: null,
  });
  const scrollBufferRef = useRef<{ deltaY: number; timer: ReturnType<typeof setTimeout> | null; lastY: number }>({
    deltaY: 0,
    timer: null,
    lastY: 0,
  });
  const lastFocusRef = useRef<string | null>(null);
  const lastClickAtRef = useRef<number>(0);
  // Rolling map of recent clicks per target key, for repeat-behavior detection.
  const clickHistoryRef = useRef<Map<string, { times: number[]; cooldownUntil: number }>>(new Map());
  const hiddenSinceRef = useRef<number | null>(null);

  useEffect(() => {
    scrollBufferRef.current.lastY = window.scrollY;

    /* ---- click ---- */
    const onClick = (e: MouseEvent) => {
      const tgt = describeTarget(e.target);
      lastClickAtRef.current = Date.now();
      logEvent('OBSERVED', `CLICK · target=${tgt}`);

      // Repeat-behavior detection. Key by describeTarget so "same button"
      // aggregates regardless of where in the DOM tree the click landed.
      const hist = clickHistoryRef.current.get(tgt) ?? { times: [], cooldownUntil: 0 };
      const now = Date.now();
      hist.times = hist.times.filter((t) => now - t < REPEAT_WINDOW_MS);
      hist.times.push(now);
      if (hist.times.length >= REPEAT_THRESHOLD && now > hist.cooldownUntil) {
        const windowMs = now - hist.times[0];
        const secs = (windowMs / 1000).toFixed(1);
        logEvent(
          'FLAGGED',
          `Repeat behavior · ${hist.times.length}× target=${tgt} within ${secs}s`
        );
        hist.cooldownUntil = now + REPEAT_COOLDOWN_MS;
        hist.times = [];
      }
      clickHistoryRef.current.set(tgt, hist);

      // Bound the Map — on long sessions, every distinct click target
      // would otherwise accumulate forever. Prune entries whose window
      // has expired AND whose cooldown is done.
      if (clickHistoryRef.current.size > 32) {
        for (const [k, v] of clickHistoryRef.current) {
          if (v.times.length === 0 && now > v.cooldownUntil) {
            clickHistoryRef.current.delete(k);
          }
        }
      }
    };

    /* ---- right-click (flag) ---- */
    const onContextMenu = (e: MouseEvent) => {
      const tgt = describeTarget(e.target);
      logEvent('FLAGGED', `RIGHT-CLICK · target=${tgt}`);
    };

    /* ---- keydown ---- */
    const onKeydown = (e: KeyboardEvent) => {
      const named = ['Tab', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (named.includes(e.key)) {
        logEvent('OBSERVED', `KEY · name=${e.key}`);
        return;
      }
      if (e.key.length !== 1 && e.key !== 'Backspace') return;
      const buf = typingBufferRef.current;
      const field = e.target instanceof HTMLElement ? fieldLabel(e.target) : 'unknown';
      if (buf.field !== field) {
        if (buf.count > 0) {
          logEvent('OBSERVED', `TYPE · field=${buf.field} · ${buf.count} chars`);
        }
        buf.field = field;
        buf.count = 0;
      }
      if (e.key === 'Backspace') {
        buf.count = Math.max(0, buf.count - 1);
      } else {
        buf.count++;
      }
      if (buf.timer) clearTimeout(buf.timer);
      buf.timer = setTimeout(() => {
        if (buf.count > 0) {
          logEvent('OBSERVED', `TYPE · field=${buf.field} · ${buf.count} chars`);
        }
        buf.field = '';
        buf.count = 0;
        buf.timer = null;
      }, 600);
    };

    /* ---- scroll ---- */
    const onScroll = () => {
      const buf = scrollBufferRef.current;
      const y = window.scrollY;
      buf.deltaY += y - buf.lastY;
      buf.lastY = y;
      if (buf.timer) clearTimeout(buf.timer);
      buf.timer = setTimeout(() => {
        if (Math.abs(buf.deltaY) > 120) {
          const sign = buf.deltaY > 0 ? '+' : '';
          logEvent('OBSERVED', `SCROLL · Δ=${sign}${buf.deltaY}px`);
        }
        buf.deltaY = 0;
        buf.timer = null;
      }, 500);
    };

    /* ---- focus ---- */
    const onFocusIn = (e: FocusEvent) => {
      // Don't double-log when a click moves focus to the clicked element.
      if (Date.now() - lastClickAtRef.current < CLICK_FOCUS_SUPPRESS_MS) return;
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      // Scope FOCUS events to form fields — buttons are covered by CLICK.
      if (!['input', 'textarea', 'select'].includes(el.tagName.toLowerCase())) return;
      const label = fieldLabel(el);
      if (lastFocusRef.current === label) return;
      lastFocusRef.current = label;
      logEvent('OBSERVED', `FOCUS · field=${label}`);
    };

    /* ---- visibilitychange (flag only if hidden > threshold) ---- */
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenSinceRef.current = Date.now();
      } else if (hiddenSinceRef.current) {
        const dur = Date.now() - hiddenSinceRef.current;
        hiddenSinceRef.current = null;
        const secs = (dur / 1000).toFixed(1);
        if (dur >= TAB_HIDDEN_FLAG_MS) {
          logEvent('FLAGGED', `Extended tab-hidden · ${secs}s`);
        } else {
          logEvent('OBSERVED', `Tab refocused · hidden ${secs}s`);
        }
      }
    };

    /* ---- copy ---- */
    const onCopy = () => {
      const sel = window.getSelection()?.toString().trim() ?? '';
      if (sel.length > 0) {
        logEvent('OBSERVED', `COPY · "${escapeForLog(sel)}"`);
      }
    };

    window.addEventListener('click', onClick);
    window.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('copy', onCopy);

    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('copy', onCopy);
      if (typingBufferRef.current.timer) clearTimeout(typingBufferRef.current.timer);
      if (scrollBufferRef.current.timer) clearTimeout(scrollBufferRef.current.timer);
    };
  }, [logEvent]);
}

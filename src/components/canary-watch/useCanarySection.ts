'use client';

/**
 * useCanarySection — the hook every landing section uses to opt in to
 * the watching system.
 *
 * Usage:
 *   const { ref, perchRef, highlight, focusRef } = useCanarySection({
 *     id: 'hero',
 *     order: 1,
 *     displayName: 'Hero · Trust layer',
 *   });
 *
 *   return (
 *     <section ref={ref}>
 *       <h1 ref={(el) => { perchRef(el); highlight('headline')(el); }}>
 *         ...
 *       </h1>
 *     </section>
 *   );
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useCanaryWatch } from './context';

export interface UseCanarySectionOptions {
  id: string;
  order: number;
  displayName: string;
}

export interface UseCanarySectionReturn {
  /** Attach to the section root. Used to detect which section is active. */
  ref: (el: HTMLElement | null) => void;
  /** Optional — attach to the element the bird should perch ON TOP of.
   *  If unused, the bird falls back to the section root. */
  perchRef: (el: HTMLElement | null) => void;
  /** Returns a ref setter for a highlight target by id. */
  highlight: (targetId: string) => (el: HTMLElement | null) => void;
  /**
   * Returns a ref setter for a focus point at the given ordered index
   * (0-based). Multiple focus points at the same index are OK — last
   * non-null wins, which is fine for these decorative callbacks.
   */
  focusRef: (index: number) => (el: HTMLElement | null) => void;
}

const HIGHLIGHT_DURATION_MS = 1500;
const HIGHLIGHT_FADE_MS = 900;
const STAGGER_MS = 180;

export function useCanarySection(
  opts: UseCanarySectionOptions
): UseCanarySectionReturn {
  const { registerSection, highlightPulse } = useCanaryWatch();

  const anchorRef = useRef<HTMLElement | null>(null);
  const perchElRef = useRef<HTMLElement | null>(null);
  const highlightRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const focusElsRef = useRef<Map<number, HTMLElement | null>>(new Map());
  /**
   * Cache the inner ref callbacks we hand back from `focusRef(index)` so that
   * `<div ref={focusRef(0)}>` sees the SAME function reference across renders.
   * Without this, every render would pass a fresh function, React would call
   * the old one with null and the new one with the element, and we'd churn
   * the registration on every render.
   */
  const focusSettersRef = useRef<Map<number, (el: HTMLElement | null) => void>>(
    new Map()
  );
  const unregisterRef = useRef<(() => void) | null>(null);

  // Re-register with the current anchor + perch + focus points. Safe to
  // call repeatedly — the context's registerSection is idempotent when
  // the payload hasn't changed (same element refs + same focusPoints
  // array element references), so this is a no-op on re-renders where
  // nothing has actually moved.
  const reregister = useCallback(() => {
    if (!anchorRef.current) return;
    const focusMap = focusElsRef.current;
    const orderedFocusPoints =
      focusMap.size === 0
        ? null
        : Array.from(focusMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([, el]) => el)
            .filter((el): el is HTMLElement => el !== null);

    const unreg = registerSection({
      id: opts.id,
      order: opts.order,
      displayName: opts.displayName,
      anchor: anchorRef.current,
      perchAnchor: perchElRef.current,
      focusPoints: orderedFocusPoints,
    });
    // Store the latest unregister function. Do NOT call the previous
    // unregister — registerSection replaces in-place.
    unregisterRef.current = unreg;
  }, [opts.id, opts.order, opts.displayName, registerSection]);

  // Clean up on unmount.
  useEffect(() => {
    return () => {
      if (unregisterRef.current) {
        unregisterRef.current();
        unregisterRef.current = null;
      }
    };
  }, []);

  // When the highlight pulse targets this section, fire the highlights.
  // All nested setTimeouts are tracked in `timers` and cleared on
  // unmount or on the next pulse — without this, a quick re-entry to
  // the same section while the previous animation is still running
  // would stack overlapping class-mutation timers on detached elements.
  useEffect(() => {
    if (!highlightPulse || highlightPulse.sectionId !== opts.id) return;
    const entries = Array.from(highlightRefs.current.entries());
    const timers: ReturnType<typeof setTimeout>[] = [];

    entries.forEach(([, el], i) => {
      if (!el) return;
      timers.push(
        setTimeout(() => {
          el.classList.remove('cw-fading');
          el.classList.add('cw-highlighted');
          timers.push(
            setTimeout(() => {
              el.classList.add('cw-fading');
              timers.push(
                setTimeout(() => {
                  el.classList.remove('cw-highlighted', 'cw-fading');
                }, HIGHLIGHT_FADE_MS)
              );
            }, HIGHLIGHT_DURATION_MS)
          );
        }, i * STAGGER_MS)
      );
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [highlightPulse, opts.id]);

  // Section root ref — updates anchor AND re-registers.
  const ref = useCallback(
    (el: HTMLElement | null) => {
      anchorRef.current = el;
      if (el) reregister();
    },
    [reregister]
  );

  // Perch ref — updates perch AND re-registers (if the anchor is already set).
  const perchRef = useCallback(
    (el: HTMLElement | null) => {
      perchElRef.current = el;
      if (el && anchorRef.current) reregister();
    },
    [reregister]
  );

  // Highlight target ref setter factory.
  const highlight = useCallback((targetId: string) => {
    return (el: HTMLElement | null) => {
      if (el === null) {
        highlightRefs.current.delete(targetId);
      } else {
        highlightRefs.current.set(targetId, el);
      }
    };
  }, []);

  // Focus-point ref setter factory. Feeds focusPoints into registration
  // so the mascot's eye-track driver can pick them up. Only re-registers
  // once the anchor is mounted to avoid dangling partial registrations.
  //
  // The inner callback is memoized per-index in `focusSettersRef` so that
  // `<div ref={focusRef(0)}>` is given the SAME function reference across
  // renders — otherwise React would churn the ref (null → el on every
  // render) and we'd thrash the registration.
  const focusRef = useCallback(
    (index: number) => {
      const cached = focusSettersRef.current.get(index);
      if (cached) return cached;
      const setter = (el: HTMLElement | null) => {
        if (el === null) {
          focusElsRef.current.delete(index);
        } else {
          focusElsRef.current.set(index, el);
        }
        if (anchorRef.current) reregister();
      };
      focusSettersRef.current.set(index, setter);
      return setter;
    },
    [reregister]
  );

  return useMemo(
    () => ({ ref, perchRef, highlight, focusRef }),
    [ref, perchRef, highlight, focusRef]
  );
}

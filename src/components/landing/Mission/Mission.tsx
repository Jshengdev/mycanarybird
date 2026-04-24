'use client';

/**
 * Mission — the trust-gap reframe, stripped down.
 *
 * Eyebrow · headline · lede · four one-word pillars with a mini
 * bird that cycles through them on loop. Each pillar dominates its
 * viewport with ink (OBSERVE → black, CONTROL → blue, BLOCK → red,
 * LEARN → yellow) as the bird perches on it. The architecture
 * diagram + sub-capability lists are gone; the pillar word *is* the
 * capability.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useCanarySection } from '@/components/canary-watch/useCanarySection';
import { AsciiMark } from '@/components/ui/AsciiMark/AsciiMark';
import styles from './Mission.module.css';

interface Pillar {
  label: string;
  /** CSS color token applied to the word while the mini bird is perched. */
  color: string;
}

const PILLARS: Pillar[] = [
  { label: 'OBSERVE', color: 'var(--text-black)' },
  { label: 'CONTROL', color: 'var(--accent-color)' },
  { label: 'BLOCK',   color: 'var(--critical)' },
  { label: 'LEARN',   color: 'var(--warning)' },
];

/** How long the mini bird rests on each pillar before hopping on. */
const PERCH_MS = 2000;

export function Mission() {
  const { ref: sectionRef, perchRef } = useCanarySection({
    id: 'mission',
    order: 2,
    displayName: 'Mission',
  });

  const reduce = useReducedMotion() === true;

  const [activeIdx, setActiveIdx] = useState(0);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [birdPos, setBirdPos] = useState<{ x: number; y: number } | null>(null);

  // Cycle the mini bird through the pillars on an interval. Reduced-motion
  // freezes it on OBSERVE.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % PILLARS.length);
    }, PERCH_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // Place the mini bird above the centre of the currently-active word.
  // useLayoutEffect so the position lands before the next paint (no flicker
  // on cycle). Resize listener keeps it pinned when the viewport changes.
  useLayoutEffect(() => {
    const place = () => {
      const wordEl = wordRefs.current[activeIdx];
      const row = rowRef.current;
      if (!wordEl || !row) return;
      const wordRect = wordEl.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      setBirdPos({
        x: wordRect.left - rowRect.left + wordRect.width / 2,
        y: wordRect.top - rowRect.top,
      });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [activeIdx]);

  return (
    <section
      className={styles.section}
      data-snap
      ref={sectionRef as unknown as Ref<HTMLElement>}
    >
      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          THE TRUST GAP
        </span>

        <h2
          className={styles.heading}
          ref={perchRef as unknown as Ref<HTMLHeadingElement>}
        >
          AI moves faster than we do.
        </h2>

        <p className={styles.lede}>
          Agents make millions of calls a day. Nobody&apos;s in the room
          when they do. Canary is: it watches the action, blocks whatever
          you flagged, and when something surprises you, it drafts the next
          rule before the next session starts.
        </p>

        <div className={styles.pillarsRow} ref={rowRef}>
          {PILLARS.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <span
                key={p.label}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className={styles.word}
                style={{
                  color: isActive ? p.color : 'var(--icon-grey)',
                  opacity: isActive ? 1 : 0.55,
                }}
              >
                {p.label}
              </span>
            );
          })}

          {birdPos && !reduce && (
            <span
              className={styles.miniBird}
              style={{
                transform: `translate3d(${birdPos.x - 12}px, ${birdPos.y - 26}px, 0)`,
                color: PILLARS[activeIdx].color,
              }}
              aria-hidden="true"
            >
              {/* Canary silhouette — `currentColor` picks up the active
                  pillar's colour so the bird tints with the word. */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c3.3 0 6 2.7 6 6 0 1.1-.3 2.1-.8 3l2.8 2.8-1.4 1.4L15.8 13c-1.1.6-2.4 1-3.8 1-3.3 0-6-2.7-6-6s2.7-5 6-5zM7.5 17.5c-1 1-1 2.6 0 3.6.9.9 2.4 1 3.4.2l1.6-1.3-3.9-3.9-1.1 1.4z" />
              </svg>
            </span>
          )}
        </div>

        <AsciiMark variant={2} corner="top-right" size={56} />
      </div>
    </section>
  );
}

export default Mission;

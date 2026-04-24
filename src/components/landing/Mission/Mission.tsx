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
  { label: 'OBSERVE', color: 'var(--warning)' },      // yellow
  { label: 'CONTROL', color: 'var(--text-black)' },   // ink
  { label: 'BLOCK',   color: 'var(--critical)' },     // red
  { label: 'LEARN',   color: 'var(--accent-color)' }, // blue
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
          HOW CANARY WORKS
        </span>

        <h2
          className={styles.heading}
          ref={perchRef as unknown as Ref<HTMLHeadingElement>}
        >
          AI moves faster than we do.
        </h2>

        <p className={styles.lede}>
          Agents make millions of calls a day. Nobody&apos;s in the room
          when they do. Canary is. It watches the action, blocks the moves
          you flagged, and when something surprises you, it drafts the
          next rule before the next session starts.
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
                transform: `translate3d(${birdPos.x - 16}px, ${birdPos.y - 36}px, 0)`,
                color: PILLARS[activeIdx].color,
              }}
              aria-hidden="true"
            >
              {/* Canary mascot — same silhouette as the main bird, inlined
                  with fill="currentColor" so it tints to the active
                  pillar's colour. */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 299 287"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M143.256 11.5576C185.324 -10.1553 223.448 2.98612 247.598 16.3223C267.134 27.1105 280.435 40.5163 288.579 53.3838C292.623 59.7727 295.516 66.2246 297.171 72.335C298.668 77.8603 299.737 85.2607 297.616 92.4727C296.037 97.8426 292.892 101.671 291.035 103.709C288.934 106.014 286.6 108.021 284.605 109.62C280.827 112.65 275.773 116.138 272.476 118.526C270.845 119.707 269.477 120.735 268.342 121.629C268.59 122.226 268.854 122.854 269.137 123.512C271.177 128.264 273.816 133.922 276.612 139.794C279.311 145.461 282.302 151.631 284.634 156.584C286.816 161.22 289.203 166.403 290.403 170.005C292.621 176.657 295.391 189.776 294.528 205.092C293.654 220.611 288.94 239.818 274.544 256.429C265.998 266.289 255.388 273.468 247.612 277.992C243.606 280.323 240.068 282.111 237.492 283.334C236.199 283.948 235.134 284.427 234.357 284.766C233.969 284.935 233.651 285.07 233.411 285.171C233.291 285.221 233.191 285.263 233.111 285.296C233.072 285.312 233.036 285.327 233.007 285.339C232.992 285.345 232.978 285.35 232.966 285.355C232.96 285.358 232.954 285.36 232.948 285.362C232.946 285.363 232.94 285.365 232.94 285.365C232.938 285.366 232.928 285.348 231.997 283.051L225.43 266.83L232.933 285.369L229.399 286.799L225.588 286.829H225.557C225.536 286.829 225.505 286.83 225.465 286.83C225.384 286.831 225.264 286.832 225.108 286.833C224.796 286.835 224.336 286.839 223.747 286.843C222.569 286.851 220.871 286.863 218.789 286.876C214.625 286.902 208.917 286.934 202.747 286.955C190.52 286.997 176.119 286.998 168.475 286.824V246.955C175.497 247.115 190.255 246.997 202.611 246.955C208.733 246.934 214.4 246.903 218.538 246.877C219.449 246.871 220.285 246.864 221.035 246.859C222.742 246.03 224.989 244.877 227.497 243.418C233.472 239.942 239.862 235.371 244.316 230.231C251.268 222.21 254.053 212.416 254.592 202.843C255.142 193.067 253.239 185.002 252.456 182.654C252.454 182.649 252.378 182.441 252.376 182.436C252.319 182.283 252.239 182.077 252.133 181.814C251.918 181.282 251.632 180.604 251.266 179.771C250.53 178.098 249.58 176.034 248.444 173.622C246.12 168.684 243.423 163.136 240.497 156.991C237.668 151.051 234.745 144.802 232.379 139.289C230.281 134.401 227.752 128.16 226.783 123.072C224.301 110.042 232.568 100.6 235.683 97.2969C239.827 92.9021 245.061 88.9926 249.009 86.1328C252.562 83.5585 255.249 81.7 257.557 79.9746C256.928 78.5087 256.031 76.7524 254.779 74.7754C250.423 67.8929 242.225 59.0492 228.261 51.3379C209.411 40.9287 186.534 34.2343 161.603 47.1025C140.342 58.0761 134.43 82.046 134.43 95.8301C134.43 99.1344 135.182 103.571 136.777 109.702C137.551 112.678 138.438 115.743 139.411 119.096C140.358 122.355 141.397 125.922 142.332 129.471C144.151 136.375 145.997 144.697 146.031 153.071C146.067 161.733 144.163 171.863 137.092 180.768C134.232 184.369 129.828 188.523 125.627 192.306C121.091 196.39 115.537 201.142 109.555 206.185C97.383 216.444 83.4208 227.93 70.5068 239.088C67.4132 241.761 64.4592 244.35 61.6768 246.83L76.9297 246.955V286.83H24.4297C21.2138 286.83 14.0657 286.427 7.86133 281.175C-0.0183607 274.504 -0.640445 265.365 0.370117 259.751C1.24987 254.864 3.4738 250.907 4.96875 248.534C6.66274 245.846 8.69035 243.245 10.7217 240.86C18.5824 231.632 31.4277 219.991 44.3555 208.821C57.4826 197.479 72.1446 185.402 83.7744 175.6C89.6923 170.611 94.8337 166.207 98.8613 162.58C100.872 160.769 102.503 159.245 103.757 158.007C104.379 157.392 104.862 156.893 105.224 156.504C105.402 156.312 105.536 156.162 105.632 156.052C105.673 156.005 105.703 155.968 105.725 155.941C105.827 155.686 106.038 154.923 106.031 153.234C106.018 150.114 105.27 145.804 103.652 139.663C102.869 136.689 101.978 133.628 100.997 130.248C100.043 126.961 99.0031 123.373 98.0664 119.772C96.2396 112.751 94.4297 104.342 94.4297 95.8301C94.4297 75.6142 102.518 32.5842 143.256 11.5576ZM199.981 58.0166C210.475 58.0166 218.981 66.5232 218.981 77.0166C218.981 87.51 210.475 96.0166 199.981 96.0166C189.488 96.0166 180.981 87.51 180.981 77.0166C180.981 66.5232 189.488 58.0166 199.981 58.0166Z" />
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

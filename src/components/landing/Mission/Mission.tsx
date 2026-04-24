'use client';

import type { Ref } from 'react';
import { useCanarySection } from '@/components/canary-watch/useCanarySection';
import { AsciiMark } from '@/components/ui/AsciiMark/AsciiMark';
import styles from './Mission.module.css';

/**
 * Mission — reframes Canary as a unified trust layer for autonomous agents.
 *
 * Sits between Hero (order 1) and Flow-install (order 3) as a full-viewport
 * snap target. Registers itself with the canary-watch system; the mascot
 * perches on the h2 the same way it perches on the Hero h1.
 *
 * The beat closes with a data-flow architecture diagram: an AGENT ACTION
 * input port fans out to four trust-layer pillars (OBSERVE / CONTROL /
 * BLOCK / LEARN), which fan back in to a CANARY VERDICT output port.
 * Connectors are static dotted SVG elbows — no animation, no glow.
 *
 * No load animations — the section must read as instant-ready under
 * scroll-snap. All decoration is CSS + one static AsciiMark in the corner.
 */
export function Mission() {
  const { ref: sectionRef, perchRef } = useCanarySection({
    id: 'mission',
    order: 2,
    displayName: 'Mission',
  });

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
          AI moves faster than our ability to guide it.
        </h2>

        <p className={styles.lede}>
          Agents make millions of decisions a day. There&apos;s no single
          place to watch what they do or shape what they&apos;re allowed to
          do. Canary is that place — record every move, enforce your rules,
          draft new ones when the agent does something you&apos;d want to
          catch next time.
        </p>

        <div className={styles.diagram}>
          {/* Dotted connectors sit behind the cards. Logical 1000×400
              viewBox is stretched by preserveAspectRatio="none" so the
              elbows keep their right-angle character at any width. */}
          <svg
            className={styles.connectors}
            aria-hidden="true"
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
          >
            {/* Input port (left) → pillar left edges. Port exits at x=0,y=200;
                pillars sit on the center column with left edges at x=360. */}
            <path d="M 0 200 L 180 200 L 180 50 L 360 50" />
            <path d="M 0 200 L 180 200 L 180 150 L 360 150" />
            <path d="M 0 200 L 180 200 L 180 250 L 360 250" />
            <path d="M 0 200 L 180 200 L 180 350 L 360 350" />

            {/* Pillar right edges (x=640) → output port (right) at x=1000,y=200. */}
            <path d="M 640 50 L 820 50 L 820 200 L 1000 200" />
            <path d="M 640 150 L 820 150 L 820 200 L 1000 200" />
            <path d="M 640 250 L 820 250 L 820 200 L 1000 200" />
            <path d="M 640 350 L 820 350 L 820 200 L 1000 200" />
          </svg>

          <div className={styles.port}>
            <span className={styles.portLabel}>AGENT ACTION</span>
          </div>

          <ul className={styles.pillars} role="list">
            <li className={styles.pillar}>
              <span className={styles.pillarLabel}>OBSERVE</span>
              <ul className={styles.pillarItems}>
                <li>every click</li>
                <li>every keystroke</li>
                <li>every screen state</li>
              </ul>
            </li>
            <li className={styles.pillar}>
              <span className={styles.pillarLabel}>CONTROL</span>
              <ul className={styles.pillarItems}>
                <li>plain-english rules</li>
                <li>policy compiler</li>
                <li>versioned rulebook</li>
              </ul>
            </li>
            <li className={styles.pillar}>
              <span className={styles.pillarLabel}>BLOCK</span>
              <ul className={styles.pillarItems}>
                <li>pre-flight check</li>
                <li>action-level deny</li>
                <li>violation ledger</li>
              </ul>
            </li>
            <li className={styles.pillar}>
              <span className={styles.pillarLabel}>LEARN</span>
              <ul className={styles.pillarItems}>
                <li>session review</li>
                <li>rule suggestions</li>
                <li>one-click adopt</li>
              </ul>
            </li>
          </ul>

          <div className={styles.port}>
            <span className={styles.portLabel}>CANARY VERDICT</span>
          </div>
        </div>

        <AsciiMark variant={2} corner="top-right" size={56} />
      </div>
    </section>
  );
}

export default Mission;

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
          Agents already make millions of decisions that touch millions of
          people — and there&apos;s no single place to watch how they behave
          or shape how they act. Canary is a unified trust layer for
          autonomous agents: observe every move, shape what they can do,
          teach them what they shouldn&apos;t repeat.
        </p>

        <ul className={styles.pillars}>
          <li className={styles.pillar}>
            <span className={styles.pillarLabel}>OBSERVE</span>
            <p className={styles.pillarBody}>
              Every click, keystroke, and screen state — recorded as it
              happens.
            </p>
          </li>
          <li className={styles.pillar}>
            <span className={styles.pillarLabel}>CONTROL</span>
            <p className={styles.pillarBody}>
              Write policy in plain English. Canary compiles it into
              enforceable rules.
            </p>
          </li>
          <li className={styles.pillar}>
            <span className={styles.pillarLabel}>BLOCK</span>
            <p className={styles.pillarBody}>
              Violations stopped before the agent acts — not flagged after
              the damage.
            </p>
          </li>
          <li className={styles.pillar}>
            <span className={styles.pillarLabel}>LEARN</span>
            <p className={styles.pillarBody}>
              After every session, Canary drafts the rules that would have
              prevented the mistake.
            </p>
          </li>
        </ul>

        <AsciiMark variant={2} corner="top-right" size={56} />
      </div>
    </section>
  );
}

export default Mission;

'use client';

/**
 * ControlNow — the "breathing beat" section between UseCases and Closer.
 *
 * A spare, cinematic enterprise-trust moment: declarative headline, short
 * supporting line, and a static ASCII dot-field texture behind it. Reads as
 * "we see every action" without shouting.
 *
 * Light-mode mirror of White Circle's dark starfield.
 */

import { useCanarySection } from '@/components/canary-watch';
import styles from './ControlNow.module.css';

export function ControlNow() {
  const { ref: sectionRef, perchRef } = useCanarySection({
    id: 'control-now',
    order: 4.5,
    displayName: 'Control Now',
  });

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-snap
      aria-labelledby="control-now-heading"
    >
      <div className={styles.texture} aria-hidden="true" />

      <div className={styles.inner}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowRule} aria-hidden="true" />
          THE COMPLETE PICTURE
        </span>
        <h2
          id="control-now-heading"
          ref={perchRef}
          className={styles.heading}
        >
          You&rsquo;re in <em className={styles.emphasis}>control</em> now.
        </h2>
        <p className={styles.sub}>
          Every action the agent takes gets watched as it happens, checked
          against your rules, and stored so you can replay it later.
        </p>
      </div>
    </section>
  );
}

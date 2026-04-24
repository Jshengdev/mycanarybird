'use client';

import { useCallback, type Ref } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { HeroAsciiGrid } from './HeroAsciiGrid';
import { HeroOrbit } from './HeroOrbit';
import { HeroCursor } from './HeroCursor';
import { staggerParent, staggerChild } from '@/lib/motion';
import {
  useCanarySection,
  BlockedDemoButton,
  ComplianceCtaButton,
} from '@/components/canary-watch';
import styles from './Hero.module.css';

/**
 * Hero — asymmetric left-aligned position + promise.
 * Per taste-skill §3 Rule 3: anti-center bias at DV > 4.
 * Monitor micro-detail: top-right LiveIndicator (pulsing green).
 */
export function Hero() {
  // Treat null (SSR/unknown) as "not reduced" to avoid hydration mismatch.
  // The actual preference is applied on the next render after hydration.
  const reduce = useReducedMotion() === true;

  // Round B: Hero has one stop — the bird sits on top of the H1 headline.
  // No focus-point cycle, no LIVE badge or cursor hops.
  const { ref: sectionRef, perchRef, highlight } = useCanarySection({
    id: 'hero',
    order: 1,
    displayName: 'Hero · Trust layer',
  });

  // Stable combined ref — inline arrows re-create every render, which would
  // drive React to call the ref with null then element on each render, each
  // call triggers reregister → setSectionsVersion → re-render → loop.
  const headlineRef = useCallback(
    (el: HTMLElement | null) => {
      perchRef(el);
      highlight('headline')(el);
    },
    [perchRef, highlight]
  );

  return (
    <section className={styles.hero} ref={sectionRef} data-snap>
      <motion.div
        className={styles.liveBadge}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { delay: 0.8, duration: 0.4 }}
      >
        <LiveIndicator label="LIVE · CANARY OBSERVING" />
      </motion.div>

      <HeroAsciiGrid />
      <HeroOrbit />

      <motion.div
        className={styles.content}
        variants={reduce ? undefined : staggerParent}
        initial={reduce ? undefined : 'hidden'}
        animate={reduce ? undefined : 'visible'}
      >
        <motion.h1
          ref={headlineRef as unknown as Ref<HTMLHeadingElement>}
          className={styles.headline}
          variants={reduce ? undefined : staggerChild}
        >
          The trust layer for
          <br />
          <em className={styles.emphasis}>autonomous</em> agents.
          <HeroCursor />
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          variants={reduce ? undefined : staggerChild}
        >
          Canary records what your agent does, and blocks anything you
          tell it to. At the end of a session, it writes rules it thinks
          you&apos;ll want. Install the SDK in five minutes.
        </motion.p>

        <motion.div
          className={styles.ctaRow}
          variants={reduce ? undefined : staggerChild}
        >
          <Button
            variant="primary"
            size="md"
            asciiVariant="both"
            plus
            tag="a"
            href="#early-access"
            className={styles.ctaPrimary}
          >
            Get early access
          </Button>
          <ComplianceCtaButton />
          <Button
            variant="secondary"
            size="md"
            asciiVariant="right"
            plus
            tag="a"
            href="#how-it-works"
          >
            See a live session
          </Button>
        </motion.div>

        {/* Utility row — always-denied demo, shows the BLOCKED mechanic live. */}
        <motion.div
          variants={reduce ? undefined : staggerChild}
          style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}
        >
          <BlockedDemoButton
            label="Access source code →"
            reason="code exfiltration"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

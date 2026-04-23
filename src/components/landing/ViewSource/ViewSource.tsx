'use client';

/**
 * ViewSource — the last tongue-in-cheek beat on the page.
 *
 * Reveal: "View source code" as a real-looking CTA at the bottom. Clicking
 * it looks like it should pull up the repo, but the canary is watching and
 * the action gets intercepted. The click itself demos what the product does.
 *
 * Wired into the canary-watch system as section `view-source` (order 5.5,
 * between Closer and SessionLog) so the bird can perch on the headline.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { useCanarySection, useCanaryWatch } from '@/components/canary-watch';
import styles from './ViewSource.module.css';

export function ViewSource() {
  const reduce = useReducedMotion() === true;
  const { logEvent } = useCanaryWatch();
  const [revealed, setRevealed] = useState(false);

  const { ref: sectionRef, perchRef } = useCanarySection({
    id: 'view-source',
    order: 5.5,
    displayName: 'View source code',
  });

  // Stable combined ref (same pattern as Closer) — avoids the inline-arrow
  // churn that would loop registration.
  const headlineRef = useCallback(
    (el: HTMLElement | null) => {
      perchRef(el);
    },
    [perchRef]
  );

  // Guard against re-log on the tiny chance the handler fires twice; the
  // button is disabled after reveal so this is belt-and-suspenders.
  const loggedRef = useRef(false);

  const handleClick = () => {
    if (loggedRef.current) return;
    loggedRef.current = true;
    logEvent(
      'BLOCKED',
      'Access source code attempt · policy: source code withheld'
    );
    setRevealed(true);
  };

  // Defensive cleanup if unmounted mid-flight (logEvent is fire-and-forget
  // so nothing to cancel, but we keep the hook symmetric with siblings).
  useEffect(() => {
    return () => {
      loggedRef.current = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-revealed={revealed ? 'true' : 'false'}
      data-snap
    >
      <motion.div
        className={styles.inner}
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={reduce ? { duration: 0 } : { ...spring, delay: 0.1 }}
      >
        <span className={styles.eyebrow}>The magic</span>
        <h2 ref={headlineRef} className={styles.headline}>
          View source code
        </h2>
        <p className={styles.body}>
          Click below to pull the code for this page.
        </p>

        <div className={styles.ctaRow}>
          <Button
            variant="primary"
            size="md"
            onClick={handleClick}
            disabled={revealed}
            aria-live="polite"
          >
            View source code →
          </Button>
        </div>

        {revealed && (
          <div className={styles.status} role="status" aria-live="polite">
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusLabel}>BLOCKED</span>
            <span className={styles.statusDivider} aria-hidden="true">·</span>
            <span className={styles.statusMsg}>
              Canary caught the attempt.
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}

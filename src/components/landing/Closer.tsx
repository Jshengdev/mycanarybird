'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { EarlyAccessForm } from './EarlyAccessForm';
import { Button } from '@/components/ui/Button';
import { useCanarySection, useCanaryWatch } from '@/components/canary-watch';
import styles from './Closer.module.css';

export function Closer() {
  // Treat null (SSR/unknown) as not-reduced; the actual preference is
  // applied on the next render after hydration. Matches Hero pattern.
  const reduce = useReducedMotion() === true;
  const { logEvent } = useCanaryWatch();

  const { ref: sectionRef, perchRef, highlight } = useCanarySection({
    id: 'closer',
    order: 5,
    displayName: 'Closer · Join the waitlist',
  });

  // Round B: the bird perches on the "Get early access" CTA (top-of-box).
  const submitRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    perchRef(submitRef.current);
  }, [perchRef]);

  const headlineRef = useCallback(
    (el: HTMLElement | null) => {
      highlight('headline')(el);
    },
    [highlight]
  );

  /** "View source code" side gag — click attempts to pull the repo, Canary
   *  blocks it and logs the attempt to the Session Log. Ported here from
   *  the removed ViewSource section so the final swipe is the logs. */
  const [sourceBlocked, setSourceBlocked] = useState(false);
  const sourceLoggedRef = useRef(false);
  const handleViewSource = () => {
    if (sourceLoggedRef.current) return;
    sourceLoggedRef.current = true;
    logEvent(
      'BLOCKED',
      'Access source code attempt · policy: source code withheld'
    );
    setSourceBlocked(true);
  };

  return (
    <section ref={sectionRef} className={styles.closer} data-snap>
      <motion.div
        className={styles.inner}
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={reduce ? { duration: 0 } : { ...spring, delay: 0.1 }}
      >
        <h2
          ref={headlineRef}
          className={styles.headline}
        >
          Every agent running itself
          <br />
          needs someone watching it.
        </h2>
        <p className={styles.subhead}>
          Watch. Block. Learn. Repeat.
        </p>
        <motion.div
          className={styles.formWrap}
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reduce ? { duration: 0 } : { ...spring, delay: 0.3 }}
        >
          <EarlyAccessForm submitRef={submitRef} />
        </motion.div>

        <div className={styles.sourceRow}>
          <span className={styles.sourceEyebrow}>The magic</span>
          <h3 className={styles.sourceHeadline}>View source code</h3>
          <p className={styles.sourceBody}>
            Click below to pull the code for this page.
          </p>
          <Button
            variant="secondary"
            size="md"
            plus
            onClick={handleViewSource}
            disabled={sourceBlocked}
            aria-live="polite"
          >
            View source code
          </Button>
          {sourceBlocked && (
            <span className={styles.blockedMsg} role="status" aria-live="polite">
              <span className={styles.blockedDot} aria-hidden="true" />
              BLOCKED · Canary caught the attempt.
            </span>
          )}
        </div>
      </motion.div>
    </section>
  );
}

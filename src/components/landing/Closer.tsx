'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { EarlyAccessForm } from './EarlyAccessForm';
import { useCanarySection } from '@/components/canary-watch';
import styles from './Closer.module.css';

export function Closer() {
  // Treat null (SSR/unknown) as not-reduced; the actual preference is
  // applied on the next render after hydration. Matches Hero pattern.
  const reduce = useReducedMotion() === true;

  const { ref: sectionRef, perchRef, highlight } = useCanarySection({
    id: 'closer',
    order: 5,
    displayName: 'Closer · Join the waitlist',
  });

  // Round B: the bird perches on the "Get early access" CTA (top-of-box).
  // The submit button's ref is forwarded into the form and registered as
  // the section's perchAnchor — the mascot's default perch math lands the
  // bird directly on top of it.
  const submitRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    perchRef(submitRef.current);
  }, [perchRef]);

  // Stable combined ref for the headline (highlight-only; not a perch).
  const headlineRef = useCallback(
    (el: HTMLElement | null) => {
      highlight('headline')(el);
    },
    [highlight]
  );

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
      </motion.div>
    </section>
  );
}

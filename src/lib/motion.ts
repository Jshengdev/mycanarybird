/**
 * Shared Framer Motion configs.
 * Do not invent new spring values per-component — the page's
 * sense of materiality comes from every interaction sharing
 * the same physics signature.
 *
 * Rationale: taste-skill §3 Rule 5 and §4 — spring physics,
 * never linear easing. stiffness/damping 100/20 is a
 * premium, weighty feel that reads as "system responds."
 */

import type { Transition, Variants, TargetAndTransition } from 'framer-motion';

/** Base spring — use for 90% of motion. */
export const spring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};

/** Snappier spring — use for taps, dismissals, quick state swaps. */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
};

/** Stagger for parent/child lists (hero headline words, nav links). */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/** Matches staggerParent — items fade up on entrance. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring },
};

/** Tactile press: scale down on active. Spread into whileTap. */
export const tapPress: TargetAndTransition = {
  scale: 0.98,
  transition: springSnappy,
};

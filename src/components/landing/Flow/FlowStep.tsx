'use client';

import { useCallback, useRef, type ComponentType, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { spring, staggerParent, staggerChild } from '@/lib/motion';
import { useCanarySection } from '@/components/canary-watch';
import styles from './FlowStep.module.css';

/**
 * Visual components rendered inside each Flow step. They receive a `perchRef`
 * for wiring a specific in-visual perch anchor (e.g. the playhead in See, the
 * Add-rule button in Learn) and a `focusRef` kept for backward compatibility
 * / log-cascade handles.
 *
 * Round B: each visual decides its OWN perch by calling `perchRef(el)` on
 * the element the bird should sit on. FlowStep forwards whichever element
 * the visual picks into canary-watch section registration — if the visual
 * never calls perchRef, FlowStep falls back to the `.numberRow` in the copy
 * column (for Install) or the `.visualFrame` itself.
 */
export interface FlowVisualProps {
  /** Attach to the element the bird should perch on within this visual. */
  perchRef: (el: HTMLElement | null) => void;
  /** Legacy focus-point refs — still accepted by visuals but unused by the
   *  Round B mascot. Kept so visuals don't need to change signature. */
  focusRef: (index: number) => (el: HTMLElement | null) => void;
}

export interface FlowStepProps {
  sectionId: string;
  sectionOrder: number;
  sectionDisplayName: string;
  number: string;
  label: string;
  headline: ReactNode;
  body: ReactNode;
  stat: { value: string; caption: string };
  orientation: 'left' | 'right';
  Visual: ComponentType<FlowVisualProps>;
  /** `data-canary-drop` marker — used by the Install cinematic to find the panel. */
  dropKey: string;
  /**
   * Which element acts as this step's initial perch:
   *   - 'numberRow' → the "01 · Install" row in the copy column (Install).
   *   - 'visual'    → whatever the visual itself registers via perchRef;
   *                   falls back to the visualFrame if the visual doesn't wire one.
   * Default is 'visual'.
   */
  initialPerch?: 'numberRow' | 'visual';
}

export function FlowStep({
  sectionId,
  sectionOrder,
  sectionDisplayName,
  number,
  label,
  headline,
  body,
  stat,
  orientation,
  Visual,
  dropKey,
  initialPerch = 'visual',
}: FlowStepProps) {
  const reduce = useReducedMotion() === true;

  const { ref: sectionRef, perchRef, focusRef } = useCanarySection({
    id: sectionId,
    order: sectionOrder,
    displayName: sectionDisplayName,
  });

  // Track which element the visual registered via its perchRef callback.
  // We may prefer the numberRow over the visual-registered element depending
  // on `initialPerch` — but we always wire the visualFrame as the
  // `data-canary-drop` target so the Install cinematic can find the panel.
  const visualPerchRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const numberRowRef = useRef<HTMLDivElement | null>(null);

  /**
   * Compute which element this step's canary-watch perchAnchor should be,
   * based on `initialPerch` and whichever perch anchor the visual registered.
   * Registration is resolved each time any of these inputs change (see
   * handlers below) — keep the logic in one place.
   */
  const commitPerch = useCallback(() => {
    if (initialPerch === 'numberRow' && numberRowRef.current) {
      perchRef(numberRowRef.current);
      return;
    }
    // 'visual' fallback: prefer the element the visual registered, else the
    // visualFrame itself (so cage/drop-target lookups still work).
    perchRef(visualPerchRef.current ?? frameRef.current);
  }, [initialPerch, perchRef]);

  /** Ref callback for the visual's chosen perch element. */
  const visualPerch = useCallback(
    (el: HTMLElement | null) => {
      visualPerchRef.current = el;
      commitPerch();
    },
    [commitPerch]
  );

  /** Ref callback for the numberRow — only load-bearing when initialPerch='numberRow'. */
  const setNumberRowRef = useCallback(
    (el: HTMLDivElement | null) => {
      numberRowRef.current = el;
      commitPerch();
    },
    [commitPerch]
  );

  /** Ref callback for the visualFrame — always wired for data-canary-drop. */
  const setFrameRef = useCallback(
    (el: HTMLDivElement | null) => {
      frameRef.current = el;
      commitPerch();
    },
    [commitPerch]
  );

  const classes =
    orientation === 'right'
      ? `${styles.step} ${styles.stepReverse}`
      : styles.step;

  return (
    <motion.div
      ref={sectionRef}
      id={sectionId}
      className={classes}
      data-snap
      variants={reduce ? undefined : staggerParent}
      initial={reduce ? undefined : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0 } : spring}
    >
      <div className={styles.copyCol}>
        <motion.div
          ref={setNumberRowRef}
          className={styles.numberRow}
          variants={reduce ? undefined : staggerChild}
        >
          <span className={styles.number} aria-hidden="true">{number}</span>
          <span className={styles.label}>{label}</span>
          <span className={styles.numberRule} aria-hidden="true" />
        </motion.div>

        <motion.h3
          className={styles.headline}
          variants={reduce ? undefined : staggerChild}
        >
          {headline}
        </motion.h3>

        <motion.p
          className={styles.body}
          variants={reduce ? undefined : staggerChild}
        >
          {body}
        </motion.p>

        <motion.div
          className={styles.stat}
          variants={reduce ? undefined : staggerChild}
        >
          <span className={styles.statValue}>{stat.value}</span>
          <span className={styles.statCaption}>{stat.caption}</span>
        </motion.div>
      </div>

      <motion.div
        className={styles.visualCol}
        variants={reduce ? undefined : staggerChild}
      >
        <div
          ref={setFrameRef}
          className={styles.visualFrame}
          data-canary-drop={dropKey}
        >
          <Visual perchRef={visualPerch} focusRef={focusRef} />
          <div className={styles.scanline} aria-hidden="true" />
        </div>
      </motion.div>
    </motion.div>
  );
}

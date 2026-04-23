'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { ReelProgress } from './ReelProgress';
import { FrameObserve } from './FrameObserve';
import { FrameControl } from './FrameControl';
import { FrameImprove } from './FrameImprove';
import { useCanarySection } from '@/components/canary-watch';
import styles from './Reel.module.css';

/**
 * The Reel — Observe → Control → Improve.
 * Pinned 100vh stage across 300vh scroll. Scroll progress drives
 * active frame index (0 | 1 | 2).
 *
 * taste-skill §8: this tree must NEVER import framer-motion.
 * taste-skill §5: all animation is opacity; no top/left/width/height.
 *
 * Reduced-motion fallback: render frames stacked, skip pinning entirely.
 */
export function Reel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<0 | 1 | 2>(0);
  const activeIndexRef = useRef<0 | 1 | 2>(0);

  const { ref: canaryRef, perchRef } = useCanarySection({
    id: 'reel',
    order: 3,
    displayName: 'Reel · Observe / Control / Improve',
  });

  // Combined ref: GSAP needs a mutable ref; canary-watch needs a callback.
  // Memoized so React doesn't re-attach on every render (which would cause
  // an infinite re-register loop).
  const setSectionRef = useCallback(
    (el: HTMLElement | null) => {
      sectionRef.current = el;
      canaryRef(el);
    },
    [canaryRef]
  );

  // Per-frame perch elements. Perches follow the reader's eye path through
  // each frame: session header (observe) → BLOCKED stripe (control) →
  // first suggested rule card (improve).
  const observePerchRef = useRef<HTMLDivElement>(null);
  const controlPerchRef = useRef<HTMLDivElement>(null);
  const improvePerchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el =
      activeIndex === 0
        ? observePerchRef.current
        : activeIndex === 1
          ? controlPerchRef.current
          : improvePerchRef.current;
    perchRef(el);
  }, [activeIndex, perchRef]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      pinSpacing: false,
      onUpdate: (self) => {
        const p = self.progress;
        let idx: 0 | 1 | 2 = 0;
        if (p > 0.66) idx = 2;
        else if (p > 0.33) idx = 1;
        // Skip setState when index hasn't changed (avoids ~120 fps re-renders).
        if (idx !== activeIndexRef.current) {
          activeIndexRef.current = idx;
          setActiveIndex(idx);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <section ref={setSectionRef} className={styles.reelStatic}>
        <div className={styles.staticStack}>
          <FrameObserve isActive />
          <FrameControl isActive />
          <FrameImprove isActive />
        </div>
      </section>
    );
  }

  return (
    <section ref={setSectionRef} className={styles.reelSection}>
      <div ref={stageRef} className={styles.stage}>
        <ReelProgress activeIndex={activeIndex} />
        <div className={styles.frames}>
          <FrameObserve isActive={activeIndex === 0} innerPerchRef={observePerchRef} />
          <FrameControl isActive={activeIndex === 1} innerPerchRef={controlPerchRef} />
          <FrameImprove isActive={activeIndex === 2} innerPerchRef={improvePerchRef} />
        </div>
        <div className={styles.stageBadge} aria-hidden="true">
          <span className={styles.stageBadgeLabel}>FRAME</span>
          <span className={styles.stageBadgeValue}>
            <span className={styles.stageBadgeCurrent}>{activeIndex + 1}</span>
            <span className={styles.stageBadgeDivider}>/</span>
            <span>3</span>
          </span>
        </div>
      </div>
    </section>
  );
}

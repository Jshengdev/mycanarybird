'use client';

import { useCallback } from 'react';
import type { FlowVisualProps } from '../FlowStep';
import styles from './SeeVisual.module.css';

/**
 * See panel — session-replay video fills the frame.
 *
 * Round B originally rode a fake CSS playhead; we now show a real session
 * replay. The bird's perch rides the `<video>` element itself so it sits
 * on top of the video frame (still reads as "bird is watching the
 * session"). `focusRef(1)` is wired to the same element for log-cascade
 * compatibility; `focusRef(0)` has no natural counterpart in a pure-video
 * panel and is intentionally skipped.
 */
export function SeeVisual({ perchRef, focusRef }: FlowVisualProps) {
  // Stable ref callback so React doesn't churn registration each render.
  const videoPerchRef = useCallback(
    (el: HTMLVideoElement | null) => {
      perchRef(el);
      focusRef(1)(el);
    },
    [perchRef, focusRef]
  );

  return (
    <div className={styles.wrap} aria-hidden="true">
      <video
        ref={videoPerchRef}
        className={styles.replay}
        src="/replays/see.mov"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    </div>
  );
}

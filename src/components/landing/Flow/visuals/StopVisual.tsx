'use client';

import type { FlowVisualProps } from '../FlowStep';
import styles from './StopVisual.module.css';

/**
 * Stop panel — session-replay video (blocked action) fills the cage interior.
 *
 * The four-walled `.cage` + `data-stop-cage` marker is preserved so the Round
 * B bounce physics in CanaryMascot still has bounds to bounce the bird
 * inside. The `.corner` tick elements render on top of the video (z-index)
 * so the cage reads as a physical container. `focusRef(0)` is wired to the
 * cage for log-cascade compatibility — the BLOCKED stripe no longer exists
 * as its own DOM node now that the video replaced the mock content.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StopVisual({ perchRef: _perchRef, focusRef }: FlowVisualProps) {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div
        className={styles.cage}
        data-stop-cage="true"
        ref={focusRef(0)}
      >
        <video
          className={styles.replay}
          src="/replays/stop.mov"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <span className={styles.corner} data-corner="tl" aria-hidden="true" />
        <span className={styles.corner} data-corner="tr" aria-hidden="true" />
        <span className={styles.corner} data-corner="bl" aria-hidden="true" />
        <span className={styles.corner} data-corner="br" aria-hidden="true" />
      </div>
    </div>
  );
}

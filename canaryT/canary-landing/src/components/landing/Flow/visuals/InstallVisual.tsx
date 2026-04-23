'use client';

import type { FlowVisualProps } from '../FlowStep';
import styles from './InstallVisual.module.css';

/**
 * Install panel — session-replay video (insights reel) fills the frame.
 *
 * Round B: Install's initial perch is the copy-column numberRow (wired at
 * FlowStep level). After the install cinematic fires, the mascot pins
 * itself to the `.visualFrame` via `birdAnchorRef`. The visual itself does
 * not need to register a perch, so `perchRef` is intentionally unused.
 *
 * `focusRef` is preserved in the prop signature (and unused) for
 * backward-compat with the FlowVisualProps interface.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InstallVisual({ perchRef: _perchRef, focusRef: _focusRef }: FlowVisualProps) {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <video
        className={styles.replay}
        src="/replays/insights.mov"
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

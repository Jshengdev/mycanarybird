import { ReactNode, type RefObject } from 'react';
import styles from './ReelFrame.module.css';

export interface ReelFrameProps {
  label: string;
  headline: string;
  body: ReactNode;
  stat: { value: string; caption: string };
  visual: ReactNode;
  isActive: boolean;
  /** Optional ref attached to the stat value — used as a perch target. */
  statRef?: RefObject<HTMLSpanElement>;
}

/**
 * Shared shell for OBSERVE / CONTROL / IMPROVE.
 * Left: label, headline, body, embedded stat.
 * Right: product visual with --card-gradient bg + scanline overlay.
 */
export function ReelFrame({ label, headline, body, stat, visual, isActive, statRef }: ReelFrameProps) {
  return (
    <div className={`${styles.frame} ${isActive ? styles.active : ''}`}>
      <div className={styles.copyColumn}>
        <span className={styles.label}>{label}</span>
        <h3 className={styles.headline}>{headline}</h3>
        <div className={styles.body}>{body}</div>
        <div className={styles.stat}>
          <span ref={statRef} className={styles.statValue}>{stat.value}</span>
          <span className={styles.statCaption}>{stat.caption}</span>
        </div>
      </div>
      <div className={styles.visualColumn}>
        <div className={styles.visualContainer}>
          {visual}
          <div className={styles.scanline} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

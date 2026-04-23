import styles from './LiveIndicator.module.css';

export interface LiveIndicatorProps {
  label?: string;
  /** Override color (defaults to --safe, muted forest green). */
  color?: string;
  /** Visual size — 'sm' for nav chrome, 'md' for hero badge. */
  size?: 'sm' | 'md';
}

/**
 * Pulsing status dot with an adjacent mono label.
 * Default color: --safe (muted forest green #2D7A55) — reads
 * as "system operational" per Real-Time Monitoring conventions.
 *
 * Honors prefers-reduced-motion: pulse disabled, dot static.
 */
export function LiveIndicator({
  label = 'LIVE',
  color = 'var(--safe)',
  size = 'md',
}: LiveIndicatorProps) {
  const sizeClass = size === 'sm' ? styles.small : styles.medium;
  const dotSizeClass = size === 'sm' ? styles.dotSmall : styles.dotMedium;
  return (
    <div className={`${styles.wrapper} ${sizeClass}`} aria-hidden="true">
      <span className={`${styles.dot} ${dotSizeClass}`} style={{ background: color }} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

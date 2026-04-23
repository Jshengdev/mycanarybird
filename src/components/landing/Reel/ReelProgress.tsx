import styles from './ReelProgress.module.css';

export interface ReelProgressProps {
  activeIndex: 0 | 1 | 2;
}

const FRAMES = ['OBSERVE', 'CONTROL', 'IMPROVE'];

export function ReelProgress({ activeIndex }: ReelProgressProps) {
  return (
    <div className={styles.progress} aria-label="Reel progress">
      {FRAMES.map((label, i) => {
        const isActive = i === activeIndex;
        return (
          <div key={label} className={styles.row}>
            <div
              className={`${styles.dot} ${isActive ? styles.dotActive : ''}`}
              aria-current={isActive ? 'step' : undefined}
            />
            <span className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import styles from './EcosystemBar.module.css';

const FRAMEWORKS = [
  { name: 'Claude Code', mark: '◆' },
  { name: 'Browser Use', mark: '◆' },
  { name: 'OpenClaw', mark: '◆' },
  { name: 'Hermes', mark: '◆' },
];

/**
 * Ecosystem trust bar between hero and Reel.
 * Not a 3-column card row (taste-skill §7 ban). Horizontal list
 * with legitimacy stat below — openClaw downloads is the
 * hardest-to-fake credibility signal in the 2-second scan.
 */
export function EcosystemBar() {
  return (
    <section className={styles.bar} aria-label="Supported agent frameworks">
      <div className={styles.row}>
        <span className={styles.prefix}>Built for</span>
        {FRAMEWORKS.map((fw) => (
          <span key={fw.name} className={styles.framework}>
            <span className={styles.mark}>{fw.mark}</span>
            {fw.name}
          </span>
        ))}
      </div>
      <p className={styles.legitimacy}>
        OpenClaw <span className={styles.mono}>1.6M</span> weekly downloads this quarter.
      </p>
    </section>
  );
}

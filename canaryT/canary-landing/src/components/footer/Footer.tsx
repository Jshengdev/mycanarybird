import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brandRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canarylogo.svg"
            alt="Canary"
            className={styles.brandLogo}
          />
          <span className={styles.brandTagline}>
            Canary. QA for computer-use agents.
          </span>
        </div>

        <div className={styles.footerLinks}>
          <a href="#docs">Docs</a>
          <span className={styles.footerDivider}>·</span>
          <a href="#github">GitHub</a>
          <span className={styles.footerDivider}>·</span>
          <a href="#npm">npm</a>
          <span className={styles.footerDivider}>·</span>
          <a href="#contact">Contact</a>
        </div>

        <p className={styles.footerLegal}>© 2026 Canary · mycanarybird.com</p>
      </div>
    </footer>
  );
}

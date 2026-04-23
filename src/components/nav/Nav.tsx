import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './Nav.module.css';

/**
 * Nav — flat full-width top bar.
 *
 * Previously morphed into a floating pill on scroll. The morph created
 * extra visual noise every page-down; a static flat bar reads calmer
 * and lets the content carry the attention.
 */
export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {/* Left: logo + wordmark */}
      <div className={styles.navLeft}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/canarylogo.svg" alt="Canary" style={{ height: 16 }} />
        <span className={styles.wordmark}>CANARY</span>
      </div>

      {/* Right: nav links + CTA */}
      <div className={styles.navRight}>
        <div className={styles.navLinks}>
          <Link href="/features" className={styles.navLink}>Features</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/blog" className={styles.navLink}>Blog</Link>
          <Link href="/login" className={styles.navLink}>Login</Link>
        </div>
        <Button variant="primary" size="sm" asciiVariant="both" tag="a" href="#early-access">
          Get early access
        </Button>
      </div>
    </nav>
  );
}

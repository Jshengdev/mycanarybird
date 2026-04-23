'use client';

/**
 * ComplianceCtaButton — "View compliance score" funnel entry.
 *
 * Clicking captures the intent, scrolls the reader to the early-access
 * form, and emits an OBSERVED "Intent captured" event so the session log
 * shows the lead-path attribution (same as a real dashboard would).
 */

import { useCanaryWatch } from './context';
import styles from './ComplianceCtaButton.module.css';

export interface ComplianceCtaButtonProps {
  className?: string;
}

export function ComplianceCtaButton({ className }: ComplianceCtaButtonProps) {
  const { logEvent, setIntent } = useCanaryWatch();

  const handleClick = () => {
    setIntent('compliance-score');
    logEvent('OBSERVED', 'Intent captured · compliance-score requested');
    const target = document.getElementById('early-access');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus the first input once the scroll likely settled.
      window.setTimeout(() => {
        const firstField = target.querySelector<HTMLInputElement>('input, select, textarea');
        firstField?.focus();
      }, 700);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[styles.btn, className ?? ''].filter(Boolean).join(' ')}
    >
      View compliance score  →
    </button>
  );
}

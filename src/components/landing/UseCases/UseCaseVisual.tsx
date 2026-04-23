'use client';

import styles from './UseCaseVisual.module.css';

/**
 * Per-use-case visual. One concrete artifact per tab — what the reader
 * would see in the product. No generic placeholders.
 */
export function UseCaseVisual({ id }: { id: string }) {
  switch (id) {
    case 'gtm':
      return <GtmVisual />;
    case 'coding':
      return <CodingVisual />;
    case 'long-running':
      return <LongRunningVisual />;
    case 'custom':
      return <CustomVisual />;
    default:
      return null;
  }
}

/** Outbound email being blocked before it sends. */
function GtmVisual() {
  return (
    <div className={styles.emailCard}>
      <div className={styles.emailHeader}>
        <span className={styles.emailHost}>outbound-agent@photon.dev</span>
        <span className={`${styles.emailStatus} ${styles.emailStatusBlocked}`}>
          <span className={styles.statusDot} /> BLOCKED
        </span>
      </div>
      <div className={styles.emailMeta}>
        <span className={styles.emailMetaLabel}>To</span>
        <span className={styles.emailMetaValue}>cfo@suppressedcompany.com</span>
      </div>
      <div className={styles.emailMeta}>
        <span className={styles.emailMetaLabel}>Subj</span>
        <span className={styles.emailMetaValue}>Re: Q4 partnership terms</span>
      </div>
      <div className={styles.emailBody}>
        Hi Sarah — following up on the proposal we sent last week. I can walk
        through pricing tiers today or tomorrow…
      </div>
      <div className={styles.policyMatch}>
        <span className={styles.policyLabel}>MATCHED POLICY</span>
        <code className={styles.policyCode}>
          suppression_list · cfo@suppressedcompany.com · added 2026-03-22
        </code>
      </div>
    </div>
  );
}

/** Terminal showing a shell command being blocked. */
function CodingVisual() {
  return (
    <div className={styles.terminal}>
      <div className={styles.terminalChrome}>
        <span className={styles.termDot} data-color="red" />
        <span className={styles.termDot} data-color="amber" />
        <span className={styles.termDot} data-color="green" />
        <span className={styles.termTitle}>claude-code · agent_session_847</span>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.termLine}>
          <span className={styles.termPrompt}>agent$</span>
          <span className={styles.termCmd}>rm -rf node_modules/.cache</span>
        </div>
        <div className={styles.termLineInfo}>
          <span className={styles.termOk}>ok</span>
          <span>3 directories removed</span>
        </div>
        <div className={styles.termLine}>
          <span className={styles.termPrompt}>agent$</span>
          <span className={styles.termCmd}>rm -rf /</span>
        </div>
        <div className={styles.termLineBlocked}>
          <span className={styles.termBlocked}>BLOCKED · canary</span>
          <span>rule matched: no rm -rf outside /tmp or workspace</span>
        </div>
        <div className={styles.termLineBlockedDetail}>
          <span className={styles.termPolicy}>policy:</span>
          <code className={styles.termPolicyCode}>
            deny.shell.recursive_delete · prefix: ["/", "/etc", "/usr", "~"]
          </code>
        </div>
        <div className={styles.termLine}>
          <span className={styles.termPrompt}>agent$</span>
          <span className={styles.termCaret}>▊</span>
        </div>
      </div>
    </div>
  );
}

/** Scrubber showing an 8-hour session compressed. */
function LongRunningVisual() {
  return (
    <div className={styles.scrubber}>
      <div className={styles.scrubHeader}>
        <span className={styles.scrubLabel}>SESSION · overnight-run-2026-04-15</span>
        <span className={styles.scrubDuration}>08:14:22 total</span>
      </div>
      <div className={styles.scrubTrack}>
        <div className={styles.scrubMarker} style={{ left: '12%' }} data-kind="observed" />
        <div className={styles.scrubMarker} style={{ left: '18%' }} data-kind="observed" />
        <div className={styles.scrubMarker} style={{ left: '24%' }} data-kind="flagged" />
        <div className={styles.scrubMarker} style={{ left: '41%' }} data-kind="observed" />
        <div className={styles.scrubMarker} style={{ left: '56%' }} data-kind="blocked" />
        <div className={styles.scrubMarker} style={{ left: '73%' }} data-kind="observed" />
        <div className={styles.scrubMarker} style={{ left: '88%' }} data-kind="learned" />
        <div className={styles.scrubPlayhead} style={{ left: '56%' }} />
      </div>
      <div className={styles.scrubLegend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} data-kind="observed" /> observed · 1,428
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} data-kind="flagged" /> flagged · 7
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} data-kind="blocked" /> blocked · 3
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} data-kind="learned" /> learned · 2
        </span>
      </div>
      <div className={styles.scrubFocus}>
        <span className={styles.scrubFocusHeader}>
          t = 04:38:11 · BLOCKED
        </span>
        <span className={styles.scrubFocusBody}>
          Attempted ddl drop on billing_events. Policy:
          &ldquo;no DROP TABLE in prod&rdquo; — held for review.
        </span>
      </div>
    </div>
  );
}

/** Minimal code sample showing the universal webhook. */
function CustomVisual() {
  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>curl</span>
        <span className={styles.codeComment}>/// works in any stack that can POST</span>
      </div>
      <pre className={styles.codeBody}>{`curl -X POST https://canary.dev/v1/events \\
  -H "Authorization: Bearer ck_live_...." \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "hermes-agent-042",
    "action": "shell.exec",
    "target": "terraform destroy",
    "context": {
      "env": "production",
      "approved_by": null
    }
  }'`}</pre>
      <div className={styles.codeFooter}>
        <span className={styles.codeFooterLabel}>RESPONSE</span>
        <code className={styles.codeFooterValue}>
          {'{ "decision": "BLOCK", "policy": "terraform_destroy_prod", "request_id": "req_7k3..." }'}
        </code>
      </div>
    </div>
  );
}

'use client';

import { FormEvent, useEffect, useRef, useState, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { tapPress, spring } from '@/lib/motion';
import { useCanaryWatch } from '@/components/canary-watch';
import styles from './EarlyAccessForm.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const TEAM_SIZES = [
  { value: '', label: 'Team size' },
  { value: 'solo', label: 'Just me' },
  { value: '2-5', label: '2-5 people' },
  { value: '6-20', label: '6-20 people' },
  { value: '21-100', label: '21-100 people' },
  { value: '100+', label: '100+ people' },
];

export interface EarlyAccessFormProps {
  /** Ref attached to the submit button — used as a mascot perch. */
  submitRef?: RefObject<HTMLButtonElement>;
}

/** Hover > this without submitting → SUGGESTED "nudge abandoning signup". */
const ABANDON_HOVER_MS = 6_000;

export function EarlyAccessForm({ submitRef }: EarlyAccessFormProps = {}) {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [agents, setAgents] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { logEvent, intent } = useCanaryWatch();

  const formRef = useRef<HTMLFormElement>(null);
  const hoverStartRef = useRef<number | null>(null);
  const abandonFiredRef = useRef(false);

  // Hover-no-submit detection — fires SUGGESTED once per session when the
  // reader lingers on the form but leaves without hitting submit.
  //
  // `status` is read via a ref inside the handler so mid-hover state
  // transitions (e.g. submitting → success) don't tear down and
  // re-bind the listeners, which would erase `hoverStartRef` mid-dwell.
  const statusRef = useRef<Status>(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onEnter = () => {
      hoverStartRef.current = Date.now();
    };
    const onLeave = () => {
      const start = hoverStartRef.current;
      hoverStartRef.current = null;
      if (!start || abandonFiredRef.current) return;
      const s = statusRef.current;
      if (s !== 'idle' && s !== 'error') return;
      const dwell = Date.now() - start;
      if (dwell < ABANDON_HOVER_MS) return;
      abandonFiredRef.current = true;
      const secs = (dwell / 1000).toFixed(1);
      logEvent(
        'SUGGESTED',
        `Nudge · abandoning signup · hovered ${secs}s without submit`
      );
    };
    form.addEventListener('mouseenter', onEnter);
    form.addEventListener('mouseleave', onLeave);
    return () => {
      form.removeEventListener('mouseenter', onEnter);
      form.removeEventListener('mouseleave', onLeave);
    };
  }, [logEvent]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamSize, agents, intent }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(data.error ?? 'Request failed');
      }
      setStatus('success');
      logEvent(
        'OBSERVED',
        intent
          ? `Waitlist submitted · interest=${intent}`
          : 'Waitlist submitted'
      );
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className={styles.successCard}
        role="status"
      >
        <div className={styles.successDot} aria-hidden="true" />
        <div>
          <h3 className={styles.successTitle}>You&apos;re on the list.</h3>
          <p className={styles.successBody}>
            We&apos;ll reach out when your slot opens. Meanwhile, the mine
            is full of agents. Stay careful out there.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={styles.form} id="early-access">
      {intent && (
        <div
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--icon-grey)',
            padding: '6px 10px',
            border: '1px solid var(--grey-stroke)',
            background: 'var(--card-bg)',
            marginBottom: 'calc(var(--space-2) * -1)',
            alignSelf: 'flex-start',
          }}
        >
          Interest captured · <strong style={{ color: 'var(--accent-color)' }}>{intent}</strong>
        </div>
      )}
      <div className={styles.fieldGroup}>
        <label htmlFor="email" className={styles.label}>
          Your email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label htmlFor="teamSize" className={styles.label}>
            Team size
          </label>
          <select
            id="teamSize"
            required
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className={styles.input}
          >
            {TEAM_SIZES.map((t) => (
              <option key={t.value} value={t.value} disabled={!t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="agents" className={styles.label}>
            Which agents are you running?
          </label>
          <input
            id="agents"
            type="text"
            placeholder="Claude Code, Browser Use, custom..."
            value={agents}
            onChange={(e) => setAgents(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      {status === 'error' && (
        <p role="alert" className={styles.errorText}>
          {errorMsg || 'Something went wrong. Try again.'}
        </p>
      )}

      <motion.button
        ref={submitRef}
        type="submit"
        whileTap={tapPress}
        disabled={status === 'submitting'}
        className={styles.submit}
      >
        {status === 'submitting' ? 'Sending…' : 'Get early access →'}
      </motion.button>

      <p className={styles.footnote}>
        Free tier at launch. Invite-only until then.
      </p>
    </form>
  );
}

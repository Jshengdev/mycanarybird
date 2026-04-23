'use client';

import React from 'react';
import type { Event } from '@/data/mockData';

export interface OutcomeExpandPanelProps {
  event: Event;
}

const DIFF_ROWS: { field: string; expected: string; actual: string; match: boolean }[] = [
  { field: 'recipient', expected: 'recipient', actual: 'recipient', match: true },
  { field: 'recipient_value', expected: '+ internal@company.com', actual: '− external@example.com', match: false },
  { field: 'subject', expected: 'subject', actual: 'subject', match: true },
  { field: 'verification', expected: '+ [verified]', actual: '− [unverified]', match: false },
];

export function OutcomeExpandPanel({ event }: OutcomeExpandPanelProps) {
  void event;

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      {/* AI Evaluated badge */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          textTransform: 'uppercase',
          border: '1px solid var(--accent-color)',
          color: 'var(--accent-color)',
          borderRadius: '0px',
          padding: '2px 6px',
          display: 'inline-block',
          marginBottom: 'var(--space-4)',
        }}
      >
        AI Evaluated
      </span>

      {/* What went wrong */}
      <div className="flex flex-col" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
          What Went Wrong
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)' }}>
          Agent attempted to send email to an external contact after accessing credential files.{' '}
          <strong style={{ color: 'var(--critical)' }}>Email send blocked due to potential credential exposure</strong>
        </span>
      </div>

      {/* Technical diff divider */}
      <div style={{ position: 'relative', borderTop: '1px solid var(--grey-stroke)', marginBottom: 'var(--space-4)' }}>
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--icon-grey)',
            background: 'var(--bg)',
            padding: '0 var(--space-3)',
            whiteSpace: 'nowrap',
          }}
        >
          Technical Diff
        </span>
      </div>

      {/* Diff grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: '0px' }}>
        {/* Headers */}
        <div
          style={{
            background: 'rgba(72,199,43,0.08)',
            borderBottom: '1px solid var(--safe)',
            padding: 'var(--space-2) var(--space-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--safe)' }}>
            Expected state
          </span>
        </div>
        <div
          style={{
            background: 'rgba(255,46,46,0.08)',
            borderBottom: '1px solid var(--critical)',
            padding: 'var(--space-2) var(--space-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--critical)' }}>
            Actual state
          </span>
        </div>

        {/* Diff rows */}
        {DIFF_ROWS.map((row, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderBottom: '1px solid var(--grey-stroke)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: row.match ? 'var(--icon-grey)' : 'var(--safe)',
              }}
            >
              {row.expected}
            </div>
            <div
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderBottom: '1px solid var(--grey-stroke)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: row.match ? 'var(--icon-grey)' : 'var(--critical)',
              }}
            >
              {row.actual}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Verdict */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--critical)',
          display: 'block',
          marginTop: 'var(--space-3)',
        }}
      >
        2 fields mismatched · recipient, verification_status
      </span>
    </div>
  );
}

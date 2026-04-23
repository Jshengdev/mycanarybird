'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';

const RESULTS = [
  { sessionId: 'ses_20260403_b7c2', status: 'PASS' as const },
  { sessionId: 'ses_20260402_f8e1', status: 'PASS' as const },
  { sessionId: 'ses_20260401_d9b3', status: 'NOT EVALUATED' as const },
];

export function Step5TestResults() {
  const passCount = RESULTS.filter((r) => r.status === 'PASS').length;
  const notEvalCount = RESULTS.filter((r) => r.status === 'NOT EVALUATED').length;

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
      {RESULTS.map((r) => (
        <div
          key={r.sessionId}
          className="flex items-center"
          style={{
            gap: 'var(--space-3)',
            padding: '8px 0',
            borderBottom: '1px solid var(--grey-stroke)',
          }}
        >
          {r.status === 'PASS' ? (
            <Check size={14} style={{ color: 'var(--safe)', flexShrink: 0 }} />
          ) : (
            <Minus size={14} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)', flex: 1 }}>
            {r.sessionId}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              color: r.status === 'PASS' ? 'var(--safe)' : 'var(--icon-grey)',
              border: `1px solid ${r.status === 'PASS' ? 'var(--safe)' : 'var(--grey-stroke)'}`,
              borderRadius: '0px',
              padding: '2px 6px',
            }}
          >
            {r.status}
          </span>
        </div>
      ))}

      {/* Summary */}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', marginTop: 'var(--space-2)' }}>
        {passCount}/{passCount + notEvalCount} sessions passed · {notEvalCount} not evaluated
      </span>
    </div>
  );
}

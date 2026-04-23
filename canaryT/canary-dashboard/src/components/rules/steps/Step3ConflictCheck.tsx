'use client';

import React, { useState } from 'react';
import { TriangleAlert } from 'lucide-react';

const RESOLUTION_OPTIONS = [
  'Pause and ask me each time',
  'Apply the newer rule',
  'Apply the higher-severity rule',
];

export interface Step3ConflictCheckProps {
  conflictRuleId?: string;
}

export function Step3ConflictCheck({ conflictRuleId = 'boundary:file_access' }: Step3ConflictCheckProps) {
  const [selected, setSelected] = useState(2);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
      {/* Alert */}
      <div
        className="flex"
        style={{
          gap: 'var(--space-3)',
          background: 'rgba(255,46,46,0.08)',
          border: '1px solid var(--critical)',
          borderRadius: '0px',
          padding: 'var(--space-4)',
        }}
      >
        <TriangleAlert size={14} style={{ color: 'var(--critical)', flexShrink: 0, marginTop: '2px' }} />
        <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--critical)' }}>
            Conflict detected
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
            This rule conflicts with: {conflictRuleId}
          </span>
        </div>
      </div>

      {/* Radio group */}
      <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
        {RESOLUTION_OPTIONS.map((opt, i) => (
          <div
            key={opt}
            onClick={() => setSelected(i)}
            className="flex items-center"
            style={{ gap: 'var(--space-3)', cursor: 'pointer' }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '999px',
                border: selected === i ? '1px solid var(--text-black)' : '1px solid var(--grey-stroke)',
                flexShrink: 0,
              }}
            >
              {selected === i && (
                <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--text-black)' }} />
              )}
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)' }}>
              {opt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

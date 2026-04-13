'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import type { Event } from '@/data/mockData';

export interface BoundaryExpandPanelProps {
  event: Event;
}

export function BoundaryExpandPanel({ event }: BoundaryExpandPanelProps) {
  return (
    <div style={{ padding: 'var(--space-5)' }}>
      {/* Section label */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          textTransform: 'uppercase',
          color: 'var(--icon-grey)',
          display: 'block',
          marginBottom: 'var(--space-3)',
        }}
      >
        Path Comparison
      </span>

      {/* Two-column comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {/* Allowed path */}
        <div
          className="flex flex-col"
          style={{
            background: 'rgba(72,199,43,0.08)',
            border: '1px solid var(--safe)',
            borderRadius: '0px',
            padding: 'var(--space-2) var(--space-4)',
            gap: '2px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--safe)', textTransform: 'uppercase' }}>
            Allowed
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
            /working/
          </span>
        </div>

        {/* Actual path */}
        <div
          className="flex flex-col"
          style={{
            background: 'rgba(255,46,46,0.08)',
            border: '1px solid var(--critical)',
            borderRadius: '0px',
            padding: 'var(--space-2) var(--space-4)',
            gap: '2px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--critical)', textTransform: 'uppercase' }}>
            Actual
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
            {event.target}
          </span>
        </div>
      </div>

      {/* Verdict line */}
      <div className="flex items-center" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        <XCircle size={12} style={{ color: 'var(--critical)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--critical)' }}>
          Violation — accessed path outside allowed boundary
        </span>
      </div>

      {/* Rule ID chip */}
      {event.matchedRuleId && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            background: 'var(--hover-gray)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: '2px 6px',
            display: 'inline-block',
            marginTop: 'var(--space-3)',
          }}
        >
          {event.matchedRuleId}
        </span>
      )}
    </div>
  );
}

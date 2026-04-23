'use client';

import React from 'react';
import { ScoringIndicator } from '@/components/ui/ScoringIndicator';
import type { Session } from '@/data/mockData';

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

export type SessionView = 'spreadsheet';

export interface SessionTopBarProps {
  session: Session;
}

export function SessionTopBar({ session }: SessionTopBarProps) {
  const scoreColor = getScoreColor(session.score);

  return (
    <div
      className="flex items-center"
      style={{
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--grey-stroke)',
        padding: '0 var(--space-6)',
        height: '56px',
      }}
    >
      <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>
          {session.id}
        </span>
        <span className="inline-flex items-baseline" style={{ gap: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 400, color: scoreColor }}>
            {session.score}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--icon-grey)' }}>
            /100
          </span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--icon-grey)' }}>
          Canary score
        </span>
        {/* Vertical separator */}
        <div style={{ width: '1px', height: '16px', background: 'var(--grey-stroke)', margin: '0 var(--space-4)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
          {session.duration} · {session.eventCount} events · {formatDate(session.date)}
        </span>
        <div style={{ width: '1px', height: '16px', background: 'var(--grey-stroke)', margin: '0 var(--space-4)' }} />
        <ScoringIndicator model="Standard" scope="workspace" variant="inline" />
      </div>
    </div>
  );
}

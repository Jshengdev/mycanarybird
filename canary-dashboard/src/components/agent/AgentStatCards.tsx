'use client';

import React from 'react';
import type { Session } from '@/data/mockData';

export interface AgentStatCardsProps {
  sessions: Session[];
}

export function AgentStatCards({ sessions }: AgentStatCardsProps) {
  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((s, x) => s + x.score, 0) / totalSessions)
    : 0;
  const totalViolations = sessions.reduce((s, x) => s + x.violationCount, 0);
  const totalBlocked = sessions.reduce((s, x) => s + x.blockedCount, 0);

  const stats = [
    { label: 'SESSIONS', value: totalSessions, color: 'var(--text-black)' },
    { label: 'AVG SCORE', value: avgScore, color: avgScore >= 80 ? 'var(--safe)' : avgScore >= 60 ? 'var(--warning)' : 'var(--critical)' },
    { label: 'VIOLATIONS', value: totalViolations, color: totalViolations > 0 ? 'var(--warning)' : 'var(--text-black)' },
    { label: 'BLOCKED', value: totalBlocked, color: totalBlocked > 0 ? 'var(--critical)' : 'var(--text-black)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(160deg, #FDFDFD 0%, #F7F7FA 100%)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '4px',
            overflow: 'hidden',
            padding: 'var(--space-5)',
            gap: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'var(--icon-grey)',
            }}
          >
            {stat.label}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '28px',
              fontWeight: 400,
              color: stat.color,
              lineHeight: '1',
            }}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

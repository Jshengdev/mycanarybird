'use client';

import React from 'react';
import type { Session, Rule } from '@/data/mockData';

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

export interface RulesetStatCardsProps {
  sessions: Session[];
  rules: Rule[];
}

export function RulesetStatCards({ sessions, rules }: RulesetStatCardsProps) {
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((s, x) => s + x.score, 0) / sessions.length)
    : 0;
  const avgPassRate = rules.length > 0
    ? Math.round(rules.reduce((s, r) => s + r.stats.passRate, 0) / rules.length)
    : 0;
  const totalViolations = sessions.reduce((s, x) => s + x.violationCount, 0);
  const totalFlagged = sessions.reduce((s, x) => s + x.flaggedCount, 0);

  const stats = [
    { label: 'AVG SCORE', value: sessions.length > 0 ? String(avgScore) : '—', color: sessions.length > 0 ? getScoreColor(avgScore) : 'var(--icon-grey)' },
    { label: 'PASS RATE', value: rules.length > 0 ? `${avgPassRate}%` : '—', color: rules.length > 0 ? getScoreColor(avgPassRate) : 'var(--icon-grey)' },
    { label: 'SESSIONS', value: String(sessions.length), color: 'var(--text-black)' },
    { label: 'VIOLATIONS', value: totalViolations > 0 ? String(totalViolations) : '—', color: totalViolations > 0 ? 'var(--critical)' : 'var(--icon-grey)' },
    { label: 'FLAGS', value: totalFlagged > 0 ? String(totalFlagged) : '—', color: totalFlagged > 0 ? 'var(--warning)' : 'var(--icon-grey)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(160deg, #FDFDFD 0%, #F7F7FA 100%)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '4px',
            overflow: 'hidden',
            padding: 'var(--space-8)',
            gap: 'var(--space-2)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
            {stat.label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 600, color: stat.color, lineHeight: '1' }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

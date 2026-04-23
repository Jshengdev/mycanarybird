'use client';

import React from 'react';
import type { Session, Rule } from '@/data/mockData';
import { StatCard } from '@/components/ui/StatCard';

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)' }}>
      <StatCard label="Avg Score" value={sessions.length > 0 ? avgScore : '—'} color={sessions.length > 0 ? getScoreColor(avgScore) : 'var(--icon-grey)'} detail="across sessions" />
      <StatCard label="Pass Rate" value={rules.length > 0 ? `${avgPassRate}%` : '—'} color={rules.length > 0 ? getScoreColor(avgPassRate) : 'var(--icon-grey)'} detail="rule evaluations" />
      <StatCard label="Sessions" value={sessions.length} detail="evaluated" />
      <StatCard label="Violations" value={totalViolations > 0 ? totalViolations : '—'} color={totalViolations > 0 ? 'var(--critical)' : 'var(--icon-grey)'} detail="blocked events" />
      <StatCard label="Flags" value={totalFlagged > 0 ? totalFlagged : '—'} color={totalFlagged > 0 ? 'var(--warning)' : 'var(--icon-grey)'} detail="flagged events" />
    </div>
  );
}

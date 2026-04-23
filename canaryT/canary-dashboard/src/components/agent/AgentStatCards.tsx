'use client';

import React from 'react';
import type { Session } from '@/data/mockData';
import { StatCard } from '@/components/ui/StatCard';

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      <StatCard label="Sessions" value={totalSessions} detail={`${totalSessions} total`} />
      <StatCard label="Avg Score" value={avgScore} color={avgScore >= 80 ? 'var(--safe)' : avgScore >= 60 ? 'var(--warning)' : 'var(--critical)'} detail="Canary score" />
      <StatCard label="Violations" value={totalViolations} color={totalViolations > 0 ? 'var(--warning)' : 'var(--icon-grey)'} detail="flagged events" />
      <StatCard label="Blocked" value={totalBlocked} color={totalBlocked > 0 ? 'var(--critical)' : 'var(--icon-grey)'} detail="blocked events" />
    </div>
  );
}

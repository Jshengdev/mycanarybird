'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { VerdictBadge } from '@/components/ui/VerdictBadge';
import type { VerdictVariant } from '@/components/ui/VerdictBadge';
import type { Session } from '@/data/mockData';

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

function getVerdict(score: number): VerdictVariant {
  if (score >= 80) return 'ready';
  if (score >= 60) return 'warning';
  return 'notready';
}

export interface LastSessionCardProps {
  session: Session;
}

export function LastSessionCard({ session }: LastSessionCardProps) {
  const router = useRouter();
  const params = useParams();
  const [arrowHovered, setArrowHovered] = useState(false);

  const scoreColor = getScoreColor(session.score);

  const pills: { label: string; count: number; color: string }[] = [
    { label: 'OBSERVED', count: session.observedCount, color: 'var(--icon-grey)' },
    { label: 'FLAGGED', count: session.flaggedCount, color: 'var(--warning)' },
    { label: 'BLOCKED', count: session.blockedCount, color: 'var(--critical)' },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '4px',
        overflow: 'hidden',
        padding: 'var(--space-8)',
        gap: 'var(--space-3)',
        height: '100%',
        minHeight: '280px',
      }}
    >
      {/* Score */}
      <div className="flex items-baseline justify-center" style={{ gap: 'var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 400, lineHeight: 1, color: scoreColor }}>
          {session.score}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 400, color: 'var(--icon-grey)' }}>
          /100
        </span>
      </div>

      {/* Verdict */}
      <div>
        <VerdictBadge variant={getVerdict(session.score)} />
      </div>

      {/* Score context */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--icon-grey)', textAlign: 'center' }}>
        Canary score · −5 per flag · −15 per block
      </span>

      {/* Mini stat pills */}
      <div className="flex flex-wrap justify-center" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        {pills.filter((p) => p.count > 0).map((p) => (
          <span
            key={p.label}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: p.color,
              border: `1px solid ${p.color}`,
              borderRadius: '0px',
              padding: '2px 6px',
              whiteSpace: 'nowrap',
            }}
          >
            {p.label} {p.count}
          </span>
        ))}
      </div>

      {/* View full report action */}
      <span
        onClick={() => router.push(`/${params.workspace || 'demo'}/${params.agent || session.agentId}/sessions/${session.id}`)}
        onMouseEnter={() => setArrowHovered(true)}
        onMouseLeave={() => setArrowHovered(false)}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          textTransform: 'uppercase',
          color: 'var(--accent-color)',
          cursor: 'pointer',
          textDecoration: arrowHovered ? 'underline' : 'none',
          transition: 'var(--transition-base)',
          marginTop: 'var(--space-3)',
        }}
      >
        View full report{' '}
        <span
          style={{
            display: 'inline-block',
            transform: arrowHovered ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform var(--transition-base)',
          }}
        >
          →
        </span>
      </span>
    </div>
  );
}

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

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
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
      className="flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #FDFDFD 0%, #F7F7FA 100%)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '4px',
        overflow: 'hidden',
        padding: 'var(--space-8)',
        gap: 'var(--space-4)',
      }}
    >
      {/* Session ID */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>
        {session.id}
      </span>

      {/* Score */}
      <div className="flex items-baseline" style={{ gap: 'var(--space-2)' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '32px',
            fontWeight: 600,
            color: scoreColor,
          }}
        >
          {session.score}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--icon-grey)' }}>
          /100
        </span>
      </div>

      {/* Verdict */}
      <div>
        <VerdictBadge variant={getVerdict(session.score)} />
      </div>

      {/* Metadata */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
        {formatDate(session.date)} · {session.duration}
      </span>

      {/* Mini stat pills */}
      <div className="flex flex-wrap" style={{ gap: 'var(--space-2)' }}>
        {pills.map((p) => (
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

      {/* Top violation */}
      {session.blockedCount > 0 && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--critical)' }}>
          boundary:file_access — Opened .env file
        </span>
      )}

      {/* View full report action */}
      <span
        onClick={() => router.push(`/${params.workspace || 'photon'}/${params.agent || session.agentId}/sessions/${session.id}`)}
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

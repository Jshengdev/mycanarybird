'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { WORKSPACE_VIOLATIONS } from '@/data/mockData';

export interface RecentViolationsListProps {
  limit?: number;
  agentId?: string;
}

export function RecentViolationsList({ limit = 8, agentId }: RecentViolationsListProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const violations = agentId
    ? WORKSPACE_VIOLATIONS.filter((v) => v.agentId === agentId).slice(0, limit)
    : WORKSPACE_VIOLATIONS.slice(0, limit);

  const showAgentName = !agentId;

  if (violations.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          gap: 'var(--space-3)',
          padding: 'var(--space-8)',
          background: 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
        }}
      >
        <CheckCircle size={16} style={{ color: 'var(--safe)' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
          No violations recorded
        </span>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: '0px' }}>
      {violations.map((v, i) => (
        <div
          key={v.id}
          onClick={() => router.push(v.sessionId ? `/demo/${v.agentId}/sessions/${v.sessionId}` : `/demo/${v.agentId}/sessions`)}
          onMouseEnter={() => setHoveredId(v.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="flex items-center"
          style={{
            gap: 'var(--space-4)',
            padding: 'var(--space-4)',
            borderBottom: i < violations.length - 1 ? '1px solid var(--grey-stroke)' : 'none',
            cursor: 'pointer',
            background: hoveredId === v.id ? 'var(--hover-gray)' : 'transparent',
            transition: 'background var(--transition-fast)',
          }}
        >
          {/* Status chip */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              color: v.status === 'BLOCKED' ? 'var(--critical)' : 'var(--warning)',
              border: `1px solid ${v.status === 'BLOCKED' ? 'var(--critical)' : 'var(--warning)'}`,
              borderRadius: '0px',
              padding: '1px 4px',
              flexShrink: 0,
            }}
          >
            {v.status}
          </span>

          {/* Agent name (workspace mode) */}
          {showAgentName && (
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                color: 'var(--icon-grey)',
                minWidth: '120px',
                flexShrink: 0,
              }}
            >
              {v.agentName}
            </span>
          )}

          {/* Action text */}
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--text-black)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {v.action}
          </span>

          {/* Rule ID chip */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              background: 'var(--hover-gray)',
              border: '1px solid var(--grey-stroke)',
              borderRadius: '0px',
              padding: '2px 6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {v.ruleId}
          </span>

          {/* Timestamp */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--icon-grey)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {v.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
}

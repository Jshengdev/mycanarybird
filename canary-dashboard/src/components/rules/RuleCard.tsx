'use client';

import React from 'react';
import { useCardHover } from '@/hooks/useCardHover';
import type { Rule } from '@/data/mockData';

function typeColor(type: string): string {
  switch (type) {
    case 'boundary': return 'var(--critical)';
    case 'outcome': return 'var(--warning)';
    case 'sequence': return 'var(--accent-color)';
    case 'time': return 'var(--icon-grey)';
    default: return 'var(--icon-grey)';
  }
}

export interface RuleCardProps {
  rule: Rule;
  onClick?: () => void;
}

export function RuleCard({ rule, onClick }: RuleCardProps) {
  const isDisabled = rule.status === 'disabled';
  const { bgStyle, transition, handleMouseMove, handleMouseLeave } = useCardHover(!isDisabled);

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: bgStyle,
        border: '1px solid var(--grey-stroke)',
        borderRadius: '4px',
        overflow: 'hidden',
        padding: 'var(--space-4)',
        cursor: 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition,
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: typeColor(rule.type), border: `1px solid ${typeColor(rule.type)}`, borderRadius: '0px', padding: '2px 6px' }}>{rule.type}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)' }}>{rule.name}</span>
          {rule.isHotRule && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--critical)' }}>HOT</span>}
          {rule.isOrphaned && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--warning)' }}>ORPHANED</span>}
          {isDisabled && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>DISABLED</span>}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: rule.stats.passRate >= 80 ? 'var(--safe)' : rule.stats.passRate >= 60 ? 'var(--warning)' : 'var(--critical)' }}>
          {rule.stats.totalEvaluations > 0 ? `${rule.stats.passRate}%` : '—'}
        </span>
      </div>

      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', marginTop: 'var(--space-2)' }}>{rule.plainEnglish}</div>

      <div className="flex items-center" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }} title={rule.evaluationMethod === 'ai' ? 'Detection method: AI-evaluated' : 'Detection method: Deterministic'}>{rule.evaluationMethod === 'ai' ? 'AI' : 'DET'}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>{rule.stats.totalEvaluations} evals</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>Last: {rule.stats.lastFired}</span>
        <div className="flex items-center" style={{ gap: '2px' }}>
          {rule.stats.sparkline.map((s, i) => (
            <div key={i} style={{ width: '4px', height: '10px', background: s === 'pass' ? 'var(--safe)' : s === 'fail' ? 'var(--critical)' : 'var(--grey-stroke)', borderRadius: '0px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

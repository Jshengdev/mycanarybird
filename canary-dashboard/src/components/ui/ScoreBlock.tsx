'use client';

import React from 'react';

export interface ScoreBlockProps {
  score: number;
  total?: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

export function ScoreBlock({ score, total = 100 }: ScoreBlockProps) {
  return (
    <span
      className="inline-flex items-baseline"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '12px',
        fontWeight: 600,
      }}
    >
      <span style={{ color: getScoreColor(score) }}>{score}</span>
      <span style={{ color: 'var(--icon-grey)', fontWeight: 400 }}>/{total}</span>
    </span>
  );
}

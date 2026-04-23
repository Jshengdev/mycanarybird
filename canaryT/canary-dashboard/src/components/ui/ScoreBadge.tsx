'use client';

import React from 'react';

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

export interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  suffix?: string;
}

export function ScoreBadge({ score, size = 'md', suffix = '%' }: ScoreBadgeProps) {
  const color = scoreColor(score);
  const fontSize = size === 'sm' ? '11px' : size === 'md' ? '14px' : '20px';
  const cellSize = size === 'sm' ? 4 : size === 'md' ? 5 : 7;
  const cols = size === 'sm' ? 8 : size === 'md' ? 10 : 14;
  const rows = size === 'sm' ? 4 : size === 'md' ? 5 : 6;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '2px' }}>
      {/* Checkerboard dither background */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {Array.from({ length: cols }).map((_, c) => (
              <span
                key={c}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  fontSize: `${cellSize}px`,
                  fontFamily: 'var(--font-mono)',
                  color,
                  opacity: (r + c) % 2 === 0 ? 0.35 : 0.2,
                  lineHeight: `${cellSize}px`,
                  textAlign: 'center',
                  display: 'inline-block',
                  overflow: 'hidden',
                }}
              >
                ░
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Score text on top */}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize,
          fontWeight: 400,
          color: 'var(--text-black)',
          lineHeight: 1,
          padding: `${cellSize}px ${cellSize * 1.5}px`,
        }}
      >
        {score}{suffix}
      </span>
    </div>
  );
}

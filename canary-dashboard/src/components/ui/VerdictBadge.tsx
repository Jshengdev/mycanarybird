'use client';

import React from 'react';

export type VerdictVariant = 'ready' | 'warning' | 'notready';

export interface VerdictBadgeProps {
  variant: VerdictVariant;
}

const verdictConfig: Record<VerdictVariant, { label: string; color: string; opacity: number }> = {
  ready: { label: 'READY', color: 'var(--safe)', opacity: 0.3 },
  warning: { label: 'WARNING', color: 'var(--warning)', opacity: 0.5 },
  notready: { label: 'NOT READY', color: 'var(--critical)', opacity: 0.8 },
};

export function VerdictBadge({ variant }: VerdictBadgeProps) {
  const config = verdictConfig[variant];

  return (
    <span
      className="inline-flex items-center"
      style={{
        padding: '4px',
        gap: '4px',
        border: `1px solid ${config.color}`,
        borderRadius: '0px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '12px',
        fontWeight: 400,
        textTransform: 'uppercase',
        color: config.color,
      }}
    >
      {/* Left block — sized div, not text character */}
      <span
        style={{
          width: '6px',
          height: '12px',
          background: config.color,
          opacity: config.opacity,
          flexShrink: 0,
        }}
      />
      <span>{config.label}</span>
      {/* Right block */}
      <span
        style={{
          width: '6px',
          height: '12px',
          background: config.color,
          opacity: config.opacity,
          flexShrink: 0,
        }}
      />
    </span>
  );
}

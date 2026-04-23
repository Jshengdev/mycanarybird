'use client';

import React from 'react';

export type StatusVariant = 'safe' | 'warning' | 'critical';

export interface StatusIndicatorProps {
  variant: StatusVariant;
}

const colorMap: Record<StatusVariant, string> = {
  safe: 'var(--safe)',
  warning: 'var(--warning)',
  critical: 'var(--critical)',
};

export function StatusIndicator({ variant }: StatusIndicatorProps) {
  const color = colorMap[variant];

  return (
    <div
      className="flex flex-col"
      style={{
        width: '4px',
        height: '14px',
        overflow: 'hidden',
        borderRadius: '0px',
      }}
    >
      <div style={{ flex: 1, background: color, opacity: 0.2 }} />
      <div style={{ flex: 1, background: color, opacity: 0.4 }} />
      <div style={{ flex: 1, background: color, opacity: 0.7 }} />
      <div style={{ flex: 1, background: color, opacity: 1 }} />
    </div>
  );
}

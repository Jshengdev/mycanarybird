'use client';

import React from 'react';

export interface LoopDetectionBannerProps {
  detected: boolean;
}

export function LoopDetectionBanner({ detected }: LoopDetectionBannerProps) {
  if (!detected) return null;

  return (
    <div
      className="flex items-center"
      style={{
        background: 'rgba(255,46,46,0.08)',
        borderBottom: '1px solid var(--critical)',
        padding: 'var(--space-3) var(--space-6)',
        gap: 'var(--space-3)',
        borderRadius: '0px',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '0px',
          border: '1px solid var(--critical)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--critical)',
          flexShrink: 0,
        }}
      >
        ↻
      </div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)' }}>
        Loop detected — agent repeated file browser access 3× between{' '}
        <span style={{ fontFamily: 'var(--font-mono)' }}>10:14:35</span>–<span style={{ fontFamily: 'var(--font-mono)' }}>10:15:22</span>
      </span>
    </div>
  );
}

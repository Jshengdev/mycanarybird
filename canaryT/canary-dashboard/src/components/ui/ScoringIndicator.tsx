'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface ScoringIndicatorProps {
  model: string;
  scope: 'workspace' | 'agent' | 'ruleset';
  variant: 'chip' | 'inline';
}

export function ScoringIndicator({ model, variant }: ScoringIndicatorProps) {
  if (variant === 'inline') {
    return (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
        Scored with {model}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 'var(--space-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        textTransform: 'uppercase',
        padding: '3px 8px',
        border: '1px solid var(--grey-stroke)',
        background: 'var(--card-bg)',
        cursor: 'pointer',
      }}
    >
      Scoring: {model}
      <ChevronDown size={10} style={{ color: 'var(--icon-grey)' }} />
    </span>
  );
}

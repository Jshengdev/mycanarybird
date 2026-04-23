'use client';

import React from 'react';
import { Shield, SquareCheck, ListOrdered, Clock3 } from 'lucide-react';

export type BadgeVariant = 'boundary' | 'outcome' | 'sequence' | 'time';

export interface BadgeProps {
  variant: BadgeVariant;
}

const badgeConfig: Record<BadgeVariant, { icon: React.ElementType; label: string }> = {
  boundary: { icon: Shield, label: 'BOUNDARY' },
  outcome: { icon: SquareCheck, label: 'OUTCOME' },
  sequence: { icon: ListOrdered, label: 'SEQUENCE' },
  time: { icon: Clock3, label: 'TIME' },
};

export function Badge({ variant }: BadgeProps) {
  const config = badgeConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 'var(--space-1)',
        padding: '6px 8px',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: '12px',
        fontWeight: 400,
        textTransform: 'uppercase',
        color: 'var(--text-black)',
      }}
    >
      <Icon size={12} style={{ color: 'var(--icon-grey)' }} />
      {config.label}
    </span>
  );
}

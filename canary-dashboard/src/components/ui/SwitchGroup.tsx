'use client';

import React from 'react';
import { Switch } from '@/components/ui/Switch';

export interface SwitchGroupProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  layout?: 'inline' | 'block';
}

export function SwitchGroup({ checked = false, disabled = false, onChange, label, layout = 'block' }: SwitchGroupProps) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 'var(--space-3)',
        width: layout === 'block' ? '100%' : 'auto',
      }}
    >
      <Switch checked={checked} disabled={disabled} onChange={onChange} />
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 500,
          color: checked ? 'var(--text-black)' : 'var(--icon-grey)',
          flex: layout === 'block' ? 1 : undefined,
        }}
      >
        {label}
      </span>
    </div>
  );
}

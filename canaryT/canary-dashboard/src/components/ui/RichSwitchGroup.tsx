'use client';

import React from 'react';
import { Switch } from '@/components/ui/Switch';

export interface RichSwitchGroupProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  description?: string;
  flipped?: boolean;
}

export function RichSwitchGroup({
  checked = false,
  disabled = false,
  onChange,
  label,
  description,
  flipped = false,
}: RichSwitchGroupProps) {
  const switchEl = <Switch checked={checked} disabled={disabled} onChange={onChange} />;

  return (
    <div
      className="flex items-center"
      style={{
        gap: 'var(--space-4)',
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-4)',
        width: '240px',
        flexDirection: flipped ? 'row-reverse' : 'row',
      }}
    >
      {switchEl}
      <div className="flex flex-col" style={{ gap: '2px', flex: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: 'var(--text-black)',
          }}
        >
          {label}
        </span>
        {description && (
          <span
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 400,
              color: 'var(--icon-grey)',
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

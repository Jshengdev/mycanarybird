'use client';

import React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked = false, indeterminate = false, disabled = false, onChange, label }: CheckboxProps) {
  const isChecked = checked || indeterminate;

  const boxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '0px',
    border: isChecked && !disabled
      ? '1px solid var(--text-black)'
      : '1px solid var(--grey-stroke)',
    background: disabled
      ? 'var(--hover-gray)'
      : isChecked
        ? 'var(--text-black)'
        : 'var(--card-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    flexShrink: 0,
  };

  const contentColor = disabled ? 'var(--icon-grey)' : 'var(--text-white)';

  return (
    <label className="flex items-center" style={{ gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <div
        style={boxStyle}
        onClick={() => {
          if (!disabled) onChange?.(!checked);
        }}
      >
        {isChecked && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              lineHeight: '1',
              color: contentColor,
              userSelect: 'none',
            }}
          >
            {indeterminate ? '—' : '▓'}
          </span>
        )}
      </div>
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: disabled ? 'var(--icon-grey)' : 'var(--text-black)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}

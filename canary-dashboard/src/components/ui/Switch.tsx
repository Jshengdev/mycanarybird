'use client';

import React from 'react';

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ checked = false, disabled = false, onChange }: SwitchProps) {
  const trackStyle: React.CSSProperties = {
    width: '33px',
    height: '18px',
    borderRadius: '12px',
    background: checked ? 'var(--text-black)' : 'var(--hover-gray)',
    border: '1px solid var(--grey-stroke)',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--transition-fast)',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
  };

  const thumbStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '999px',
    background: checked ? 'var(--text-white)' : 'var(--icon-grey)',
    position: 'absolute',
    top: '2px',
    left: checked ? '17px' : '2px',
    transition: 'left var(--transition-fast), background var(--transition-fast)',
  };

  return (
    <div
      style={trackStyle}
      onClick={() => {
        if (!disabled) onChange?.(!checked);
      }}
      role="switch"
      aria-checked={checked}
    >
      <div style={thumbStyle} />
    </div>
  );
}

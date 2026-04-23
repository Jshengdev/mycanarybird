'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AsciiHover } from '@/components/ui/AsciiHover';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}

function MenuItem({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <AsciiHover
      variant="right"
      color="var(--icon-grey)"
      style={{
        background: hovered ? 'var(--hover-gray)' : 'transparent',
        transition: 'background var(--transition-fast)',
        padding: '4px 6px 4px 4px',
        '--ascii-pad-y': '4px',
        '--ascii-pad-x': '4px',
      } as React.CSSProperties}
    >
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 500,
          color: 'var(--text-black)',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {selected && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-black)' }}>█</span>
        )}
        {label}
      </div>
    </AsciiHover>
  );
}

export function Select({ options, value, onChange, placeholder = 'Select...', label }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  const groups = options.reduce<Record<string, SelectOption[]>>((acc, o) => {
    const g = o.group || '__default';
    if (!acc[g]) acc[g] = [];
    acc[g].push(o);
    return acc;
  }, {});
  const groupKeys = Object.keys(groups);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-1)', position: 'relative' }} ref={ref}>
      {label && (
        <label style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: '16px', fontWeight: 500, color: 'var(--text-black)' }}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '28px',
          padding: '6px',
          background: open ? 'var(--pressed-gray)' : 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 500,
          color: 'var(--text-black)',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background var(--transition-fast)',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'var(--pressed-gray)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: 'var(--space-1)',
            maxHeight: `${5 * 28}px`,
            overflowY: 'auto',
            minWidth: '100%',
            maxWidth: '280px',
          }}
        >
          {groupKeys.map((gk, gi) => (
            <React.Fragment key={gk}>
              {gi > 0 && (
                <div style={{ height: '1px', background: 'var(--grey-stroke)', margin: '2px 0' }} />
              )}
              {groups[gk].map((opt) => (
                <MenuItem key={opt.value} selected={opt.value === value} label={opt.label} onClick={() => { onChange?.(opt.value); setOpen(false); }} />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

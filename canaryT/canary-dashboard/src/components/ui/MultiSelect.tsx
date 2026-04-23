'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AsciiHover } from '@/components/ui/AsciiHover';

export interface MultiSelectOption {
  value: string;
  label: string;
  statusColor?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  label?: string;
}

function MultiSelectItem({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
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

export function MultiSelect({ options, value, onChange, placeholder = 'Select...', label }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange?.(next);
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

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
          flexWrap: 'wrap',
          gap: 'var(--space-1)',
          minHeight: '28px',
          padding: '4px 6px',
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
        {selectedOptions.length === 0 && <span style={{ color: 'var(--icon-grey)' }}>{placeholder}</span>}
        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center"
            style={{
              gap: 'var(--space-1)',
              background: 'var(--hover-gray)',
              border: '1px solid var(--grey-stroke)',
              padding: '2px 6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'var(--text-black)',
            }}
          >
            {opt.statusColor && (
              <span style={{ width: '8px', height: '8px', background: opt.statusColor, flexShrink: 0 }} />
            )}
            {opt.label}
          </span>
        ))}
        <ChevronDown size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0, marginLeft: 'auto' }} />
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
          {options.map((opt) => (
            <MultiSelectItem key={opt.value} selected={value.includes(opt.value)} label={opt.label} onClick={() => toggle(opt.value)} />
          ))}
        </div>
      )}
    </div>
  );
}

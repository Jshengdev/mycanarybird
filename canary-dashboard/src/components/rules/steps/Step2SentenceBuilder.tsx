'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Camera, X, ChevronDown, Info, TriangleAlert } from 'lucide-react';
import { Input } from '@/components/ui/Input';

/* ── Inline chip dropdown ─────────────────────────────────────── */

function ChipDropdown({
  value,
  options,
  onChange,
  colorFn,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  colorFn?: (v: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const color = colorFn ? colorFn(value) : 'var(--text-black)';
  const selected = options.find((o) => o.value === value);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
      <span
        onClick={() => setOpen(!open)}
        className="inline-flex items-center"
        style={{
          gap: '4px',
          background: 'var(--pressed-gray)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          padding: '2px 8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {selected?.label || value}
        <ChevronDown size={10} style={{ color: 'var(--icon-grey)' }} />
      </span>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 200,
            background: 'var(--pressed-gray)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: 'var(--space-1)',
            minWidth: '100%',
            marginTop: '2px',
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                padding: '4px 8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: colorFn ? colorFn(opt.value) : 'var(--text-black)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

/* ── Inline chip input ────────────────────────────────────────── */

function ChipInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        background: 'var(--pressed-gray)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: '2px 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        color: 'var(--text-black)',
        outline: 'none',
        width: Math.max(120, value.length * 8 + 40),
        margin: 0,
      }}
    />
  );
}

/* ── Options ──────────────────────────────────────────────────── */

const ACTION_OPTIONS = [
  { value: 'accesses', label: 'accesses' },
  { value: 'modifies', label: 'modifies' },
  { value: 'deletes', label: 'deletes' },
  { value: 'sends', label: 'sends' },
  { value: 'opens', label: 'opens' },
  { value: 'types into', label: 'types into' },
];

const OBJECT_OPTIONS = [
  { value: 'file or folder', label: 'file or folder' },
  { value: 'application', label: 'application' },
  { value: 'contact or recipient', label: 'contact or recipient' },
  { value: 'UI element', label: 'UI element' },
  { value: 'external network request', label: 'external network request' },
  { value: 'data category', label: 'data category' },
];

const SEVERITY_OPTIONS = [
  { value: 'Critical', label: 'Critical' },
  { value: 'Warning', label: 'Warning' },
  { value: 'Info', label: 'Info' },
];

const DATA_CATEGORY_OPTIONS = [
  { value: 'password pattern', label: 'password pattern' },
  { value: 'SSN', label: 'SSN' },
  { value: 'credit card', label: 'credit card' },
];

function severityColor(v: string): string {
  if (v === 'Critical') return 'var(--critical)';
  if (v === 'Warning') return 'var(--warning)';
  return 'var(--icon-grey)';
}

function getPlaceholder(objectType: string): string {
  if (objectType === 'file or folder') return '/path/to/resource';
  if (objectType === 'application') return 'Gmail, Chrome...';
  return 'threshold value';
}

/* ── Main ─────────────────────────────────────────────────────── */

export interface Step2SentenceBuilderProps {
  prePopulated?: boolean;
  initialObject?: string;
  onDismissPrePopulated?: () => void;
}

export function Step2SentenceBuilder({ prePopulated, initialObject, onDismissPrePopulated }: Step2SentenceBuilderProps) {
  const [showTag, setShowTag] = useState(!!prePopulated);
  const [action, setAction] = useState('accesses');
  const [objectType, setObjectType] = useState('file or folder');
  const [threshold, setThreshold] = useState(initialObject || '');
  const [severity, setSeverity] = useState('Critical');

  const ruleName = useMemo(() => {
    const obj = objectType.split(' ')[0];
    return `block-${action}-${obj}`;
  }, [action, objectType]);

  const preview = useMemo(() => {
    const sev = severity.toLowerCase();
    const thresh = threshold || '[threshold]';
    return `Canary will flag a ${sev} violation if your agent ${action} any ${objectType} outside ${thresh}.`;
  }, [action, objectType, threshold, severity]);

  const hasConflict = action === 'accesses' && objectType === 'file or folder';

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
      {/* Pre-populated tag */}
      {showTag && (
        <div
          className="inline-flex items-center"
          style={{
            gap: 'var(--space-2)',
            background: 'var(--card-bg)',
            border: '1px solid var(--accent-color)',
            borderRadius: '0px',
            padding: '3px 8px',
            alignSelf: 'flex-start',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Camera size={12} style={{ color: 'var(--accent-color)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-color)' }}>
            Populated from screenshot
          </span>
          <X
            size={10}
            style={{ color: 'var(--accent-color)', cursor: 'pointer' }}
            onClick={() => { setShowTag(false); onDismissPrePopulated?.(); }}
          />
        </div>
      )}

      {/* Sentence */}
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: '2.5', color: 'var(--text-black)' }}>
        If agent{' '}
        <ChipDropdown value={action} options={ACTION_OPTIONS} onChange={setAction} />{' '}
        <ChipDropdown value={objectType} options={OBJECT_OPTIONS} onChange={setObjectType} />{' '}
        {objectType === 'data category' ? (
          <ChipDropdown value={threshold || 'password pattern'} options={DATA_CATEGORY_OPTIONS} onChange={setThreshold} />
        ) : (
          <ChipInput value={threshold} onChange={setThreshold} placeholder={getPlaceholder(objectType)} />
        )}{' '}
        → Flag as{' '}
        <ChipDropdown value={severity} options={SEVERITY_OPTIONS} onChange={setSeverity} colorFn={severityColor} />
      </div>

      {/* Conflict warning */}
      {hasConflict && (
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <TriangleAlert size={12} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--warning)' }}>
            Potential conflict with: boundary:file_access
          </span>
        </div>
      )}

      {/* Plain English preview */}
      <div
        className="flex items-start"
        style={{
          gap: 'var(--space-3)',
          background: 'var(--pressed-gray)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          padding: 'var(--space-4)',
        }}
      >
        <Info size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
          {preview}
        </span>
      </div>

      {/* Rule name */}
      <div style={{ maxWidth: '320px' }}>
        <Input
          label="Rule name (auto-generated — edit if needed)"
          value={ruleName}
          onChange={() => {}}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
        />
      </div>
    </div>
  );
}

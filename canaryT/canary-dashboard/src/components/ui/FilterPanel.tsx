'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import type { VerdictVariant } from '@/components/ui/VerdictBadge';

/* ── Types ────────────────────────────────────────────────────── */

export interface FilterState {
  verdicts: VerdictVariant[];
  scoreMin: number;
  scoreMax: number;
  dateFrom: string;
  dateTo: string;
  durationMin: string;
  durationMax: string;
  violationsMin: string;
  violationsMax: string;
}

export const EMPTY_FILTERS: FilterState = {
  verdicts: [],
  scoreMin: 0,
  scoreMax: 100,
  dateFrom: '',
  dateTo: '',
  durationMin: '',
  durationMax: '',
  violationsMin: '',
  violationsMax: '',
};

export function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.verdicts.length > 0) n++;
  if (f.scoreMin > 0 || f.scoreMax < 100) n++;
  if (f.dateFrom || f.dateTo) n++;
  if (f.durationMin || f.durationMax) n++;
  if (f.violationsMin || f.violationsMax) n++;
  return n;
}

/* ── Sub-components ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 400,
        textTransform: 'uppercase',
        color: 'var(--icon-grey)',
      }}
    >
      {children}
    </span>
  );
}

function MiniInput({
  value,
  onChange,
  placeholder,
  width,
  icon,
  'aria-label': ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  width?: string;
  icon?: React.ReactNode;
  'aria-label'?: string;
}) {
  return (
    <div className="relative" style={{ width: width || '100%' }}>
      <input
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '32px',
          background: 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          padding: icon ? '6px 28px 6px 6px' : '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-black)',
          outline: 'none',
          outlineOffset: '-2px',
        }}
        onFocus={(e) => { e.currentTarget.style.outline = '2px solid var(--grey-stroke)'; }}
        onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
      />
      {icon && (
        <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          {icon}
        </span>
      )}
    </div>
  );
}

/* ── Range slider ─────────────────────────────────────────────── */

function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  const handleDrag = useCallback(
    (which: 'min' | 'max') => (e: React.MouseEvent) => {
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;

      const move = (ev: MouseEvent) => {
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        const val = Math.round(min + pct * (max - min));
        if (which === 'min') {
          onChangeMin(Math.min(val, valueMax));
        } else {
          onChangeMax(Math.max(val, valueMin));
        }
      };

      const up = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    },
    [min, max, valueMin, valueMax, onChangeMin, onChangeMax]
  );

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
      {/* Display value */}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
        {valueMin} — {valueMax}
      </span>

      {/* Track */}
      <div ref={trackRef} style={{ position: 'relative', height: '12px', cursor: 'pointer' }}>
        {/* Background track */}
        <div style={{ position: 'absolute', top: '5px', left: 0, right: 0, height: '2px', background: 'var(--grey-stroke)' }} />
        {/* Active track */}
        <div style={{ position: 'absolute', top: '5px', left: `${pctMin}%`, width: `${pctMax - pctMin}%`, height: '2px', background: 'var(--text-black)' }} />
        {/* Min handle */}
        <div
          onMouseDown={handleDrag('min')}
          style={{
            position: 'absolute',
            top: '0px',
            left: `${pctMin}%`,
            width: '12px',
            height: '12px',
            background: 'var(--text-black)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            transform: 'translateX(-50%)',
            cursor: 'grab',
            zIndex: 2,
          }}
        />
        {/* Max handle */}
        <div
          onMouseDown={handleDrag('max')}
          style={{
            position: 'absolute',
            top: '0px',
            left: `${pctMax}%`,
            width: '12px',
            height: '12px',
            background: 'var(--text-black)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            transform: 'translateX(-50%)',
            cursor: 'grab',
            zIndex: 2,
          }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>{min}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>{max}</span>
      </div>
    </div>
  );
}

/* ── Main FilterPanel ─────────────────────────────────────────── */

export interface FilterPanelProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onCancel: () => void;
}

export function FilterPanel({ filters, onApply, onCancel }: FilterPanelProps) {
  const [draft, setDraft] = useState<FilterState>({ ...filters });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onCancel]);

  const toggleVerdict = (v: VerdictVariant) => {
    setDraft((d) => ({
      ...d,
      verdicts: d.verdicts.includes(v) ? d.verdicts.filter((x) => x !== v) : [...d.verdicts, v],
    }));
  };

  const hasActiveFilters = countActiveFilters(draft) > 0;

  const verdictOptions: { value: VerdictVariant; label: string; color: string }[] = [
    { value: 'ready', label: 'Ready', color: 'var(--safe)' },
    { value: 'warning', label: 'Warning', color: 'var(--warning)' },
    { value: 'notready', label: 'Not Ready', color: 'var(--critical)' },
  ];

  return (
    <div
      ref={panelRef}
      className="flex flex-col"
      style={{
        width: '320px',
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-5)',
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 200,
        marginTop: '2px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)' }}>
          Filters
        </span>
        {hasActiveFilters && (
          <span
            onClick={() => setDraft({ ...EMPTY_FILTERS })}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 400,
              color: 'var(--accent-color)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Clear all
          </span>
        )}
      </div>
      <div style={{ height: '1px', background: 'var(--grey-stroke)', marginBottom: 'var(--space-4)' }} />

      {/* Section: Verdict */}
      <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <SectionLabel>Verdict</SectionLabel>
        {verdictOptions.map((opt) => (
          <div key={opt.value} className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <Checkbox
              checked={draft.verdicts.includes(opt.value)}
              onChange={() => toggleVerdict(opt.value)}
            />
            <span
              style={{
                width: '8px',
                height: '8px',
                background: opt.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, color: 'var(--text-black)' }}>
              {opt.label}
            </span>
          </div>
        ))}
      </div>

      {/* Section: Score Range */}
      <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <SectionLabel>Score Range</SectionLabel>
        <RangeSlider
          min={0}
          max={100}
          valueMin={draft.scoreMin}
          valueMax={draft.scoreMax}
          onChangeMin={(v) => setDraft((d) => ({ ...d, scoreMin: v }))}
          onChangeMax={(v) => setDraft((d) => ({ ...d, scoreMax: v }))}
        />
      </div>

      {/* Section: Date Range */}
      <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <SectionLabel>Date Range</SectionLabel>
        <div className="flex" style={{ gap: 'var(--space-1)' }}>
          <MiniInput
            aria-label="Date from"
            value={draft.dateFrom}
            onChange={(v) => setDraft((d) => ({ ...d, dateFrom: v }))}
            placeholder="MM/DD/YYYY"
            icon={<Calendar size={12} style={{ color: 'var(--icon-grey)' }} />}
          />
          <MiniInput
            aria-label="Date to"
            value={draft.dateTo}
            onChange={(v) => setDraft((d) => ({ ...d, dateTo: v }))}
            placeholder="MM/DD/YYYY"
            icon={<Calendar size={12} style={{ color: 'var(--icon-grey)' }} />}
          />
        </div>
      </div>

      {/* Section: Duration */}
      <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <SectionLabel>Duration</SectionLabel>
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <MiniInput
            aria-label="Duration minimum"
            value={draft.durationMin}
            onChange={(v) => setDraft((d) => ({ ...d, durationMin: v }))}
            placeholder="0"
            width="80px"
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>min</span>
          <MiniInput
            aria-label="Duration maximum"
            value={draft.durationMax}
            onChange={(v) => setDraft((d) => ({ ...d, durationMax: v }))}
            placeholder="∞"
            width="80px"
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>min</span>
        </div>
      </div>

      {/* Section: Violations */}
      <div className="flex flex-col" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <SectionLabel>Violations</SectionLabel>
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <MiniInput
            aria-label="Violations minimum"
            value={draft.violationsMin}
            onChange={(v) => setDraft((d) => ({ ...d, violationsMin: v }))}
            placeholder="0"
            width="80px"
          />
          <MiniInput
            aria-label="Violations maximum"
            value={draft.violationsMax}
            onChange={(v) => setDraft((d) => ({ ...d, violationsMax: v }))}
            placeholder="∞"
            width="80px"
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ height: '1px', background: 'var(--grey-stroke)', marginBottom: 'var(--space-4)' }} />
      <div className="flex items-center justify-end" style={{ gap: 'var(--space-3)' }}>
        <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={() => onApply(draft)} style={{ whiteSpace: 'nowrap' }}>Apply Filters</Button>
      </div>
    </div>
  );
}

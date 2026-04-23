'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Info, TriangleAlert, Image, Type, Plus, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { TRACES_A1B2 } from '@/data/mockData';

/* ── Inline chip dropdown ─────────────────────────────────────── */

function ChipDropdown({
  value, options, onChange, colorFn,
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
          padding: '4px 8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
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
                padding: '6px 8px',
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

/* ── Options ──────────────────────────────────────────────────── */

const ACTION_OPTIONS = [
  { value: 'navigates to', label: 'navigates to' },
  { value: 'accesses', label: 'accesses' },
  { value: 'accesses outside of', label: 'accesses outside of' },
  { value: 'leaves', label: 'leaves' },
  { value: 'modifies', label: 'modifies' },
  { value: 'clicks', label: 'clicks' },
  { value: 'clicks outside of', label: 'clicks outside of' },
  { value: 'types into', label: 'types into' },
  { value: 'sends', label: 'sends' },
  { value: 'downloads', label: 'downloads' },
];

const CONSEQUENCE_OPTIONS = [
  { value: 'block', label: 'Block' },
  { value: 'flag', label: 'Flag' },
  { value: 'observe', label: 'Observe' },
];

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

function severityColor(v: string): string {
  if (v === 'critical') return 'var(--critical)';
  if (v === 'warning') return 'var(--warning)';
  return 'var(--icon-grey)';
}

function consequenceColor(v: string): string {
  if (v === 'block') return 'var(--critical)';
  if (v === 'flag') return 'var(--warning)';
  return 'var(--icon-grey)';
}

/* ── Inferred targets from trace data ─────────────────────────── */

const INFERRED_TARGETS = (() => {
  const targets = new Map<string, { target: string; app: string; count: number; status: string }>();
  TRACES_A1B2.forEach((t) => {
    const key = t.target;
    const existing = targets.get(key);
    if (existing) {
      existing.count++;
      if (t.status === 'BLOCKED' || t.status === 'FLAGGED') existing.status = t.status;
    } else {
      targets.set(key, { target: t.target, app: t.app, count: 1, status: t.status });
    }
  });
  return Array.from(targets.values()).sort((a, b) => {
    if (a.status === 'BLOCKED' && b.status !== 'BLOCKED') return -1;
    if (a.status === 'FLAGGED' && b.status === 'OBSERVED') return -1;
    return b.count - a.count;
  });
})();

/* ── Screenshot thumbnails ────────────────────────────────────── */

const SCREENSHOT_TRACES = TRACES_A1B2.filter((t) => t.hasScreenshot);

/* ── Screenshot Bounding Box ──────────────────────────────────── */

function ScreenshotBoundingBox({ onSelectArea }: { onSelectArea: (area: { x: number; y: number; w: number; h: number }) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [endPos, setEndPos] = useState<{ x: number; y: number } | null>(null);
  const [boxes, setBoxes] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setStartPos({ x, y });
    setEndPos({ x, y });
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setEndPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!drawing || !startPos || !endPos) return;
    setDrawing(false);
    const x = Math.min(startPos.x, endPos.x);
    const y = Math.min(startPos.y, endPos.y);
    const w = Math.abs(endPos.x - startPos.x);
    const h = Math.abs(endPos.y - startPos.y);
    if (w > 2 && h > 2) {
      const box = { x, y, w, h };
      setBoxes((prev) => [...prev, box]);
      onSelectArea(box);
    }
    setStartPos(null);
    setEndPos(null);
  };

  const drawRect = startPos && endPos ? {
    left: `${Math.min(startPos.x, endPos.x)}%`,
    top: `${Math.min(startPos.y, endPos.y)}%`,
    width: `${Math.abs(endPos.x - startPos.x)}%`,
    height: `${Math.abs(endPos.y - startPos.y)}%`,
  } : null;

  /* ── Fullscreen overlay for bounding box ── */
  if (expanded !== null) {
    const trace = SCREENSHOT_TRACES[expanded];
    return (
      <>
        {/* Fullscreen overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,10,0.75)',
            zIndex: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between" style={{ width: '100%', maxWidth: '900px', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-white)', letterSpacing: '0.06em' }}>
              Drag to create a bounding box of the area you want to target
            </span>
            <span
              onClick={() => setExpanded(null)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'var(--text-white)',
                cursor: 'pointer',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              ✕
            </span>
          </div>

          {/* Screenshot info */}
          <div className="flex items-center" style={{ width: '100%', maxWidth: '900px', marginBottom: 'var(--space-2)', gap: 'var(--space-3)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{trace?.app}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{trace?.target}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{trace?.time}</span>
            {boxes.length > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--safe)', marginLeft: 'auto' }}>
                {boxes.length} area{boxes.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>

          {/* Image with bounding box drawing */}
          <div
            ref={imgRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { if (drawing) handleMouseUp(); }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.15)',
              overflow: 'hidden',
              cursor: 'crosshair',
              userSelect: 'none',
            }}
          >
            <img
              src="/demo-screenshot.png"
              alt="Session screenshot"
              style={{ width: '100%', display: 'block' }}
              draggable={false}
            />
            {boxes.map((box, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.w}%`,
                  height: `${box.h}%`,
                  border: '2px solid var(--accent-color)',
                  background: 'rgba(11,13,196,0.15)',
                  pointerEvents: 'none',
                }}
              />
            ))}
            {drawRect && (
              <div
                style={{
                  position: 'absolute',
                  ...drawRect,
                  border: '2px dashed var(--accent-color)',
                  background: 'rgba(11,13,196,0.1)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  /* ── Thumbnail grid ── */
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
        Click a screenshot to select target area
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxHeight: '220px', overflowY: 'auto' }}>
        {SCREENSHOT_TRACES.map((t, i) => {
          const statusColor = t.status === 'BLOCKED' ? 'var(--critical)' : t.status === 'FLAGGED' ? 'var(--warning)' : 'var(--icon-grey)';
          return (
            <div
              key={t.id}
              onClick={() => setExpanded(i)}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--grey-stroke)',
                borderRadius: '4px',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'border-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--grey-stroke)'; }}
            >
              {/* Thumbnail image */}
              <div style={{ height: '48px', overflow: 'hidden', position: 'relative' }}>
                <img src="/demo-screenshot.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} draggable={false} />
                {/* Status indicator */}
                <span style={{ position: 'absolute', top: '3px', right: '3px', fontFamily: 'var(--font-mono)', fontSize: '7px', color: statusColor }}>█</span>
              </div>
              {/* Info */}
              <div style={{ padding: '4px 6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-black)', display: 'block', fontWeight: 500 }}>{t.app}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--icon-grey)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.target}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--icon-grey)' }}>{t.time} · #{t.sequence}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */

export interface Step2SentenceBuilderProps {
  prePopulated?: boolean;
  initialObject?: string;
  onDismissPrePopulated?: () => void;
}

export function Step2SentenceBuilder({ initialObject }: Step2SentenceBuilderProps) {
  const [targetMode, setTargetMode] = useState<'text' | 'image'>('text');
  const [selectedTargets, setSelectedTargets] = useState<string[]>(initialObject ? [initialObject] : []);
  const [customTarget, setCustomTarget] = useState('');
  const [showSemantic, setShowSemantic] = useState(false);
  const [semanticRule, setSemanticRule] = useState('');

  // Rule fill-ins
  const [action, setAction] = useState('navigates to');
  const [consequence, setConsequence] = useState('block');
  const [severity, setSeverity] = useState('critical');

  const toggleTarget = (t: string) => {
    setSelectedTargets((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const addCustomTarget = () => {
    if (customTarget.trim() && !selectedTargets.includes(customTarget.trim())) {
      setSelectedTargets((prev) => [...prev, customTarget.trim()]);
      setCustomTarget('');
    }
  };

  const targetDisplay = selectedTargets.length > 0 ? selectedTargets.join(', ') : '[target]';

  const preview = useMemo(() => {
    const c = consequence === 'block' ? 'Block' : consequence === 'flag' ? 'Flag' : 'Observe';
    return `${c} if agent ${action} ${targetDisplay}`;
  }, [action, consequence, targetDisplay]);

  const ruleName = useMemo(() => {
    const t = selectedTargets[0]?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'target';
    return `${consequence}-${action.split(' ')[0]}-${t}`;
  }, [consequence, action, selectedTargets]);

  return (
    <div className="flex" style={{ gap: 'var(--space-6)', minHeight: '320px' }}>
      {/* LEFT — Target selection */}
      <div className="flex flex-col" style={{ width: '50%', gap: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', letterSpacing: '0.06em' }}>
          Target
        </span>

        {/* Text / Image toggle */}
        <div className="flex" style={{ border: '1px solid var(--grey-stroke)', overflow: 'hidden' }}>
          <button
            onClick={() => setTargetMode('text')}
            className="flex items-center justify-center"
            style={{
              flex: 1, padding: '6px', gap: '4px',
              background: targetMode === 'text' ? 'var(--text-black)' : 'var(--card-bg)',
              color: targetMode === 'text' ? 'var(--text-white)' : 'var(--icon-grey)',
              border: 'none', borderRight: '1px solid var(--grey-stroke)',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
              cursor: 'pointer', margin: 0, borderRadius: '0px',
            }}
          >
            <Type size={10} /> Text
          </button>
          <button
            onClick={() => setTargetMode('image')}
            className="flex items-center justify-center"
            style={{
              flex: 1, padding: '6px', gap: '4px',
              background: targetMode === 'image' ? 'var(--text-black)' : 'var(--card-bg)',
              color: targetMode === 'image' ? 'var(--text-white)' : 'var(--icon-grey)',
              border: 'none',
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500,
              cursor: 'pointer', margin: 0, borderRadius: '0px',
            }}
          >
            <Image size={10} /> Screenshot
          </button>
        </div>

        {targetMode === 'text' ? (
          <>
            {/* Inferred targets */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
              Inferred from sessions
            </span>
            <div className="flex flex-col" style={{ gap: '2px', maxHeight: '160px', overflowY: 'auto' }}>
              {INFERRED_TARGETS.map((t) => {
                const isSelected = selectedTargets.includes(t.target);
                const statusColor = t.status === 'BLOCKED' ? 'var(--critical)' : t.status === 'FLAGGED' ? 'var(--warning)' : 'var(--icon-grey)';
                return (
                  <div
                    key={t.target}
                    onClick={() => toggleTarget(t.target)}
                    className="flex items-center"
                    style={{
                      gap: 'var(--space-2)',
                      padding: '4px 6px',
                      background: isSelected ? 'rgba(11,13,196,0.06)' : 'transparent',
                      border: isSelected ? '1px solid var(--accent-color)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--hover-gray)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: '14px', height: '14px', border: isSelected ? '1px solid var(--text-black)' : '1px solid var(--grey-stroke)', background: isSelected ? 'var(--text-black)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isSelected && <Check size={9} style={{ color: 'var(--text-white)' }} />}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-black)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.target}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: statusColor, flexShrink: 0 }}>█</span>
                  </div>
                );
              })}
            </div>

            {/* Custom target input */}
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <input
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addCustomTarget(); }}
                placeholder="Add custom path..."
                style={{
                  flex: 1, height: '28px', border: '1px solid var(--grey-stroke)',
                  background: 'var(--card-bg)', fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'var(--text-black)', padding: '0 8px', borderRadius: '0px', outline: 'none', margin: 0,
                }}
              />
              <button
                onClick={addCustomTarget}
                style={{ width: '28px', height: '28px', border: '1px solid var(--grey-stroke)', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0, borderRadius: '0px' }}
              >
                <Plus size={12} style={{ color: 'var(--icon-grey)' }} />
              </button>
            </div>
          </>
        ) : (
          /* Screenshot bounding box mode */
          <ScreenshotBoundingBox
            onSelectArea={(area) => {
              const label = `area:${Math.round(area.x)}x${Math.round(area.y)}-${Math.round(area.w)}x${Math.round(area.h)}`;
              if (!selectedTargets.includes(label)) setSelectedTargets((prev) => [...prev, label]);
            }}
          />
        )}

        {/* Selected targets display */}
        {selectedTargets.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '4px' }}>
            {selectedTargets.map((t) => (
              <span
                key={t}
                className="inline-flex items-center"
                style={{ gap: '4px', background: 'var(--hover-gray)', border: '1px solid var(--grey-stroke)', padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-black)' }}
              >
                {t}
                <X size={8} style={{ color: 'var(--icon-grey)', cursor: 'pointer' }} onClick={() => toggleTarget(t)} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — Rule fill-ins */}
      <div className="flex flex-col" style={{ width: '50%', gap: 'var(--space-4)', borderLeft: '1px solid var(--grey-stroke)', paddingLeft: 'var(--space-6)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', letterSpacing: '0.06em' }}>
          Rule
        </span>

        {/* Consequence */}
        <div className="flex flex-col" style={{ gap: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Action</span>
          <ChipDropdown value={consequence} options={CONSEQUENCE_OPTIONS} onChange={setConsequence} colorFn={consequenceColor} />
        </div>

        {/* When agent... */}
        <div className="flex flex-col" style={{ gap: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>When agent</span>
          <ChipDropdown value={action} options={ACTION_OPTIONS} onChange={setAction} />
        </div>

        {/* Severity */}
        <div className="flex flex-col" style={{ gap: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Severity</span>
          <ChipDropdown value={severity} options={SEVERITY_OPTIONS} onChange={setSeverity} colorFn={severityColor} />
        </div>

        {/* Semantic text toggle */}
        <div>
          <span
            onClick={() => setShowSemantic(!showSemantic)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showSemantic ? 'Hide' : 'Write rule as text instead'}
          </span>
          {showSemantic && (
            <textarea
              value={semanticRule}
              onChange={(e) => setSemanticRule(e.target.value)}
              placeholder="Describe your rule in plain English..."
              style={{
                width: '100%', minHeight: '60px', marginTop: 'var(--space-2)',
                border: '1px solid var(--grey-stroke)', background: 'var(--card-bg)',
                fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)',
                padding: '8px', borderRadius: '0px', outline: 'none', resize: 'vertical',
              }}
            />
          )}
        </div>

        {/* Preview */}
        <div
          className="flex items-start"
          style={{
            gap: 'var(--space-3)',
            background: 'var(--pressed-gray)',
            border: '1px solid var(--grey-stroke)',
            padding: 'var(--space-3)',
          }}
        >
          <Info size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-black)' }}>
            {semanticRule || preview}
          </span>
        </div>

        {/* Rule name */}
        <div>
          <Input
            label="Rule name"
            value={ruleName}
            onChange={() => {}}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}
          />
        </div>

        {/* Conflict warning */}
        {consequence === 'block' && selectedTargets.some((t) => t.includes('settings')) && (
          <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            <TriangleAlert size={12} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--warning)' }}>
              Similar rule exists: block-settings-access
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

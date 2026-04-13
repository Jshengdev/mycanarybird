'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ListFilter, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BoundaryExpandPanel } from '@/components/session/expand/BoundaryExpandPanel';
import { OutcomeExpandPanel } from '@/components/session/expand/OutcomeExpandPanel';
import { SequenceExpandPanel } from '@/components/session/expand/SequenceExpandPanel';
import { TimeExpandPanel } from '@/components/session/expand/TimeExpandPanel';
import { ScreenshotZone } from '@/components/session/timeline/ScreenshotZone';
import { ScrubberBar } from '@/components/session/timeline/ScrubberBar';
import { LoopDetectionBanner } from '@/components/session/timeline/LoopDetectionBanner';
import { SessionTimeline } from '@/components/session/SessionTimeline';
import { VerdictBadge } from '@/components/ui/VerdictBadge';
import type { VerdictVariant } from '@/components/ui/VerdictBadge';
import type { Event, Session } from '@/data/mockData';

/* ── Helpers ──────────────────────────────────────────────────── */

type FilterMode = 'all' | 'violations' | 'safe';

function statusColor(s: string): string {
  if (s === 'BLOCKED') return 'var(--critical)';
  if (s === 'FLAGGED') return 'var(--warning)';
  return 'var(--icon-grey)';
}

function rowBg(status: string, isActive: boolean): string {
  if (isActive) return 'var(--hover-gray)';
  return 'var(--card-bg)';
}

function getVerdict(score: number): VerdictVariant {
  if (score >= 80) return 'ready';
  if (score >= 60) return 'warning';
  return 'notready';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

/* ── Filter pill ──────────────────────────────────────────────── */

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        textTransform: 'uppercase',
        padding: '4px 10px',
        border: active ? '1px solid var(--text-black)' : '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        background: active ? 'var(--text-black)' : 'transparent',
        color: active ? 'var(--text-white)' : 'var(--icon-grey)',
        cursor: 'pointer',
        outline: 'none',
        margin: 0,
        WebkitAppearance: 'none' as const,
      }}
    >
      {label}
    </button>
  );
}

/* ── Expand panel (generic fallback) ──────────────────────────── */

function ExpandPanel({ event }: { event: Event }) {
  const pairs: [string, string][] = [
    ['Event ID', event.id],
    ['Session', event.sessionId],
    ['Sequence', String(event.sequence)],
    ['Timestamp', event.timestamp],
    ['Action Type', event.actionType],
    ['Action', event.action],
    ['Target', event.target],
    ['App', event.app],
    ['Status', event.classificationStatus],
    ['Source', event.classificationSource],
    ['Confidence', `${event.classificationConfidence}%`],
    ['Matched Rule', event.matchedRuleId || '—'],
  ];
  if (event.violationDetails) pairs.push(['Violation', event.violationDetails]);

  return (
    <div style={{ background: 'var(--bg)', padding: 'var(--space-5)', borderTop: '1px solid var(--grey-stroke)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        {pairs.map(([k, v]) => (
          <div key={k} className="flex flex-col" style={{ gap: '2px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)', textTransform: 'uppercase' }}>{k}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)', wordBreak: 'break-all' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Highlighted overlay row ──────────────────────────────────── */

function HighlightedRow({ event, onDismiss, onScrollTo }: { event: Event; onDismiss: () => void; onScrollTo: () => void }) {
  return (
    <div
      onClick={() => { onScrollTo(); onDismiss(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px var(--space-4)',
        background: 'rgba(0,136,199,0.08)',
        borderBottom: '2px solid var(--accent-color)',
        cursor: 'pointer',
        gap: 'var(--space-3)',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-color)', textTransform: 'uppercase' }}>
        Jump to #{event.sequence}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {event.action}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          color: statusColor(event.classificationStatus),
          border: `1px solid ${statusColor(event.classificationStatus)}`,
          borderRadius: '0px',
          padding: '2px 6px',
        }}
      >
        {event.classificationStatus}
      </span>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export interface SessionSpreadsheetProps {
  events: Event[];
  session?: Session;
  activeIndex: number;
  onActiveChange: (i: number) => void;
  highlightTraceId?: string;
}

export function SessionSpreadsheet({ events, session, activeIndex, onActiveChange, highlightTraceId }: SessionSpreadsheetProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [topHeight, setTopHeight] = useState(280);
  const [leftWidth, setLeftWidth] = useState(200);
  const filterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [deepLinkIdx, setDeepLinkIdx] = useState<number | null>(null);

  // Deep-link: auto-scroll to highlighted trace from ?trace= param
  useEffect(() => {
    if (!highlightTraceId || events.length === 0) return;
    const idx = events.findIndex((e) => e.id === highlightTraceId);
    if (idx === -1) return;
    onActiveChange(idx);
    setDeepLinkIdx(idx);
    // Wait for render then scroll
    requestAnimationFrame(() => {
      const el = rowRefs.current.get(idx);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    // Remove highlight after 3s
    const timer = setTimeout(() => setDeepLinkIdx(null), 3000);
    return () => clearTimeout(timer);
  }, [highlightTraceId, events, onActiveChange]);

  const filteredEvents = useMemo(() => {
    let result = events;
    if (filterMode === 'violations') {
      result = result.filter((e) => e.classificationStatus === 'FLAGGED' || e.classificationStatus === 'BLOCKED');
    } else if (filterMode === 'safe') {
      result = result.filter((e) => e.classificationStatus === 'OBSERVED');
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) =>
        e.action.toLowerCase().includes(q) ||
        (e.matchedRuleId && e.matchedRuleId.toLowerCase().includes(q))
      );
    }
    return result;
  }, [events, filterMode, searchQuery]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    if (filterOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [filterOpen]);

  // When activeIndex changes from timeline interaction, show highlight + scroll
  const prevActiveRef = useRef(activeIndex);
  useEffect(() => {
    if (activeIndex !== prevActiveRef.current) {
      setHighlightIndex(activeIndex);
      prevActiveRef.current = activeIndex;
      // Auto-scroll to the row
      setTimeout(() => {
        const el = rowRefs.current.get(activeIndex);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [activeIndex]);

  // Clear highlight on any user interaction with the table
  const clearHighlight = useCallback(() => {
    setHighlightIndex(null);
  }, []);

  const handleRowClick = (originalIndex: number) => {
    clearHighlight();
    onActiveChange(originalIndex);
    setExpandedIndex(expandedIndex === originalIndex ? null : originalIndex);
  };

  const scrollToRow = useCallback((idx: number) => {
    const el = rowRefs.current.get(idx);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const COL = { seq: '48px', time: '80px', status: '100px', rule: '140px' };

  // Drag handler for horizontal divider (top/bottom)
  const handleTopDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = topHeight;
    const move = (ev: MouseEvent) => {
      const delta = ev.clientY - startY;
      setTopHeight(Math.max(150, Math.min(500, startH + delta)));
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [topHeight]);

  // Drag handler for vertical divider (left/right in top section)
  const handleLeftDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = leftWidth;
    const move = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      setLeftWidth(Math.max(160, Math.min(400, startW + delta)));
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [leftWidth]);

  // Fullscreen timeline overlay
  if (fullscreen) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'var(--card-bg)', display: 'flex', flexDirection: 'column' }}>
        {/* Close bar */}
        <div className="flex items-center justify-end" style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--grey-stroke)' }}>
          <button
            onClick={() => setFullscreen(false)}
            style={{
              background: 'none',
              border: '1px solid var(--grey-stroke)',
              borderRadius: '0px',
              padding: 'var(--space-1) var(--space-3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-black)',
              margin: 0,
            }}
          >
            <Minimize2 size={12} />
            Exit fullscreen
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <SessionTimeline events={events} activeIndex={activeIndex} onActiveChange={onActiveChange} />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Top section: Score + Timeline embed */}
      {session && (
        <div className="flex" style={{ height: `${topHeight}px`, flexShrink: 0 }}>
          {/* Left: Score card + details */}
          <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--space-6)', width: `${leftWidth}px`, flexShrink: 0, overflow: 'hidden' }}>
            {/* Score */}
            <div className="flex items-baseline justify-center" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '64px', fontWeight: 400, color: 'var(--text-black)', lineHeight: '1' }}>
                {session.score}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 400, color: 'var(--icon-grey)' }}>
                /100
              </span>
            </div>

            {/* Verdict badge — 4px below score */}
            <div style={{ marginTop: '4px' }}>
              <VerdictBadge variant={getVerdict(session.score)} />
            </div>

            {/* Details — 24px below verdict */}
            <div className="flex flex-col" style={{ gap: '2px', marginTop: 'var(--space-8)' }}>
              {[
                { label: 'Events', value: String(session.eventCount), color: 'var(--text-black)' },
                { label: 'Date', value: formatDate(session.date), color: 'var(--text-black)' },
                { label: 'Duration', value: session.duration, color: 'var(--text-black)' },
                { label: 'Flagged', value: String(session.flaggedCount), color: 'var(--warning)' },
                { label: 'Blocked', value: String(session.blockedCount), color: 'var(--critical)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: item.color === 'var(--text-black)' ? 'var(--icon-grey)' : item.color, width: '60px' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical draggable divider */}
          <div
            onMouseDown={handleLeftDrag}
            style={{ width: '4px', cursor: 'col-resize', background: 'transparent', flexShrink: 0, position: 'relative' }}
          >
            <div style={{ position: 'absolute', inset: '0 1px', background: 'var(--grey-stroke)' }} />
          </div>

          {/* Right: Timeline embed */}
          <div className="flex flex-col" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <LoopDetectionBanner detected={true} />
            <div className="flex" style={{ flex: 1, minHeight: 0 }}>
              <ScreenshotZone events={events} activeIndex={activeIndex} onActiveChange={(i) => { onActiveChange(i); setHighlightIndex(i); }} />
            </div>
            <ScrubberBar events={events} activeIndex={activeIndex} onActiveChange={(i) => { onActiveChange(i); setHighlightIndex(i); }} />
            {/* Fullscreen button */}
            <button
              onClick={() => setFullscreen(true)}
              style={{
                position: 'absolute',
                top: 'var(--space-2)',
                right: 'var(--space-2)',
                background: 'var(--card-bg)',
                border: '1px solid var(--grey-stroke)',
                borderRadius: '0px',
                padding: 'var(--space-1)',
                cursor: 'pointer',
                display: 'flex',
                zIndex: 5,
                margin: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card-bg)'; }}
            >
              <Maximize2 size={12} style={{ color: 'var(--icon-grey)' }} />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal draggable divider */}
      {session && (
        <div
          onMouseDown={handleTopDrag}
          style={{ height: '4px', cursor: 'row-resize', background: 'transparent', flexShrink: 0, position: 'relative' }}
        >
          <div style={{ position: 'absolute', inset: '1px 0', background: 'var(--grey-stroke)' }} />
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)', padding: 'var(--space-4)', borderBottom: '1px solid var(--grey-stroke)', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <FilterPill label="All" active={filterMode === 'all'} onClick={() => { setFilterMode('all'); clearHighlight(); }} />
        <FilterPill label="Violations" active={filterMode === 'violations'} onClick={() => { setFilterMode('violations'); clearHighlight(); }} />
        <FilterPill label="Safe" active={filterMode === 'safe'} onClick={() => { setFilterMode('safe'); clearHighlight(); }} />
        <div ref={filterRef} className="relative">
          <Button variant="secondary" size="sm" noAscii icon={<ListFilter size={12} />} onClick={() => setFilterOpen(!filterOpen)} style={{ minWidth: '120px' }}>
            <span className="flex items-center" style={{ gap: 'var(--space-1)', flex: 1 }}>
              Filter
              {searchQuery && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-color)' }}>· 1</span>}
              <ChevronDown size={12} style={{ color: 'var(--icon-grey)', marginLeft: 'auto' }} />
            </span>
          </Button>
          {filterOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '2px', width: '280px', background: 'var(--card-bg)', border: '1px solid var(--grey-stroke)', borderRadius: '0px', padding: 'var(--space-4)', zIndex: 200 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-3)' }}>Filter by action or rule</span>
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') { setSearchQuery(''); setFilterOpen(false); } }} autoFocus />
              {searchQuery && (
                <span onClick={() => { setSearchQuery(''); setFilterOpen(false); }} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer', display: 'block', marginTop: 'var(--space-3)' }}>Clear filter</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Highlighted row overlay (from timeline click) */}
      {highlightIndex !== null && events[highlightIndex] && (
        <HighlightedRow
          event={events[highlightIndex]}
          onDismiss={clearHighlight}
          onScrollTo={() => scrollToRow(highlightIndex)}
        />
      )}

      {/* Column header */}
      <div className="flex items-center" style={{ padding: '8px var(--space-4)', borderBottom: '1px solid var(--grey-stroke)', flexShrink: 0 }}>
        <span style={{ width: COL.seq, fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>#</span>
        <span style={{ width: COL.time, fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Time</span>
        <span style={{ width: COL.status, fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Status</span>
        <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Action</span>
        <span style={{ width: COL.rule, fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>Rule</span>
      </div>

      {/* Event rows */}
      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto' }} onClick={clearHighlight}>
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center" style={{ padding: 'var(--space-8)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>No events match the current filter</span>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const origIdx = events.indexOf(evt);
            const isActive = origIdx === activeIndex;
            const isExpanded = expandedIndex === origIdx;
            const isHovered = hoveredIndex === origIdx;
            const isHighlighted = highlightIndex === origIdx;
            const isDeepLinked = deepLinkIdx === origIdx;
            const bg = isHighlighted ? 'rgba(0,136,199,0.06)' : isHovered && !isActive ? 'var(--hover-gray)' : rowBg(evt.classificationStatus, isActive);

            return (
              <div key={evt.id} ref={(el) => { if (el) rowRefs.current.set(origIdx, el); }}>
                <div
                  className="flex items-center"
                  onClick={() => handleRowClick(origIdx)}
                  onMouseEnter={() => setHoveredIndex(origIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    padding: '8px var(--space-4)',
                    borderBottom: '1px solid var(--grey-stroke)',
                    background: bg,
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast), outline 300ms ease',
                    outline: isDeepLinked ? '2px solid var(--accent-color)' : 'none',
                  }}
                >
                  <span style={{ width: COL.seq, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>{evt.sequence}</span>
                  <span style={{ width: COL.time, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>{evt.timestamp}</span>
                  <div style={{ width: COL.status }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: statusColor(evt.classificationStatus), border: `1px solid ${statusColor(evt.classificationStatus)}`, borderRadius: '0px', padding: '2px 6px' }}>
                      {evt.classificationStatus}
                    </span>
                  </div>
                  <div className="flex flex-col" style={{ flex: 1, gap: '1px', overflow: 'hidden' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.action}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.target}</span>
                  </div>
                  <div style={{ width: COL.rule }}>
                    {evt.matchedRuleId ? (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'var(--hover-gray)', border: '1px solid var(--grey-stroke)', borderRadius: '0px', padding: '2px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '100%' }}>{evt.matchedRuleId}</span>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>—</span>
                    )}
                  </div>
                </div>

                {/* Expand panel */}
                <div style={{ maxHeight: isExpanded ? '800px' : '0px', overflow: 'hidden', transition: 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease', opacity: isExpanded ? 1 : 0, borderBottom: isExpanded ? '1px solid var(--grey-stroke)' : 'none' }}>
                  {isExpanded && (
                    evt.ruleType === 'boundary' ? <BoundaryExpandPanel event={evt} />
                    : evt.ruleType === 'sequence' ? <SequenceExpandPanel event={evt} />
                    : evt.ruleType === 'time' ? <TimeExpandPanel event={evt} />
                    : evt.classificationStatus === 'FLAGGED' ? <OutcomeExpandPanel event={evt} />
                    : <ExpandPanel event={evt} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

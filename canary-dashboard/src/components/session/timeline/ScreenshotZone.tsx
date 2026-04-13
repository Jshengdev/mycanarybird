'use client';

import React, { useState, useMemo } from 'react';
import type { Event } from '@/data/mockData';

/* ── State logic ──────────────────────────────────────────────── */

type ScreenState = 'gmail-compose' | 'file-browser-flagged' | 'file-browser-blocked' | 'gmail-compose-send';

function getScreenState(idx: number): ScreenState {
  if (idx === 5 || idx === 7) return 'file-browser-flagged';
  if (idx === 9) return 'file-browser-blocked';
  if (idx === 11 || idx === 12) return 'gmail-compose-send';
  return 'gmail-compose';
}

function getUrl(state: ScreenState): string {
  if (state === 'gmail-compose' || state === 'gmail-compose-send') return 'mail.google.com/compose';
  return '/home/user/documents';
}

const STATE_EVENTS: Record<ScreenState, number[]> = {
  'gmail-compose': [0, 1, 2, 3, 6, 8, 10, 13],
  'file-browser-flagged': [4, 7],
  'file-browser-blocked': [9],
  'gmail-compose-send': [11, 12],
};

/* Pin positions (approximate x%, y% within the 480x260 content area) */
const PIN_POSITIONS: Record<number, { x: number; y: number }> = {
  0: { x: 50, y: 15 }, 1: { x: 85, y: 50 }, 2: { x: 30, y: 25 },
  3: { x: 30, y: 40 }, 4: { x: 40, y: 45 }, 5: { x: 50, y: 15 },
  6: { x: 50, y: 15 }, 7: { x: 55, y: 55 }, 8: { x: 50, y: 60 },
  9: { x: 45, y: 40 }, 10: { x: 50, y: 15 }, 11: { x: 70, y: 75 },
  12: { x: 80, y: 85 }, 13: { x: 50, y: 15 },
};

/* ── Sub-components ───────────────────────────────────────────── */

function BrowserChrome({ url }: { url: string }) {
  return (
    <div
      className="flex items-center"
      style={{ height: '28px', background: '#1a1a18', gap: '6px', paddingLeft: '12px', flexShrink: 0 }}
    >
      <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: '#FF5F57' }} />
      <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: '#FEBC2E' }} />
      <span style={{ width: '7px', height: '7px', borderRadius: '999px', background: '#28C840' }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '200px',
            height: '16px',
            background: '#0f0f0e',
            border: '1px solid #2a2a28',
            borderRadius: '0px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--icon-grey)',
            textAlign: 'center',
            padding: '2px 8px',
            lineHeight: '12px',
            overflow: 'hidden',
          }}
        >
          {url}
        </div>
      </div>
    </div>
  );
}

function GmailCompose({ sendHighlight }: { sendHighlight?: boolean }) {
  return (
    <div className="flex flex-col" style={{ padding: 'var(--space-4)', gap: 'var(--space-3)', background: 'white', flex: 1 }}>
      <div style={{ borderBottom: '1px solid var(--grey-stroke)', paddingBottom: 'var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>
          To: recipient@example.com
        </span>
      </div>
      <div style={{ borderBottom: '1px solid var(--grey-stroke)', paddingBottom: 'var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
          Re: Q1 Report
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)' }}>
          Dear team, please find the attached Q1 report for your review...
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span
          style={{
            background: '#1a73e8',
            color: 'white',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            padding: '4px 16px',
            borderRadius: '0px',
            ...(sendHighlight ? { border: '2px solid var(--warning)', background: 'rgba(255,192,46,0.15)' } : {}),
          }}
        >
          Send
        </span>
      </div>
    </div>
  );
}

function FileBrowser({ blocked }: { blocked?: boolean }) {
  const files = [
    { name: 'documents/', type: 'dir' },
    { name: 'attachments/', type: 'dir' },
    { name: 'report-q1.pdf', type: 'file' },
    { name: '.env', type: 'file', highlight: true },
    { name: 'config.yaml', type: 'file' },
    { name: 'README.md', type: 'file' },
  ];

  return (
    <div className="flex flex-col" style={{ background: 'white', flex: 1 }}>
      {files.map((f) => {
        const isTarget = f.highlight;
        const bg = isTarget
          ? blocked ? 'rgba(255,46,46,0.2)' : 'rgba(255,192,46,0.15)'
          : 'transparent';
        const borderLeft = isTarget
          ? blocked ? '2px solid var(--critical)' : '2px solid var(--warning)'
          : '2px solid transparent';
        const color = isTarget && blocked ? 'var(--critical)' : 'var(--text-black)';

        return (
          <div
            key={f.name}
            style={{
              padding: '4px var(--space-4)',
              background: bg,
              borderLeft,
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color,
              borderBottom: '1px solid var(--grey-stroke)',
            }}
          >
            {isTarget && blocked ? '🔒 ' : ''}{f.name}
          </div>
        );
      })}
    </div>
  );
}

/* ── Pin ──────────────────────────────────────────────────────── */

function Pin({
  event,
  eventIndex,
  isActive,
  onClick,
}: {
  event: Event;
  eventIndex: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = PIN_POSITIONS[eventIndex] || { x: 50, y: 50 };
  const bg = event.classificationStatus === 'BLOCKED' ? 'var(--critical)'
    : event.classificationStatus === 'FLAGGED' ? 'var(--warning)'
    : 'var(--icon-grey)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 20 : 10,
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '999px',
          background: bg,
          color: 'white',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 600,
          cursor: 'pointer',
          outline: isActive ? '2px solid white' : 'none',
          outlineOffset: isActive ? '2px' : '0',
        }}
      >
        {event.sequence}
      </div>
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '6px',
            background: 'var(--text-black)',
            color: 'var(--text-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '0px',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        >
          {event.action}
        </div>
      )}
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */

export interface ScreenshotZoneProps {
  events: Event[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
}

export function ScreenshotZone({ events, activeIndex, onActiveChange }: ScreenshotZoneProps) {
  const screenState = getScreenState(activeIndex);
  const url = getUrl(screenState);
  const isBlocked = screenState === 'file-browser-blocked';

  const visiblePins = useMemo(() => {
    const indices = STATE_EVENTS[screenState] || [];
    return indices.filter((i) => i < events.length).map((i) => ({ event: events[i], index: i }));
  }, [screenState, events]);

  return (
    <div style={{ flex: 1, background: '#0f0f0e', position: 'relative', overflow: 'hidden' }}>
      {/* Centered mock browser */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '480px',
          height: '290px',
          border: isBlocked ? '2px solid var(--critical)' : '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* BLOCKED badge */}
        {isBlocked && (
          <div
            style={{
              position: 'absolute',
              top: 'var(--space-2)',
              right: 'var(--space-2)',
              background: 'var(--critical)',
              color: 'white',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '0px',
              zIndex: 30,
            }}
          >
            Blocked
          </div>
        )}

        <BrowserChrome url={url} />

        {/* Content area — relative for pins */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Screen content with fade transition */}
          <div
            key={screenState}
            className="flex flex-col"
            style={{
              position: 'absolute',
              inset: 0,
              animation: 'fadeIn 150ms ease',
            }}
          >
            {(screenState === 'gmail-compose') && <GmailCompose />}
            {(screenState === 'gmail-compose-send') && <GmailCompose sendHighlight />}
            {(screenState === 'file-browser-flagged') && <FileBrowser />}
            {(screenState === 'file-browser-blocked') && <FileBrowser blocked />}
          </div>

          {/* Pins */}
          {visiblePins.map(({ event, index }) => (
            <Pin
              key={event.id}
              event={event}
              eventIndex={index}
              isActive={index === activeIndex}
              onClick={() => onActiveChange(index)}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

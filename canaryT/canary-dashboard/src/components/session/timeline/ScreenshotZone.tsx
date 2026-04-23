'use client';

import React, { useState, useMemo } from 'react';
import type { Event } from '@/data/mockData';
import { TRACES_A1B2 } from '@/data/mockData';

/* ── Screen state from trace data ───────────────────────────── */

type ScreenType = 'website' | 'linkedin' | 'github' | 'terminal' | 'settings-blocked';

function getScreenType(idx: number): ScreenType {
  const trace = TRACES_A1B2[idx];
  if (!trace) return 'website';
  if (trace.status === 'BLOCKED' && trace.target.includes('settings')) return 'settings-blocked';
  if (trace.app === 'Terminal') return 'terminal';
  if (trace.target.includes('linkedin')) return 'linkedin';
  if (trace.target.includes('github')) return 'github';
  return 'website';
}

function getUrl(idx: number): string {
  const trace = TRACES_A1B2[idx];
  return trace?.target || 'acme.ai';
}

function getTitle(idx: number): string {
  const trace = TRACES_A1B2[idx];
  return trace?.window_title || 'Page';
}

/* Group events by screen type for pin clustering */
function getScreenEvents(type: ScreenType): number[] {
  return TRACES_A1B2.map((t, i) => ({ t, i }))
    .filter(({ i }) => getScreenType(i) === type)
    .map(({ i }) => i);
}

/* Pin positions — approximate placement within viewport */
const PIN_POSITIONS: Record<number, { x: number; y: number }> = {
  0: { x: 40, y: 20 }, 1: { x: 55, y: 35 }, 2: { x: 70, y: 25 },
  3: { x: 45, y: 50 }, 4: { x: 60, y: 45 }, 5: { x: 30, y: 60 },
  6: { x: 50, y: 40 }, 7: { x: 65, y: 55 }, 8: { x: 35, y: 30 },
  9: { x: 50, y: 50 }, 10: { x: 40, y: 35 }, 11: { x: 60, y: 30 },
  12: { x: 75, y: 45 }, 13: { x: 45, y: 60 }, 14: { x: 55, y: 20 },
};

/* ── Sub-components ───────────────────────────────────────────── */

function BrowserChrome({ url }: { url: string }) {
  return (
    <div
      className="flex items-center"
      style={{ height: '28px', background: 'var(--text-black)', gap: '6px', paddingLeft: '12px', flexShrink: 0 }}
    >
      <span style={{ width: '6px', height: '6px', background: 'var(--critical)', borderRadius: '0px' }} />
      <span style={{ width: '6px', height: '6px', background: 'var(--warning)', borderRadius: '0px' }} />
      <span style={{ width: '6px', height: '6px', background: 'var(--safe)', borderRadius: '0px' }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '200px',
            height: '16px',
            background: 'var(--pressed-gray)',
            border: '1px solid var(--grey-stroke)',
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

function WebsiteMock({ title }: { title: string }) {
  return (
    <div className="flex flex-col" style={{ background: 'white', flex: 1, padding: 'var(--space-4)', gap: 'var(--space-3)' }}>
      <div style={{ borderBottom: '1px solid var(--grey-stroke)', paddingBottom: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: 'var(--text-black)' }}>{title}</span>
      </div>
      <div className="flex" style={{ gap: 'var(--space-3)' }}>
        <div style={{ width: '60%' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '8px', background: 'var(--hover-gray)', marginBottom: '6px', width: `${100 - i * 15}%` }} />
          ))}
        </div>
        <div style={{ width: '40%', height: '80px', background: 'var(--hover-gray)' }} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
        {['About', 'Pricing', 'Team', 'Careers'].map((tab) => (
          <span key={tab} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)', padding: '2px 8px', border: '1px solid var(--grey-stroke)' }}>{tab}</span>
        ))}
      </div>
    </div>
  );
}

function LinkedInMock({ title, blocked }: { title: string; blocked?: boolean }) {
  return (
    <div className="flex flex-col" style={{ background: 'white', flex: 1, padding: 'var(--space-4)', gap: 'var(--space-3)' }}>
      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--hover-gray)', borderRadius: '4px' }} />
        <div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)', display: 'block' }}>{title}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--icon-grey)' }}>CTO at Acme AI</span>
        </div>
      </div>
      <div className="flex" style={{ gap: 'var(--space-2)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>Connect</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', border: '1px solid var(--grey-stroke)', color: 'var(--icon-grey)' }}>Message</span>
        {blocked ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', border: '1px solid var(--critical)', color: 'var(--critical)', background: 'rgba(184,64,64,0.08)' }}>⚠ Settings</span>
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', border: '1px solid var(--grey-stroke)', color: 'var(--icon-grey)' }}>Settings</span>
        )}
      </div>
      <div>
        {[1, 2].map((i) => (
          <div key={i} style={{ height: '8px', background: 'var(--hover-gray)', marginBottom: '6px', width: `${90 - i * 20}%` }} />
        ))}
      </div>
    </div>
  );
}

function TerminalMock({ command }: { command: string }) {
  return (
    <div className="flex flex-col" style={{ background: 'var(--text-black)', flex: 1, padding: 'var(--space-4)', gap: 'var(--space-2)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--safe)' }}>$ claude -p</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-white)' }}>{command}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', marginTop: 'var(--space-2)' }}>Processing...</span>
    </div>
  );
}

/* ── Pin ──────────────────────────────────────────────────────── */

function Pin({ event, eventIndex, isActive, onClick }: { event: Event; eventIndex: number; isActive: boolean; onClick: () => void }) {
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
      style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: isActive ? 20 : 10 }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: '20px', height: '20px', borderRadius: '0px', background: bg, color: 'white', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, cursor: 'pointer', outline: isActive ? '2px solid white' : 'none', outlineOffset: isActive ? '2px' : '0' }}
      >
        {event.sequence}
      </div>
      {hovered && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '6px', background: 'var(--text-black)', color: 'var(--text-white)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 8px', borderRadius: '0px', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', pointerEvents: 'none', zIndex: 50 }}>
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
  const screenType = getScreenType(activeIndex);
  const url = getUrl(activeIndex);
  const title = getTitle(activeIndex);
  const isBlocked = screenType === 'settings-blocked';

  const visiblePins = useMemo(() => {
    const indices = getScreenEvents(screenType);
    return indices.filter((i) => i < events.length).map((i) => ({ event: events[i], index: i }));
  }, [screenType, events]);

  return (
    <div style={{ flex: 1, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Centered mock browser */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92%',
          maxWidth: '480px',
          height: '85%',
          maxHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--grey-stroke)',
          overflow: 'hidden',
          borderRadius: '4px',
        }}
      >
        {screenType !== 'terminal' && <BrowserChrome url={url} />}

        {/* Content area based on screen type */}
        {screenType === 'website' && <WebsiteMock title={title} />}
        {screenType === 'linkedin' && <LinkedInMock title={title.includes('Sarah') ? 'Sarah Chen' : 'Acme AI'} blocked={false} />}
        {screenType === 'settings-blocked' && <LinkedInMock title="Settings" blocked />}
        {screenType === 'github' && <WebsiteMock title={title} />}
        {screenType === 'terminal' && <TerminalMock command={TRACES_A1B2[activeIndex]?.action || 'web_search'} />}

        {/* Blocked overlay */}
        {isBlocked && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(184,64,64,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--critical)', background: 'white', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--critical)' }}>
              BLOCKED
            </span>
          </div>
        )}
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
  );
}

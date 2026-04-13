'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Event } from '@/data/mockData';

function statusColor(s: string): string {
  if (s === 'BLOCKED') return 'var(--critical)';
  if (s === 'FLAGGED') return 'var(--warning)';
  return 'var(--icon-grey)';
}

function borderLeftStyle(isActive: boolean): string {
  return isActive ? '2px solid var(--grey-stroke)' : '2px solid transparent';
}

export interface ActionSidebarProps {
  events: Event[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
}

export function ActionSidebar({ events, activeIndex, onActiveChange }: ActionSidebarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeIndex]);

  return (
    <div
      className="flex flex-col"
      style={{
        width: '240px',
        borderLeft: '1px solid var(--grey-stroke)',
        background: 'var(--card-bg)',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col"
        style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--grey-stroke)' }}
      >
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-black)' }}>
          {events.length} actions
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--icon-grey)' }}>
          click to jump
        </span>
      </div>

      {/* Scrollable list */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {events.map((evt, i) => {
          const isActive = i === activeIndex;
          const isHovered = hoveredIndex === i;
          const bg = isActive ? 'var(--hover-gray)' : isHovered ? 'var(--hover-gray)' : 'transparent';

          return (
            <div
              key={evt.id}
              ref={isActive ? activeRowRef : null}
              onClick={() => onActiveChange(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex"
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: '1px solid var(--grey-stroke)',
                borderLeft: borderLeftStyle(isActive),
                gap: 'var(--space-3)',
                cursor: 'pointer',
                background: bg,
                transition: 'background var(--transition-fast)',
                alignItems: 'flex-start',
              }}
            >
              {/* Status ASCII block */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  lineHeight: '1',
                  color: statusColor(evt.classificationStatus),
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              >
                {evt.classificationStatus === 'BLOCKED' ? '█' : evt.classificationStatus === 'FLAGGED' ? '▒' : '░'}
              </span>

              {/* Event number */}
              <span
                style={{
                  width: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--icon-grey)',
                  flexShrink: 0,
                }}
              >
                {evt.sequence}
              </span>

              {/* Action text */}
              <span
                style={{
                  flex: 1,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--text-black)',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {evt.action}
              </span>

              {/* Timestamp */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--icon-grey)',
                  alignSelf: 'flex-end',
                  flexShrink: 0,
                }}
              >
                {evt.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

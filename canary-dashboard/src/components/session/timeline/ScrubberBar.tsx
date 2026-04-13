'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { Event } from '@/data/mockData';

function statusColor(s: string): string {
  if (s === 'BLOCKED') return 'var(--critical)';
  if (s === 'FLAGGED') return 'var(--warning)';
  return 'var(--icon-grey)';
}

export interface ScrubberBarProps {
  events: Event[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
}

export function ScrubberBar({ events, activeIndex, onActiveChange }: ScrubberBarProps) {
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = events.length;
  const maxIdx = Math.max(count - 1, 1);
  const fillPct = (activeIndex / maxIdx) * 100;

  const indexFromX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return activeIndex;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * maxIdx);
  }, [maxIdx, activeIndex]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);

    const move = (ev: MouseEvent) => {
      onActiveChange(indexFromX(ev.clientX));
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [indexFromX, onActiveChange]);

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    onActiveChange(indexFromX(e.clientX));
  }, [indexFromX, onActiveChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && activeIndex > 0) {
      e.preventDefault();
      onActiveChange(activeIndex - 1);
    }
    if (e.key === 'ArrowRight' && activeIndex < maxIdx) {
      e.preventDefault();
      onActiveChange(activeIndex + 1);
    }
  }, [activeIndex, maxIdx, onActiveChange]);

  if (count === 0) return null;

  const midIdx = Math.floor(count / 2);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        height: '52px',
        borderTop: '1px solid var(--grey-stroke)',
        background: 'var(--card-bg)',
        padding: '0 var(--space-6)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
      }}
    >
      {/* Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        style={{ width: '100%', height: '4px', background: 'var(--grey-stroke)', position: 'relative', cursor: 'pointer' }}
      >
        {/* Fill */}
        <div
          style={{
            height: '4px',
            width: `${fillPct}%`,
            background: 'var(--text-black)',
            borderRadius: '0px',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        {/* Event dots */}
        {events.map((evt, i) => (
          <div
            key={evt.id}
            onClick={(e) => { e.stopPropagation(); onActiveChange(i); }}
            style={{
              position: 'absolute',
              left: `${(i / maxIdx) * 100}%`,
              top: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: statusColor(evt.classificationStatus),
              transform: 'translateX(-50%)',
              cursor: 'pointer',
              zIndex: 1,
            }}
          />
        ))}

        {/* Thumb */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${fillPct}%`,
            top: '-6px',
            width: '16px',
            height: '16px',
            borderRadius: '999px',
            background: 'var(--text-black)',
            transform: 'translateX(-50%)',
            cursor: dragging ? 'grabbing' : 'grab',
            zIndex: 2,
          }}
        />
      </div>

      {/* Timestamps */}
      <span
        style={{
          position: 'absolute',
          bottom: '4px',
          left: 'var(--space-6)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--icon-grey)',
        }}
      >
        {events[0].timestamp}
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--icon-grey)',
        }}
      >
        {events[midIdx].timestamp}
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: '4px',
          right: 'var(--space-6)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--icon-grey)',
        }}
      >
        {events[count - 1].timestamp}
      </span>
    </div>
  );
}

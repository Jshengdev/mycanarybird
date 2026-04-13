'use client';

import React from 'react';
import type { Event } from '@/data/mockData';

export interface TimeExpandPanelProps {
  event: Event;
}

interface BarDef {
  label: string;
  value: string;
  seconds: number;
  threshold: number;
  maxSeconds: number;
  color: string;
}

const BARS: BarDef[] = [
  { label: 'Total duration', value: '4m 15s', seconds: 255, threshold: 180, maxSeconds: 300, color: 'var(--critical)' },
  { label: 'Time to first action', value: '2s', seconds: 2, threshold: 10, maxSeconds: 15, color: 'var(--safe)' },
  { label: 'Longest pause', value: '45s', seconds: 45, threshold: 30, maxSeconds: 60, color: 'var(--warning)' },
];

export function TimeExpandPanel({ event }: TimeExpandPanelProps) {
  void event;

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      {/* Duration bars */}
      <div className="flex flex-col" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {BARS.map((bar) => {
          const fillPct = Math.min(100, (bar.seconds / bar.maxSeconds) * 100);
          const thresholdPct = Math.min(100, (bar.threshold / bar.maxSeconds) * 100);

          return (
            <div key={bar.label} className="flex items-center" style={{ gap: 'var(--space-4)' }}>
              {/* Label */}
              <span
                style={{
                  width: '140px',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--icon-grey)',
                  flexShrink: 0,
                }}
              >
                {bar.label}
              </span>

              {/* Track */}
              <div style={{ flex: 1, height: '4px', background: 'var(--grey-stroke)', position: 'relative', borderRadius: '0px' }}>
                {/* Fill */}
                <div
                  style={{
                    height: '4px',
                    width: `${fillPct}%`,
                    background: bar.color,
                    borderRadius: '0px',
                  }}
                />
                {/* Threshold marker */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${thresholdPct}%`,
                    top: '-2px',
                    width: '2px',
                    height: '8px',
                    background: 'var(--icon-grey)',
                    transform: 'translateX(-1px)',
                  }}
                />
              </div>

              {/* Value */}
              <span
                style={{
                  width: '60px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: bar.color,
                  flexShrink: 0,
                }}
              >
                {bar.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <div
          className="flex flex-col items-center"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: 'var(--space-4)',
            gap: 'var(--space-1)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
            Threshold
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: 'var(--icon-grey)' }}>
            3m 00s
          </span>
        </div>
        <div
          className="flex flex-col items-center"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: 'var(--space-4)',
            gap: 'var(--space-1)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
            Actual
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: 'var(--critical)' }}>
            4m 15s
          </span>
        </div>
        <div
          className="flex flex-col items-center"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: 'var(--space-4)',
            gap: 'var(--space-1)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
            Over by
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: 'var(--critical)' }}>
            1m 15s
          </span>
        </div>
      </div>

      {/* Verdict */}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--critical)',
          display: 'block',
          marginTop: 'var(--space-4)',
        }}
      >
        Session exceeded time threshold by 1m 15s
      </span>
    </div>
  );
}

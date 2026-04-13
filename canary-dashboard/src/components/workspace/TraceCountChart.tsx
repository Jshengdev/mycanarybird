'use client';

import React, { useState, useRef } from 'react';
import { TRACE_COUNT_HISTORY, AGENTS } from '@/data/mockData';

const AGENT_COLORS: Record<string, string> = {
  'email-agent': 'var(--critical)',
  'file-agent': 'var(--safe)',
  'browser-agent': 'var(--warning)',
  'calendar-agent': 'var(--accent-color)',
};

const LEFT_PAD = 40;
const RIGHT_PAD = 20;
const TOP_PAD = 20;
const BOTTOM_PAD = 30;
const SVG_W = 800;
const SVG_H = 280;
const CHART_W = SVG_W - LEFT_PAD - RIGHT_PAD;
const CHART_H = SVG_H - TOP_PAD - BOTTOM_PAD;

const Y_MAX = 200;
const Y_TICKS = [0, 50, 100, 150, 200];

function toX(i: number): number {
  return LEFT_PAD + (i / 9) * CHART_W;
}

function toY(count: number): number {
  return TOP_PAD + (1 - count / Y_MAX) * CHART_H;
}

interface TooltipData {
  x: number;
  y: number;
  agentName: string;
  count: number;
  session: number;
}

const agentMap = Object.fromEntries(AGENTS.map((a) => [a.id, a]));

export interface TraceCountChartProps {
  agentId?: string;
}

export function TraceCountChart({ agentId }: TraceCountChartProps = {}) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const agentIds = agentId ? [agentId] : Object.keys(TRACE_COUNT_HISTORY);

  const handleDotHover = (e: React.MouseEvent<SVGCircleElement>, aid: string, count: number, session: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({ x, y, agentName: agentMap[aid]?.name || aid, count, session });
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '4px',
        padding: 'var(--space-5)',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
        >
          {/* Grid lines + Y-axis labels */}
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={LEFT_PAD}
                y1={toY(tick)}
                x2={SVG_W - RIGHT_PAD}
                y2={toY(tick)}
                stroke="var(--grey-stroke)"
                strokeWidth={0.5}
                strokeDasharray="2 2"
              />
              <text
                x={LEFT_PAD - 8}
                y={toY(tick) + 4}
                textAnchor="end"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--icon-grey)' }}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Bottom border */}
          <line
            x1={LEFT_PAD}
            y1={SVG_H - BOTTOM_PAD}
            x2={SVG_W - RIGHT_PAD}
            y2={SVG_H - BOTTOM_PAD}
            stroke="var(--grey-stroke)"
            strokeWidth={0.5}
          />

          {/* X-axis tick marks */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={toX(i)}
              y1={SVG_H - BOTTOM_PAD}
              x2={toX(i)}
              y2={SVG_H - BOTTOM_PAD + 4}
              stroke="var(--grey-stroke)"
              strokeWidth={0.5}
            />
          ))}

          {/* Lines + dots per agent */}
          {agentIds.map((aid) => {
            const counts = TRACE_COUNT_HISTORY[aid];
            if (!counts) return null;
            const color = AGENT_COLORS[aid] || 'var(--icon-grey)';
            const points = counts.map((c, i) => `${toX(i)},${toY(c)}`).join(' ');

            return (
              <g key={aid}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                />
                {counts.map((c, i) => (
                  <circle
                    key={i}
                    cx={toX(i)}
                    cy={toY(c)}
                    r={3}
                    fill={color}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handleDotHover(e, aid, c, i + 1)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x + 12,
              top: tooltip.y - 8,
              background: 'var(--text-black)',
              color: 'var(--text-white)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: '0px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            {tooltip.agentName} · {tooltip.count} traces · Session {tooltip.session}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap" style={{ gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
        {agentIds.map((aid) => {
          const agent = agentMap[aid];
          const color = AGENT_COLORS[aid] || 'var(--icon-grey)';
          return (
            <div key={aid} className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1', color, flexShrink: 0 }}>█</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>
                {agent?.name || aid}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

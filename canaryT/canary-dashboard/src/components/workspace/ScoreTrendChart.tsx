'use client';

import React, { useState, useRef } from 'react';
import { SCORE_HISTORY, AGENTS } from '@/data/mockData';

const AGENT_COLORS: Record<string, string> = {
  'photon-research': 'var(--critical)',
  'photon-contacts': 'var(--safe)',
  'photon-draft': 'var(--warning)',
  'photon-send': 'var(--accent-color)',
  'photon-followup': 'var(--icon-grey)',
  'photon-inbound': 'var(--safe)',
};

const LEFT_PAD = 40;
const RIGHT_PAD = 60;
const TOP_PAD = 20;
const BOTTOM_PAD = 30;
const SVG_W = 800;
const SVG_H = 280;
const CHART_W = SVG_W - LEFT_PAD - RIGHT_PAD;
const CHART_H = SVG_H - TOP_PAD - BOTTOM_PAD;

const Y_TICKS = [0, 20, 40, 60, 80, 100];

function toX(i: number): number {
  return LEFT_PAD + (i / 9) * CHART_W;
}

function toY(score: number): number {
  return TOP_PAD + (1 - score / 100) * CHART_H;
}

interface TooltipData {
  x: number;
  y: number;
  agentName: string;
  score: number;
  session: number;
}

export interface ScoreTrendChartProps {
  mode: 'workspace' | 'agent';
  agentId?: string;
}

export function ScoreTrendChart({ mode, agentId }: ScoreTrendChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const agentIds = mode === 'agent' && agentId
    ? [agentId]
    : Object.keys(SCORE_HISTORY);

  const agentMap = Object.fromEntries(AGENTS.map((a) => [a.id, a]));

  const handleDotHover = (e: React.MouseEvent<SVGCircleElement>, aid: string, score: number, session: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({ x, y, agentName: agentMap[aid]?.name || aid, score, session });
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
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
          {/* Grid lines */}
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

          {/* Threshold line at 80 */}
          <line
            x1={LEFT_PAD}
            y1={toY(80)}
            x2={SVG_W - RIGHT_PAD}
            y2={toY(80)}
            stroke="var(--grey-stroke)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <text
            x={SVG_W - RIGHT_PAD + 6}
            y={toY(80) + 4}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--icon-grey)' }}
          >
            threshold
          </text>

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
            const scores = SCORE_HISTORY[aid];
            if (!scores) return null;
            const color = AGENT_COLORS[aid] || 'var(--icon-grey)';
            const points = scores.map((s, i) => `${toX(i)},${toY(s)}`).join(' ');

            return (
              <g key={aid}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                />
                {scores.map((s, i) => (
                  <circle
                    key={i}
                    cx={toX(i)}
                    cy={toY(s)}
                    r={3}
                    fill={color}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handleDotHover(e, aid, s, i + 1)}
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
            {tooltip.agentName} · {tooltip.score} · Session {tooltip.session}
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

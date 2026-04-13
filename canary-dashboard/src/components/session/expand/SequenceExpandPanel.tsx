'use client';

import React from 'react';
import type { Event } from '@/data/mockData';

export interface SequenceExpandPanelProps {
  event: Event;
}

const STEPS = ['Compose', 'Attach', 'Verify', 'Send'];
const NODE_W = 80;
const NODE_H = 28;
const GAP = 30;
const START_X = 30;
const TOP_Y = 16;
const BOT_Y = 76;

function nodeX(i: number): number {
  return START_X + i * (NODE_W + GAP);
}

function nodeCX(i: number): number {
  return nodeX(i) + NODE_W / 2;
}

export function SequenceExpandPanel({ event }: SequenceExpandPanelProps) {
  void event;

  return (
    <div style={{ padding: 'var(--space-5)' }}>
      {/* Summary */}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          color: 'var(--text-black)',
          display: 'block',
          marginBottom: 'var(--space-4)',
        }}
      >
        Agent skipped verification step and sent directly
      </span>

      {/* Path diff divider */}
      <div style={{ position: 'relative', borderTop: '1px solid var(--grey-stroke)', marginBottom: 'var(--space-4)' }}>
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--icon-grey)',
            background: 'var(--bg)',
            padding: '0 var(--space-3)',
            whiteSpace: 'nowrap',
          }}
        >
          Path Diff
        </span>
      </div>

      {/* SVG Diagram */}
      <svg width="100%" height="120" viewBox="0 0 500 120" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
        <defs>
          <marker id="arrow-safe" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--safe)" strokeWidth="1" />
          </marker>
          <marker id="arrow-critical" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--critical)" strokeWidth="1" />
          </marker>
          <marker id="arrow-warning" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--warning)" strokeWidth="1" />
          </marker>
        </defs>

        {/* Vertical alignment guides */}
        {STEPS.map((_, i) => (
          <line
            key={`guide-${i}`}
            x1={nodeCX(i)}
            y1={TOP_Y + NODE_H + 2}
            x2={nodeCX(i)}
            y2={BOT_Y - 2}
            stroke="var(--grey-stroke)"
            strokeWidth={0.5}
            opacity={0.4}
          />
        ))}

        {/* ── TOP ROW: Expected (all green) ── */}
        {STEPS.map((step, i) => (
          <g key={`top-${i}`}>
            <rect
              x={nodeX(i)}
              y={TOP_Y}
              width={NODE_W}
              height={NODE_H}
              fill="rgba(72,199,43,0.12)"
              stroke="var(--safe)"
              strokeWidth={1}
              rx={0}
            />
            <text
              x={nodeCX(i)}
              y={TOP_Y + NODE_H / 2 + 4}
              textAnchor="middle"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--safe)' }}
            >
              {step}
            </text>
            {/* Arrow to next */}
            {i < STEPS.length - 1 && (
              <line
                x1={nodeX(i) + NODE_W}
                y1={TOP_Y + NODE_H / 2}
                x2={nodeX(i + 1)}
                y2={TOP_Y + NODE_H / 2}
                stroke="var(--safe)"
                strokeWidth={1.5}
                markerEnd="url(#arrow-safe)"
              />
            )}
          </g>
        ))}

        {/* ── BOTTOM ROW: Actual ── */}
        {STEPS.map((step, i) => {
          const isSkipped = step === 'Verify';
          const isWrongPath = step === 'Send';
          const fillColor = isSkipped ? 'rgba(255,46,46,0.08)' : isWrongPath ? 'rgba(186,117,23,0.08)' : 'rgba(72,199,43,0.12)';
          const strokeColor = isSkipped ? 'var(--critical)' : isWrongPath ? 'var(--warning)' : 'var(--safe)';
          const textColor = isSkipped ? 'var(--critical)' : isWrongPath ? 'var(--warning)' : 'var(--safe)';

          return (
            <g key={`bot-${i}`} opacity={isSkipped ? 0.4 : 1}>
              <rect
                x={nodeX(i)}
                y={BOT_Y}
                width={NODE_W}
                height={NODE_H}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={1}
                rx={0}
              />
              <text
                x={nodeCX(i)}
                y={BOT_Y + NODE_H / 2 + 4}
                textAnchor="middle"
                textDecoration={isSkipped ? 'line-through' : 'none'}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: textColor }}
              >
                {step}
              </text>
            </g>
          );
        })}

        {/* Bottom row arrows: Compose→Attach (green) */}
        <line
          x1={nodeX(0) + NODE_W}
          y1={BOT_Y + NODE_H / 2}
          x2={nodeX(1)}
          y2={BOT_Y + NODE_H / 2}
          stroke="var(--safe)"
          strokeWidth={1.5}
          markerEnd="url(#arrow-safe)"
        />

        {/* Dashed red arc: Attach → Send (skipping Verify), curves below */}
        <path
          d={`M ${nodeX(1) + NODE_W} ${BOT_Y + NODE_H / 2} Q ${nodeCX(2)} ${BOT_Y + NODE_H + 20} ${nodeX(3)} ${BOT_Y + NODE_H / 2}`}
          fill="none"
          stroke="var(--critical)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          markerEnd="url(#arrow-critical)"
        />
      </svg>

      {/* Legend */}
      <div className="flex items-center" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        {[
          { color: 'var(--safe)', label: 'Completed' },
          { color: 'var(--critical)', label: 'Skipped' },
          { color: 'var(--warning)', label: 'Wrong path' },
        ].map((item) => (
          <div key={item.label} className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: 1, color: item.color, flexShrink: 0 }}>█</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--critical)',
          display: 'block',
          marginTop: 'var(--space-3)',
        }}
      >
        ✗ Verify step skipped · direct path taken
      </span>
    </div>
  );
}

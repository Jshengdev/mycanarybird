'use client';

import React from 'react';

export interface StatCardProps {
  label: string;
  value: number | string;
  detail?: string;
  color?: string;
}

function svgForColor(color: string): string {
  if (color === 'var(--critical)') return '/asciigraphic-critical.svg';
  if (color === 'var(--safe)') return '/asciigraphic-safe.svg';
  if (color === 'var(--warning)') return '/asciigraphic-warning.svg';
  return '/asciigraphic-grey.svg';
}

export function StatCard({ label, value, detail, color = 'var(--icon-grey)' }: StatCardProps) {
  const src = svgForColor(color);

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '4px',
        overflow: 'hidden',
        aspectRatio: '1',
        position: 'relative',
      }}
    >
      {/* Left ASCII graphic — flipped, 4px inset */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          left: '4px',
          top: '4px',
          width: '25%',
          height: 'calc(100% - 8px)',
          objectFit: 'fill',
          transform: 'scaleX(-1)',
        }}
      />

      {/* Right ASCII graphic — 4px inset */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          right: '4px',
          top: '4px',
          width: '25%',
          height: 'calc(100% - 8px)',
          objectFit: 'fill',
        }}
      />

      {/* Content */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          position: 'absolute',
          inset: 0,
          paddingLeft: 'calc(25% + 20px)',
          paddingRight: 'calc(25% + 20px)',
          paddingTop: 'clamp(12px, 2vw, 20px)',
          paddingBottom: 'clamp(12px, 2vw, 20px)',
          gap: 'var(--space-2)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 1.2vw, 11px)', fontWeight: 400, textTransform: 'uppercase', color: 'var(--icon-grey)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(20px, 4vw, 48px)', fontWeight: 400, color: 'var(--text-black)', lineHeight: 1 }}>
          {value}
        </span>
        {detail && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(7px, 0.9vw, 9px)', color: 'var(--icon-grey)', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

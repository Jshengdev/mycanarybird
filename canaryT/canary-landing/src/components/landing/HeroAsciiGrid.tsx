'use client';

import { useState, useEffect } from 'react';
import styles from './HeroAsciiGrid.module.css';

// Character tiers from bottom to top — increasing density
const TIERS: { char: string; rows: number; opacity: number }[] = [
  { char: '.', rows: 2, opacity: 0.3 },
  { char: ':', rows: 2, opacity: 0.4 },
  { char: "'", rows: 3, opacity: 0.45 },
  { char: '-', rows: 3, opacity: 0.5 },
  { char: '~', rows: 3, opacity: 0.55 },
  { char: '*', rows: 3, opacity: 0.6 },
  { char: '#', rows: 3, opacity: 0.7 },
  { char: '░', rows: 3, opacity: 0.8 },
  { char: '▒', rows: 3, opacity: 0.9 },
];

function useColCount() {
  const [cols, setCols] = useState(240);
  useEffect(() => {
    const update = () => {
      setCols(Math.ceil(window.innerWidth / 5.5) + 40);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

/**
 * Animated ASCII grid that bleeds past the right edge.
 * Colors derive from --accent-color (#0B0DC4) at varying opacities.
 *
 * Each visible character spins 360deg on hover (CSS-only; respects
 * prefers-reduced-motion). Whitespace gap cells are excluded.
 */
export function HeroAsciiGrid() {
  const COLS = useColCount();

  const allRows: { char: string; opacity: number }[] = [];
  for (const tier of TIERS) {
    for (let r = 0; r < tier.rows; r++) {
      allRows.push({ char: tier.char, opacity: tier.opacity });
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: '-10vw',  // bleed past right edge
        zIndex: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.05em',
        userSelect: 'none',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {allRows.map((row, idx) => {
        // Top rows have a center gap; closes by row 7
        const gapEndRow = 7;
        const gapFraction = idx >= gapEndRow ? 0 : 0.7 * (1 - idx / gapEndRow);
        const gapCount = Math.floor(COLS * gapFraction);
        const mid = Math.floor(COLS / 2);
        const halfGap = Math.floor(gapCount / 2);
        const gapStart = mid - halfGap;
        const gapEnd = mid + halfGap;

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: `rgba(11, 13, 196, ${row.opacity})`,
              lineHeight: '14px',
            }}
          >
            {Array.from({ length: COLS }, (_, ci) => {
              const inGap = gapCount > 0 && ci >= gapStart && ci < gapEnd;
              if (inGap) {
                return (
                  <span
                    key={ci}
                    style={{
                      display: 'inline-block',
                      width: '0.55em',
                      textAlign: 'center',
                    }}
                  >
                    {'\u00A0'}
                  </span>
                );
              }
              return (
                <span key={ci} className={styles.char}>
                  {row.char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

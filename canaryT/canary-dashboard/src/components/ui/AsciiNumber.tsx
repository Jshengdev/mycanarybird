'use client';

import React from 'react';

// 5×7 bitmap font for digits 0-9 and /
const DIGIT_MAP: Record<string, number[][]> = {
  '0': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,1,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  '3': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
  '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '6': [[0,1,1,1,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  '8': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '9': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
  '/': [[0,0,0,0,1],[0,0,0,1,0],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[1,0,0,0,0]],
};

// Padding cells around each digit
const PAD_X = 1;
const PAD_Y = 1;

export interface AsciiNumberProps {
  value: string;
  color?: string;
  cellSize?: number;
  bgChar?: string;
  fgChar?: string;
  bgColor?: string;
}

export function AsciiNumber({
  value,
  color = 'var(--text-black)',
  cellSize = 4,
  bgChar = '░',
  fgChar = '*',
  bgColor = 'var(--icon-grey)',
}: AsciiNumberProps) {
  const chars = value.split('');
  const digitWidth = 5;
  const digitHeight = 7;
  const gapCols = 1; // gap between digits

  // Build full grid
  const totalCols = chars.reduce((sum, ch, i) => {
    const w = DIGIT_MAP[ch] ? digitWidth : 2;
    return sum + w + (i > 0 ? gapCols : 0);
  }, 0) + PAD_X * 2;
  const totalRows = digitHeight + PAD_Y * 2;

  // Create grid filled with bg
  const grid: { char: string; isFg: boolean }[][] = [];
  for (let r = 0; r < totalRows; r++) {
    grid[r] = [];
    for (let c = 0; c < totalCols; c++) {
      grid[r][c] = { char: bgChar, isFg: false };
    }
  }

  // Stamp digits
  let colOffset = PAD_X;
  chars.forEach((ch, ci) => {
    if (ci > 0) colOffset += gapCols;
    const bitmap = DIGIT_MAP[ch];
    if (!bitmap) { colOffset += 2; return; }
    for (let r = 0; r < digitHeight; r++) {
      for (let c = 0; c < digitWidth; c++) {
        if (bitmap[r][c]) {
          grid[r + PAD_Y][colOffset + c] = { char: fgChar, isFg: true };
        }
      }
    }
    colOffset += digitWidth;
  });

  return (
    <div
      style={{
        display: 'inline-block',
        lineHeight: 0,
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {grid.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', height: `${cellSize}px` }}>
          {row.map((cell, ci) => (
            <span
              key={ci}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                fontSize: `${cellSize}px`,
                fontFamily: 'var(--font-mono)',
                color: cell.isFg ? color : bgColor,
                opacity: cell.isFg ? 1 : 0.15,
                textAlign: 'center',
                lineHeight: `${cellSize}px`,
                display: 'inline-block',
                overflow: 'hidden',
              }}
            >
              {cell.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

'use client';

import styles from './AsciiMark.module.css';

export type AsciiMarkProps = {
  /**
   * Which density/dither pattern to render. 4 distinct values so callers
   * can vary the motif across tiles.
   * - 1: sparse (~15% fill)
   * - 2: checkerboard-ish (~35% fill)
   * - 3: dense halftone (~55% fill)
   * - 4: near-solid with micro-gaps (~75% fill)
   */
  variant?: 1 | 2 | 3 | 4;
  /** px — CSS width/height of the square mark. */
  size?: number;
  /** Opacity 0..1 */
  opacity?: number;
  /** CSS color. Defaults to var(--accent-color). */
  color?: string;
  /**
   * If set, positions the mark absolutely in the given corner of the
   * nearest positioned ancestor.
   */
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
};

/**
 * Static 4x4 Bayer-style dither blocks. Each array is 16 bits arranged row-major.
 * Fill counts are tuned to match the documented density bands while reading as
 * a coherent family (same dot size, same color, same geometry).
 */
const BAYER: Record<1 | 2 | 3 | 4, readonly number[]> = {
  // ~15% fill — 2 of 16 lit, spaced diagonally for a quiet accent
  1: [
    0, 0, 1, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 1, 0, 0,
  ],
  // ~37% fill — broken checkerboard
  2: [
    1, 0, 1, 0,
    0, 1, 0, 0,
    1, 0, 1, 0,
    0, 0, 0, 1,
  ],
  // ~56% fill — denser halftone, reads as "almost filled"
  3: [
    1, 1, 0, 1,
    1, 0, 1, 1,
    0, 1, 1, 0,
    1, 1, 0, 1,
  ],
  // ~75% fill — solid block with three micro-gaps
  4: [
    1, 1, 1, 1,
    1, 0, 1, 1,
    1, 1, 0, 1,
    1, 1, 1, 0,
  ],
};

const CORNER_CLASS: Record<NonNullable<AsciiMarkProps['corner']>, string> = {
  'top-left': styles.cornerTopLeft,
  'top-right': styles.cornerTopRight,
  'bottom-left': styles.cornerBottomLeft,
  'bottom-right': styles.cornerBottomRight,
};

/**
 * Decorative ASCII-dither block that echoes the hero's Bayer texture.
 *
 * Renders as a 4x4 CSS grid of 16 cells; each cell is either lit (filled
 * with `color`) or blank. Static — no animation, no JS work after mount.
 * Purely decorative; `aria-hidden` and `pointer-events: none` so it never
 * interferes with real content.
 */
export function AsciiMark({
  variant = 2,
  size = 48,
  opacity = 0.55,
  color,
  corner,
  className,
}: AsciiMarkProps) {
  const bits = BAYER[variant];
  const resolvedColor = color ?? 'var(--accent-color)';

  const classes = [styles.root, corner ? CORNER_CLASS[corner] : null, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-hidden="true"
      className={classes}
      style={{
        width: size,
        height: size,
        opacity,
      }}
    >
      {bits.map((bit, i) => (
        <span
          key={i}
          className={styles.cell}
          style={bit ? { backgroundColor: resolvedColor } : undefined}
        />
      ))}
    </div>
  );
}

export default AsciiMark;

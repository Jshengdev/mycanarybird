/**
 * HeroOrbit — decorative line-art "blueprint" graphic for the hero.
 *
 * Inspired by wgb.agency: three tilted concentric rings, a diamond glyph
 * anchored inside, a couple of labelled nodes. Stroke-only, paper-tone
 * ink. Pure SVG so it's crisp at every DPR and costs nothing to render.
 *
 * Lives top-right of the hero, absolutely positioned, pointer-events none,
 * behind the main content so it reads as a watermark / blueprint — not as
 * an image the reader is supposed to interact with.
 */

import styles from './HeroOrbit.module.css';

export function HeroOrbit() {
  return (
    <svg
      className={styles.orbit}
      viewBox="-500 -380 900 760"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
    >
      {/* Three tilted rings — outer to inner. rx > ry gives the Saturn-ring
          perspective. Rotated 18° so they read as drifting, not aligned. */}
      <g className={styles.rings} transform="rotate(-14)">
        <ellipse cx="0" cy="0" rx="440" ry="88" />
        <ellipse cx="0" cy="0" rx="340" ry="68" />
        <ellipse cx="0" cy="0" rx="240" ry="48" />
      </g>

      {/* Diamond glyph — the Canary mark equivalent. Solid fill so it
          pops against the linework. Anchored slightly left-of-center. */}
      <g transform="translate(-60 -10) rotate(45)">
        <rect
          className={styles.diamond}
          x="-14"
          y="-14"
          width="28"
          height="28"
        />
      </g>

      {/* Labelled node on the outer ring — "Capture". */}
      <g transform="translate(310 -70)">
        <circle className={styles.node} r="3.5" />
        <text className={styles.nodeLabel} x="12" y="5">
          Capture
        </text>
      </g>

      {/* Second labelled node — "Verdict". On the middle ring, opposite side. */}
      <g transform="translate(-290 74)">
        <circle className={styles.node} r="3.5" />
        <text className={styles.nodeLabel} x="12" y="5">
          Verdict
        </text>
      </g>

      {/* Third unlabelled tick — travel marker, adds rhythm. */}
      <g transform="translate(155 145)">
        <circle className={styles.node} r="2.5" />
      </g>
    </svg>
  );
}

export default HeroOrbit;

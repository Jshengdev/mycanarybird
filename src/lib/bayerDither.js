const BAYER_4x4 = [
  [ 0/16,  8/16,  2/16, 10/16],
  [12/16,  4/16, 14/16,  6/16],
  [ 3/16, 11/16,  1/16,  9/16],
  [15/16,  7/16, 13/16,  5/16],
];

export function drawBayerDither(canvas, opts, cursorX, cursorY) {
  const {
    colorR = 79, colorG = 70, colorB = 229,
    maxOpacity = 0.18,
    direction = 'bottom',
    dotSize = 5,
    cursorRadius = 140,
    cursorBoost = 0.55,
  } = opts || {};

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cols = Math.ceil(W / dotSize);
  const rows = Math.ceil(H / dotSize);

  const hasCursor = cursorX !== undefined && cursorY !== undefined;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rawT = direction === 'bottom'
        ? 1 - (r / rows)
        : (r / rows);

      const t = rawT * rawT * (3 - 2 * rawT);
      const threshold = BAYER_4x4[r % 4][c % 4];

      let boost = 0;
      if (hasCursor) {
        const px = c * dotSize + dotSize / 2;
        const py = r * dotSize + dotSize / 2;
        const dist = Math.hypot(px - cursorX, py - cursorY);
        boost = Math.max(0, 1 - dist / cursorRadius) * cursorBoost;
      }

      const effectiveT = Math.min(1, t + boost);

      if (effectiveT > threshold) {
        const cursorMix = hasCursor ? Math.max(0, 1 - Math.hypot(
          c * dotSize + dotSize/2 - cursorX,
          r * dotSize + dotSize/2 - cursorY
        ) / cursorRadius) : 0;

        const r_ = Math.round(colorR + (140 - colorR) * cursorMix * 0.6);
        const g_ = Math.round(colorG + (80  - colorG) * cursorMix * 0.3);
        const b_ = Math.round(colorB + (255 - colorB) * cursorMix * 0.25);

        const alpha = (maxOpacity * t + cursorMix * 0.3) * Math.min(1, effectiveT * 1.6);
        ctx.fillStyle = `rgba(${r_},${g_},${b_},${alpha})`;
        ctx.fillRect(c * dotSize, r * dotSize, dotSize - 1, dotSize - 1);
      }
    }
  }
}

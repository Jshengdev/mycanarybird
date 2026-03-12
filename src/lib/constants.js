const DITHER_BASE = { colorR: 79, colorG: 70, colorB: 229, dotSize: 5 };

export const HERO_DITHER_OPTS = {
  ...DITHER_BASE,
  maxOpacity: 0.22, direction: 'bottom',
  cursorRadius: 160, cursorBoost: 0.6,
};

export const STATIC_DITHER_OPTS = {
  ...DITHER_BASE,
  maxOpacity: 0.2, direction: 'top',
};

export const CTA_DITHER_OPTS = {
  ...DITHER_BASE,
  maxOpacity: 0.25, direction: 'top',
};

export const FEED_TICK_MS = 2800;

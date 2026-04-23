# Watched Field — Canary p5.js background prototype

Standalone algorithmic-art prototype for Canary's background layer. Read
[`PHILOSOPHY.md`](./PHILOSOPHY.md) first — it's the manifesto the code
executes.

## Open

```bash
open canaryT/canary-prototyping/watched-field/index.html
```

Or serve locally for LAN testing:

```bash
cd canaryT/canary-prototyping/watched-field && python3 -m http.server 8080
# visit http://localhost:8080
```

No build step. p5.js via CDN.

## What to look for

1. **Scroll from top to bottom** — watch the three phases shift:
   - 0-35%: ~40 agents drifting calmly, almost no rings
   - 35-70%: ~100 agents, turbulent field, frequent blue observation rings
     pop where an agent diverges from the local current
   - 70-100%: agents converge, trails sharpen, still just one canary
2. **The canary** — one sentinel in muted forest green, larger,
   slower, with a longer trail. Always visible, gently pulsing (matches
   the `--pulse-duration: 2s` token).
3. **Scroll readout** — bottom-right corner shows the current phase label.
4. **`prefers-reduced-motion: reduce`** — DevTools → Rendering → emulate.
   Reload. You'll see a single static composition, no animation.

## How it integrates into the landing page

The prototype uses a fullscreen `#sketch-root` div with
`position: fixed; inset: 0; z-index: 0; pointer-events: none;`. Above it,
`<main>` sits at `z-index: 1` with normal scroll.

To integrate into `canary-landing/`:

1. **Wrap as a React client component** — `src/components/landing/WatchedField.tsx`
   with `'use client'`, wrap the p5 instance creation in `useEffect` with
   a strict cleanup (`p.remove()` on unmount), and use a ref for the
   canvas mount point instead of `document.getElementById`.
2. **Install p5** — `npm install p5 @types/p5 --legacy-peer-deps`
3. **Mount in `app/page.tsx`** above `<Hero />` but before all other
   sections:
   ```tsx
   <WatchedField />
   <main>{/* hero, reel, etc. stay at z-1 */}</main>
   ```
4. **Update the current hero** — the HeroAsciiGrid can coexist with
   WatchedField or be replaced by it. If keeping both, give ASCII a
   slightly lower z-index so it lives between the field and the copy.
5. **Scroll reactivity** — the prototype's rAF-throttled scroll listener
   is production-safe. Optionally rewrite to use GSAP ScrollTrigger if
   more precise section-tied phases are needed (e.g., agents converge
   exactly when Reel section 3 is in view).

## Parameters worth tuning

In `index.html`, the top-of-sketch constants are the knobs:

| Constant | Default | Effect |
|---|---|---|
| `MAX_AGENTS` | 160 | Peak density at 100% scroll — lower for slower devices |
| `MIN_AGENTS` | 40 | Baseline density at 0% scroll |
| `FIELD_RES` | 24 | Noise cell size in px — higher = broader gestures |
| `TRAIL_LEN_BASE` | 18 | Trail buffer — longer = more persistent ghosts |
| `obsInterval` formula | `180 - scroll*130` | Frames between ring spawns |
| Divergence threshold | `< 0.35` | How off-path an agent must be to be "seen" |

## What makes this Canary and not a generic flow-field

Dozens of p5 sketches do Perlin flow fields. Three things make this one
Canary-specific:

1. **Divergence-as-detection** — the blue observation rings only appear
   when an agent's velocity diverges from the local field. This is the
   "Canary sees what the agent does" visualization, not just pretty
   motion.
2. **The sentinel** — a single constant agent in `--safe` green, always
   visible, pulsing. It is literally the canary in the mine. The
   metaphor is embedded in the algorithm, not just the copy.
3. **Token discipline** — every color in the sketch is a Canary token.
   No invented values. The field colors and the landing page copy share
   the same palette, so the field never visually conflicts with the
   foreground.

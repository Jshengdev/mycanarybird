# Rigging the Canary — Figma brief

You're creating a multi-path SVG of the canary logo so we can articulate
the wings via CSS. The references in this folder show target wing
positions. Your deliverable is one SVG file with named, separated paths.

## Files in this folder

| File | What it is |
|---|---|
| `canarylogo.svg` | **Source of truth.** The existing brand mark. Open this in Figma. |
| `canary-rest.png` | **Reference only** — canary at rest, wings tucked. Baseline pose. |
| `canary-flap-up.png` | **Reference only** — wings at the top of a wingbeat. Shows where wings should point at the upstroke extreme. |
| `canary-flap-down.png` | **Reference only** — wings at the bottom of a wingbeat. Shows where wings should point at the downstroke extreme. |

**The three PNGs are visual references, not traceable assets.** Use
them to understand the silhouette shape at each wing extreme, then
create the actual rig from the original SVG path.

## What to deliver

One file: **`canary-rigged.svg`**

Structural requirements (order matters — more specific reqs below):

```svg
<svg viewBox="0 0 299 287" xmlns="http://www.w3.org/2000/svg">
  <!-- Body — the core silhouette minus wings and eye -->
  <g id="body">
    <path d="..." />
  </g>

  <!-- Wing(s) — see "Two rigging options" below -->
  <g id="wing-left" style="transform-origin: 160px 120px;">
    <path d="..." />
  </g>
  <g id="wing-right" style="transform-origin: 160px 120px;">
    <path d="..." />
  </g>

  <!-- Eye — the small circle at top -->
  <circle id="eye" cx="199.981" cy="77.0166" r="19" />
</svg>
```

The exact coordinates of the transform-origin don't matter — just place
it at the shoulder joint (where the wing visibly pivots from the body).

## Two rigging options

The logo is abstract, so there's no obvious anatomical wing. Pick one of
these approaches based on what feels right when you're looking at the
path in Figma.

### Option A — Two wings (one left, one right)

Split the logo into three groups: `body`, `wing-left`, `wing-right`.
The two wings rotate in mirror when the bird flaps.

Appropriate if the logo's outer curves can be meaningfully split in half
(e.g., left side of the curve is one wing, right side is the other).

**CSS I'll write:**
```css
.pose-flap-up   #wing-left  { transform: rotate(-22deg); }
.pose-flap-up   #wing-right { transform: rotate(22deg); }
.pose-flap-down #wing-left  { transform: rotate(14deg); }
.pose-flap-down #wing-right { transform: rotate(-14deg); }
```

### Option B — Single wing (whole outer curve)

The logo's outer curve is the "wing" as a single articulated element.
Split into two groups: `body` (inner mass + eye) and `wing` (the outer
curve that moves).

Appropriate if the logo's shape naturally reads as a bird-form with one
continuous wing silhouette (common for stylized / C-shape bird logos).

**CSS I'll write:**
```css
.pose-flap-up   #wing { transform: translateY(-4px) scaleY(0.85); }
.pose-flap-down #wing { transform: translateY(2px)  scaleY(1.1); }
```

**My guess from looking at the logo:** Option B is a better fit for this
specific mark because the path reads as one continuous silhouette with
an eye dot, not as a symmetric body-with-wings figure. But you're the
designer — pick whichever makes sense when you're in Figma.

## Figma steps (rough)

1. Open `canarylogo.svg` in Figma (drag-drop or File → Place Image)
2. Right-click the layer → **Outline Stroke** (converts to editable shape
   if needed) — actually for this logo it's already a filled shape, skip
3. Select the path → **Ungroup** / convert to editable paths
4. Use the pen tool + **Split path** to cut the silhouette into your
   chosen parts:
   - For Option A: identify the two halves at the midline, split there
   - For Option B: find the seam between body-core and outer curve, split
5. Rename each path as `body`, `wing-left` / `wing-right` OR `body` / `wing`
6. Also make sure the eye is its own path or `<circle>` named `eye`
7. Export as SVG with the multi-path structure preserved
8. Save as `canary-rigged.svg` in this folder

## Key fidelity rules

- **viewBox must stay `0 0 299 287`** — preserves all current CSS sizing
- **Keep the original path data where possible** — don't redraw. Use
  Figma's path-splitting tools so each piece carries a subset of the
  original curves.
- **Don't change proportions** — same character size, same stroke
  weight, same gap widths. The reference PNGs are guides for *where
  wings go when they move*, not for redrawing the character.
- **Preserve the eye circle** exactly: `cx="199.981" cy="77.0166" r="19"`
- **All paths keep `fill="black"`** (or no explicit fill — I'll drive
  it via CSS)
- **No strokes** anywhere — the logo is fill-only

## What I do once you deliver

When `canary-rigged.svg` lands in this folder:

1. I inline it into the prototype (replaces the current `<img>` reference)
2. I write CSS `@keyframes` that rotate/transform the wing groups per
   pose (using whichever option you chose)
3. The existing flap cycle (during scroll transit) and idle twitch
   (when perched) switch from "transform the whole bird" to "rotate the
   wings specifically"
4. We verify in browser — if the flap reads weird, we tune rotation
   angles and timing

Total wire-up on my side: ~15 min.

## Quick gut check

Before you deliver, preview the rig in Figma by selecting a wing group
and rotating it ±20°. If the rotation looks natural (the wing pivots
cleanly at its shoulder without the body tearing or the eye drifting),
you've got the pivot point right. If it looks weird, adjust the
transform-origin to the actual visual shoulder joint and retry.

## Questions worth answering before you start

1. Are you picking **Option A (two wings)** or **Option B (one wing)**?
   Affects the split pattern.
2. Do you want the eye to **stay fixed** during flap, or **drift with
   the body's pose transform**? (My default: stay fixed — feels more
   anchored. Easy to change later.)
3. Any constraint on viewBox / dimensions? (I'm assuming we keep the
   original 299×287 — say if not.)

Tell me your Option A/B choice before you dive in — I'll pre-write the
CSS so it's ready the second you drop in the rigged SVG.

# Track: UI Polish

> First, read `CLAUDE.md` at the project root. It has the shared context, tokens, and guardrails.

## Mission

Raise the visual fidelity and readability of the landing page. Tighten typographic hierarchy, spacing rhythm, and visual weight so a first-time visitor's eye moves cleanly from hero → reel → use cases → CTA. You are the taste bar.

## Files you own

- `**/*.module.css` (all colocated styles)
- `src/app/globals.css`
- Non-copy JSX structure in `Hero.tsx`, `EcosystemBar.tsx`, `Flow/*`, `UseCases/*`, `Closer.tsx`, `Nav.tsx`, `Footer.tsx`, `EarlyAccessForm.tsx` — layout + element roles only
- `src/components/ui/` — Button, LiveIndicator, AsciiHover
- Hero ASCII visual primitives (`HeroAsciiGrid.tsx`, `HeroCursor.tsx`) if their visual tuning is in scope

## Files you do NOT touch

- `src/components/canary-watch/**` — the bird belongs to the `bird` track
- `src/components/landing/UseCases/useCaseData.ts` — data/copy, not visual
- Any user-facing string inside JSX — that belongs to the `copy` track (you can move text around but don't change the words)

## What "polish" means here

Walk the page in a browser. For each section, ask:

1. **Hierarchy**: does the eye go where I want it first? Second? Third? Is the important thing the heaviest?
2. **Rhythm**: are section gaps consistent? Do the tokens (`--space-*`) actually get used, or are there one-off pixel values?
3. **Readability**: line length around `65ch` for body copy. Line height comfortable. Font weight intentional.
4. **Contrast**: is `--icon-grey` readable on `--bg`? Run a contrast check. Anything under 4.5:1 on body text is a miss.
5. **Alignment**: left rails, card padding, stat positions — are they on an 8px-ish grid or floating?
6. **Visual density**: VISUAL_DENSITY=4 (from taste-skill baseline). Clean but not airy-gallery.
7. **Micro-detail**: 1px dividers, subtle card gradients, scanline overlay opacity, ascii scanline contrast.

## Concrete candidates (propose & implement, don't ask permission for each)

- Audit `Hero.module.css` — the `<h1>` size vs. subtitle spacing vs. CTA row gap. Does `tracking` match our typographic family?
- Flow frames: the copy column's `.stat` block and `.body` density — does the 88%/90%/10ms feel balanced or cramped?
- UseCase tabs: active-state underline thickness, hover state, keyboard focus ring (must keep accessibility).
- Closer section: headline scale on mobile (`clamp()`?); form input padding; submit button disabled state.
- Session log: monospace alignment of the `time / type / target` columns; log row hover maybe? But don't compete with the bird.
- Global: any stray color values that should be tokens. Any stray spacing values that should be `--space-*`.

## Off-limits taste rules (from `CLAUDE.md` / taste-skill §7)

- No Inter. No pure `#000`. No outer glows. No purple/neon gradients. No 3-equal-cards row.
- Singular accent `--accent-color #0B0DC4` only. Never gradient-fill large H1.
- No oversized H1 that screams — control hierarchy with weight + color, not scale.
- Shadows must be tinted to the background hue; no default neutral `0,0,0` glows.

## Test loop

1. Dev server at `localhost:3000` is shared. HMR picks up CSS instantly.
2. Before commit: `npx tsc --noEmit` (for any `.tsx` touches), eyeball the page, resize the window (mobile, iPad-ish, desktop).
3. Commit small. Message convention: `polish(ui): <concern>`. Example: `polish(ui): tighten Hero vertical rhythm and lift subtitle weight`.
4. Push to `main`.

## Rules of engagement

- **Do not** add new dependencies. The stack is final.
- **Do not** refactor JSX just to "clean up." Layout edits only when they serve a visual outcome.
- **Do not** touch any user-facing string. Even if you disagree with copy — that's `copy` track's call.
- **Do not** introduce framer-motion into the Flow tree (Flow is GSAP-only per taste-skill §8).
- Every motion/transition addition needs `@media (prefers-reduced-motion: reduce)` handling.

## Initial prompt to paste in your Claude session

```
I'm running the UI polish track for the Canary landing page.

Read CLAUDE.md at the project root and docs/polish/ui.md for my full brief.

First task: walk the home page (localhost:3000) section by section — Nav, Hero, EcosystemBar, Flow (all 3 frames), UseCases (all 4 tabs), Closer, SessionLog, Footer — and give me a punch-list of visual-hierarchy, spacing, readability, or token-consistency issues you'd tackle. Rank them high/medium/low impact. Do not start editing yet — I want to pick the top 3-5 before any changes land.

Don't touch anything in src/components/canary-watch/** or any user-facing strings.
```

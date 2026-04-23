# Canary Landing — Polish Phase Context

## What this is

The marketing landing page for **Canary**, a QA/observability SDK for computer-use AI agents (Claude Code, Browser Use, openClaw, Hermes).

- **Stack**: Next.js 16 App Router · React 18 · Framer Motion · GSAP (Reel only) · CSS Modules · next/font
- **Live**: https://mycanarybird.com (Vercel, project `mycanarybird`, root `canaryT/canary-landing`)
- **Dev repo**: `teriyapi/canary` branch `feat/landing-redesign` (this folder's `.git`)
- **Local dev**: `npm run dev` → http://localhost:3000
- **Prod deploy**: from outer `mycanarybird/` run `vercel --prod --yes`

The page is already shipped and working. **We are now in polish phase** — no structural rewrites, just refinement.

## Architecture at a glance

```
src/
  app/
    layout.tsx          — root layout, CanaryWatchProvider wraps everything
    page.tsx            — home composition (Nav, Hero, EcosystemBar, Reel, UseCases, Closer, SessionLog, Footer)
    about/ blog/ features/ api/early-access/
    globals.css         — design tokens (source of truth below)
  components/
    nav/Nav.tsx         — full-bar → pill on scroll (framer-motion)
    landing/
      Hero.tsx            — asymmetric hero, LIVE badge, blinking cursor, ascii grid
      EcosystemBar.tsx
      Reel/               — GSAP pinned 300vh, frames Observe/Control/Improve
      UseCases/           — 4-tab selector with layoutId morph
      Closer.tsx          — "agents in the mine" headline + EarlyAccessForm
    canary-watch/       — the mascot system (context, mascot, session log, hooks)
    ui/                 — Button, LiveIndicator, AsciiHover
```

Colocated CSS: every `Foo.tsx` has `Foo.module.css` beside it. Tokens live only in `src/app/globals.css`.

## Design tokens (non-negotiable — do NOT invent new values)

```
--accent-color     #0B0DC4      (singular accent; never gradient-fill text with it for large H1)
--safe             #2D7A55      green for LIVE / OK states
--critical         #B84040      red for BLOCKED
--warning          #8C6508
--text-black       #0A0A0A      (never pure #000)
--icon-grey        #5A5A7A      secondary text
--grey-stroke      #DCDCE8      1px borders
--bg               #F5F5F8
--card-bg          #FAFAFA

fonts (next/font/google, wired in layout.tsx):
  --font-sans       Plus Jakarta Sans   (hero/headings)
  --font-mono       IBM Plex Mono        (labels, session log, code snippets)
  --font-mono-alt   JetBrains Mono       (action log)

spacing: --space-1…16  (4, 6, 8, 12, 16, 20, 24, 32, 48, 64)
radius:  --radius-card 4px · --radius-btn 2px
```

## The mascot system (`components/canary-watch/`)

The bird is meta-commentary on the product itself — it watches you read the page, logs your actions in the Session Log at the bottom (styled like the real dashboard). Sections self-register via `useCanarySection({id, order, displayName})`. They can optionally declare a **perch anchor** (the specific sub-element the bird should sit on).

Eye-path perch chain (in order):

1. Hero headline — "The trust layer for autonomous agents."
2. Reel · Observe → session header (`SESSION · 2026-04-15 · 14:23:07`)
3. Reel · Control → the red `● BLOCKED · OUTREACH SEND` stripe
4. Reel · Improve → first suggested rule card (`rate-limit-domain-sends`)
5. UseCases → active tab (2.2s) → drifts to `[data-uc-visual]` visual box
6. Closer → the "Get early access →" submit button
7. SessionLog → "Caught you." headline

Nav is **NOT** a perch — the logo isn't an eye-path stop.

Behavior knobs (in `CanaryMascot.tsx`):
- `SWITCH_HYSTERESIS_PX = 60` — new candidate must be this much closer before switch
- `SWITCH_DWELL_MS = 220` — new candidate must hold for this long before commit
- `SCROLL_IDLE_MS = 140` — scroll settles after this much quiet, triggers perch commit + wiggle
- `WIGGLE_DURATION_MS = 1200` — one-shot spring-overshoot flap on landing

## Polish tracks

We are running **three parallel polish tracks**. Each runs in its own tmux session / Claude instance. Coordinate through git — short-lived branches, frequent commits, pull before starting. Brief for your track lives at `docs/polish/<track>.md` — **read it first**.

| Track | Scope | File ownership |
|---|---|---|
| **ui** | Typography, spacing, readability, visual hierarchy, contrast, CSS polish | `**/*.module.css`, `globals.css`, ascii/visual primitives; Hero/Reel/UseCases **visual** layer only |
| **copy** | Every user-facing string — headlines, body, stats, CTAs, error messages, log event copy | Any `.tsx` containing user-visible text; `useCaseData.ts`, stat captions, labels |
| **bird** | Mascot behavior, scroll physics, wiggle, perch selection, event log quality, input tracking | `src/components/canary-watch/**` and perch wiring in sections |

## Guardrails (all tracks)

- **Taste skill §7**: no Inter font, no pure `#000`, no outer glows, no sperm-like flow fields, no "3 equal cards" row, no "Elevate"/"Seamless"/"Next-Gen" copy, no 50%/99% round stat values.
- **Animation**: `transform` and `opacity` only — never animate `top/left/width/height`.
- **Reel tree**: must NEVER import `framer-motion` (GSAP territory). Nav/Hero/UseCases/Closer use framer.
- **Client boundaries**: interactive sections need `'use client'`. RSC by default otherwise.
- **React 18 ref types**: use `RefObject<T>` (not `RefObject<T | null>`), and `useRef<T>(null)`.
- **Reduced motion**: every motion addition needs a `prefers-reduced-motion: reduce` fallback.
- **No feature creep**: we are polishing, not adding. If you feel the urge to refactor, stop and ask.

## Coordination protocol

1. Before editing, `git pull --rebase origin feat/landing-redesign`
2. Stage + commit per concern — **small focused commits**, conventional message style (`polish(ui): …`, `polish(copy): …`, `polish(bird): …`)
3. Push often. If another track's commit conflicts with yours, rebase — do not force-push over each other.
4. If a change crosses track boundaries (e.g., a copy change requires a CSS tweak to keep layout), flag it in the commit message and, for anything substantive, stop and sync with the leader.
5. Dev server at `localhost:3000` is shared — keep it running in a separate pane; every track's HMR reloads it.

## Quick checks before commit

```bash
npx tsc --noEmit        # must be clean
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/   # 200
# eye-check the home page in the browser
```

## What's already been done (don't redo)

- Full redesign: Nav (full→pill), Hero (asymmetric, LIVE, cursor), Reel (GSAP 3 frames), UseCases (4 tabs), Closer (form), placeholder routes
- Canary-watch meta-system wired end to end; perch chain; scroll stickiness (hysteresis + dwell + idle + wiggle)
- Prod deploy working; `/demo` dashboard preserved via static export rewrite
- Input tracking, attention score, session-log punchline

## Where to look for details

- Track brief: `docs/polish/<ui|copy|bird>.md`
- Dashboard taste reference: `../canary-dashboard/` (the product the landing advertises)
- Tokens of record: `src/app/globals.css`
- Mascot types: `src/components/canary-watch/types.ts`

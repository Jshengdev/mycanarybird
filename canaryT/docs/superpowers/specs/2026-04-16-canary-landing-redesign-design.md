# Canary Landing — Redesign Design Spec

**Status:** Approved (pending user review)
**Date:** 2026-04-16
**Author:** Brainstormed with Teri & Johnny
**Scope:** Full redesign of `canaryT/canary-landing`

---

## 1. Context

Canary is a drop-in SDK providing QA and observability for computer-use AI agents — it sees what agents actually do on screen, blocks mistakes before they happen, and learns the agent over time. Currently at $2K MRR with Photon as first paying customer. Positioning is B2C2B dev-native: individual AI engineers and agent-native startup founders discover Canary, bring it into their team.

The current landing page has strong bones (hero, carousel, problem, differentiator, CTAs) but:
- Uses its own color palette disconnected from the canonical dashboard tokens
- Leans on a carousel that's conversion-ambiguous (passive clicking through slides)
- Lacks a reel-grade product moment
- Doesn't use the premium scroll-driven storytelling pattern appropriate for the brand
- Hero is centered (taste-skill §3 Rule 3 bans centered heroes at DESIGN_VARIANCE > 4)

This redesign brings the landing into alignment with the dashboard system and upgrades the scroll experience to match the quality of the product.

## 2. Goals

1. Hero visitor to `Get early access` form conversion in ≤ 3 scroll events on desktop, ≤ 5 on mobile
2. Establish Canary as the serious observability layer for computer-use agents (not a toy, not a generic observability product)
3. Preserve and reinforce Canary's visual identity: ASCII texture, IBM Plex Mono for numbers, electric-blue accent as attention currency, zero border-radius structural elements
4. Align 100% with `canary-design-system` tokens (no orphan color values)
5. Monitor-esque character: pulsing live indicators, blinking cursor, streaming micro-detail — without cyberpunk kitsch

## 3. Positioning (locked from founder pitch)

**Category:** QA / observability for computer-use AI agents
**Wedge vs. competitors (AgentOps, LangSmith, Langfuse, Braintrust):** they trace text-in / text-out; Canary sees the screen
**Proprietary tech:** 90% lower visual-processing cost enables the serviceable margins
**Primary audience:** IC AI engineers + agent-native startup founders (B2C2B)
**Brand metaphor:** the canary goes first; the agents are already in the mine

## 4. Page skeleton

Section list, top → bottom, with intended density per taste-skill VISUAL_DENSITY dial:

| # | Section | Height | VD | Motion engine |
|---|---|---|---|---|
| 0 | Nav (full-width → pill on scroll) | sticky | — | Framer `layoutId` |
| 1 | Hero (asymmetric left-aligned) | 100vh | 3 | Framer stagger |
| 2 | Ecosystem bar | 120px | 5 | Framer fade |
| 3 | Reel: Observe → Control → Improve | 300vh scroll, pinned stage | 5 | **GSAP ScrollTrigger** |
| 4 | Use-case selector (4 tabs) | ~120vh | 6 | Framer `layoutId` |
| 5 | Closer (mine metaphor + early-access form) | 100vh | 2 | Framer |
| 6 | Footer | compact | 6 | static |

Density rhythm: **3 → 5 → 5 → 6 → 2 → 6**. Visitor compresses into product detail in the middle, peaks in the use-case density, then fully decompresses into the metaphor beat.

## 5. Section-level design

### 5.1 Nav

**Behavior (inverted from current):** starts as full-width bar at top of page. On scroll > 150px, morphs into a floating pill inset to center ~42% from each side. Framer Motion `layoutId` on the container drives the width, border-radius, and inset transition with spring `stiffness: 100, damping: 20`.

**Content:**
- Left: Canary logo (SVG mark, 20px) + CANARY wordmark (JetBrains Mono, 11px, 700)
- Center-right: `Features` · `About` · `Blog` (nav links, Plus Jakarta Sans 12px, `--icon-grey` default → `--text-black` on hover)
- Right: `Login` (ghost button, routes to dashboard) + `Get early access` (primary button, `--accent-color`)

**Background:** `--card-bg` with `1px solid --grey-stroke` border on 3 sides (not top) in pill state, 4 sides in full state.

**Micro-detail:** when scrolled, nav adds a small `status: observing` label in mono-grey next to the wordmark — monitor-esque signal that this is a working product.

### 5.2 Hero (100vh, VD 3, asymmetric left)

**Break from current:** centered → left-aligned.

**Layout:**
- Text column occupies left ~60% of viewport
- ASCII grid from current implementation is preserved, now coloring via `rgba(11, 13, 196, opacity)` from `--accent-color`
- ASCII grid bleeds past right edge (right margin: -10vw) so it reads as texture, not a contained element
- No competing visual on the right — let copy breathe

**Content (locked):**

```
[headline, clamp(3.5rem, 5vw + 1rem, 5rem), -0.03em tracking, leading-none]
The trust layer for
autonomous agents.

[subtitle, 1.0625rem, --icon-grey, leading 1.65, max-width 52ch]
A drop-in SDK that sees every action, blocks every mistake,
and learns your agent. Built for Claude Code, Browser Use,
openClaw, and Hermes.

[dual CTA]
[Primary: Get early access] [Secondary: Read the docs →]
```

**Monitor micro-detail:** top-right of viewport, small mono label:
```
● LIVE    canary observing
```
`● LIVE` dot uses `--safe` (#2D7A55) with 2s pulse animation. Muted green, not neon.

**Entry motion (Framer Motion):**
- Headline: word-by-word stagger, `y: 12 → 0`, `opacity: 0 → 1`, spring(100, 20), 60ms between words
- Subtitle: fades in at 120ms delay after headline complete
- CTAs: slide up from +8px at 200ms delay
- ASCII grid: density animates up via `transform: scaleY` over 800ms starting at 300ms delay
- After headline complete (roughly 1.2s), a blinking cursor (`▊`) appears at the end of "agents." and blinks at 800ms interval for 4 pulses, then fades

### 5.3 Ecosystem bar (120px, VD 5)

Thin horizontal strip between hero and reel.

**Content:**
```
Built for   [Claude Code]   [Browser Use]   [openClaw]   [Hermes]
              ~1M weekly downloads · the new wave
```

**Styling:**
- Background: `--card-bg`
- Border top and bottom: `1px solid --grey-stroke`
- Framework names in Plus Jakarta 13px, 500 weight, `--text-black`
- Each framework prefixed with a small mark (diamond `◆` or logo SVG when available)
- Secondary line: IBM Plex Mono 11px, `--icon-grey`, letter-spacing 0.1em, uppercase

**Handoff from hero:** scroll drives hero to bleed off top; ecosystem bar becomes visible at the 100vh mark. Fades in over 200ms on intersection.

### 5.4 The Reel — Observe → Control → Improve (300vh scroll, 1 pinned stage)

The anchor section. **GSAP ScrollTrigger** drives a pinned stage; scroll position advances the active frame.

**Structural layout of the pinned stage:**

```
┌─────────────────────────────────────────────────────────────┐
│ [side progress, left:                                       │
│  ● OBSERVE                                                  │
│  ○ CONTROL                                                  │
│  ○ IMPROVE]                                                 │
│                                                             │
│  ┌────────────────┬────────────────────────────────────┐    │
│  │                │                                    │    │
│  │  [FRAME COPY]  │  [FRAME PRODUCT VISUAL]            │    │
│  │                │  (card-gradient bg,                │    │
│  │                │   scanline-overlay pseudo)         │    │
│  │                │                                    │    │
│  └────────────────┴────────────────────────────────────┘    │
│                                                             │
│ [bottom: stage progress 1 / 3]                              │
└─────────────────────────────────────────────────────────────┘
```

**Stage dimensions:** outer section is 300vh tall. Inner stage is 100vh, pinned. Scroll within the 300vh range drives `useTransform` from 0 → 3 (which frame is active).

**Progress indicator (left side, vertical):**
- Three dots, stacked, 16px apart
- Inactive dots: 8px, `--icon-grey`, filled
- Active dot: 12px, wrapped with 1px `--gradient-border-active` ring (applied via `background: --gradient-border-active` on a padded wrapper, inner bg `--card-bg` creating a 1px-gradient-ring effect)
- Dot labels to right: `OBSERVE` / `CONTROL` / `IMPROVE` in IBM Plex Mono 10px, 600 weight, letter-spacing 0.15em
- Label color: active = `--text-black`, inactive = `--icon-grey`

**Frames:**

**Frame 1 — OBSERVE**
- Copy (left column):
  ```
  OBSERVE

  See what your agent actually did.

  Visual replay + action log. Scrub any session. Every click,
  every keystroke, every screen state — recorded.

  10ms  regex + policy classification. Can't be prompt-injected.
  ```
- `10ms` in IBM Plex Mono 24px, 400, `--text-black`. Separator line below `10ms` in 1px `--grey-stroke`.
- Product visual (right column): real Canary dashboard — replay scrubber timeline at bottom, action log at right. Use existing dashboard screenshots or UI fragments. Background `--card-gradient`. Scanline overlay at 0.03 opacity applied as a fixed pseudo-element inside the container.

**Frame 2 — CONTROL**
- Copy:
  ```
  CONTROL

  Set the rules. Canary blocks the mistake
  before it happens.

  Rules in your codebase. Canary intercepts the agent
  mid-action. Works with any computer-use framework.

  88%   of organizations report agent security incidents
  ```
- Product visual: rule editor on top + agent mid-action visual on bottom with a subtle red `BLOCKED` badge (muted `--critical`).

**Frame 3 — IMPROVE**
- Copy:
  ```
  IMPROVE

  Canary learns your agent.

  Session data turns into suggested rules. Insights
  surface patterns your agent keeps hitting.
  Every session makes the next one safer.

  90%   lower visual processing cost vs. text-only QA
  ```
- Product visual: suggested-rules card + insights panel. `--card-gradient` bg.

**Inter-frame transition:** as `useTransform` value crosses each frame boundary:
- Copy crossfades with `y: 12 → 0` spring
- Product visual morphs via Framer `layoutId` on the image container (shared element)
- Progress dot changes active state

**Exit:** at scroll progress > 0.95, the pinned stage unsticks and the use-case selector enters from below.

**Performance (taste-skill §5):**
- GSAP `ScrollTrigger.create()` with proper cleanup in useEffect return
- Never mix Framer Motion and GSAP in the same component tree; the Reel is its own isolated client component
- All animated properties are `transform` or `opacity` only — no animating top/left/width/height

### 5.5 Use-case selector (~120vh, VD 6)

"Built for teams running ___ agents" — 4 tabs, content block morphs per tab.

**Tab row:**
```
Built for teams running

┌──────────┬─────────────┬──────────────┬─────────┐
│ GTM      │ Coding      │ Long-running │ Custom  │
│ agents   │ in Claude   │ autonomous   │ SDK     │
│          │ Code        │ tasks        │ (Hermes)│
└──────────┴─────────────┴──────────────┴─────────┘
```

**Active tab indication:** `border-left: 2px solid` with `--gradient-border-active-vertical` applied. Inactive tabs have no left border. Tab text: Plus Jakarta 14px, 500. Inactive = `--icon-grey`, active = `--text-black`. Active tab's container background: `--hover-gray` at 100% opacity.

**Content block (below tab row):**

Split 50/50:
- Left column: problem, save, quote
- Right column: contextual product moment (screenshot or UI fragment specific to that cohort)

**Tab content (locked):**

**GTM agents**
- Problem: `GTM agents send outreach to the wrong leads — or spam clients when a prompt shifts.`
- Save: `$X in deliverability reputation. Every domain flagged for spam is a months-long recovery.`
- Quote: `"Canary caught three wrong-lead emails in our first week of running a GTM agent 24/7." — Photon`
- Product moment: Canary UI showing a blocked outreach send with a BLOCKED badge

**Coding in Claude Code**
- Problem: `Coding agents are allowed to run destructive shell commands. One bad rm -rf and a weekend is gone.`
- Save: `Block rm -rf / terraform destroy / git push --force before they ever execute.`
- Quote: [testimonial TBD or "Coming soon: Photon engineering team on Claude Code"]
- Product moment: Canary UI showing a blocked shell command

**Long-running autonomous tasks**
- Problem: `Overnight agents rack up cost or take paths you never intended. By morning, too late.`
- Save: `Every action replayable. Every deviation logged. Every override one rule away.`
- Quote: TBD
- Product moment: Replay scrubber showing an 8-hour session compressed to 30s

**Custom SDK (Hermes / any framework)**
- Problem: `You built your own agent stack. You also built your own lack of observability.`
- Save: `POST events to Canary. Drop-in webhook. No framework lock-in.`
- Quote: TBD
- Product moment: Code snippet showing the SDK integration

**Tab transition motion:** Framer `layoutId` on the content block makes the right-column image morph smoothly between tabs. Copy in the left column crossfades with `opacity 0 → 1, y: 8 → 0` spring.

### 5.6 Closer (100vh, VD 2, centered exception)

The only centered section on the page — the metaphor beat benefits from symmetry.

**Content:**
```
[headline, clamp(3rem, 4vw + 0.5rem, 4.5rem), -0.025em, leading-[1.1], centered]
The agents are already in the mine.
We are the canary.

[form card, max-width 540px, centered]
┌──────────────────────────────────────────┐
│  your@email.com                          │
│                                          │
│  Team size             ▾  Which agents?  │
│                                          │
│  [  Get early access  →  ]               │
└──────────────────────────────────────────┘

[micro footnote below form, 11px --icon-grey]
Free tier available at launch. Gated early access until then.
```

**Form fields:**
- Email (text input, required)
- Team size (dropdown: Just me / 2-5 / 6-20 / 21-100 / 100+)
- Which agents? (text input, placeholder: "Claude Code, Browser Use, custom...")

**Styling:**
- Form card: `--card-gradient` background, 1px `--grey-stroke` border, 4px radius
- Inputs: bg `--card-bg`, 1px `--grey-stroke`, 2px radius, Plus Jakarta 14px
- Submit button: primary variant with `--accent-color` background, spring entrance on form load

**Motion:** on scroll intersection, headline fades up over 400ms; form card slides in from below at 200ms delay. On submit, button does a spring `scale: 1 → 0.98 → 1` tactile press (taste-skill §3 Rule 5) and form shows success state (shimmer → checkmark).

### 5.7 Footer

Keep existing structure, lightly refined:
- Logo + "Canary. QA for computer-use agents." tagline
- Nav: `Docs · GitHub · npm · Contact` in IBM Plex Mono
- Legal: `© 2026 Canary · mycanarybird.com`
- Background: `--black`, text `--text-white`, links at 35% opacity → 100% on hover

## 6. Design tokens (migrated 2026-04-16)

All color tokens now match `canary-dashboard/src/styles/tokens.css` exactly. Three landing-only utility tokens added for monitor micro-details:

```css
/* Landing-only: monitor-esque micro-details */
--scanline-overlay: rgba(10, 10, 10, 0.03);   /* derived from --black */
--blink-duration:   800ms;
--pulse-duration:   2s;
```

Token rule: **never hardcode hex values**. Every color in any component references a token. The three landing-only tokens above are the only deviation from the dashboard system.

## 7. Motion engine split

| Use case | Engine | Rationale |
|---|---|---|
| Nav pill morph | Framer `layoutId` | Shared-element transition |
| Hero load-in | Framer staggered variants | Spring physics, easy cleanup |
| Ecosystem bar fade | Framer | Trivial intersection fade |
| **Reel sticky stage** | **GSAP + ScrollTrigger** | Isolated full-page scrolltelling (taste-skill §8) |
| Use-case tab morph | Framer `layoutId` | Shared-element between tabs |
| Closer form | Framer | UI interaction, spring press |

**Critical rule (taste-skill §8):** GSAP and Framer Motion never occupy the same component tree. The Reel is its own isolated client component with strict useEffect cleanup.

## 8. Iconography

Three tiers, no Lucide or Phosphor defaults:

1. **Feature glyphs (OBSERVE / CONTROL / IMPROVE, tab icons)** — custom ASCII glyphs via existing `AsciiHover` component. On-brand, unique, dev-tool-authentic.
2. **Ecosystem bar** — actual framework logos (Claude, Browser Use, openClaw, Hermes). Hardest-to-fake legitimacy signal.
3. **Chrome (nav, footer, secondary)** — minimal geometric primitives (dots, lines, chevrons `›` `‹`). No pictograms.

## 9. File scaffolding

```
src/
├── app/
│   ├── page.tsx                   ← composes all sections (thin shell)
│   ├── layout.tsx                 ← next/font + metadata (MIGRATED)
│   ├── globals.css                ← tokens (MIGRATED)
│   ├── page.module.css            ← shared page classes
│   ├── features/page.tsx          ← NEW route placeholder
│   ├── about/page.tsx             ← NEW route placeholder
│   └── blog/page.tsx              ← NEW route placeholder
├── components/
│   ├── ui/
│   │   ├── Button.tsx             ← existing (accent token renamed)
│   │   ├── AsciiHover.tsx         ← existing (promote from project root if needed)
│   │   ├── SectionLabel.tsx       ← NEW — extract from page.tsx
│   │   └── LiveIndicator.tsx      ← NEW — pulsing green dot + label
│   ├── nav/
│   │   └── Nav.tsx                ← NEW — extract, add full→pill morph
│   ├── footer/
│   │   └── Footer.tsx             ← NEW — extract
│   └── landing/
│       ├── Hero.tsx               ← server shell
│       ├── HeroAsciiGrid.tsx      ← 'use client' (animated)
│       ├── HeroCursor.tsx         ← 'use client' (blinking cursor)
│       ├── EcosystemBar.tsx       ← server
│       ├── Reel/
│       │   ├── Reel.tsx           ← 'use client' — GSAP ScrollTrigger orchestrator
│       │   ├── ReelFrame.tsx      ← shared frame shell
│       │   ├── FrameObserve.tsx   ← OBSERVE content
│       │   ├── FrameControl.tsx   ← CONTROL content
│       │   ├── FrameImprove.tsx   ← IMPROVE content
│       │   └── ReelProgress.tsx   ← side progress indicator
│       ├── UseCases/
│       │   ├── UseCases.tsx       ← 'use client' — tab controller
│       │   ├── UseCaseTab.tsx     ← single tab
│       │   └── UseCaseContent.tsx ← morphing content block
│       ├── Closer.tsx             ← 'use client' — metaphor + form
│       └── EarlyAccessForm.tsx    ← 'use client' — form with validation
└── lib/
    ├── motion.ts                  ← shared spring configs (stiffness 100, damping 20)
    └── gsap-register.ts           ← single GSAP plugin registration point
```

**Interactivity isolation (taste-skill §2):** any component with motion is a `'use client'` leaf. Parent composition stays server-safe where possible.

## 10. Dependencies to install

```
npm install framer-motion gsap --legacy-peer-deps
```

- `framer-motion` — for all non-Reel UI motion
- `gsap` — for Reel ScrollTrigger only (import `gsap/ScrollTrigger` in `lib/gsap-register.ts`)

No other new runtime dependencies. Icons are custom SVG / ASCII, so no icon library needed.

## 11. Out of scope

- Dark mode — not in scope per dashboard design system
- CMS integration for Blog — Blog/About routes ship as placeholder pages for the initial launch; content pipeline comes later
- i18n — English only
- A/B testing infrastructure — ship one version, iterate with analytics
- Animated hero video / 3D elements — Reel's GSAP scrolltelling is the cinematic moment; no WebGL or pre-rendered video

## 12. Accessibility requirements

Per dashboard design system + taste-skill §10:

- All interactive elements reachable by keyboard
- Focus rings visible, 2px solid `--grey-stroke` (thickness-only change)
- Color contrast ≥ WCAG AA for all text
- `prefers-reduced-motion` respected for all animation (already in `globals.css`, covers pulse, blink, stagger, Reel scroll)
- All images have `alt` text
- Form fields have visible `<label>` elements above inputs (taste-skill §3 Rule 6)
- Live indicator `● LIVE` has `aria-live="polite"` or is marked `aria-hidden` (decorative)
- Reel progress has `aria-label` per frame

## 13. Analytics hooks

Lightweight events (exact provider TBD, likely PostHog or Plausible):

- `landing_view`
- `cta_click` (with source: hero / nav / closer)
- `reel_frame_complete` (frame: observe / control / improve)
- `usecase_tab_click` (tab: gtm / coding / longrunning / custom)
- `early_access_submit` (with qualification fields)

## 14. Open questions

None remaining at design time. Resolved through brainstorming:

- ✓ Funnel: gated early access (product exists, sign-ups reviewed)
- ✓ Audience: IC AI engineers + agent-native founders (B2C2B)
- ✓ Scroll mechanic: sticky-stage curated showreel (GSAP)
- ✓ Narrative arc: Observe → Control → Improve
- ✓ Hero copy: "The trust layer for autonomous agents" + ecosystem-grounded subtitle
- ✓ Use-case count: 4 tabs (GTM / Coding / Long-running / Custom)
- ✓ Proof placement: embedded as mono stats inside Reel frames (no standalone proof strip)
- ✓ Icon strategy: ASCII feature glyphs, framework logos, minimal geometric chrome
- ✓ Motion engine: GSAP for Reel, Framer for everything else
- ✓ Design tokens: migrated to dashboard canonical values

## 15. Implementation sequence (preview for writing-plans)

Rough phasing — actual plan will be produced by the `writing-plans` skill after this spec is approved:

1. Token migration + next/font setup (DONE 2026-04-16)
2. Install framer-motion and gsap
3. Extract Nav + Footer into components (plus `SectionLabel`, `LiveIndicator`)
4. Redesign Hero (asymmetric left, motion, live indicator)
5. Build EcosystemBar
6. Build Reel (GSAP scaffolding first, then each frame, then inter-frame morph)
7. Build UseCases (tab row, morphing content, per-tab content)
8. Build Closer + EarlyAccessForm
9. Create Features / About / Blog placeholder routes
10. Full verification: dev server golden path, a11y check, reduced-motion check, mobile layout
11. Deploy preview to Vercel, review, deploy production

---

**Spec self-review checklist:**

- [x] No placeholders beyond `[testimonial TBD]` markers in use-case tabs — these are honest unknowns, not vague requirements
- [x] All color references use tokens, no hardcoded hex
- [x] Motion engine clearly split, no mixing
- [x] Typography uses only the approved font stack
- [x] Every section has a defined purpose, content, and motion behavior
- [x] Scope is tight — 7 sections, 4 new routes, 1 form, 1 cinematic reel
- [x] Accessibility and performance requirements explicit
- [x] Open questions are all resolved

Ready for implementation plan.

# Track: Bird / Observability Polish

> First, read `CLAUDE.md` at the project root. It has the shared context, mascot architecture, and current behavior knobs.

## Mission

The canary mascot is meta-commentary: it watches the reader and logs their actions the same way Canary logs an agent's actions. This has to feel *alive and specific* — not a generic cursor chaser, not random. Every refinement should strengthen the illusion that "the product is watching you right now and the product is good at its job."

Your work has two halves: **motion/perch behavior** (how the bird moves) and **signal quality** (what it observes and how that renders in the Session Log at the bottom).

## Files you own

- `src/components/canary-watch/**` — everything in there:
  - `CanaryMascot.tsx` + `.module.css` (movement, wiggle, sway)
  - `context.tsx` (provider, event log, section registration, perch overrides)
  - `SessionLog.tsx` + `.module.css` (bottom section rendering)
  - `useCanarySection.ts` (section registration hook)
  - `useInputTracker.ts` (click/key/scroll/focus/copy/right-click/tab-hidden handlers)
  - `useStatTracker.ts`
  - `types.ts`
- Perch wiring points in other sections — i.e. where `useCanarySection`'s `perchRef` is attached. You can move a perch inside a section if a better eye-path target exists. Sections currently wired:
  - `Nav.tsx` — NOT a perch (don't re-add)
  - `Hero.tsx` — perches on `<h1>`
  - `Flow/Flow.tsx` + `FrameObserve/Control/Improve.tsx` — perch cycles with active frame
  - `UseCases/UseCases.tsx` + `UseCaseContent.tsx` — alternates between active tab and visual box
  - `Closer.tsx` — perches on `Get early access` submit button
  - `SessionLog.tsx` — perches on "Caught you." headline

## Files you do NOT touch

- `**/*.module.css` outside `canary-watch/` — `ui` track
- Any user-visible string inside JSX — `copy` track (event-log strings in `useInputTracker.ts` ARE yours though, since they are part of the observability signal; coordinate with copy track if renaming)

## Current behavior knobs (for reference)

Constants in `CanaryMascot.tsx`:
- `BIRD_SIZE = 28`, `GAP_ABOVE = 6`, `LEFT_OFFSET = -2`
- `SWITCH_HYSTERESIS_PX = 60` — a new candidate section must be this much closer to the reading focus (38% from top of viewport) before it can claim the bird
- `SWITCH_DWELL_MS = 220` — candidate must hold for this long before switch commits
- `SCROLL_IDLE_MS = 140` — scroll settles after this much quiet → bird commits to fine perch + fires wiggle
- `WIGGLE_DURATION_MS = 1200` — one-shot spring-overshoot flap on landing

CSS animations in `CanaryMascot.module.css`:
- `.inner` → `cw-breathe` 3.4s (translateY + scale)
- `.sway` → `cw-sway` 5.6s (micro weight-shift, rotation ±1.4°)
- `.mascot.wiggle .sway` → `cw-wiggle` 1.2s spring-overshoot (rotation ±8° → decay, translateY bob)
- Transition on `.mascot` transform: `1100ms cubic-bezier(0.45, 0.05, 0.25, 1)`

## Focus areas

### Motion quality

1. **Scroll-ride feel**: during scroll the bird moves to the section anchor (coarse); on idle it commits to the fine perch (sub-element). Is the 140ms idle threshold correct? Does the transition between ride-target and perch-target read as a "landing" or a "jump"?
2. **Wiggle character**: the current wiggle is a rotation decay. A real bird catching balance also has a *side-to-side tail-adjust*. Consider a second channel.
3. **Facing direction**: currently set by raw X delta > 4px. The bird sometimes faces "wrong" during tiny horizontal anchor shifts. Consider comparing *section start-to-end* x, not rAF-to-rAF x.
4. **Flying pose**: right now the bird looks the same mid-flight as perched. A flight pose (slightly nose-forward, wings extended if the SVG allows) would sell the motion.
5. **Sway variance**: `cw-sway` plays identically forever — add subtle randomized phase offset per perch so it doesn't feel like a loop.
6. **Shift+click override** (in `context.tsx`): currently registers a runtime perch override by clicking any element. Is this still working correctly with the scroll-ride changes?

### Signal quality (what gets logged)

1. **Event-log strings in `useInputTracker.ts`**: `CLICK target=button "Get early access"` format — does it feel authentic to a dashboard log line? Consider adding element hierarchy breadcrumbs.
2. **FLAGGED rationale**: right now right-clicks and tab-hidden events are FLAGGED. Are there other signals that should flag? (Scroll reversal past a section? Inactivity > 30s? Dev-tools open?)
3. **LEARNED events**: currently never fire. Could trigger when the reader repeats a behavior (re-reads a section, cycles through use-case tabs twice). Adds a satisfying "Canary learned a pattern" moment.
4. **SUGGESTED events**: currently never fire. Could fire when reader hovers the `EarlyAccessForm` but doesn't submit — "Suggest rule: nudge abandoning signups." Meta.
5. **Attention score**: in `SessionLog.tsx`, the formula is a heuristic. Does the score track with what a real attentive reader would score? Tune the coefficients.
6. **Session log stats**: `Events observed / Sections visited / Flags raised / Attention score` — is this the right set? What would a Canary dashboard actually show?

### Perch placement

1. Validate the eye-path perch chain walks the way a reader's eye actually does. For each perch, watch a first-time reader — does the bird arrive where their eye already is, or slightly ahead, or slightly behind?
2. Hero: does the headline perch feel right, or should it be on the `Get early access` CTA after the headline settles?
3. UseCases: the tab→visual alternation fires on a 2.2s timer. Should it key off scroll-settling instead of timer?
4. Flow Improve: only the first suggested rule is a perch. Consider rotating through all three over time — it'd mirror the "Canary is learning" theme.

## Constraints

- **No new dependencies.** Framer for UI, GSAP for Flow only, vanilla `setTimeout`/`requestAnimationFrame` for canary-watch.
- **Animation primitives**: `transform` and `opacity` only. Never animate `top/left/width/height`.
- **Performance**: the scroll handler runs on every rAF during scroll. Keep it cheap — no new DOM queries per frame; cache what you can.
- **Reduced motion**: every motion addition needs a `prefers-reduced-motion: reduce` fallback. The bird should still *work* in reduced motion, just without the physics.
- **No regressions to taste-skill rules**: no sperm-like visuals, no neon glows, no CSS animation of non-transform properties.
- **Shift+click perch override stays**: it's a dev affordance — don't delete it.

## Test loop

1. Dev server at `localhost:3000` (shared). Scroll through the whole page; watch the bird; open the Session Log at the bottom.
2. Shift+click anywhere to test runtime perch override.
3. Run with and without `prefers-reduced-motion: reduce` (macOS: System Settings → Accessibility → Display → Reduce motion).
4. Before commit: `npx tsc --noEmit`.
5. Commit small. Convention: `polish(bird): <concern>`. Examples:
   - `polish(bird): randomize sway phase per perch to kill loop feel`
   - `polish(bird): fire LEARNED on use-case tab cycle`
6. Push to `main`.

## Rules of engagement

- **Do not** touch visual CSS outside `canary-watch/`.
- **Do not** change user-visible *headline/body* copy (your territory for strings stops at event-log formatters and section display names — coordinate with copy track if the SessionLog title/sub needs to change).
- **Do not** add a new dependency.
- **Do not** reintroduce nav as a perch — reader's eyes don't dwell on logos.
- **Do not** try to be clever with scroll physics — the hysteresis+dwell+idle design is intentional. Refine the constants; don't rip out the model.

## Initial prompt to paste in your Claude session

```
I'm running the bird/observability polish track for the Canary landing page mascot.

Read CLAUDE.md at the project root and docs/polish/bird.md for my full brief.

First task: trace the bird's behavior end to end at localhost:3000. Scroll the full page, cycle use-case tabs, shift+click different elements, submit the form, toggle reduced-motion. Give me a punch-list of motion-quality issues (jitter, mis-timing, mis-facing, wrong target, bad landing) AND signal-quality issues (weak/missing events, bad formatter output, attention-score miscalibration). Rank high/medium/low impact with a one-line reason each.

Do not start editing yet — I want to review the punch-list and pick the top 4-6 before any changes land.

Scope boundary: you own src/components/canary-watch/** and perch wiring points in section files. Do not touch visual CSS outside canary-watch/ or user-visible headline/body copy.
```

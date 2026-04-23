# Canary Scroll Flight — Design Spec

**Date:** 2026-04-16
**Scope:** `canaryT/canary-landing/` (the marketing landing page)
**Owner track:** `bird` (per `docs/polish/bird.md`)
**Status:** approved design; implementation plan pending

---

## 1. Intent

The Canary bird mascot is the product's silent narrator. Its motion across the page should feel like **one continuous animation** — a single guided flight from the top of the page to the bottom, where every perch and every transition communicates one specific message about the product. No idle drift, no decorative hops.

The reader's eye is led by the bird. The bird tells the pitch without copy having to do it.

This spec replaces the current "scroll-driven perch with install cinematic" behavior with a unified model: full-screen sections, a per-screen eye-track of focus points, and a single easing curve shared by every transition so the whole page reads as one motion piece.

## 2. The two problems this fixes

1. **Perch-to-perch stickiness.** Today the bird commits to the first perch after the install cinematic and then stops re-evaluating as the reader scrolls further. The reader sees a bird floating motionless in viewport-space while the page moves under it. Cause: Flow registers as one canary-watch section with an internal `activeIndex` state loop that fights the global active-section machinery, and the install cinematic leaves `birdHeldPos` state in a way that inhibits recovery.
2. **No UX purpose in the movement.** The bird currently perches in ways that feel arbitrary to the reader (mid-section, on elements with no narrative weight). There is no deliberate eye-path inside each screen.

## 3. Design principles

- **One continuous animation.** Every transition uses the same easing — `cubic-bezier(0.45, 0, 0.25, 1)` over 820 ms — so the whole site reads as one directed motion piece.
- **Every move says something.** Each perch and each transition maps to a specific product message. If a stop does not communicate, it does not exist.
- **One screen = one idea.** Each major feature is rendered at full viewport height (~`100vh`). The reader settles on one idea at a time. Spacing is solved by structure, not by bumping margins.
- **The bird is the eye-tracker.** Within each screen the bird walks 1–3 focus points in reading order, drawing a bounding box around each. The reader's eye follows.
- **No idle drift.** If the reader is not near a threshold, the bird stays on its current focus point. It does not wander to fill time.
- **Decorative, non-interactive.** The bird is never draggable or clickable. Drag-and-drop is a metaphor we SHOW, not a chore we ask of the reader.

## 4. Scene model

The whole page becomes one uniform perch list. Flow stops owning its own active-index logic; its four steps register independently with `useCanarySection`.

| Order | Section id | Screen height | Perch / focus points | Drop key |
|---|---|---|---|---|
| 1 | `hero` | existing | Headline → LIVE badge → blinking cursor | — |
| 2 | `ecosystem` | existing | Brand row | — |
| 3 | `flow-install` | `min-height: 100vh` | `npm install` line → `~5 min` stat | `install` |
| 4 | `flow-see` | `min-height: 100vh` | Session timestamp → `30s` stat → scrub cursor | `see` |
| 5 | `flow-stop` | `min-height: 100vh` | `● BLOCKED · OUTREACH SEND` stripe → `13/13` stat | `stop` |
| 6 | `flow-learn` | `min-height: 100vh` | Suggested rule card → Add rule → button | `learn` |
| 7 | `usecases` | existing | Active tab → that tab's visual | — |
| 8 | `closer` | existing | Headline → Get early access → button | — |
| 9 | `sessionlog` | existing | "Caught you." headline | — |

## 5. Per-screen eye-track

Every section component defines an **ordered list of focus points** — DOM refs for the bird to perch on in sequence.

When a section becomes the active section (via the existing threshold + hysteresis + scroll-idle commit logic), the bird:

1. Commits to that section's first focus point.
2. Draws a bounding box around it (the existing `.cw-perched` dashed outline, polished: 1 px dashed, `var(--accent-color)`, 4 px offset). Optional small `OBSERVING` micro-label above the box.
3. After a 1.6 s dwell, takes off and glides to the section's second focus point. Previous box fades out (200 ms); new box fades in as the bird lands.
4. Repeats through the focus-point list. After the last one, the bird stays there until the reader scrolls the next section past the threshold.

Per-focus-point dwell is 1.6 s; the transition between focus points reuses the shared 820 ms easing curve. These values are shared across every screen — that uniformity is what sells "one animation."

## 6. The transition between screens

The transition between one screen and the next IS the animation. It has exactly three beats:

1. Current focus point's bounding box fades out (200 ms).
2. Bird glides along the shared easing curve — `820 ms · cubic-bezier(0.45, 0, 0.25, 1)` — to the first focus point of the next screen.
3. Lands, draws first bounding box. Eye-track sequence begins on the new screen.

No special-case easing between sections. No double-speed hops. Every transition uses the same curve, which is what makes the whole page feel like one motion piece.

## 7. Scripted beats

There are exactly two scripted moments. Everything else is scroll-driven.

### 7.1 Cursor drop at Install

Fires once per page load, when the reader first scrolls past the threshold into `flow-install`. Flow:

1. A phantom cursor SVG materializes near the bird's current perch (Hero or Ecosystem) with a pop-in / overshoot easing.
2. Cursor "grabs" the bird — bird enters the `.held` dangle animation; both lift 42 px together (420 ms).
3. Cursor + bird glide as one unit along the shared easing curve into the Install cage. Cursor stays glued to the bird throughout (CSS transition on cursor matches the mascot's exactly).
4. Bird lands inside the Install cage (top-right corner, `x = rect.right − BIRD_SIZE − 12`, `y = rect.top + 12`). Cursor releases and fades out.
5. The existing `DROP_CASCADES.install` log cascade fires: OBSERVED · LEARNED · SUGGESTED.
6. From this point forward, the bird is under scroll-driven perch control — the cinematic does not return.

The cinematic is the only place drag-and-drop is SHOWN, not asked of the reader.

### 7.2 Release at Learn

Fires once, when `activeSectionId` becomes `flow-learn`. Flow:

1. Previous step's `.cw-caged` outline fades out (200 ms).
2. Bird plays a one-shot "break out" beat: small upward arc (−18 px) combined with the existing 1.2 s wiggle animation.
3. One log line emits: `OBSERVED · Canary · released · free to perch`.
4. Bird commits to Learn's first focus point (the suggested-rule card) using the default above-perch math — no cage, no dashed cage outline. Bird is visibly free for the rest of the page.

The release is the product's handoff moment: Canary stops being invisible infrastructure (Install/See/Stop) and becomes something the reader accepts a suggestion from. The cage metaphor breaks on purpose.

## 8. The cage

The cage is 100% a positioning mode + a CSS class on the step's `.visualFrame`. No new artwork, no portal, no DOM container swap.

**Default perch math** (everywhere outside Flow Install/See/Stop): bird sits *above* the perch element — `y = rect.top − BIRD_SIZE − GAP_ABOVE`.

**Caged perch math** (Flow Install/See/Stop only): bird sits *inside* the perch element — `y = rect.top + 12`, `x = rect.right − BIRD_SIZE − 12`. The perch element in these three screens is the `.visualFrame` itself (via the existing `data-canary-drop` attribute), not an inner sub-element.

While a caged perch is occupied the frame carries a `.cw-caged` class: same dashed outline as the existing `.cw-drop-target` but steady (no pulse). Reads as locked-in without being noisy.

The bounding box for the bird's *current focus point* (a sub-element inside the cage, e.g. the `npm install` line) is drawn independently with `.cw-perched` — so the reader sees both the cage boundary and the narrower box on the element the bird is currently observing.

**Once-released-never-caged.** After the release-at-Learn beat (§7.2) the bird stays out of the cage for the rest of the session, even if the reader scrolls back up to Install/See/Stop. A single `wasReleasedRef` flag gates the caged perch math — if true, Install/See/Stop use the default above-perch math and the `.cw-caged` class is not applied. This preserves the narrative that the bird's release at Learn is permanent.

Turning the cage off is removing the `.cw-caged` class and reverting to the default perch math — the system has no other coupling.

## 9. BLOCKED wiggle on Stop

The bird must be inside the Stop cage when the existing `alertKey` BLOCKED event fires, so that the wiggle reads as "the bird just caught one" with the cage framing. No new mechanism — the existing `alertKey` → wiggle hook already does this. We only need to verify the Stop cage is an active perch before the event triggers.

## 10. What changes, file by file

- `src/components/landing/Flow/Flow.tsx` — remove `activeIndex` state, the perchRef-switching `useEffect`, and the `onStepActivate` plumbing. Register Flow itself as a layout-only wrapper (no `useCanarySection`).
- `src/components/landing/Flow/FlowStep.tsx` — each step calls `useCanarySection({ id: 'flow-<dropKey>', order, displayName })` and binds its perch ref to the `.visualFrame`. Section height is `min-height: 100vh`. The `useInView`-driven `onActivate` callback is removed.
- `src/components/landing/Flow/Flow.module.css` / `FlowStep.module.css` — increase vertical spacing between steps; add `min-height: 100vh` and vertical centering to each step wrapper.
- `src/components/canary-watch/CanaryMascot.tsx` — extend the perch math to switch to caged-mode when the perch element has a `data-canary-drop` attribute. Add release-at-Learn effect (watches `activeSectionId === 'flow-learn'` and plays the break-out beat once). Add per-section eye-track driver that cycles focus points.
- `src/components/canary-watch/CanaryMascot.module.css` — add `.cw-caged` class; polish `.cw-perched` outline (ensure 1 px dashed, 4 px offset, `var(--accent-color)`); add optional micro-label.
- `src/components/canary-watch/types.ts` — extend `CanarySectionRegistration` with an optional `focusPoints: HTMLElement[]` field (ordered list).
- `src/components/canary-watch/context.tsx` — propagate `focusPoints` through registration; expose a `setActiveFocusIndex(sectionId, idx)` or similar for the eye-track driver.
- `src/components/landing/Hero.tsx`, `UseCases.tsx`, `Closer.tsx`, `SessionLog.tsx` — each declares its focus-point refs and passes them to `useCanarySection`.

## 11. What stays untouched

- Section-switch logic: `SWITCH_HYSTERESIS_PX`, `SCROLL_IDLE_MS`, the scroll-idle commit — all reused unchanged.
- The cursor drop cinematic — kept exactly as it works today, just re-triggered when `flow-install` becomes the active section (not on a separate IntersectionObserver).
- The `.cw-drop-target` class used during the cinematic itself — reused for the landing-pulse beat.
- The BLOCKED → `alertKey` → wiggle hook.
- The `prefers-reduced-motion: reduce` fallbacks — all additions need matching reduced-motion behavior (typically: snap to the final focus point with no transition).

## 12. Accessibility

- Every animation addition requires a `prefers-reduced-motion: reduce` fallback. In reduced-motion mode the bird snaps to focus points without transitions, eye-track dwell is cut to zero (bird sits on the first focus point of each section only), and the cursor drop is skipped entirely.
- Bounding boxes are decorative (`aria-hidden="true"`); they are never a screen-reader stop.
- The bird itself stays `aria-hidden="true"` as it is today.

## 13. Success criteria

1. **Stickiness is gone.** Scrolling from top to bottom shows the bird committing cleanly to each section's first focus point at threshold, riding that perch as the page scrolls, and hopping to the next at the next threshold.
2. **The four Flow screens each dominate the viewport.** Reader cannot scroll one step without settling on the previous first.
3. **Every transition uses the same easing.** Inspecting the DOM shows identical `transition: transform 820ms cubic-bezier(0.45, 0, 0.25, 1)` on every bird move.
4. **Eye-track sequence runs on each screen.** A user parked on any section sees the bird hop between 1–3 focus points, drawing a bounding box on each, in order.
5. **Install cinematic plays once, on first pass.** Scrolling back up and down again does not replay it.
6. **Release at Learn plays once, and only once.** After release the bird is free for the rest of the page — scrolling back up to Install/See/Stop does not re-cage it.
7. **Reduced-motion users see the bird at each section's first focus point, with no animation.**

## 14. Explicit non-goals

- No change to the underlying canary-watch context API beyond adding `focusPoints`.
- No change to SessionLog, Nav, Hero, EcosystemBar, UseCases, Closer, Footer layout or copy.
- No change to the SVG artwork of the mascot.
- No drag-and-drop interactivity for the reader (the bird is decorative).
- No new routes, no new providers, no new global state.
- No structural rewrite of Flow.tsx beyond removing the `activeIndex` loop.

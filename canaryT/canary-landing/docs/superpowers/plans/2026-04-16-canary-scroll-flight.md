# Canary Scroll Flight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Canary bird mascot's motion as one continuous scroll-driven flight with per-screen eye-track, full-height Flow steps, caged install/see/stop panels, an explicit release at Learn, and polished bounding boxes — fixing the post-cinematic "sticky" bug at its architectural root.

**Architecture:** Flow's four steps each register as independent canary-watch sections (Install/See/Stop/Learn), so the existing global section-switch logic (threshold + hysteresis + scroll-idle commit + rAF glue-to-perch) handles Flow just like Hero/UseCases/Closer — no more Flow-local `activeIndex` loop fighting the global store. The mascot gains a per-section eye-track driver that cycles 1–3 focus points per screen, a caged positioning mode for Install/See/Stop, and a once-released-never-caged release beat at Learn. Every transition uses one shared easing curve so the whole flight reads as one motion piece.

**Tech Stack:** Next.js 16 App Router · React 18 · TypeScript · CSS Modules · Framer Motion (already in use) · no new deps.

**Repo root for all paths:** `canaryT/canary-landing/`

---

## Root-cause summary (this is what we're fixing)

The spec at `docs/superpowers/specs/2026-04-16-canary-scroll-flight-design.md` documents the full design. Two root causes this plan targets:

1. **Flow registers as one `canary-watch` section (`id: 'flow'`) with an internal `activeIndex` state that swaps the perch ref on `useInView` changes.** This bypasses the global `activeSectionId` / `SWITCH_HYSTERESIS_PX` / `SCROLL_IDLE_MS` commit logic that makes the bird feel deliberate everywhere else. Symptom: once the bird commits to a Flow step, it does not re-evaluate which step is closest as the reader keeps scrolling.
2. **The install cinematic uses a separate `IntersectionObserver` keyed on `[data-canary-drop="install"]`, and holds `birdHeldPos` for `INSTALLED_HOLD_MS = 3400` ms before releasing.** During that window and immediately after, the regular scroll handler calls `recalcPosition` but short-circuits on `birdHeldPos`. Combined with (1), the reader sees the bird floating frozen in viewport-space while the page moves under it.

The fix: fold install into the same section model as everything else, drive the cinematic off `activeSectionId === 'flow-install'`, and make Flow's four steps each be their own section.

---

## Testing philosophy for this plan

There is no unit-test framework in `canary-landing` (package.json has only `dev`, `build`, `lint`). Verification for each task is:

- **Typecheck:** `cd canaryT/canary-landing && npx tsc --noEmit` must be clean.
- **Build compile:** `cd canaryT/canary-landing && npm run build` must succeed (runs for later tasks only — fine to defer until a checkpoint).
- **Manual browser check:** `cd canaryT/canary-landing && npm run dev` — eyeball on `http://localhost:3000` for the specific behavior each task targets.
- **Lint:** `cd canaryT/canary-landing && npm run lint` at the end.

Every task ends with a verification step + a commit. Commits are focused per the project's `polish(bird): ...` convention from `CLAUDE.md`.

---

## File structure — what this plan touches

**Modified:**

- `src/components/canary-watch/types.ts` — add `focusPoints` field.
- `src/components/canary-watch/context.tsx` — propagate `focusPoints` through registration (no behavioral change; consumer-level).
- `src/components/canary-watch/useCanarySection.ts` — accept & forward `focusPoints` ref setter factory.
- `src/components/canary-watch/CanaryMascot.tsx` — caged perch math, release-at-Learn, eye-track driver, rewired cinematic trigger.
- `src/components/canary-watch/CanaryMascot.module.css` — `.cw-caged`, polished `.cw-perched`, eye-track transitions.
- `src/components/landing/Flow/Flow.tsx` — remove `activeIndex` + perchRef-switching useEffect + `onStepActivate`.
- `src/components/landing/Flow/FlowStep.tsx` — each step calls `useCanarySection`, binds perch to `.visualFrame`, declares `focusPoints`.
- `src/components/landing/Flow/FlowStep.module.css` — `min-height: 100vh` per step, vertical centering, increased gap.
- `src/components/landing/Flow/visuals/InstallVisual.tsx` — expose focus-point refs.
- `src/components/landing/Flow/visuals/SeeVisual.tsx` — expose focus-point refs.
- `src/components/landing/Flow/visuals/StopVisual.tsx` — expose focus-point refs.
- `src/components/landing/Flow/visuals/LearnVisual.tsx` — expose focus-point refs.
- `src/components/landing/Hero.tsx` — declare focus-point refs (headline, LIVE badge, cursor).
- `src/components/landing/UseCases/UseCases.tsx` — declare focus-point refs (active tab, visual).
- `src/components/landing/Closer.tsx` — declare focus-point refs (headline, submit button).
- `src/components/canary-watch/SessionLog.tsx` — declare focus-point refs ("Caught you." headline).

**Not touched:** Nav, EcosystemBar, Footer, mascot SVG artwork, the SessionLog log-rendering pipeline, any route, any server/server action, any global state.

---

## Task 1: Pre-flight audit — verify root cause on the live code

**Files:**
- Read: `src/components/canary-watch/CanaryMascot.tsx`, `src/components/canary-watch/context.tsx`, `src/components/canary-watch/useCanarySection.ts`, `src/components/landing/Flow/Flow.tsx`, `src/components/landing/Flow/FlowStep.tsx`, `src/components/landing/Flow/visuals/*.tsx`.
- No writes.

- [ ] **Step 1: Re-read the full `CanaryMascot.tsx`.** Confirm the two root causes hold on the current code:

  - Install cinematic fires via an `IntersectionObserver` on `[data-canary-drop="install"]` inside a `useEffect` with `[]` deps.
  - `playInstallCinematic` sets `birdHeldPos`, and `runDropCascade` schedules a `setBirdHeldPos(null)` after `INSTALLED_HOLD_MS = 3400` ms.
  - Inside `recalcPosition`, the first branch is `if (birdHeldPos) { setPos(birdHeldPos); return; }` — short-circuits scroll-perch updates while held.

- [ ] **Step 2: Re-read `Flow.tsx` + `FlowStep.tsx`.** Confirm:

  - `Flow.tsx` owns `activeIndex` state and calls `perchRef(el)` in a `useEffect` keyed on `activeIndex`.
  - `FlowStep.tsx` fires `onActivate(index)` via `useInView(stepRef, { amount: 0.5 })`.
  - The whole Flow section registers as one `canary-watch` section (`id: 'flow'`).

- [ ] **Step 3: Re-read `useCanarySection.ts` + `context.tsx`.** Confirm:

  - `registerSection` is idempotent on identical payloads (important — we're going to register 4 Flow-step sections and don't want loops).
  - `CanarySectionRegistration` has no `focusPoints` field yet.
  - Shift+click design-mode perch overrides exist — we must preserve that flow when we extend registration.

- [ ] **Step 4: No commit.** This is read-only verification. If any of the above does not match, STOP and flag the discrepancy — the plan assumptions are wrong and the design needs updating before we write code.

---

## Task 2: Extend `CanarySectionRegistration` + `useCanarySection` to carry `focusPoints`

**Files:**
- Modify: `src/components/canary-watch/types.ts`
- Modify: `src/components/canary-watch/useCanarySection.ts`
- Modify: `src/components/canary-watch/context.tsx` (registerSection idempotency check only)

- [ ] **Step 1: Extend `CanarySectionRegistration` in `types.ts`.**

Replace the existing interface with this version (append `focusPoints`):

```ts
export interface CanarySectionRegistration {
  id: string;
  order: number;
  displayName: string;
  /** Section root — used for scroll-position detection (which section is active). */
  anchor: HTMLElement | null;
  /** Optional specific element the bird PERCHES ON. Falls back to anchor if null. */
  perchAnchor: HTMLElement | null;
  /**
   * Ordered list of focus points the bird cycles through while this section
   * is active — the "eye-track". Index 0 is the bird's initial perch for
   * this section; subsequent indices are cycled on a dwell timer.
   * Empty or null → fall back to perchAnchor behaviour (no cycling).
   */
  focusPoints: HTMLElement[] | null;
}
```

- [ ] **Step 2: Extend `useCanarySection` return type and hook body in `useCanarySection.ts`.**

Add a `focusRef` factory alongside `highlight`:

```ts
export interface UseCanarySectionReturn {
  ref: (el: HTMLElement | null) => void;
  perchRef: (el: HTMLElement | null) => void;
  highlight: (targetId: string) => (el: HTMLElement | null) => void;
  /**
   * Returns a ref setter for a focus point at the given ordered index
   * (0-based). Multiple focus points at the same index are OK — last
   * non-null wins, which is fine for these decorative callbacks.
   */
  focusRef: (index: number) => (el: HTMLElement | null) => void;
}
```

Inside the hook, add:

```ts
const focusElsRef = useRef<Map<number, HTMLElement | null>>(new Map());

const focusRef = useCallback((index: number) => {
  return (el: HTMLElement | null) => {
    if (el === null) {
      focusElsRef.current.delete(index);
    } else {
      focusElsRef.current.set(index, el);
    }
    // Focus points feed into registration — re-register so the mascot picks
    // them up. Only after anchor is mounted.
    if (anchorRef.current) reregister();
  };
}, [/* reregister declared below */]);
```

Inside `reregister`, build the ordered focus-points array:

```ts
const reregister = useCallback(() => {
  if (!anchorRef.current) return;
  const focusMap = focusElsRef.current;
  const orderedFocusPoints =
    focusMap.size === 0
      ? null
      : Array.from(focusMap.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([, el]) => el)
          .filter((el): el is HTMLElement => el !== null);

  const unreg = registerSection({
    id: opts.id,
    order: opts.order,
    displayName: opts.displayName,
    anchor: anchorRef.current,
    perchAnchor: perchElRef.current,
    focusPoints: orderedFocusPoints,
  });
  unregisterRef.current = unreg;
}, [opts.id, opts.order, opts.displayName, registerSection]);
```

Expose `focusRef` in the `useMemo` return:

```ts
return useMemo(
  () => ({ ref, perchRef, highlight, focusRef }),
  [ref, perchRef, highlight, focusRef]
);
```

- [ ] **Step 3: Update `registerSection` idempotency check in `context.tsx`.**

In the `registerSection` callback, extend the `isDifferent` comparison to include `focusPoints`:

```ts
const isDifferent =
  !prev ||
  prev.anchor !== reg.anchor ||
  prev.perchAnchor !== reg.perchAnchor ||
  prev.order !== reg.order ||
  prev.displayName !== reg.displayName ||
  !arrayRefsEqual(prev.focusPoints, reg.focusPoints);
```

Add this helper inside the file (module-scope, above `CanaryWatchProvider`):

```ts
/**
 * Shallow-by-reference compare two focus-point arrays. null/null === equal.
 * Null vs array is NOT equal. Different lengths or any differing element
 * reference is NOT equal.
 */
function arrayRefsEqual(
  a: HTMLElement[] | null,
  b: HTMLElement[] | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
```

- [ ] **Step 4: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: clean. The existing consumers (Hero, UseCases, Closer, SessionLog, Flow) still compile because they don't use `focusRef` yet, and `focusPoints` is optional-shaped (allowed to be `null`).

- [ ] **Step 5: Commit.**

```bash
cd canaryT/canary-landing && git add src/components/canary-watch/types.ts src/components/canary-watch/useCanarySection.ts src/components/canary-watch/context.tsx && git commit -m "polish(bird): add focusPoints to canary-watch section registration"
```

---

## Task 3: Refactor Flow — remove `activeIndex` loop; register each step independently

**Files:**
- Modify: `src/components/landing/Flow/Flow.tsx`
- Modify: `src/components/landing/Flow/FlowStep.tsx`

- [ ] **Step 1: Replace `Flow.tsx` with a layout-only wrapper.**

Overwrite `src/components/landing/Flow/Flow.tsx` with:

```tsx
'use client';

import { FlowStep } from './FlowStep';
import { InstallVisual } from './visuals/InstallVisual';
import { SeeVisual } from './visuals/SeeVisual';
import { StopVisual } from './visuals/StopVisual';
import { LearnVisual } from './visuals/LearnVisual';
import styles from './Flow.module.css';

/**
 * Flow — four-step arc of the Canary product: Install → See → Stop → Learn.
 *
 * Each FlowStep registers itself as its own canary-watch section. The mascot's
 * global section-switch logic (threshold + hysteresis + scroll-idle commit)
 * handles perch selection — Flow owns no active-index state of its own.
 */
export function Flow() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        <header className={styles.sectionHeader}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowRule} aria-hidden="true" />
            HOW CANARY WORKS
          </span>
          <h2 className={styles.heading}>
            One session. Four moves. Every agent safer than the last.
          </h2>
          <p className={styles.subheading}>
            Canary is the trust layer that watches your agent, blocks the
            action you flagged, and writes rules for what it sees next time.
          </p>
        </header>

        <div className={styles.steps}>
          <FlowStep
            sectionId="flow-install"
            sectionOrder={3}
            sectionDisplayName="Flow · Install"
            number="01"
            label="Install"
            headline="Drop in the SDK. Canary starts listening."
            body="One npm install and one init call. Canary hooks into Claude Code, Browser Use, openClaw, Hermes — or any stack that can POST events."
            stat={{
              value: '~5 min',
              caption: 'From install to first recorded session.',
            }}
            orientation="left"
            Visual={InstallVisual}
            dropKey="install"
          />

          <FlowStep
            sectionId="flow-see"
            sectionOrder={4}
            sectionDisplayName="Flow · See"
            number="02"
            label="See"
            headline="Scroll 12 hours of agent work in 30 seconds."
            body="Every click, keystroke, and screen state — recorded. Other tools trace what your agent said. Canary shows what it did."
            stat={{
              value: '30s',
              caption: 'Review 12h of agent work in 30 seconds.',
            }}
            orientation="right"
            Visual={SeeVisual}
            dropKey="see"
          />

          <FlowStep
            sectionId="flow-stop"
            sectionOrder={5}
            sectionDisplayName="Flow · Stop"
            number="03"
            label="Stop"
            headline="Write a rule in plain English. Canary blocks the action before it runs."
            body={
              <>
                &ldquo;Don&rsquo;t touch admin settings.&rdquo;
                &ldquo;Don&rsquo;t email new domains.&rdquo; Canary compiles
                rules like these into policy and enforces them on every action
                the agent attempts.
              </>
            }
            stat={{
              value: '13/13',
              caption: 'Violations caught in the ClaimDesk benchmark.',
            }}
            orientation="left"
            Visual={StopVisual}
            dropKey="stop"
          />

          <FlowStep
            sectionId="flow-learn"
            sectionOrder={6}
            sectionDisplayName="Flow · Learn"
            number="04"
            label="Learn"
            headline="After every session, Canary writes rules."
            body="Canary reviews what your agent did and suggests rules that would have prevented any mistake. One click to add — that mistake can't happen again."
            stat={{
              value: '1 click',
              caption: 'Add a suggested rule. Live before the next session.',
            }}
            orientation="right"
            Visual={LearnVisual}
            dropKey="learn"
          />
        </div>
      </div>
    </section>
  );
}
```

**Note the prop change:** the step now takes `Visual` (a component type) + section registration props, rather than a pre-built `visual` ReactNode — so each step can wire a perch ref + focus refs through its own hook.

- [ ] **Step 2: Replace `FlowStep.tsx` with the independently-registering version.**

Overwrite `src/components/landing/Flow/FlowStep.tsx` with:

```tsx
'use client';

import { type ComponentType, type ReactNode, type RefObject, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { spring, staggerParent, staggerChild } from '@/lib/motion';
import { useCanarySection } from '@/components/canary-watch';
import styles from './FlowStep.module.css';

/**
 * Visual components rendered inside each Flow step. They receive the perch
 * ref (to be bound to the visualFrame) AND focus-point refs (0 = primary,
 * 1 = secondary, etc.) so the mascot's eye-track can cycle through them.
 */
export interface FlowVisualProps {
  perchRef: (el: HTMLElement | null) => void;
  focusRef: (index: number) => (el: HTMLElement | null) => void;
}

export interface FlowStepProps {
  sectionId: string;
  sectionOrder: number;
  sectionDisplayName: string;
  number: string;
  label: string;
  headline: ReactNode;
  body: ReactNode;
  stat: { value: string; caption: string };
  orientation: 'left' | 'right';
  /** Component (not element) for the visual — receives perchRef + focusRef. */
  Visual: ComponentType<FlowVisualProps>;
  /** `data-canary-drop` marker used by the CanaryMascot to detect cages. */
  dropKey: string;
}

/**
 * One numbered step in the Flow section.
 *
 * Each step is its OWN canary-watch section. The bird's global section-switch
 * logic (threshold + hysteresis + scroll-idle) drives perch selection here
 * — no Flow-local active index, no in-view callbacks.
 *
 * Layout: alternating 2-column grid (copy / visual). min-height: 100vh so
 * each step owns the viewport — the reader settles on one idea at a time.
 */
export function FlowStep({
  sectionId,
  sectionOrder,
  sectionDisplayName,
  number,
  label,
  headline,
  body,
  stat,
  orientation,
  Visual,
  dropKey,
}: FlowStepProps) {
  const reduce = useReducedMotion() === true;
  const frameRef = useRef<HTMLDivElement>(null);

  const { ref: sectionRef, perchRef, focusRef } = useCanarySection({
    id: sectionId,
    order: sectionOrder,
    displayName: sectionDisplayName,
  });

  // The `.visualFrame` is both the drop-zone / cage AND the perch anchor for
  // Install/See/Stop. (Learn's FocusPoint #0 = the rule button; we still
  // point perchAnchor at the frame so the eye-track has a stable base.)
  const setFrameRef = (el: HTMLDivElement | null) => {
    frameRef.current = el;
    perchRef(el);
  };

  const classes =
    orientation === 'right'
      ? `${styles.step} ${styles.stepReverse}`
      : styles.step;

  return (
    <motion.div
      ref={sectionRef}
      className={classes}
      variants={reduce ? undefined : staggerParent}
      initial={reduce ? undefined : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0 } : spring}
    >
      <div className={styles.copyCol}>
        <motion.div
          className={styles.numberRow}
          variants={reduce ? undefined : staggerChild}
        >
          <span className={styles.number} aria-hidden="true">{number}</span>
          <span className={styles.label}>{label}</span>
          <span className={styles.numberRule} aria-hidden="true" />
        </motion.div>

        <motion.h3
          className={styles.headline}
          variants={reduce ? undefined : staggerChild}
        >
          {headline}
        </motion.h3>

        <motion.p
          className={styles.body}
          variants={reduce ? undefined : staggerChild}
        >
          {body}
        </motion.p>

        <motion.div
          className={styles.stat}
          variants={reduce ? undefined : staggerChild}
        >
          <span className={styles.statValue}>{stat.value}</span>
          <span className={styles.statCaption}>{stat.caption}</span>
        </motion.div>
      </div>

      <motion.div
        className={styles.visualCol}
        variants={reduce ? undefined : staggerChild}
      >
        <div
          ref={setFrameRef}
          className={styles.visualFrame}
          data-canary-drop={dropKey}
        >
          <Visual perchRef={perchRef} focusRef={focusRef} />
          <div className={styles.scanline} aria-hidden="true" />
        </div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: **type errors** about the visual components' prop signatures (they currently use `forwardRef<HTMLElement>`, now need to accept `{ perchRef, focusRef }`). That is what Task 4 and Task 9 will fix. For now, if any OTHER unrelated error pops up, flag it.

- [ ] **Step 4: DO NOT commit yet.** Typecheck is red on the 4 visuals by design; Task 4 (step-height CSS) is safe to commit independently, but the visuals must be updated in Task 9 before the branch types clean. Proceed to Task 4.

---

## Task 4: Each Flow step = full viewport height (breathing room)

**Files:**
- Modify: `src/components/landing/Flow/FlowStep.module.css`

- [ ] **Step 1: Update `.step` to full viewport height with vertical centering.**

In `src/components/landing/Flow/FlowStep.module.css`, replace the `.step` rule (currently lines 1–9) with:

```css
.step {
  position: relative;
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: var(--space-16);
  padding: var(--space-16) 0;
  min-height: 100vh;
  align-items: center;
  border-top: 1px solid var(--grey-stroke);
}
```

- [ ] **Step 2: Keep the existing mobile override, but raise step padding for breathing room.**

Replace the existing `@media (max-width: 900px)` block (currently lines 151–175) with:

```css
@media (max-width: 900px) {
  .step,
  .stepReverse {
    grid-template-columns: 1fr;
    gap: var(--space-10);
    padding: var(--space-16) 0;
    min-height: auto;
  }
  .stepReverse .copyCol {
    grid-column: 1;
    grid-row: 1;
  }
  .stepReverse .visualCol {
    grid-column: 1;
    grid-row: 2;
  }
  .copyCol {
    max-width: none;
  }
  .visualCol {
    min-height: 320px;
  }
  .number {
    font-size: 2.5rem;
  }
}
```

Mobile drops the 100vh requirement — stacking two full-height columns on a phone is user-hostile. Desktop (>900 px) gets the full-screen treatment.

- [ ] **Step 3: Typecheck + lint.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: still red on the visuals (from Task 3 — by design).

- [ ] **Step 4: DO NOT commit yet.** We're mid-refactor; branch is not buildable. Continue to Task 5.

---

## Task 5: CanaryMascot — caged perch math + `wasReleasedRef`

**Files:**
- Modify: `src/components/canary-watch/CanaryMascot.tsx`

- [ ] **Step 1: Add `wasReleasedRef` near the other refs at the top of the component (around line 150).**

Inside `CanaryMascot`, add:

```ts
/**
 * Once the bird breaks out of the Learn cage (see §7.2 of the spec), it
 * never goes back into cage mode for the rest of the session. Even if the
 * reader scrolls back up to Install/See/Stop, the bird perches above the
 * frame like any other section instead of inside it.
 */
const wasReleasedRef = useRef(false);
```

- [ ] **Step 2: Replace `recalcPosition` with a caged-aware version.**

Find the current `recalcPosition` (around lines 214–228) and replace it with:

```ts
const CAGE_INSET_X = 12;
const CAGE_INSET_Y = 12;

/**
 * Position the bird for the current frame.
 *
 * Priority:
 *   1. birdHeldPos (cursor-actor override, e.g. install cinematic)
 *   2. Caged mode: active perch has data-canary-drop AND the bird hasn't
 *      been released yet → bird sits INSIDE the top-right of the frame.
 *   3. Default: bird sits ABOVE the perch (gap above).
 */
const recalcPosition = () => {
  if (birdHeldPos) {
    setPos(birdHeldPos);
    return;
  }
  const active = sections.find((s) => s.id === activeSectionId);
  if (!active) return;
  const perchEl =
    perchOverrides.get(active.id) ?? active.perchAnchor ?? active.anchor;
  if (!perchEl) return;
  const rect = perchEl.getBoundingClientRect();

  // Caged mode: perch element carries data-canary-drop AND bird still caged.
  const isCagedPerch =
    !wasReleasedRef.current && perchEl.hasAttribute('data-canary-drop');

  if (isCagedPerch) {
    const x = rect.right - BIRD_SIZE - CAGE_INSET_X;
    const y = rect.top + CAGE_INSET_Y;
    setPos({ x, y });
    return;
  }

  // Default: hover above.
  const x = rect.left + LEFT_OFFSET;
  const y = rect.top - BIRD_SIZE - GAP_ABOVE;
  setPos({ x, y });
};
```

- [ ] **Step 3: Wire the `.cw-caged` class onto the perch when in caged mode.**

Extend `lockPerchOutline` (around lines 156–162). Replace it with:

```ts
const lockPerchOutline = (el: HTMLElement) => {
  if (perchedElRef.current && perchedElRef.current !== el) {
    perchedElRef.current.classList.remove('cw-perched');
    perchedElRef.current.classList.remove('cw-caged');
  }
  el.classList.add('cw-perched');
  // If this perch is a drop-zone frame and the bird hasn't been released,
  // also mark it as caged — steady dashed outline, no pulse, reads as
  // "bird is locked in here".
  if (
    !wasReleasedRef.current &&
    el.hasAttribute('data-canary-drop')
  ) {
    el.classList.add('cw-caged');
  } else {
    el.classList.remove('cw-caged');
  }
  perchedElRef.current = el;
};
```

And extend `unlockPerchOutline`:

```ts
const unlockPerchOutline = () => {
  if (perchedElRef.current) {
    perchedElRef.current.classList.remove('cw-perched');
    perchedElRef.current.classList.remove('cw-caged');
    perchedElRef.current = null;
  }
};
```

- [ ] **Step 4: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: still red only on the visuals (from Task 3).

- [ ] **Step 5: DO NOT commit yet.** Continue.

---

## Task 6: CanaryMascot — rewire install cinematic trigger to `activeSectionId`

**Files:**
- Modify: `src/components/canary-watch/CanaryMascot.tsx`

**Why:** the current `IntersectionObserver` trigger on `[data-canary-drop="install"]` runs independently of the global section-switch logic, which is part of why `birdHeldPos` gets stuck. Driving the cinematic off `activeSectionId === 'flow-install'` makes it part of the same causal chain as every other perch transition.

- [ ] **Step 1: Remove the old `IntersectionObserver` effect.**

Delete the entire `useEffect` block that starts with:

```ts
// Observe the Install drop zone; play the drag-install cinematic once
// when the reader has scrolled it meaningfully into view.
useEffect(() => {
  if (typeof window === 'undefined') return;
  const rafId = requestAnimationFrame(() => {
    const zone = document.querySelector<HTMLElement>('[data-canary-drop="install"]');
    // ...
  });
  // ...
}, []);
```

(roughly lines 423–449 in the current file, ending at the `}, []);` that closes the effect.)

- [ ] **Step 2: Add a new effect that fires the cinematic on `activeSectionId === 'flow-install'`.**

Insert after the `useEffect` that mirrors `pos → posRef`:

```ts
// Fire the install cinematic exactly once, the first time flow-install
// becomes the active section. We wait one rAF so that `pos` has been laid
// down for whatever perch the reader was on when the threshold tripped
// (typically Hero or Ecosystem) — the cursor needs to materialize near
// that perch for the beat to read.
useEffect(() => {
  if (activeSectionId !== 'flow-install') return;
  if (demoPlayedRef.current) return;
  if (!posRef.current) return;

  const zone = document.querySelector<HTMLElement>(
    '[data-canary-drop="install"]'
  );
  if (!zone) return;

  demoPlayedRef.current = true;
  playInstallCinematic(zone);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSectionId]);
```

- [ ] **Step 3: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: still red only on the visuals.

- [ ] **Step 4: DO NOT commit yet.**

---

## Task 7: CanaryMascot — release-at-Learn beat (one-shot)

**Files:**
- Modify: `src/components/canary-watch/CanaryMascot.tsx`
- Modify: `src/components/canary-watch/CanaryMascot.module.css` (Task 9 handles the full CSS polish — here we only declare the new class name)

- [ ] **Step 1: Add a `releasePlayedRef` alongside `demoPlayedRef`.**

```ts
/** Release-at-Learn fires exactly once per session. */
const releasePlayedRef = useRef(false);
```

- [ ] **Step 2: Add the release effect.**

Insert this effect alongside the install-cinematic effect from Task 6:

```ts
/**
 * Release at Learn — the bird's "let out to learn from its mistakes" beat.
 * Fires once when flow-learn first becomes the active section:
 *   1. Drop the current cage outline (handled implicitly as the perch moves).
 *   2. One-shot upward arc + wiggle (.cw-breakout class on mascot; CSS owns
 *      the animation keyframes).
 *   3. Flip wasReleasedRef — from now on Install/See/Stop perches use the
 *      default above-perch math and do not add .cw-caged.
 *   4. Emit one OBSERVED log line.
 */
useEffect(() => {
  if (activeSectionId !== 'flow-learn') return;
  if (releasePlayedRef.current) return;
  releasePlayedRef.current = true;

  // Flip the released flag. The next recalcPosition (triggered by the
  // section-switch useEffect that already runs on activeSectionId change)
  // will land the bird with default above-perch math on Learn's perch.
  wasReleasedRef.current = true;

  // Fire the break-out visual — see CanaryMascot.module.css .cw-breakout
  // keyframe for the actual animation.
  setBreakoutKey((k) => k + 1);

  // Log the beat so it shows up in SessionLog.
  logEvent('OBSERVED', 'Canary · released · free to perch');
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSectionId]);
```

- [ ] **Step 3: Add the `breakoutKey` state and conditionally apply the class.**

Near the other `useState` calls (around line 124):

```ts
/**
 * Incrementing key to trigger the one-shot break-out CSS animation. When
 * this changes we add a class for 1.2s (matches the keyframe duration).
 */
const [breakoutKey, setBreakoutKey] = useState(0);
const [breakoutActive, setBreakoutActive] = useState(false);
```

Add an effect that flips `breakoutActive` on for the animation's duration:

```ts
useEffect(() => {
  if (breakoutKey === 0) return;
  setBreakoutActive(true);
  const t = setTimeout(() => setBreakoutActive(false), 1200);
  return () => clearTimeout(t);
}, [breakoutKey]);
```

Then in the JSX (where `.mascot` classes are composed, around line 510), add `breakoutActive ? styles.breakout : ''` to the array:

```tsx
<div
  className={[
    styles.mascot,
    facing === 'left' ? styles.faceLeft : '',
    wiggle ? styles.wiggle : '',
    scrolling ? styles.scrolling : '',
    birdHeldPos ? styles.held : '',
    cinePhase !== 'idle' ? styles.cinePlay : '',
    breakoutActive ? styles.breakout : '',
  ]
    .filter(Boolean)
    .join(' ')}
```

- [ ] **Step 4: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: still red only on the visuals.

- [ ] **Step 5: DO NOT commit yet.**

---

## Task 8: CanaryMascot — per-screen eye-track driver (cycle focus points)

**Files:**
- Modify: `src/components/canary-watch/CanaryMascot.tsx`

- [ ] **Step 1: Add the eye-track state + dwell constant.**

Near the other constants at the top of the file (around line 65):

```ts
/** Dwell time between focus-point hops within a single section. Shared across
 *  the whole page — uniform cadence sells the "one animation" feel. */
const FOCUS_DWELL_MS = 1600;
```

Near the other `useState` calls:

```ts
/**
 * Index into the current section's focusPoints list. -1 means the section
 * has no focus points (use perchAnchor) or the driver hasn't committed yet.
 */
const [focusIndex, setFocusIndex] = useState(0);
```

- [ ] **Step 2: Reset `focusIndex` to 0 whenever `activeSectionId` changes.**

Inside the existing "Active section changed" effect (around line 288), add at the top:

```ts
setFocusIndex(0);
```

(Place it as the first statement inside the effect body, before `const active = ...`.)

- [ ] **Step 3: Drive the focus-point cycle with a timer.**

Add a new effect:

```ts
/**
 * Eye-track driver — cycle focus points while the reader is parked on a
 * section. Each hop uses the shared transform-transition curve (820ms),
 * then dwells FOCUS_DWELL_MS before the next hop. Stops at the last
 * focus point; does not wrap.
 */
useEffect(() => {
  const active = sections.find((s) => s.id === activeSectionId);
  const fps = active?.focusPoints;
  if (!fps || fps.length <= 1) return;
  if (focusIndex >= fps.length - 1) return;

  const t = setTimeout(() => {
    setFocusIndex((i) => Math.min(i + 1, fps.length - 1));
  }, FOCUS_DWELL_MS + TRAVEL_MS);

  return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSectionId, focusIndex, sections]);
```

- [ ] **Step 4: Route `recalcPosition` through the focus point when available.**

Update `recalcPosition` (from Task 5) to prefer the current focus point over the perchAnchor:

```ts
const recalcPosition = () => {
  if (birdHeldPos) {
    setPos(birdHeldPos);
    return;
  }
  const active = sections.find((s) => s.id === activeSectionId);
  if (!active) return;

  // Prefer the current focus point (eye-track driver controls focusIndex);
  // fall back to perchOverride, then declared perchAnchor, then anchor.
  const focusEl = active.focusPoints?.[focusIndex] ?? null;
  const perchEl =
    focusEl ??
    perchOverrides.get(active.id) ??
    active.perchAnchor ??
    active.anchor;
  if (!perchEl) return;

  const rect = perchEl.getBoundingClientRect();

  // Caged perch math uses the SECTION'S perchAnchor (the frame), not the
  // focus point — the bird sits inside the cage corner and the .cw-perched
  // bounding box is drawn on the focus point independently.
  const cageFrame = active.perchAnchor;
  const isCagedSection =
    !wasReleasedRef.current &&
    cageFrame !== null &&
    cageFrame.hasAttribute('data-canary-drop');

  if (isCagedSection && cageFrame) {
    const cageRect = cageFrame.getBoundingClientRect();
    const x = cageRect.right - BIRD_SIZE - CAGE_INSET_X;
    const y = cageRect.top + CAGE_INSET_Y;
    setPos({ x, y });
    return;
  }

  const x = rect.left + LEFT_OFFSET;
  const y = rect.top - BIRD_SIZE - GAP_ABOVE;
  setPos({ x, y });
};
```

- [ ] **Step 5: Outline the current focus point, not the section perch.**

In the existing "Active section changed" useEffect (around line 288–322), the call `lockPerchOutline(perchEl)` currently outlines the `perchAnchor`. Change it to outline the first focus point (if any) instead:

Replace:

```ts
arriveTimerRef.current = setTimeout(() => {
  fireWiggle();
  lockPerchOutline(perchEl);
  arriveTimerRef.current = null;
}, delay);
```

with:

```ts
arriveTimerRef.current = setTimeout(() => {
  fireWiggle();
  const focusEl = active.focusPoints?.[0] ?? null;
  // The bounding box sits on what the bird is OBSERVING — the focus
  // point — not on the cage. lockPerchOutline also applies .cw-caged to
  // the cage frame separately if it's a data-canary-drop perch.
  lockPerchOutline(focusEl ?? perchEl);
  if (active.perchAnchor && active.perchAnchor !== (focusEl ?? perchEl)) {
    // Also mark the cage frame, independently of the focus-point outline,
    // so both visuals read at once.
    if (!wasReleasedRef.current && active.perchAnchor.hasAttribute('data-canary-drop')) {
      active.perchAnchor.classList.add('cw-caged');
    }
  }
  arriveTimerRef.current = null;
}, delay);
```

- [ ] **Step 6: Move the outline on each focus-point hop.**

Add a new effect:

```ts
/**
 * When focusIndex changes within a committed section, move the .cw-perched
 * outline to the new focus point. No wiggle — mid-section hops are quieter
 * than section-switch arrivals.
 */
useEffect(() => {
  const active = sections.find((s) => s.id === activeSectionId);
  const focusEl = active?.focusPoints?.[focusIndex] ?? null;
  if (!focusEl) return;
  // Wait for the 820ms transit to finish, then swap the outline.
  const t = setTimeout(() => {
    lockPerchOutline(focusEl);
  }, TRAVEL_MS);
  return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [focusIndex, activeSectionId]);
```

- [ ] **Step 7: Include `focusIndex` in the scroll-rAF recalc chain.**

The existing scroll listener (around lines 231–285) already calls `recalcPosition` inside rAF. Because `recalcPosition` now reads `focusIndex` via closure, ensure the scroll useEffect's dep array includes `focusIndex` so scroll recomputes with the current focus:

Find:

```ts
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [sections, activeSectionId]);
```

Replace with:

```ts
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [sections, activeSectionId, focusIndex]);
```

- [ ] **Step 8: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: still red only on the visuals.

- [ ] **Step 9: DO NOT commit yet.**

---

## Task 9: CSS — `.cw-caged`, polished `.cw-perched`, `.breakout` keyframes, transitions for outlines

**Files:**
- Modify: `src/components/canary-watch/CanaryMascot.module.css`

- [ ] **Step 1: Polish `.cw-perched`.**

Replace the existing `:global(.cw-perched)` block (around lines 189–197) with:

```css
:global(.cw-perched) {
  outline: 1px dashed var(--accent-color);
  outline-offset: 4px;
  animation: cw-perched-in 260ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: outline-color 200ms ease, outline-offset 200ms ease;
}
```

- [ ] **Step 2: Add the `.cw-caged` class.**

Insert after the `.cw-drop-target` block (around line 157):

```css
/* ── Cage overlay ──────────────────────────────────────────────────
   Applied to a Flow step's .visualFrame while the bird is perched inside
   it and has not yet been released at Learn. Steady dashed outline —
   no pulse, no motion. Reads as "locked in" without being busy.
   Independent of the tighter .cw-perched outline on the current focus
   point inside the cage. */
:global(.cw-caged) {
  outline: 1px dashed var(--accent-color);
  outline-offset: 6px;
  transition: outline-offset 200ms ease, outline-color 200ms ease;
}
```

- [ ] **Step 3: Add the `.breakout` class + keyframe.**

Insert after the `.mascot.wiggle` block (around line 94):

```css
/* ── Release at Learn ──────────────────────────────────────────────
   One-shot upward arc layered over the sway/wiggle. Fires exactly once
   per session when the bird exits the Stop cage into Learn. After this
   beat the bird is considered "released" and never re-enters the cage. */
.mascot.breakout .inner {
  animation: cw-breakout 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 1;
}

@keyframes cw-breakout {
  0%   { transform: translateY(0) scale(1); }
  30%  { transform: translateY(-18px) scale(1.06); }
  60%  { transform: translateY(-6px) scale(1.02); }
  100% { transform: translateY(0) scale(1); }
}
```

- [ ] **Step 4: Extend the reduced-motion block.**

Replace the existing `@media (prefers-reduced-motion: reduce)` block (around lines 212–219) with:

```css
@media (prefers-reduced-motion: reduce) {
  .mascot { transition: none; }
  .inner,
  .sway,
  .mascot.wiggle .sway,
  .mascot.breakout .inner { animation: none !important; }
  :global(.cw-highlighted)::after { animation: none !important; transform: scaleX(1); }
  :global(.cw-perched) { animation: none !important; outline-offset: 4px; }
  :global(.cw-caged) { outline-offset: 6px; }
  :global(.cw-drop-target) { animation: none !important; outline-offset: 6px; }
  .cursor { transition: none !important; animation: none !important; }
}
```

- [ ] **Step 5: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: still red only on the visuals.

- [ ] **Step 6: DO NOT commit yet.**

---

## Task 10: Update Flow visuals to forward perch + focus refs

**Files:**
- Modify: `src/components/landing/Flow/visuals/InstallVisual.tsx`
- Modify: `src/components/landing/Flow/visuals/SeeVisual.tsx`
- Modify: `src/components/landing/Flow/visuals/StopVisual.tsx`
- Modify: `src/components/landing/Flow/visuals/LearnVisual.tsx`

Each visual needs to:
1. Replace the old `forwardRef<...>` signature with a props interface matching `FlowVisualProps` (from Task 3): `{ perchRef, focusRef }`.
2. Drop the `perchRef` usage on an inner element — the frame itself is the perch now (wired by `FlowStep`).
3. Attach `focusRef(0)`, `focusRef(1)`, … on the elements the bird should observe in order.

The focus-point assignments come from §4 of the spec.

- [ ] **Step 1: Update `InstallVisual.tsx`.**

Read the current file first: `src/components/landing/Flow/visuals/InstallVisual.tsx`. Identify the element that renders the `npm install @canary/sdk` line (currently receives `ref={perchRef}` at approximately line 74) and the element that shows the `~5 min` stat.

Change the component signature from `forwardRef<HTMLDivElement>(...)` to a plain function component:

```tsx
import type { FlowVisualProps } from '../FlowStep';
// (keep existing imports)

export function InstallVisual({ perchRef, focusRef }: FlowVisualProps) {
  // (keep existing body)
}
```

Remove the `perchRef` prop usage on the inner line element. Instead:

- Replace `ref={perchRef}` on the `npm install` line with `ref={focusRef(0)}`.
- If the stat element (e.g. `~5 min`) is rendered inside the visual, attach `ref={focusRef(1)}` there. If it is NOT inside the visual (it lives in the copy column), skip Focus #1 for Install — the step will eye-track only the npm install line.

Re-export: keep `InstallVisual` as a named export. Remove the `forwardRef` wrapper. Delete the unused `displayName` assignment.

- [ ] **Step 2: Update `SeeVisual.tsx`** the same way.

Focus points per the spec: `0 = session timestamp`, `1 = 30s stat (if inside the visual)`, `2 = scrub cursor`. Apply `focusRef(N)` to each rendered element that matches these. If fewer than 3 exist in the visual, use the ones that do — the eye-track driver gracefully handles 1-N focus points.

- [ ] **Step 3: Update `StopVisual.tsx`.**

Focus points: `0 = ● BLOCKED · OUTREACH SEND stripe`, `1 = 13/13 stat (if inside the visual)`. Apply `focusRef(0)` to the stripe element; `focusRef(1)` to the stat if it lives inside the visual.

- [ ] **Step 4: Update `LearnVisual.tsx`.**

Focus points: `0 = suggested-rule card`, `1 = Add rule → button`. Apply `focusRef(0)` to the card, `focusRef(1)` to the button. Note: Learn's perch is the frame (like the others) — but because release at Learn sets `wasReleasedRef = true`, the bird perches with default math (above the perch = above the frame), not caged.

- [ ] **Step 5: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: **clean.** All four visual components now conform to `FlowVisualProps`. Flow, FlowStep, visuals, canary-watch, and the mascot compile together.

- [ ] **Step 6: Commit — this is the first green-types checkpoint.**

```bash
cd canaryT/canary-landing && git add src/components/canary-watch/types.ts src/components/canary-watch/useCanarySection.ts src/components/canary-watch/context.tsx src/components/canary-watch/CanaryMascot.tsx src/components/canary-watch/CanaryMascot.module.css src/components/landing/Flow/Flow.tsx src/components/landing/Flow/FlowStep.tsx src/components/landing/Flow/FlowStep.module.css src/components/landing/Flow/visuals/InstallVisual.tsx src/components/landing/Flow/visuals/SeeVisual.tsx src/components/landing/Flow/visuals/StopVisual.tsx src/components/landing/Flow/visuals/LearnVisual.tsx && git commit -m "polish(bird): scroll flight — independent Flow-step sections, cage + release, eye-track driver"
```

---

## Task 11: Wire focus points on Hero, UseCases, Closer, SessionLog

**Files:**
- Modify: `src/components/landing/Hero.tsx`
- Modify: `src/components/landing/UseCases/UseCases.tsx`
- Modify: `src/components/landing/Closer.tsx`
- Modify: `src/components/canary-watch/SessionLog.tsx`

Each of these calls `useCanarySection(...)` already. Destructure `focusRef` from the return and attach `ref={focusRef(N)}` to the elements from the spec §4 table.

- [ ] **Step 1: Hero.**

In `src/components/landing/Hero.tsx`, destructure `focusRef` from the hook:

```tsx
const { ref: sectionRef, perchRef, highlight, focusRef } = useCanarySection({
  id: 'hero',
  order: 1,
  displayName: 'Hero · Trust layer',
});
```

Attach focus refs in reading order:

- Focus 0 (headline): the same `<motion.h1>` that currently takes `perchRef`. Use a fan-out ref:

```tsx
<motion.h1
  ref={(el) => { perchRef(el); highlight('headline')(el); focusRef(0)(el); }}
  className={styles.headline}
  ...
>
```

- Focus 1 (LIVE badge): find the element rendering `LIVE · CANARY OBSERVING` (currently a `motion.div` with `className={styles.liveBadge}`). Add `ref={focusRef(1)}`.

  If the element is a `motion.div`, cast through or use a function ref wrapper:

  ```tsx
  <motion.div
    ref={focusRef(1) as unknown as React.Ref<HTMLDivElement>}
    className={styles.liveBadge}
    ...
  >
  ```

- Focus 2 (blinking cursor in the code): if the Hero renders a cursor element via `HeroCursor` or within an inline code block, find the innermost element that represents the blinking cursor and attach `ref={focusRef(2)}`. If there is no single identifiable element, skip Focus 2.

- [ ] **Step 2: UseCases.**

In `src/components/landing/UseCases/UseCases.tsx`, destructure `focusRef` and attach:

- Focus 0: the currently-active `UseCaseTab`. If active state is inside `UseCases` (likely), wrap the active tab's ref so `focusRef(0)` only binds when that tab is active. Simplest approach: attach `focusRef(0)` via a callback ref on the ACTIVE tab only (skip inactive tabs).
- Focus 1: the visual output box for the active case (e.g. `[data-uc-visual]`). Attach `ref={focusRef(1)}`.

If this requires non-trivial restructuring, keep Focus 0 only and leave Focus 1 for a follow-up.

- [ ] **Step 3: Closer.**

In `src/components/landing/Closer.tsx`, attach:

- Focus 0: the headline (`<h2>` with the "agents in the mine" copy).
- Focus 1: the Get early access → submit button (rendered by `EarlyAccessForm` — if the submit button is not reachable from `Closer`, skip Focus 1 or lift the ref).

- [ ] **Step 4: SessionLog.**

In `src/components/canary-watch/SessionLog.tsx`, attach `focusRef(0)` to the "Caught you." headline. (This assumes SessionLog already registers itself as a canary-watch section. If not, skip — SessionLog's perch is handled elsewhere.)

- [ ] **Step 5: Typecheck + lint.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit && npm run lint`
Expected: clean. Any cast-through for framer-motion `ref` prop is acceptable per the existing codebase pattern (see taste §11 "React 18 ref types" note in `CLAUDE.md`).

- [ ] **Step 6: Commit.**

```bash
cd canaryT/canary-landing && git add src/components/landing/Hero.tsx src/components/landing/UseCases/UseCases.tsx src/components/landing/Closer.tsx src/components/canary-watch/SessionLog.tsx && git commit -m "polish(bird): add focusPoints to Hero / UseCases / Closer / SessionLog for eye-track"
```

---

## Task 12: Reduced-motion fallbacks for the new behavior

**Files:**
- Modify: `src/components/canary-watch/CanaryMascot.tsx`

- [ ] **Step 1: Gate the eye-track cycle on `prefers-reduced-motion`.**

At the top of the component (alongside refs), add a reduced-motion hook. This project already uses `useReducedMotion` from framer-motion elsewhere:

```ts
import { useReducedMotion } from 'framer-motion';
// ...
const reduce = useReducedMotion() === true;
```

In the eye-track driver effect (from Task 8, Step 3), early-exit if `reduce`:

```ts
useEffect(() => {
  if (reduce) return; // no cycling in reduced-motion; stay on focus 0.
  const active = sections.find((s) => s.id === activeSectionId);
  const fps = active?.focusPoints;
  if (!fps || fps.length <= 1) return;
  if (focusIndex >= fps.length - 1) return;

  const t = setTimeout(() => {
    setFocusIndex((i) => Math.min(i + 1, fps.length - 1));
  }, FOCUS_DWELL_MS + TRAVEL_MS);

  return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSectionId, focusIndex, sections, reduce]);
```

- [ ] **Step 2: Skip the install cinematic in reduced-motion.**

In the install cinematic trigger effect (from Task 6, Step 2), add `reduce` to the early-exit chain:

```ts
useEffect(() => {
  if (reduce) {
    demoPlayedRef.current = true;  // prevent later play when reduce flips off
    return;
  }
  if (activeSectionId !== 'flow-install') return;
  if (demoPlayedRef.current) return;
  // ...
}, [activeSectionId, reduce]);
```

- [ ] **Step 3: Skip the release break-out animation in reduced-motion.**

In the release effect (from Task 7, Step 2), do not increment `breakoutKey` when `reduce`:

```ts
useEffect(() => {
  if (activeSectionId !== 'flow-learn') return;
  if (releasePlayedRef.current) return;
  releasePlayedRef.current = true;
  wasReleasedRef.current = true;
  if (!reduce) setBreakoutKey((k) => k + 1);
  logEvent('OBSERVED', 'Canary · released · free to perch');
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSectionId, reduce]);
```

- [ ] **Step 4: Typecheck.**

Run: `cd canaryT/canary-landing && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit.**

```bash
cd canaryT/canary-landing && git add src/components/canary-watch/CanaryMascot.tsx && git commit -m "polish(bird): respect prefers-reduced-motion for eye-track, cinematic, and release"
```

---

## Task 13: Verify — end-to-end manual + build

**Files:** none modified.

- [ ] **Step 1: Start the dev server.**

Run: `cd canaryT/canary-landing && npm run dev`
Wait for "Ready on http://localhost:3000".

- [ ] **Step 2: Verify Hero.**

Open http://localhost:3000. Expected on first paint:

- Bird visible near the headline.
- Bounding box (dashed outline) around the headline.
- After ~1.6 s, bird hops to the LIVE badge; box moves.
- After another ~1.6 s, bird hops to Focus 2 if wired.
- After the last focus point, bird stays there. No idle drift.

- [ ] **Step 3: Verify scroll into Flow-Install.**

Slowly scroll down. Expected:

- Cursor phantom appears on top of the bird near its current Hero/Ecosystem perch.
- Cursor+bird lift (~42 px) for 420 ms.
- They glide together into the Install `.visualFrame`; bird lands in the top-right corner inside the frame.
- `.cw-caged` dashed outline appears on the Install frame (steady, no pulse).
- `.cw-perched` box lands on the `npm install` line (Focus 0). After dwell, box hops to next focus if wired.
- Session log cascade: OBSERVED · LEARNED · SUGGESTED.

- [ ] **Step 4: Verify scroll through See and Stop.**

Keep scrolling. Expected:

- Bird glides from Install cage → See cage → Stop cage as each step crosses threshold (hysteresis `60 px`, commit on scroll idle `180 ms`).
- Each cage shows `.cw-caged` while bird is inside. Previous cage's `.cw-caged` is removed when bird takes off.
- At Stop: if a BLOCKED event fires (check `useInputTracker` / BLOCKED demo button), bird wiggles inside the Stop cage.

- [ ] **Step 5: Verify release at Learn.**

Scroll into Learn. Expected:

- Bird plays the break-out animation (upward arc + small scale bump) exactly once.
- No `.cw-caged` on the Learn frame.
- Bird perches above the suggested-rule card (default math, not inside).
- Session log gets `OBSERVED · Canary · released · free to perch`.

- [ ] **Step 6: Verify bird stays released on scroll back up.**

Scroll back up to Install / See / Stop. Expected:

- No cage outline. Bird perches ABOVE each frame (default math), as a free bird.
- Scroll back down to Learn and past into UseCases. Bird continues perching normally.

- [ ] **Step 7: Verify UseCases / Closer / SessionLog.**

Continue to bottom. Each section's focus-point ref(s) are outlined in order. Bird lands on the "Caught you." headline in SessionLog.

- [ ] **Step 8: Verify reduced-motion.**

In Chrome DevTools → Rendering → Emulate CSS prefers-reduced-motion → reduce. Refresh. Expected:

- Bird is at Hero focus 0. No eye-track cycling.
- Scroll down — bird commits to sections instantly, no transitions.
- No install cinematic (cursor never appears).
- No release animation; just perch change + log line.

- [ ] **Step 9: Production build.**

Stop dev server. Run: `cd canaryT/canary-landing && npm run build`
Expected: build succeeds with no errors. Any new warnings are acceptable if they match pre-existing ones (compare against `main`).

- [ ] **Step 10: Lint.**

Run: `cd canaryT/canary-landing && npm run lint`
Expected: clean or unchanged from baseline.

- [ ] **Step 11: Final commit if any tuning was needed.**

If the manual pass surfaced a small issue (e.g. a focus-point ref on the wrong element), fix it with a focused commit:

```bash
cd canaryT/canary-landing && git add <specific files> && git commit -m "polish(bird): tune <specific thing found during verification>"
```

If everything works on the first pass, no commit here.

---

## Self-review (already performed)

**Spec coverage:**
- §1 Intent → plan preamble + Task 1 root-cause summary.
- §2 Problems → Task 1 audit explicitly maps to both.
- §3 Principles → enforced via shared 820 ms easing (Tasks 5, 8), single dwell constant (Task 8), no-idle-drift (Task 8 Step 3 stops at last focus), decorative non-interactivity (Task 3 FlowStep has no pointer handlers on the bird).
- §4 Scene model table → Task 3 hard-codes the four flow-* sections with the given orders; Task 11 wires the rest.
- §5 Per-screen eye-track → Task 8 driver + Task 10/11 focus refs.
- §6 Transition → shared CSS transition on `.mascot` (already in place) + Task 8 reuses `TRAVEL_MS`.
- §7.1 Cursor drop → Task 6 rewires trigger; cinematic beats preserved.
- §7.2 Release at Learn → Task 7.
- §8 Cage → Task 5 (math) + Task 9 (.cw-caged class).
- §9 BLOCKED wiggle → no change (preserved as §11 of spec states).
- §10 File-by-file → matches plan's file list.
- §11 Untouched → Task 5 preserves scroll listener, Task 6 keeps cinematic beats, Task 7 does not touch alertKey wiring.
- §12 Accessibility → Task 9 Step 4 + Task 12.
- §13 Success criteria → Task 13 verifies each.
- §14 Non-goals → plan does not touch any non-goal file.

**Placeholder scan:** no TBD / TODO / "similar to" / missing code blocks.

**Type consistency:** `focusPoints` is `HTMLElement[] | null` everywhere (types.ts, useCanarySection.ts, context.tsx idempotency check); `focusRef(index: number)` signature matches across hook and consumers; `FlowVisualProps` matches what Flow.tsx passes into the Visual component.

---

## Notes for the implementer

- **Worktree isolation** is recommended. Brainstorming did not create one; if you want isolation, run:
  `cd canaryT/canary-landing && git worktree add ../canary-landing-bird -b polish/bird-scroll-flight`
  then run the plan inside that worktree. Not required — the change is commit-scoped and reversible via `git revert`.

- **CLAUDE.md coordination protocol** (`canaryT/canary-landing/CLAUDE.md`) calls for `git pull --rebase origin feat/landing-redesign` before work on this branch. Follow it if working with other polish tracks.

- **Do not introduce `framer-motion` imports inside any Reel-tree file.** The Reel is GSAP-only by CLAUDE.md contract. This plan does not touch Reel.

- **Token-budget tip for subagent execution:** Tasks 1–9 are tightly coupled inside the mascot + Flow module. Tasks 10, 11, 12, 13 are independent and can be parallelized across sub-agents if desired.

- **Root-cause discipline:** if during Task 1 the audit reveals that the real behavior of CanaryMascot or Flow differs from this plan's assumptions, STOP and re-align the spec before writing code. The whole point of this rewrite is that the current architecture has a hidden fight between Flow-local and global state — do not patch over a symptom without confirming the cause.

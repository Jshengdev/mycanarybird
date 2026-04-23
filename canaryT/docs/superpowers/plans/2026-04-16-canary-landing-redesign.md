# Canary Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `canaryT/canary-landing` to an asymmetric, scroll-driven, monitor-esque landing page aligned with the canonical dashboard design system, producing a gated early-access funnel optimized for IC AI engineers and agent-native startup founders (B2C2B).

**Architecture:** Next.js 16 App Router, Server Components by default with isolated `'use client'` leaves for motion. Framer Motion drives UI-level interactions (nav morph, stagger, tab `layoutId`, spring physics). GSAP + ScrollTrigger drives the Reel's isolated sticky-stage scrolltelling — never mixed with Framer in the same tree. All color values reference `canary-dashboard/src/styles/tokens.css` tokens (migrated 2026-04-16). Typography owned by `next/font/google`.

**Tech Stack:** Next.js 16.2.4, React 18, TypeScript 5, Framer Motion (to install), GSAP + ScrollTrigger (to install), next/font/google (already configured).

**Design spec:** `canaryT/docs/superpowers/specs/2026-04-16-canary-landing-redesign-design.md`

---

## 0. Why this plan exists (startup framing)

This section is the first thing to read and the last to forget. Every task below inherits from this reasoning.

### The WHY — grounded in the YC/SV development framework

**This landing is a P0 shipping priority.** It is the only surface turning brand-aware visitors into qualified early-access signups during the current gated-access window. Every design and engineering decision below is accountable to a single question: **does this make it more likely that an IC AI engineer or agent-native founder will submit the form?**

Applying the YC/SV framework discipline:

- **P0:** Hero, Reel, Use-case selector, Closer+form, early-access API, deploy to production. These ship.
- **P1:** Blog, About, Features placeholder pages (nav references them; placeholder content is honest and fine).
- **P2:** Automated tests, A/B testing infrastructure, analytics dashboards, CMS for Blog. Not in this plan. Conversion data from the first week of real signups will tell us where to invest next.

This plan intentionally omits unit tests and Playwright smoke tests. Not because testing is unimportant, but because for a pre-launch landing page with a visual-first verification story, the testing budget is spent better on **manual QA checklists per phase** and **production Lighthouse audits**. Landing pages are validated by conversion rate, not test coverage. Tests come in a follow-up PR once the funnel proves itself. This is explicit YAGNI per the framework — no speculative test scaffolding.

### The WHY — grounded in the pitch script

Teri's pitch is the source of truth for tone, positioning, and what constitutes a real claim:

- The canary/mine metaphor is load-bearing for the **closer**, not the hero. Body copy stays product-forward; metaphor delivers the payoff.
- Differentiation wedge: **Canary sees the screen**. Every competitor (AgentOps, LangSmith, Langfuse, Braintrust) traces text-in/text-out. This appears exactly once on the landing — in the OBSERVE frame of the Reel — so the claim stays sharp.
- Proof points that MUST appear somewhere on the page: `$2K MRR`, `10ms`, `88%`, `90%`, `Photon`, `openClaw ~1M weekly downloads`. Each has a specific home (see spec §5.4 and §5.5).
- B2C2B audience: peer-to-peer dev-native tone. No "enterprise-grade" filler. Named frameworks over abstract categories. Drop-in SDK, not platform.

### The WHY — grounded in taste

Every implementation decision that isn't strictly functional is a **taste call**. We cite the skill-anchored reasoning so future engineers (and future-us) understand why a choice was made and can override it only when they can cite something stronger:

- **taste-skill §3 Rule 3** — anti-center bias at DESIGN_VARIANCE > 4: hero is asymmetric left, ONLY the closer is centered (metaphor exception).
- **taste-skill §3 Rule 2** — max 1 accent, saturation < 80%: `--accent-color #0B0DC4` is the only accent. No gradient rainbows on text. No AI-purple.
- **taste-skill §3 Rule 4** — anti-card-overuse: VD 8 sections use `divide-y` lines, not card containers. The Reel's product-visual container is the main permitted card, gradient-backed.
- **taste-skill §3 Rule 5** — full interaction cycles: every interactive component gets loading, empty, error, and `:active` tactile feedback (`-translate-y-[1px]` or `scale-[0.98]`).
- **taste-skill §4** — no glow, use inner borders + tinted shadows: `--gradient-border-active` replaces the instinct to box-shadow-glow an active tab or dot.
- **taste-skill §5** — animate `transform` and `opacity` only: no animating `top`, `left`, `width`, `height` anywhere.
- **taste-skill §7** — AI tells forbidden: no Inter font, no pure `#000000` (we use `#0A0A0A`), no "Elevate/Seamless/Unleash", no generic 3-column card feature rows.
- **taste-skill §8** — motion engine isolation: GSAP for the Reel ONLY, Framer everywhere else, never in the same component tree.
- **frontend-design skill** — distinctive, production-grade UI: this page should feel recognizably Canary-built. The ASCII texture, mono-set stats, and `● LIVE` monitor micro-details are the signatures.
- **ui-ux-pro-max `Real-Time / Operations Landing` pattern** — validated section order (hero with live preview → key metrics → how it works → CTA) matches our Reel-then-selector-then-closer structure.
- **ui-ux-pro-max `Real-Time Monitoring` style** — informs the `● LIVE` pulse (`--pulse-duration: 2s`), the blinking cursor (`--blink-duration: 800ms`), the `status: observing` nav micro-label, and the scanline overlay on Reel product visuals.
- **redesign-skill** — when touching existing code, audit for generic AI patterns (centered hero, 3-column cards, neon glows, purple gradients) and eliminate them as we pass through.

---

## 1. File structure

The plan produces this final state. Files marked DONE are already migrated (2026-04-16 token + font work).

```
canary-landing/
├── src/
│   ├── app/
│   │   ├── page.tsx                       ← rewritten: thin composition shell
│   │   ├── layout.tsx                     ← DONE (next/font + metadata)
│   │   ├── globals.css                    ← DONE (migrated tokens)
│   │   ├── page.module.css                ← simplified; shared page classes only
│   │   ├── fonts/                         ← kept as-is (favicon, etc.)
│   │   ├── favicon.ico
│   │   ├── api/
│   │   │   └── early-access/
│   │   │       └── route.ts               ← NEW: form submit endpoint stub
│   │   ├── features/
│   │   │   └── page.tsx                   ← NEW: placeholder route
│   │   ├── about/
│   │   │   └── page.tsx                   ← NEW: placeholder route
│   │   └── blog/
│   │       └── page.tsx                   ← NEW: placeholder route
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx                 ← DONE (accent rename)
│   │   │   ├── AsciiHover.jsx             ← existing, left in place
│   │   │   ├── SectionLabel.tsx           ← NEW: extract from page.tsx
│   │   │   └── LiveIndicator.tsx          ← NEW: pulsing mono dot + label
│   │   ├── nav/
│   │   │   ├── Nav.tsx                    ← NEW: extract + invert morph behavior
│   │   │   └── Nav.module.css             ← colocated styles
│   │   ├── footer/
│   │   │   ├── Footer.tsx                 ← NEW: extract
│   │   │   └── Footer.module.css
│   │   └── landing/
│   │       ├── Hero.tsx                   ← NEW: server shell
│   │       ├── Hero.module.css
│   │       ├── HeroAsciiGrid.tsx          ← NEW: 'use client' — animated grid
│   │       ├── HeroCursor.tsx             ← NEW: 'use client' — blinking cursor
│   │       ├── EcosystemBar.tsx           ← NEW: server
│   │       ├── EcosystemBar.module.css
│   │       ├── Reel/
│   │       │   ├── Reel.tsx               ← NEW: 'use client' GSAP orchestrator
│   │       │   ├── Reel.module.css
│   │       │   ├── ReelFrame.tsx          ← NEW: shared frame shell
│   │       │   ├── FrameObserve.tsx       ← NEW: OBSERVE content
│   │       │   ├── FrameControl.tsx       ← NEW: CONTROL content
│   │       │   ├── FrameImprove.tsx       ← NEW: IMPROVE content
│   │       │   └── ReelProgress.tsx       ← NEW: side progress indicator
│   │       ├── UseCases/
│   │       │   ├── UseCases.tsx           ← NEW: 'use client' tab controller
│   │       │   ├── UseCases.module.css
│   │       │   ├── UseCaseTab.tsx         ← NEW: single tab
│   │       │   ├── UseCaseContent.tsx     ← NEW: morphing content block
│   │       │   └── useCaseData.ts         ← NEW: static copy data
│   │       ├── Closer.tsx                 ← NEW: 'use client' — metaphor + form
│   │       ├── Closer.module.css
│   │       └── EarlyAccessForm.tsx        ← NEW: 'use client' form with validation
│   └── lib/
│       ├── motion.ts                      ← NEW: shared Framer spring configs
│       └── gsap-register.ts               ← NEW: single GSAP plugin registration
├── AsciiHover.jsx                         ← ROOT copy; delete (duplicate)
├── package.json                           ← modified: add framer-motion, gsap
└── next.config.mjs                        ← modified: add turbopack.root silencer
```

**File structure reasoning:**
- Components are grouped by **role** (landing/nav/footer/ui), not technical layer. A change to the Reel touches one folder.
- CSS Modules colocated with components — matches dashboard convention, keeps per-section styling local.
- `lib/` holds engine-agnostic helpers (motion configs, GSAP plugin registration) so no component reinvents spring values.
- `app/api/early-access/route.ts` is the Vercel Function. Fluid Compute default, Node.js runtime.

---

## 2. Dependencies

One install. No other packages.

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
npm install framer-motion gsap --legacy-peer-deps
```

**Why each:**
- `framer-motion` — spring physics (`type: "spring", stiffness: 100, damping: 20`), `layoutId` shared-element transitions, `useScroll`/`useTransform` for nav and tab morphs. Only pkg that cleanly combines declarative animation with shared-element layout transitions.
- `gsap` — for the Reel only. `ScrollTrigger` is the gold standard for pinned-stage scroll choreography (taste-skill §8 validates this split). We also get strict useEffect cleanup control, avoiding the Framer scroll-listener performance pitfalls.

---

## 3. Prerequisites already completed (2026-04-16)

These are done. Verify quickly before starting.

| Item | Status |
|---|---|
| `globals.css` migrated to dashboard tokens | ✓ |
| `layout.tsx` migrated to `next/font/google` | ✓ |
| `Button.tsx` uses `--accent-color` | ✓ |
| `page.tsx` uses `--accent-color` (all refs) | ✓ |
| `page.module.css` uses `--accent-color` | ✓ |
| Hero ASCII grid uses `rgba(11, 13, 196, ...)` | ✓ |
| Dev server compiles clean at `localhost:3001` | ✓ |

**Verification command (run once before starting):**
```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
grep -rn "var(--accent)\|--accent-dim\|--accent-border\|rgba(13, 15, 237" src/ 2>&1 | head
```
Expected: no matches.

---

## Phase 1: Scaffolding foundations

Establish deps, motion config, GSAP registration, and silence the Turbopack workspace warning.

### Task 1.1: Install dependencies

**Files:**
- Modify: `canary-landing/package.json` (via npm)

**Why:** framer-motion drives all UI motion except the Reel; gsap drives the Reel. Install both now so every subsequent task can import from them without re-running npm.

- [ ] **Step 1: Install packages**

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
npm install framer-motion gsap --legacy-peer-deps
```

- [ ] **Step 2: Verify packages installed**

```bash
npm ls framer-motion gsap --depth=0
```

Expected: both show as direct dependencies with version numbers.

- [ ] **Step 3: Restart dev server**

Kill the existing background dev server and relaunch to pick up deps:
```bash
# Find and stop existing dev server first, then:
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
npm run dev
```

Expected: `✓ Ready in <1s`, no peer-dep errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT
git add canary-landing/package.json canary-landing/package-lock.json
git commit -m "feat(landing): add framer-motion and gsap"
```

### Task 1.2: Silence Turbopack workspace warning

**Files:**
- Modify: `canary-landing/next.config.mjs`

**Why:** Dev server has been logging `Next.js inferred your workspace root` on every request. Noisy and misleading. Locking the root to the landing directory makes the message disappear and prevents accidental cross-repo resolution.

- [ ] **Step 1: Read current config**

```bash
cat /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing/next.config.mjs
```

- [ ] **Step 2: Replace with root-locked config**

Write to `canary-landing/next.config.mjs`:
```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Restart dev server, verify warning gone**

Expected: no `workspace root` warning on HTTP requests.

- [ ] **Step 4: Commit**

```bash
git add canary-landing/next.config.mjs
git commit -m "chore(landing): lock turbopack root to silence workspace warning"
```

### Task 1.3: Create motion config library

**Files:**
- Create: `canary-landing/src/lib/motion.ts`

**Why:** taste-skill §3 Rule 5 + §4 — spring physics on every interaction, never linear easing. Centralizing the spring config prevents drift (Task 3.x's hero stagger and Task 7.x's tab morph must use the *same* spring feel — 100/20 — or the page feels incoherent).

- [ ] **Step 1: Create motion.ts**

Write to `canary-landing/src/lib/motion.ts`:
```ts
/**
 * Shared Framer Motion configs.
 * Do not invent new spring values per-component — the page's
 * sense of materiality comes from every interaction sharing
 * the same physics signature.
 *
 * Rationale: taste-skill §3 Rule 5 and §4 — spring physics,
 * never linear easing. stiffness/damping 100/20 is a
 * premium, weighty feel that reads as "system responds."
 */

import type { Transition, Variants } from 'framer-motion';

/** Base spring — use for 90% of motion. */
export const spring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};

/** Snappier spring — use for taps, dismissals, quick state swaps. */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
};

/** Stagger for parent/child lists (hero headline words, nav links). */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/** Matches staggerParent — items fade up on entrance. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring },
};

/** Tactile press: scale down on active. */
export const tapPress = {
  scale: 0.98,
  transition: springSnappy,
};
```

- [ ] **Step 2: Commit**

```bash
git add canary-landing/src/lib/motion.ts
git commit -m "feat(landing): add shared framer-motion spring config"
```

### Task 1.4: Create GSAP registration module

**Files:**
- Create: `canary-landing/src/lib/gsap-register.ts`

**Why:** GSAP plugins (`ScrollTrigger`) must be registered once per bundle. Centralizing prevents double-registration and provides a single import point for plugin-using components (only the Reel, in our case). taste-skill §8 rule: never mix GSAP and Framer in the same component tree — by only importing from this module inside Reel-scoped components, we structurally enforce the isolation.

- [ ] **Step 1: Create gsap-register.ts**

Write to `canary-landing/src/lib/gsap-register.ts`:
```ts
/**
 * GSAP + ScrollTrigger registration.
 *
 * Import this module only inside the Reel component tree.
 * Framer Motion and GSAP must never coexist in the same
 * component tree (taste-skill §8) — this module serves as
 * the structural boundary.
 */

'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Commit**

```bash
git add canary-landing/src/lib/gsap-register.ts
git commit -m "feat(landing): add gsap ScrollTrigger registration module"
```

### Task 1.5: Clean up duplicate AsciiHover at project root

**Files:**
- Delete: `canary-landing/AsciiHover.jsx` (project root)

**Why:** The canonical AsciiHover lives at `src/components/ui/AsciiHover.jsx` and is what Button imports via `@/components/ui/AsciiHover`. The root-level duplicate is dead code that will confuse future maintainers. redesign-skill principle: audit existing code as we pass through, cut what doesn't serve.

- [ ] **Step 1: Confirm no imports reference the root file**

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
grep -rn "from ['\"].\/AsciiHover['\"]\|from ['\"]\.\./AsciiHover['\"]" src/ 2>&1
```
Expected: no output.

- [ ] **Step 2: Delete the root duplicate**

```bash
rm /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing/AsciiHover.jsx
```

- [ ] **Step 3: Dev server recompiles clean**

Check dev server output. Expected: no module-not-found errors, page still renders.

- [ ] **Step 4: Commit**

```bash
git add -A canary-landing/AsciiHover.jsx
git commit -m "chore(landing): remove duplicate AsciiHover at project root"
```

---

## Phase 2: Extract existing scaffolding into reusable components

Before redesigning, we separate concerns. The current `page.tsx` is a 700-line mono-file with Nav, Footer, Hero, Carousel, Problem, Differentiator, BottomCTA, and several inline ASCII components. We need the Nav + Footer + SectionLabel + LiveIndicator in their own files so the redesign phases have clean boundaries.

### Task 2.1: Extract Nav into its own component (existing behavior preserved first)

**Files:**
- Create: `canary-landing/src/components/nav/Nav.tsx`
- Create: `canary-landing/src/components/nav/Nav.module.css`
- Modify: `canary-landing/src/app/page.tsx` (remove inline Nav, import the new one)

**Why:** Separation of concerns — the redesign's nav-inversion (Task 4.1) is a focused change if Nav lives in its own file. Extracting **without changing behavior first** means we can verify nothing visually regresses before touching logic. vercel-plugin:react-best-practices: one component, one responsibility.

- [ ] **Step 1: Read current Nav code location**

In `src/app/page.tsx`, Nav is defined around lines 576–681. Scan it.

- [ ] **Step 2: Create Nav component with existing behavior preserved**

Write to `canary-landing/src/components/nav/Nav.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './Nav.module.css';

/**
 * Nav — floating pill that morphs to full width on scroll.
 * NOTE: this is the legacy behavior preserved for refactor safety.
 * Task 4.1 will invert this to start full-width → morph to pill.
 */
export function Nav() {
  const [t, setT] = useState(0); // 0 = pill, 1 = full-width

  useEffect(() => {
    const onScroll = () => {
      const raw = Math.min(1, Math.max(0, window.scrollY / 200));
      setT(raw);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lerp = (a: number, b: number) => a + (b - a) * t;

  const top = lerp(160, 0);
  const sidePct = lerp(42, 0);
  const radius = lerp(999, 0);
  const height = lerp(36, 40);
  const linksOpacity = Math.max(0, (t - 0.7) / 0.3);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 41,
          background: 'var(--card-bg)',
          zIndex: 99,
          opacity: t,
          pointerEvents: 'none',
        }}
      />
      <nav
        style={{
          position: 'fixed',
          top,
          left: `${sidePct}%`,
          right: `${sidePct}%`,
          borderRadius: radius,
          zIndex: 100,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: `0 ${lerp(40, 20)}px`,
          background: 'var(--card-bg)',
          borderTop: t > 0.95 ? 'none' : '1px solid var(--grey-stroke)',
          borderLeft: t > 0.95 ? 'none' : '1px solid var(--grey-stroke)',
          borderRight: t > 0.95 ? 'none' : '1px solid var(--grey-stroke)',
          borderBottom: '1px solid var(--grey-stroke)',
          willChange: 'top, left, right, border-radius',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginLeft: `calc(${Math.round((1 - t) * 50)}% - ${Math.round((1 - t) * 50)}px)`,
            transform: `translateX(-${Math.round((1 - t) * 50)}%)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/canarylogo.svg" alt="Canary" style={{ height: 16 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono-alt)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-black)',
            }}
          >
            CANARY
          </span>
        </div>

        <div
          className={styles.navLinks}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: linksOpacity,
            pointerEvents: linksOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <a href="/features" className={styles.navLink}>Features</a>
          <a href="/about" className={styles.navLink}>About</a>
          <a href="/blog" className={styles.navLink}>Blog</a>
          <a href="/login" className={styles.navLink}>Login</a>
          <Button variant="primary" size="sm" asciiVariant="both" tag="a" href="#early-access">
            Get early access
          </Button>
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 3: Create Nav.module.css**

Write to `canary-landing/src/components/nav/Nav.module.css`:
```css
.navLinks {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navLink {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--icon-grey);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.navLink:hover {
  color: var(--text-black);
}
```

- [ ] **Step 4: Update page.tsx to import Nav**

In `src/app/page.tsx`:
1. At the top, add: `import { Nav } from '@/components/nav/Nav';`
2. Delete the inline `function Nav()` definition (roughly lines 576–681).
3. Delete the `.navLinks` and `.navLink` classes from `page.module.css` (they now live in Nav.module.css).

- [ ] **Step 5: Verify dev server renders identically**

Reload `localhost:3001`. Expected: nav looks and behaves exactly as before. Nav link hrefs now point to `/features`, `/about`, `/blog`, `/login` (placeholder routes, will 404 until Phase 9).

- [ ] **Step 6: Commit**

```bash
git add canary-landing/src/components/nav canary-landing/src/app/page.tsx canary-landing/src/app/page.module.css
git commit -m "refactor(landing): extract Nav into src/components/nav"
```

### Task 2.2: Extract Footer into its own component

**Files:**
- Create: `canary-landing/src/components/footer/Footer.tsx`
- Create: `canary-landing/src/components/footer/Footer.module.css`
- Modify: `canary-landing/src/app/page.tsx`
- Modify: `canary-landing/src/app/page.module.css` (remove footer classes)

**Why:** Same extraction rationale as Nav. Footer is called "cutesy-patootsy" per the brainstorm — we keep it, just move it.

- [ ] **Step 1: Create Footer component**

Write to `canary-landing/src/components/footer/Footer.tsx`:
```tsx
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brandRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canarylogo.svg"
            alt="Canary"
            className={styles.brandLogo}
          />
          <span className={styles.brandTagline}>
            Canary. QA for computer-use agents.
          </span>
        </div>

        <div className={styles.footerLinks}>
          <a href="#docs">Docs</a>
          <span className={styles.footerDivider}>·</span>
          <a href="#github">GitHub</a>
          <span className={styles.footerDivider}>·</span>
          <a href="#npm">npm</a>
          <span className={styles.footerDivider}>·</span>
          <a href="#contact">Contact</a>
        </div>

        <p className={styles.footerLegal}>© 2026 Canary · mycanarybird.com</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create Footer.module.css**

Write to `canary-landing/src/components/footer/Footer.module.css`:
```css
.footer {
  background: var(--black);
  color: var(--text-white);
  padding: var(--space-12) var(--space-8);
}

.footerInner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.brandRow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.brandLogo {
  height: 20px;
  filter: brightness(0) invert(1);
}

.brandTagline {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(247, 247, 247, 0.5);
}

.footerLinks {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.footerLinks a {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(247, 247, 247, 0.35);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footerLinks a:hover {
  color: var(--text-white);
}

.footerDivider {
  color: rgba(247, 247, 247, 0.2);
}

.footerLegal {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  color: rgba(247, 247, 247, 0.2);
}
```

- [ ] **Step 3: Update page.tsx to import Footer**

In `src/app/page.tsx`:
1. Add: `import { Footer } from '@/components/footer/Footer';`
2. Delete the inline `function Footer()` definition.
3. Remove `.footer`, `.footerInner`, `.footerLinks`, `.footerLegal` from `page.module.css`.

- [ ] **Step 4: Verify dev server renders identically**

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/components/footer canary-landing/src/app/page.tsx canary-landing/src/app/page.module.css
git commit -m "refactor(landing): extract Footer into src/components/footer"
```

### Task 2.3: Create SectionLabel component

**Files:**
- Create: `canary-landing/src/components/ui/SectionLabel.tsx`
- Modify: `canary-landing/src/app/page.tsx` (remove inline, import)

**Why:** SectionLabel is already used by Problem and Differentiator sections. We'll keep it after removing those sections (it's still useful for Reel frame labels if we want consistency, and it's small/focused). taste-skill §7 (no 3-column cards): this is a safer structural component anyway.

- [ ] **Step 1: Create SectionLabel**

Write to `canary-landing/src/components/ui/SectionLabel.tsx`:
```tsx
import styles from './SectionLabel.module.css';

export interface SectionLabelProps {
  text: string;
}

/**
 * Mono-uppercase label with a trailing horizontal rule.
 * Used as the section header eyebrow on Problem, Differentiator,
 * and anywhere else we need a monochrome anchor.
 */
export function SectionLabel({ text }: SectionLabelProps) {
  return (
    <div className={styles.sectionLabel}>
      <span className={styles.sectionLabelText}>{text}</span>
      <div className={styles.sectionLabelLine} />
    </div>
  );
}
```

- [ ] **Step 2: Create SectionLabel.module.css**

Write to `canary-landing/src/components/ui/SectionLabel.module.css`:
```css
.sectionLabel {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  margin-bottom: var(--space-6);
}

.sectionLabelText {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--icon-grey);
  flex-shrink: 0;
  white-space: nowrap;
}

.sectionLabelLine {
  flex: 1;
  height: 1px;
  background: var(--grey-stroke);
}
```

- [ ] **Step 3: Update page.tsx**

In `src/app/page.tsx`:
1. Add: `import { SectionLabel } from '@/components/ui/SectionLabel';`
2. Delete the inline `function SectionLabel(...)` near the top.
3. Remove `.sectionLabel`, `.sectionLabelText`, `.sectionLabelLine` from `page.module.css`.

- [ ] **Step 4: Verify Problem and Differentiator sections still show their section labels**

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/components/ui/SectionLabel.tsx canary-landing/src/components/ui/SectionLabel.module.css canary-landing/src/app/page.tsx canary-landing/src/app/page.module.css
git commit -m "refactor(landing): extract SectionLabel into src/components/ui"
```

### Task 2.4: Create LiveIndicator component

**Files:**
- Create: `canary-landing/src/components/ui/LiveIndicator.tsx`
- Create: `canary-landing/src/components/ui/LiveIndicator.module.css`

**Why:** This is the monitor-esque signature micro-detail per ui-ux-pro-max `Real-Time Monitoring` style — `● LIVE canary observing`. Used in hero top-right and as part of nav's `status: observing` label. Single source of truth prevents divergence.

- [ ] **Step 1: Create LiveIndicator**

Write to `canary-landing/src/components/ui/LiveIndicator.tsx`:
```tsx
import styles from './LiveIndicator.module.css';

export interface LiveIndicatorProps {
  label?: string;
  /** Override color (defaults to --safe, muted forest green). */
  color?: string;
  /** Visual size — 'sm' for nav chrome, 'md' for hero badge. */
  size?: 'sm' | 'md';
}

/**
 * Pulsing status dot with an adjacent mono label.
 * Default color: --safe (muted forest green #2D7A55) — reads
 * as "system operational" per ui-ux-pro-max Real-Time Monitoring.
 *
 * Honors prefers-reduced-motion: pulse disabled, dot static.
 */
export function LiveIndicator({
  label = 'LIVE',
  color = 'var(--safe)',
  size = 'md',
}: LiveIndicatorProps) {
  const sizeClass = size === 'sm' ? styles.small : styles.medium;
  return (
    <div className={`${styles.wrapper} ${sizeClass}`} aria-hidden="true">
      <span className={styles.dot} style={{ background: color }} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create LiveIndicator.module.css**

Write to `canary-landing/src/components/ui/LiveIndicator.module.css`:
```css
.wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--icon-grey);
}

.medium {
  font-size: 0.6875rem;
}

.small {
  font-size: 0.625rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 0 currentColor;
  animation: pulse var(--pulse-duration) infinite;
}

.medium .dot {
  width: 8px;
  height: 8px;
}

.label {
  line-height: 1;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
  }
}
```

- [ ] **Step 3: Commit (not yet wired to page, ready for Phase 3)**

```bash
git add canary-landing/src/components/ui/LiveIndicator.tsx canary-landing/src/components/ui/LiveIndicator.module.css
git commit -m "feat(landing): add LiveIndicator component with pulsing dot"
```

---

## Phase 3: Hero redesign

Spec §5.2. Asymmetric left-aligned text over the ASCII grid, CTAs, monitor micro-details, staggered Framer entrance.

### Task 3.1: Create Hero shell (server component)

**Files:**
- Create: `canary-landing/src/components/landing/Hero.tsx`
- Create: `canary-landing/src/components/landing/Hero.module.css`
- Modify: `canary-landing/src/app/page.tsx`

**Why:** taste-skill §2 interactivity isolation — Hero is a server shell; its motion pieces are client-only leaves. Asymmetric layout (taste-skill §3 Rule 3) beats the current centered hero.

- [ ] **Step 1: Create Hero.tsx**

Write to `canary-landing/src/components/landing/Hero.tsx`:
```tsx
import { Button } from '@/components/ui/Button';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { HeroAsciiGrid } from './HeroAsciiGrid';
import { HeroCursor } from './HeroCursor';
import styles from './Hero.module.css';

/**
 * Hero — asymmetric left-aligned position + promise.
 * Per taste-skill §3 Rule 3: anti-center bias at DV > 4.
 * Monitor micro-detail: top-right LiveIndicator (pulsing green).
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      {/* Top-right monitor badge — absolutely positioned */}
      <div className={styles.liveBadge}>
        <LiveIndicator label="LIVE · CANARY OBSERVING" />
      </div>

      {/* ASCII grid — bleeds past right edge */}
      <HeroAsciiGrid />

      {/* Asymmetric left text column */}
      <div className={styles.content}>
        <h1 className={styles.headline}>
          The trust layer for
          <br />
          autonomous agents.
          <HeroCursor />
        </h1>

        <p className={styles.subtitle}>
          A drop-in SDK that sees every action, blocks every mistake,
          and learns your agent. Built for Claude Code, Browser Use,
          openClaw, and Hermes.
        </p>

        <div className={styles.ctaRow}>
          <Button
            variant="primary"
            size="md"
            asciiVariant="both"
            tag="a"
            href="#early-access"
            style={{ padding: '0 36px' }}
          >
            Get early access
          </Button>
          <Button
            variant="secondary"
            size="md"
            asciiVariant="right"
            tag="a"
            href="#docs"
          >
            Read the docs →
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Hero.module.css**

Write to `canary-landing/src/components/landing/Hero.module.css`:
```css
.hero {
  position: relative;
  min-height: 100dvh;  /* taste-skill §2: NEVER use h-screen (iOS Safari bug) */
  background: var(--bg);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: var(--space-16) var(--space-8) var(--space-16) var(--space-10);
}

.liveBadge {
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 2;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin-top: 80px; /* pull up from dead center */
}

.headline {
  font-family: var(--font-sans);
  font-size: clamp(2.75rem, 4.5vw + 0.5rem, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: var(--text-black);
  text-wrap: balance;
}

.subtitle {
  font-family: var(--font-sans);
  font-size: clamp(1rem, 0.9vw + 0.5rem, 1.125rem);
  font-weight: 400;
  color: var(--icon-grey);
  letter-spacing: -0.005em;
  line-height: 1.6;
  margin-top: var(--space-6);
  max-width: 52ch;
}

.ctaRow {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-10);
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero {
    padding: var(--space-16) var(--space-5) var(--space-12) var(--space-5);
    align-items: flex-start;
    padding-top: 120px;
  }
  .liveBadge {
    top: 16px;
    right: 16px;
  }
  .content {
    margin-top: 0;
  }
}
```

- [ ] **Step 3: Replace old Hero in page.tsx**

In `src/app/page.tsx`:
1. Delete the inline `function Hero()` definition (lines ~168–206).
2. Delete the inline `function AnimatedAsciiGrid()` and helpers `AsciiGlyph`, `useColCount`, `TIERS` (they'll live inside `HeroAsciiGrid` in Task 3.2).
3. Add: `import { Hero } from '@/components/landing/Hero';`
4. Update the page's `<main>` to use `<Hero />`.

(HeroAsciiGrid and HeroCursor components will be created in the next tasks — expect TypeScript errors until then; that's OK, finish Task 3.2 and 3.3 before verifying.)

- [ ] **Step 4: Skip dev server verification until Task 3.3 complete**

### Task 3.2: Create HeroAsciiGrid (client component)

**Files:**
- Create: `canary-landing/src/components/landing/HeroAsciiGrid.tsx`

**Why:** Preserves the existing animated ASCII grid that IS Canary's visual texture, but repositioned to bleed right (spec §5.2). taste-skill §2 leaf isolation — ASCII grid is self-contained client component.

- [ ] **Step 1: Create HeroAsciiGrid.tsx**

Write to `canary-landing/src/components/landing/HeroAsciiGrid.tsx`:
```tsx
'use client';

import { useState, useEffect } from 'react';

// Character tiers from bottom to top — increasing density
const TIERS: { char: string; rows: number; opacity: number }[] = [
  { char: '.', rows: 2, opacity: 0.3 },
  { char: ':', rows: 2, opacity: 0.4 },
  { char: "'", rows: 3, opacity: 0.45 },
  { char: '-', rows: 3, opacity: 0.5 },
  { char: '~', rows: 3, opacity: 0.55 },
  { char: '*', rows: 3, opacity: 0.6 },
  { char: '#', rows: 3, opacity: 0.7 },
  { char: '░', rows: 3, opacity: 0.8 },
  { char: '▒', rows: 3, opacity: 0.9 },
];

function useColCount() {
  const [cols, setCols] = useState(240);
  useEffect(() => {
    const update = () => {
      setCols(Math.ceil(window.innerWidth / 5.5) + 40);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

/**
 * Animated ASCII grid that bleeds past the right edge.
 * Colors derive from --accent-color (#0B0DC4) at varying opacities.
 *
 * Character rotate-once animation on hover is intentional:
 * readers who pause here get a small reward. taste-skill §4
 * "perpetual micro-interactions" principle.
 */
export function HeroAsciiGrid() {
  const COLS = useColCount();

  const allRows: { char: string; opacity: number }[] = [];
  for (const tier of TIERS) {
    for (let r = 0; r < tier.rows; r++) {
      allRows.push({ char: tier.char, opacity: tier.opacity });
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: '-10vw',  // bleed past right edge
        zIndex: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.05em',
        userSelect: 'none',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {allRows.map((row, idx) => {
        // Top rows have a center gap; closes by row 7
        const gapEndRow = 7;
        const gapFraction = idx >= gapEndRow ? 0 : 0.7 * (1 - idx / gapEndRow);
        const gapCount = Math.floor(COLS * gapFraction);
        const mid = Math.floor(COLS / 2);
        const halfGap = Math.floor(gapCount / 2);
        const gapStart = mid - halfGap;
        const gapEnd = mid + halfGap;

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              color: `rgba(11, 13, 196, ${row.opacity})`, // --accent-color alpha
              lineHeight: '14px',
            }}
          >
            {Array.from({ length: COLS }, (_, ci) => {
              const inGap = gapCount > 0 && ci >= gapStart && ci < gapEnd;
              return (
                <span
                  key={ci}
                  style={{
                    display: 'inline-block',
                    width: '0.55em',
                    textAlign: 'center',
                  }}
                >
                  {inGap ? '\u00A0' : row.char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit (after Task 3.3 completes)**

### Task 3.3: Create HeroCursor (blinking client component)

**Files:**
- Create: `canary-landing/src/components/landing/HeroCursor.tsx`
- Create: `canary-landing/src/components/landing/HeroCursor.module.css`

**Why:** Monitor-esque micro-detail (ui-ux-pro-max Terminal CLI style, applied lightly). Blinks at `--blink-duration` for 4 pulses after the headline completes, then fades to static. Reads as "system alive" without shouting.

- [ ] **Step 1: Create HeroCursor.tsx**

Write to `canary-landing/src/components/landing/HeroCursor.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './HeroCursor.module.css';

/**
 * Blinking cursor appended after the hero headline.
 * Blinks 4 times, then stays solid (muted).
 * Honors prefers-reduced-motion — rendered static.
 */
export function HeroCursor() {
  const [phase, setPhase] = useState<'blinking' | 'static'>('blinking');

  useEffect(() => {
    // 4 blinks × 800ms cycle = 3.2s
    const t = window.setTimeout(() => setPhase('static'), 3200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <span
      className={`${styles.cursor} ${phase === 'blinking' ? styles.blinking : styles.static}`}
      aria-hidden="true"
    >
      ▊
    </span>
  );
}
```

- [ ] **Step 2: Create HeroCursor.module.css**

Write to `canary-landing/src/components/landing/HeroCursor.module.css`:
```css
.cursor {
  display: inline-block;
  color: var(--accent-color);
  margin-left: 4px;
  font-weight: 400;
  transform: translateY(-0.05em);
}

.blinking {
  animation: cursorBlink var(--blink-duration) step-end infinite;
}

.static {
  opacity: 0.35;
}

@keyframes cursorBlink {
  0%, 49.9% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .blinking {
    animation: none;
    opacity: 0.35;
  }
}
```

- [ ] **Step 3: Verify dev server renders Hero correctly**

Reload `localhost:3001`. Expected:
- Headline left-aligned, ~4.5rem
- Subtitle below, muted grey, max ~52 chars per line
- Two CTAs, primary (blue filled) + secondary (ghost)
- Top-right: `● LIVE · CANARY OBSERVING` label, green dot pulsing
- Bottom half: ASCII grid in deep-blue, densifying downward
- Blinking cursor after "agents." for ~3 seconds, then dims to static

- [ ] **Step 4: Commit Hero + subcomponents together**

```bash
git add canary-landing/src/components/landing/Hero.tsx canary-landing/src/components/landing/Hero.module.css canary-landing/src/components/landing/HeroAsciiGrid.tsx canary-landing/src/components/landing/HeroCursor.tsx canary-landing/src/components/landing/HeroCursor.module.css canary-landing/src/app/page.tsx
git commit -m "feat(landing): redesign hero to asymmetric left with live badge and blinking cursor"
```

### Task 3.4: Add Framer entrance stagger to Hero

**Files:**
- Modify: `canary-landing/src/components/landing/Hero.tsx` (wrap content in motion)

**Why:** taste-skill §3 Rule 5 — load states must have full interaction cycles. Staggered entrance via Framer `staggerParent`/`staggerChild` (from `src/lib/motion.ts`) gives the hero the "page boots up" feel that reinforces the monitor-esque brand without being gimmicky.

- [ ] **Step 1: Wrap content in motion and add variants**

Modify `canary-landing/src/components/landing/Hero.tsx`. Convert the file to a client component and wrap the content:

```tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { HeroAsciiGrid } from './HeroAsciiGrid';
import { HeroCursor } from './HeroCursor';
import { staggerParent, staggerChild } from '@/lib/motion';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.liveBadge}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <LiveIndicator label="LIVE · CANARY OBSERVING" />
      </motion.div>

      <HeroAsciiGrid />

      <motion.div
        className={styles.content}
        variants={staggerParent}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className={styles.headline} variants={staggerChild}>
          The trust layer for
          <br />
          autonomous agents.
          <HeroCursor />
        </motion.h1>

        <motion.p className={styles.subtitle} variants={staggerChild}>
          A drop-in SDK that sees every action, blocks every mistake,
          and learns your agent. Built for Claude Code, Browser Use,
          openClaw, and Hermes.
        </motion.p>

        <motion.div className={styles.ctaRow} variants={staggerChild}>
          <Button
            variant="primary"
            size="md"
            asciiVariant="both"
            tag="a"
            href="#early-access"
            style={{ padding: '0 36px' }}
          >
            Get early access
          </Button>
          <Button
            variant="secondary"
            size="md"
            asciiVariant="right"
            tag="a"
            href="#docs"
          >
            Read the docs →
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify stagger plays on page load**

Reload `localhost:3001`. Expected: headline appears first, subtitle follows ~60ms later, CTAs last. Each element slides up slightly from +12px. LiveIndicator fades in last.

- [ ] **Step 3: Verify prefers-reduced-motion behavior**

In DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce. Reload. Expected: elements appear without animation (instant).

- [ ] **Step 4: Commit**

```bash
git add canary-landing/src/components/landing/Hero.tsx
git commit -m "feat(landing): add framer-motion staggered entrance to hero"
```

---

## Phase 4: Nav inversion (full-width → pill on scroll)

### Task 4.1: Invert Nav morph direction

**Files:**
- Modify: `canary-landing/src/components/nav/Nav.tsx`
- Modify: `canary-landing/src/components/nav/Nav.module.css` (minor)

**Why:** Spec §5.1 + user direction. Nav starts full-width for maximum hero-period presence (so initial viewers see it's a real product with docs/login), then compresses to a pill to get out of the way for scroll-focused reading.

- [ ] **Step 1: Rewrite Nav with inverted `t`**

Rewrite `canary-landing/src/components/nav/Nav.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { spring } from '@/lib/motion';
import styles from './Nav.module.css';

/**
 * Nav — full-width bar at top → floating pill on scroll.
 * t = 0 at top (full-width), t = 1 past scrollY 200 (pill).
 */
export function Nav() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const raw = Math.min(1, Math.max(0, window.scrollY / 200));
      setT(raw);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lerp = (a: number, b: number) => a + (b - a) * t;

  // t=0: full-width bar at top. t=1: floating pill.
  const top = lerp(0, 16);
  const sidePct = lerp(0, 42);
  const radius = lerp(0, 999);
  const linksOpacity = 1 - Math.max(0, (t - 0.3) / 0.4);
  // Links fade out as we compress; compressed state shows only logo + primary CTA
  const compressedCtaOpacity = Math.max(0, (t - 0.5) / 0.5);

  return (
    <motion.nav
      layout
      transition={spring}
      style={{
        position: 'fixed',
        top,
        left: `${sidePct}%`,
        right: `${sidePct}%`,
        borderRadius: radius,
        zIndex: 100,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${lerp(24, 14)}px`,
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderTopWidth: t > 0.5 ? 1 : 0,
        willChange: 'top, left, right, border-radius',
      }}
    >
      {/* Left: logo + wordmark + (scrolled) status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/canarylogo.svg" alt="Canary" style={{ height: 16 }} />
        <span className={styles.wordmark}>CANARY</span>
        {t > 0.6 && (
          <span className={styles.statusLabel} aria-hidden="true">
            status: observing
          </span>
        )}
      </div>

      {/* Right: nav links (fade out on scroll) + CTAs */}
      <div className={styles.navRight}>
        <div
          className={styles.navLinks}
          style={{
            opacity: linksOpacity,
            pointerEvents: linksOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <a href="/features" className={styles.navLink}>Features</a>
          <a href="/about" className={styles.navLink}>About</a>
          <a href="/blog" className={styles.navLink}>Blog</a>
          <a href="/login" className={styles.navLink}>Login</a>
        </div>
        <div
          style={{
            opacity: t < 0.5 ? 1 : compressedCtaOpacity,
            transition: 'opacity 150ms ease',
          }}
        >
          <Button variant="primary" size="sm" asciiVariant="both" tag="a" href="#early-access">
            Get early access
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Update Nav.module.css**

Modify `canary-landing/src/components/nav/Nav.module.css`:
```css
.navLinks {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  transition: opacity 150ms ease;
}

.navLink {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--icon-grey);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.navLink:hover {
  color: var(--text-black);
}

.navRight {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.wordmark {
  font-family: var(--font-mono-alt);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-black);
  letter-spacing: 0.04em;
}

.statusLabel {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--icon-grey);
  text-transform: lowercase;
  letter-spacing: 0.08em;
  margin-left: var(--space-3);
  padding-left: var(--space-3);
  border-left: 1px solid var(--grey-stroke);
}

@media (max-width: 768px) {
  .navLinks {
    display: none;
  }
  .statusLabel {
    display: none;
  }
}
```

- [ ] **Step 3: Verify**

Reload. Scroll slowly. Expected:
- At scroll 0: full-width nav, all links + CTA visible
- Scrolling down: sides compress inward, bar morphs into centered pill
- Past scroll 200: fully compressed pill with only logo + `status: observing` + primary CTA
- Scrolling up: reverses smoothly

- [ ] **Step 4: Commit**

```bash
git add canary-landing/src/components/nav/Nav.tsx canary-landing/src/components/nav/Nav.module.css
git commit -m "feat(nav): invert morph — full-width at top, pill on scroll"
```

---

## Phase 5: Ecosystem bar

### Task 5.1: Create EcosystemBar

**Files:**
- Create: `canary-landing/src/components/landing/EcosystemBar.tsx`
- Create: `canary-landing/src/components/landing/EcosystemBar.module.css`
- Modify: `canary-landing/src/app/page.tsx`

**Why:** Spec §5.3. Serves as a bridge between hero's "position + promise" and Reel's "here's the product." openClaw's ~1M weekly downloads stat is the single hardest-to-fake legitimacy signal on the page (per startup framing — specificity beats generality).

- [ ] **Step 1: Create EcosystemBar.tsx**

Write to `canary-landing/src/components/landing/EcosystemBar.tsx`:
```tsx
import styles from './EcosystemBar.module.css';

const FRAMEWORKS = [
  { name: 'Claude Code', mark: '◆' },
  { name: 'Browser Use', mark: '◆' },
  { name: 'openClaw', mark: '◆' },
  { name: 'Hermes', mark: '◆' },
];

/**
 * Ecosystem trust bar between hero and Reel.
 * Not a 3-column card row (taste-skill §7 ban). Horizontal list
 * with legitimacy stat below.
 */
export function EcosystemBar() {
  return (
    <section className={styles.bar} aria-label="Supported agent frameworks">
      <div className={styles.row}>
        <span className={styles.prefix}>Built for</span>
        {FRAMEWORKS.map((fw) => (
          <span key={fw.name} className={styles.framework}>
            <span className={styles.mark}>{fw.mark}</span>
            {fw.name}
          </span>
        ))}
      </div>
      <p className={styles.legitimacy}>
        openClaw <span className={styles.mono}>~1M</span> weekly downloads · the new wave
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Create EcosystemBar.module.css**

Write to `canary-landing/src/components/landing/EcosystemBar.module.css`:
```css
.bar {
  background: var(--card-bg);
  border-top: 1px solid var(--grey-stroke);
  border-bottom: 1px solid var(--grey-stroke);
  padding: var(--space-6) var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
  justify-content: center;
}

.prefix {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--icon-grey);
}

.framework {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-black);
}

.mark {
  color: var(--accent-color);
  font-size: 0.75rem;
}

.legitimacy {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--icon-grey);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--text-black);
}

@media (max-width: 768px) {
  .bar {
    padding: var(--space-5) var(--space-5);
  }
  .row {
    gap: var(--space-5);
  }
}
```

- [ ] **Step 3: Replace ContextBar in page.tsx**

In `src/app/page.tsx`:
1. Delete the inline `function ContextBar()` (lines ~212–220).
2. Add: `import { EcosystemBar } from '@/components/landing/EcosystemBar';`
3. Replace `<ContextBar />` in the main composition with `<EcosystemBar />`.
4. Remove `.contextBar`, `.contextBarEyebrow` from `page.module.css`.

- [ ] **Step 4: Verify**

Expected: thin horizontal bar below hero with "Built for ◆ Claude Code ◆ Browser Use ◆ openClaw ◆ Hermes" and legitimacy stat.

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/components/landing/EcosystemBar.tsx canary-landing/src/components/landing/EcosystemBar.module.css canary-landing/src/app/page.tsx canary-landing/src/app/page.module.css
git commit -m "feat(landing): add EcosystemBar replacing ContextBar"
```

---

## Phase 6: The Reel — Observe → Control → Improve

This is the anchor section. GSAP ScrollTrigger drives a pinned 100vh stage across a 300vh scroll range. Three frames, each with left copy + right product visual. No Framer inside the Reel tree (taste-skill §8).

### Task 6.1: Create ReelProgress (side indicator)

**Files:**
- Create: `canary-landing/src/components/landing/Reel/ReelProgress.tsx`
- Create: `canary-landing/src/components/landing/Reel/ReelProgress.module.css`

**Why:** Spec §5.4. Per ui-ux-pro-max `Scroll-Triggered Storytelling`: progress indicator essential. Uses `--gradient-border-active` token for the active-dot ring (taste-skill §4: no box-shadow glow; use gradient border instead).

- [ ] **Step 1: Create ReelProgress.tsx**

Write to `canary-landing/src/components/landing/Reel/ReelProgress.tsx`:
```tsx
import styles from './ReelProgress.module.css';

export interface ReelProgressProps {
  activeIndex: 0 | 1 | 2;
}

const FRAMES = ['OBSERVE', 'CONTROL', 'IMPROVE'];

export function ReelProgress({ activeIndex }: ReelProgressProps) {
  return (
    <div className={styles.progress} aria-label="Reel progress">
      {FRAMES.map((label, i) => {
        const isActive = i === activeIndex;
        return (
          <div key={label} className={styles.row}>
            <div
              className={`${styles.dot} ${isActive ? styles.dotActive : ''}`}
              aria-current={isActive}
            />
            <span className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create ReelProgress.module.css**

Write to `canary-landing/src/components/landing/Reel/ReelProgress.module.css`:
```css
.progress {
  position: absolute;
  left: var(--space-8);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  z-index: 2;
}

.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--icon-grey);
  flex-shrink: 0;
  transition: transform 200ms var(--ease-out-quart);
}

.dotActive {
  width: 12px;
  height: 12px;
  background: var(--card-bg);
  padding: 1px;
  /* gradient ring via background-image layering */
  background-image: var(--gradient-border-active);
  background-origin: border-box;
  background-clip: content-box, border-box;
  border: 1px solid transparent;
}

.label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--icon-grey);
  transition: color 200ms ease;
}

.labelActive {
  color: var(--text-black);
}

@media (max-width: 900px) {
  .progress {
    left: var(--space-5);
  }
  .label {
    display: none;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add canary-landing/src/components/landing/Reel/ReelProgress.tsx canary-landing/src/components/landing/Reel/ReelProgress.module.css
git commit -m "feat(reel): add ReelProgress side indicator"
```

### Task 6.2: Create ReelFrame (shared frame shell)

**Files:**
- Create: `canary-landing/src/components/landing/Reel/ReelFrame.tsx`
- Create: `canary-landing/src/components/landing/Reel/ReelFrame.module.css`

**Why:** The three frames share structure (50/50 split, copy left, product visual right with card-gradient + scanline). Extracting the shell means each frame component is just content + the embedded stat. DRY.

- [ ] **Step 1: Create ReelFrame.tsx**

Write to `canary-landing/src/components/landing/Reel/ReelFrame.tsx`:
```tsx
import { ReactNode } from 'react';
import styles from './ReelFrame.module.css';

export interface ReelFrameProps {
  label: string;
  headline: string;
  body: ReactNode;
  stat: {
    value: string;
    caption: string;
  };
  visual: ReactNode;
  /** Opacity/transform driven by GSAP from the parent Reel. */
  isActive: boolean;
}

/**
 * Shared shell for OBSERVE / CONTROL / IMPROVE.
 * Left: label, headline, body, embedded stat.
 * Right: product visual with --card-gradient bg + scanline overlay.
 */
export function ReelFrame({ label, headline, body, stat, visual, isActive }: ReelFrameProps) {
  return (
    <div className={`${styles.frame} ${isActive ? styles.active : ''}`}>
      <div className={styles.copyColumn}>
        <span className={styles.label}>{label}</span>
        <h3 className={styles.headline}>{headline}</h3>
        <div className={styles.body}>{body}</div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stat.value}</span>
          <span className={styles.statCaption}>{stat.caption}</span>
        </div>
      </div>
      <div className={styles.visualColumn}>
        <div className={styles.visualContainer}>
          {visual}
          <div className={styles.scanline} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ReelFrame.module.css**

Write to `canary-landing/src/components/landing/Reel/ReelFrame.module.css`:
```css
.frame {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-16) var(--space-12) 160px;
  /* padding-left = 160px = space-16 + space-16 to clear ReelProgress */
  opacity: 0;
  transition: opacity 300ms var(--ease-out-quart);
  pointer-events: none;
}

.active {
  opacity: 1;
  pointer-events: auto;
}

.copyColumn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 480px;
}

.label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--icon-grey);
  margin-bottom: var(--space-6);
}

.headline {
  font-family: var(--font-sans);
  font-size: clamp(1.75rem, 2.2vw + 0.5rem, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: var(--text-black);
  text-wrap: balance;
  margin-bottom: var(--space-6);
}

.body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--icon-grey);
  max-width: 52ch;
}

.stat {
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: 1px solid var(--grey-stroke);
  display: flex;
  align-items: baseline;
  gap: var(--space-5);
}

.statValue {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-black);
  line-height: 1;
}

.statCaption {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--icon-grey);
  max-width: 32ch;
  line-height: 1.4;
}

.visualColumn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) 0;
}

.visualContainer {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--card-gradient);
  border: 1px solid var(--grey-stroke);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: 0 20px 40px -20px rgba(10, 10, 10, 0.08);
}

.scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    var(--scanline-overlay) 3px,
    var(--scanline-overlay) 4px
  );
}

@media (max-width: 900px) {
  .frame {
    grid-template-columns: 1fr;
    padding: var(--space-10) var(--space-5);
    gap: var(--space-8);
  }
  .visualColumn {
    padding: 0;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add canary-landing/src/components/landing/Reel/ReelFrame.tsx canary-landing/src/components/landing/Reel/ReelFrame.module.css
git commit -m "feat(reel): add shared ReelFrame shell with card-gradient and scanline"
```

### Task 6.3: Create FrameObserve, FrameControl, FrameImprove (content)

**Files:**
- Create: `canary-landing/src/components/landing/Reel/FrameObserve.tsx`
- Create: `canary-landing/src/components/landing/Reel/FrameControl.tsx`
- Create: `canary-landing/src/components/landing/Reel/FrameImprove.tsx`

**Why:** Each frame's content is spec-locked per §5.4 — copy and embedded stat from the founder pitch. Separate files keep each frame focused.

- [ ] **Step 1: Create FrameObserve.tsx**

Write to `canary-landing/src/components/landing/Reel/FrameObserve.tsx`:
```tsx
import { ReelFrame } from './ReelFrame';

export interface FrameObserveProps {
  isActive: boolean;
}

export function FrameObserve({ isActive }: FrameObserveProps) {
  return (
    <ReelFrame
      isActive={isActive}
      label="Observe"
      headline="See what your agent actually did."
      body={
        <>
          Visual replay + action log. Scrub any session. Every click,
          every keystroke, every screen state — recorded. Other tools
          trace text-in and text-out. Canary sees the screen.
        </>
      }
      stat={{
        value: '10ms',
        caption: "Regex + policy rules classify actions in 10ms. Can't be prompt-injected away.",
      }}
      visual={<ObservePlaceholder />}
    />
  );
}

/** Placeholder product visual — replace with real Canary UI screenshot. */
function ObservePlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-black)',
      }}
    >
      {/* Fake timeline header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--grey-stroke)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          SESSION · 2026-04-15 · 14:23:07
        </span>
        <span style={{ color: 'var(--safe)' }}>● RECORDING</span>
      </div>
      {/* Fake action log rows */}
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <LogRow t="14:23:09" a="CLICK" target="div.mail-compose" />
        <LogRow t="14:23:12" a="TYPE" target="To: contact@acme.inc" />
        <LogRow t="14:23:18" a="CLICK" target="button.send" highlight />
        <LogRow t="14:23:18" a="BLOCKED" target="canary.rule('no-spam-pattern')" critical />
      </div>
    </div>
  );
}

function LogRow({
  t,
  a,
  target,
  highlight,
  critical,
}: {
  t: string;
  a: string;
  target: string;
  highlight?: boolean;
  critical?: boolean;
}) {
  const color = critical ? 'var(--critical)' : highlight ? 'var(--text-black)' : 'var(--icon-grey)';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '70px 70px 1fr', gap: 12, color }}>
      <span>{t}</span>
      <span style={{ fontWeight: critical ? 600 : 400 }}>{a}</span>
      <span>{target}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create FrameControl.tsx**

Write to `canary-landing/src/components/landing/Reel/FrameControl.tsx`:
```tsx
import { ReelFrame } from './ReelFrame';

export interface FrameControlProps {
  isActive: boolean;
}

export function FrameControl({ isActive }: FrameControlProps) {
  return (
    <ReelFrame
      isActive={isActive}
      label="Control"
      headline="Set the rules. Canary blocks the mistake before it happens."
      body={
        <>
          Rules live in your codebase. Canary intercepts the agent
          mid-action. Works with any computer-use framework that
          can POST events.
        </>
      }
      stat={{
        value: '88%',
        caption: 'of organizations report agent security incidents.',
      }}
      visual={<ControlPlaceholder />}
    />
  );
}

/** Placeholder product visual — replace with real Canary UI screenshot. */
function ControlPlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-black)',
      }}
    >
      {/* Rule editor preview */}
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: 'var(--radius-card)',
          padding: 12,
          flex: 1,
        }}
      >
        <div style={{ color: 'var(--icon-grey)', fontSize: 10, marginBottom: 8, letterSpacing: '0.08em' }}>
          rules/outreach.ts
        </div>
        <div style={{ color: 'var(--text-black)' }}>
          canary.rule(<span style={{ color: 'var(--accent-color)' }}>&quot;no-spam-pattern&quot;</span>, &#123;
          <br />
          &nbsp;&nbsp;match: /unsubscribe.*urgent/i,
          <br />
          &nbsp;&nbsp;action: &quot;block&quot;,
          <br />
          &#125;)
        </div>
      </div>
      {/* Blocked action badge */}
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(184, 64, 64, 0.06)',
          border: '1px solid var(--critical)',
          borderRadius: 'var(--radius-card)',
          color: 'var(--critical)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>● BLOCKED · OUTREACH SEND</span>
        <span>14:23:18</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create FrameImprove.tsx**

Write to `canary-landing/src/components/landing/Reel/FrameImprove.tsx`:
```tsx
import { ReelFrame } from './ReelFrame';

export interface FrameImproveProps {
  isActive: boolean;
}

export function FrameImprove({ isActive }: FrameImproveProps) {
  return (
    <ReelFrame
      isActive={isActive}
      label="Improve"
      headline="Canary learns your agent."
      body={
        <>
          Session data becomes suggested rules. Insights surface
          patterns your agent keeps hitting. Every session makes
          the next one safer.
        </>
      }
      stat={{
        value: '90%',
        caption: 'lower visual processing cost than text-only QA tools.',
      }}
      visual={<ImprovePlaceholder />}
    />
  );
}

/** Placeholder product visual — replace with real Canary UI screenshot. */
function ImprovePlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-black)',
      }}
    >
      <div style={{ color: 'var(--icon-grey)', fontSize: 10, letterSpacing: '0.08em' }}>
        SUGGESTED RULES · BASED ON 147 SESSIONS
      </div>
      <SuggestedRule
        name="rate-limit-domain-sends"
        reason="Agent sent 12 emails to acme.inc in 3 minutes"
        confidence="94%"
      />
      <SuggestedRule
        name="require-human-review-for-contracts"
        reason="Agent opened 3 PDFs matching /contract\\.pdf/i"
        confidence="81%"
      />
      <SuggestedRule
        name="no-terraform-destroy-after-hours"
        reason="Destructive commands flagged 2× this week"
        confidence="76%"
      />
    </div>
  );
}

function SuggestedRule({
  name,
  reason,
  confidence,
}: {
  name: string;
  reason: string;
  confidence: string;
}) {
  return (
    <div
      style={{
        padding: 10,
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: 'var(--radius-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>+ {name}</span>
        <span style={{ color: 'var(--icon-grey)' }}>{confidence}</span>
      </div>
      <div style={{ color: 'var(--icon-grey)', fontSize: 10 }}>{reason}</div>
    </div>
  );
}
```

- [ ] **Step 4: Commit all three frames**

```bash
git add canary-landing/src/components/landing/Reel/FrameObserve.tsx canary-landing/src/components/landing/Reel/FrameControl.tsx canary-landing/src/components/landing/Reel/FrameImprove.tsx
git commit -m "feat(reel): add OBSERVE CONTROL IMPROVE frames with placeholder visuals"
```

### Task 6.4: Create Reel orchestrator (GSAP ScrollTrigger)

**Files:**
- Create: `canary-landing/src/components/landing/Reel/Reel.tsx`
- Create: `canary-landing/src/components/landing/Reel/Reel.module.css`
- Modify: `canary-landing/src/app/page.tsx`

**Why:** Spec §5.4 + taste-skill §8. GSAP pins a 100vh stage across a 300vh scroll track. `onUpdate` callback reads progress (0-1) and maps to active frame index. Strict `useEffect` cleanup prevents ScrollTrigger leak on route change.

- [ ] **Step 1: Create Reel.tsx**

Write to `canary-landing/src/components/landing/Reel/Reel.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { ReelProgress } from './ReelProgress';
import { FrameObserve } from './FrameObserve';
import { FrameControl } from './FrameControl';
import { FrameImprove } from './FrameImprove';
import styles from './Reel.module.css';

/**
 * The Reel — Observe → Control → Improve.
 * Pinned 100vh stage across 300vh scroll. Scroll progress drives
 * active frame index (0 | 1 | 2).
 *
 * taste-skill §8: this tree must NEVER import framer-motion.
 * taste-skill §5: all animation is opacity; no top/left/width/height.
 */
export function Reel() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      pinSpacing: false,
      onUpdate: (self) => {
        const p = self.progress;
        // 0.00 - 0.33 → 0, 0.33 - 0.66 → 1, 0.66 - 1.00 → 2
        let idx: 0 | 1 | 2 = 0;
        if (p > 0.66) idx = 2;
        else if (p > 0.33) idx = 1;
        setActiveIndex(idx);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.reelSection}>
      <div ref={stageRef} className={styles.stage}>
        <ReelProgress activeIndex={activeIndex} />
        <div className={styles.frames}>
          <FrameObserve isActive={activeIndex === 0} />
          <FrameControl isActive={activeIndex === 1} />
          <FrameImprove isActive={activeIndex === 2} />
        </div>
        <div className={styles.stageBadge} aria-hidden="true">
          <span className={styles.stageBadgeLabel}>FRAME</span>
          <span className={styles.stageBadgeValue}>
            <span className={styles.stageBadgeCurrent}>{activeIndex + 1}</span>
            <span className={styles.stageBadgeDivider}>/</span>
            <span>3</span>
          </span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Reel.module.css**

Write to `canary-landing/src/components/landing/Reel/Reel.module.css`:
```css
.reelSection {
  position: relative;
  height: 300vh;   /* scroll runway */
  background: var(--bg);
}

.stage {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.frames {
  position: absolute;
  inset: 0;
}

.stageBadge {
  position: absolute;
  bottom: var(--space-8);
  right: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  z-index: 2;
  font-family: var(--font-mono);
  color: var(--icon-grey);
}

.stageBadgeLabel {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.stageBadgeValue {
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  display: flex;
  gap: 4px;
}

.stageBadgeCurrent {
  color: var(--text-black);
}

.stageBadgeDivider {
  opacity: 0.4;
}
```

- [ ] **Step 3: Wire Reel into page.tsx**

In `src/app/page.tsx`:
1. Delete inline `function ProductCarousel()` and `CAROUSEL_SLIDES` (lines ~227–388).
2. Also delete `function Problem()` and `function Differentiator()` (we're replacing them with the Reel + Use Cases).
3. Delete the `AsciiWarning` and `AsciiCrossGrid` helpers (no longer needed).
4. Add: `import { Reel } from '@/components/landing/Reel/Reel';`
5. In the main composition: replace the old sections with `<Reel />`.
6. Remove `.diffList`, `.diffListItem`, `.diffListMarker`, `.diffListTitle`, `.diffListDesc`, `.bodyText`, `.heroHeadline`, `.heroTagline`, `.headlineSection`, `.monoNumber`, `.asciiBg`, `.asciiChar`, `.asciiSpinOnce` from `page.module.css` (now unused).

- [ ] **Step 4: Verify Reel**

Reload `localhost:3001`. Expected:
- Hero renders, ecosystem bar renders
- Scrolling past ecosystem bar → Reel section pins
- While pinned, scrolling changes the active frame (OBSERVE → CONTROL → IMPROVE)
- ReelProgress (left side) updates active dot + label color
- Stage badge (bottom right) reads `FRAME 1 / 3` → `2 / 3` → `3 / 3`
- Each frame's product visual (ASCII-style placeholder) shows different content
- After Reel completes, the page continues below (will be use-case selector in Phase 7)

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/components/landing/Reel canary-landing/src/app/page.tsx canary-landing/src/app/page.module.css
git commit -m "feat(reel): wire GSAP ScrollTrigger pinned stage with three frames"
```

### Task 6.5: Verify Reel's reduced-motion fallback

**Files:**
- Modify: `canary-landing/src/components/landing/Reel/Reel.tsx` (guard)

**Why:** Users with `prefers-reduced-motion: reduce` should still see all three frames — just without the pinned scroll experience. Accessibility fallback is mandatory per dashboard design system and taste-skill §5.

- [ ] **Step 1: Add reduced-motion guard**

Modify `Reel.tsx` — add detection before `useEffect`:
```tsx
import { useEffect, useMemo, useRef, useState } from 'react';

// ...inside component:
const prefersReducedMotion = useMemo(() => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}, []);

useEffect(() => {
  if (prefersReducedMotion) return;  // skip GSAP entirely
  const section = sectionRef.current;
  const stage = stageRef.current;
  if (!section || !stage) return;
  // ...rest of existing effect
}, [prefersReducedMotion]);
```

Also, when reduced motion, render the three frames stacked (not overlaid). Update the JSX:
```tsx
return (
  <section
    ref={sectionRef}
    className={prefersReducedMotion ? styles.reelStatic : styles.reelSection}
  >
    {prefersReducedMotion ? (
      <div className={styles.staticStack}>
        <FrameObserve isActive />
        <FrameControl isActive />
        <FrameImprove isActive />
      </div>
    ) : (
      <div ref={stageRef} className={styles.stage}>
        {/* ...existing pinned content */}
      </div>
    )}
  </section>
);
```

- [ ] **Step 2: Add static layout styles**

In `Reel.module.css`, append:
```css
.reelStatic {
  position: relative;
  background: var(--bg);
  padding: var(--space-16) 0;
}

.staticStack {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.staticStack > * {
  position: relative !important;
  opacity: 1 !important;
  min-height: 90vh;
}
```

- [ ] **Step 3: Verify reduced-motion path**

DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce. Reload. Expected: all three frames render stacked, no pinning.

- [ ] **Step 4: Commit**

```bash
git add canary-landing/src/components/landing/Reel
git commit -m "feat(reel): add reduced-motion fallback that stacks frames vertically"
```

---

## Phase 7: Use-case selector

### Task 7.1: Create useCaseData

**Files:**
- Create: `canary-landing/src/components/landing/UseCases/useCaseData.ts`

**Why:** Spec §5.5. Content data separated from component logic — easy for Teri to iterate copy without touching JSX. Per humanizer skill: plain concrete verbs, no "Unleash/Seamless/Elevate" tells.

- [ ] **Step 1: Create useCaseData.ts**

Write to `canary-landing/src/components/landing/UseCases/useCaseData.ts`:
```ts
export interface UseCase {
  id: string;
  tab: string;
  problem: string;
  save: string;
  quote?: {
    text: string;
    attribution: string;
  };
  visualHint: string; // short label describing the product moment
}

export const USE_CASES: UseCase[] = [
  {
    id: 'gtm',
    tab: 'GTM agents',
    problem:
      'GTM agents send outreach to the wrong leads — or spam clients when a prompt shifts. One flagged domain is a months-long recovery.',
    save:
      'Canary catches misaddressed sends, checks recipient lists against rules you write, and blocks patterns you train it on.',
    quote: {
      text: 'Canary caught three wrong-lead emails in our first week of running a GTM agent 24/7.',
      attribution: 'Photon, first design partner',
    },
    visualHint: 'Blocked outreach send with BLOCKED badge',
  },
  {
    id: 'coding',
    tab: 'Coding in Claude Code',
    problem:
      'Coding agents are allowed to run destructive shell commands. One bad rm -rf and a weekend of work is gone.',
    save:
      'Block rm -rf, terraform destroy, git push --force, or any rule you define — before the command executes.',
    visualHint: 'Blocked shell command in the action log',
  },
  {
    id: 'long-running',
    tab: 'Long-running autonomous tasks',
    problem:
      'Overnight agents rack up cost or take paths you never intended. By morning it is too late to course-correct.',
    save:
      'Every action replayable. Every deviation logged. Every override one rule away.',
    visualHint: 'Replay scrubber showing an 8-hour session compressed to 30 seconds',
  },
  {
    id: 'custom',
    tab: 'Custom SDK (Hermes / any framework)',
    problem:
      'You built your own agent stack. You also built your own lack of observability.',
    save:
      'POST events to Canary. Drop-in webhook. No framework lock-in.',
    visualHint: 'Code snippet showing the Canary webhook integration',
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add canary-landing/src/components/landing/UseCases/useCaseData.ts
git commit -m "feat(use-cases): add use-case data (4 tabs, copy + quote)"
```

### Task 7.2: Create UseCaseTab + UseCaseContent

**Files:**
- Create: `canary-landing/src/components/landing/UseCases/UseCaseTab.tsx`
- Create: `canary-landing/src/components/landing/UseCases/UseCaseContent.tsx`

**Why:** Split the row of tabs from the content block that morphs. Framer `layoutId` on the gradient border of the active tab provides premium shared-element animation. Uses `--gradient-border-active-vertical` token directly from dashboard (matches the sidebar active-item pattern — consistency).

- [ ] **Step 1: Create UseCaseTab.tsx**

Write to `canary-landing/src/components/landing/UseCases/UseCaseTab.tsx`:
```tsx
'use client';

import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import styles from './UseCases.module.css';

export interface UseCaseTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function UseCaseTab({ label, isActive, onClick }: UseCaseTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
      aria-pressed={isActive}
    >
      {isActive && (
        <motion.span
          layoutId="useCaseTabBorder"
          className={styles.tabBorder}
          transition={spring}
          aria-hidden="true"
        />
      )}
      <span className={styles.tabLabel}>{label}</span>
    </button>
  );
}
```

- [ ] **Step 2: Create UseCaseContent.tsx**

Write to `canary-landing/src/components/landing/UseCases/UseCaseContent.tsx`:
```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { UseCase } from './useCaseData';
import { spring } from '@/lib/motion';
import styles from './UseCases.module.css';

export interface UseCaseContentProps {
  useCase: UseCase;
}

export function UseCaseContent({ useCase }: UseCaseContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={useCase.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={spring}
        className={styles.contentGrid}
      >
        <div className={styles.copyColumn}>
          <div className={styles.copyBlock}>
            <span className={styles.copyLabel}>The problem</span>
            <p className={styles.copyBody}>{useCase.problem}</p>
          </div>

          <div className={styles.copyBlock}>
            <span className={styles.copyLabel}>What Canary saves</span>
            <p className={styles.copyBody}>{useCase.save}</p>
          </div>

          {useCase.quote && (
            <blockquote className={styles.quote}>
              <p className={styles.quoteText}>&ldquo;{useCase.quote.text}&rdquo;</p>
              <cite className={styles.quoteAttribution}>— {useCase.quote.attribution}</cite>
            </blockquote>
          )}
        </div>

        <div className={styles.visualColumn} aria-label={useCase.visualHint}>
          <div className={styles.visualContainer}>
            <span className={styles.visualLabel}>{useCase.visualHint}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Commit together with UseCases.tsx in Task 7.3**

### Task 7.3: Create UseCases orchestrator

**Files:**
- Create: `canary-landing/src/components/landing/UseCases/UseCases.tsx`
- Create: `canary-landing/src/components/landing/UseCases/UseCases.module.css`
- Modify: `canary-landing/src/app/page.tsx`

**Why:** Spec §5.5. Tab bar + content block with morph. Tab layout goes 4-across on desktop, stacked on mobile.

- [ ] **Step 1: Create UseCases.tsx**

Write to `canary-landing/src/components/landing/UseCases/UseCases.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { USE_CASES } from './useCaseData';
import { UseCaseTab } from './UseCaseTab';
import { UseCaseContent } from './UseCaseContent';
import styles from './UseCases.module.css';

export function UseCases() {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const active = USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0];

  return (
    <section className={styles.section} id="use-cases">
      <div className={styles.inner}>
        <h2 className={styles.heading}>Built for teams running</h2>

        <div className={styles.tabRow} role="tablist">
          {USE_CASES.map((uc) => (
            <UseCaseTab
              key={uc.id}
              label={uc.tab}
              isActive={uc.id === activeId}
              onClick={() => setActiveId(uc.id)}
            />
          ))}
        </div>

        <UseCaseContent useCase={active} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create UseCases.module.css**

Write to `canary-landing/src/components/landing/UseCases/UseCases.module.css`:
```css
.section {
  background: var(--bg);
  padding: var(--space-16) var(--space-8);
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
}

.heading {
  font-family: var(--font-sans);
  font-size: clamp(1.75rem, 2.2vw + 0.5rem, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: var(--text-black);
  margin-bottom: var(--space-8);
}

.tabRow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--grey-stroke);
  border-bottom: 1px solid var(--grey-stroke);
  background: var(--card-bg);
  margin-bottom: var(--space-10);
}

.tab {
  position: relative;
  padding: var(--space-6) var(--space-5);
  background: transparent;
  border: none;
  border-right: 1px solid var(--grey-stroke);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}

.tab:last-child {
  border-right: none;
}

.tab:hover {
  background: var(--hover-gray);
}

.tabActive {
  background: var(--hover-gray);
}

.tabBorder {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gradient-border-active-vertical);
}

.tabLabel {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--icon-grey);
  display: block;
}

.tabActive .tabLabel {
  color: var(--text-black);
  font-weight: 600;
}

.contentGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: start;
}

.copyColumn {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.copyBlock {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.copyLabel {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--icon-grey);
}

.copyBody {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-black);
  max-width: 48ch;
}

.quote {
  border-left: 2px solid var(--accent-color);
  padding-left: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 48ch;
}

.quoteText {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-black);
  font-style: italic;
}

.quoteAttribution {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--icon-grey);
  letter-spacing: 0.06em;
  font-style: normal;
}

.visualColumn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.visualContainer {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--card-gradient);
  border: 1px solid var(--grey-stroke);
  border-radius: var(--radius-card);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.visualLabel {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--icon-grey);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  text-align: center;
}

@media (max-width: 900px) {
  .tabRow {
    grid-template-columns: 1fr 1fr;
  }
  .tab:nth-child(2n) {
    border-right: none;
  }
  .tab:nth-child(1),
  .tab:nth-child(2) {
    border-bottom: 1px solid var(--grey-stroke);
  }
  .contentGrid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
}
```

- [ ] **Step 3: Wire into page.tsx**

In `src/app/page.tsx`:
1. Delete inline `function BottomCTA()`.
2. Add: `import { UseCases } from '@/components/landing/UseCases/UseCases';`
3. In the main composition, after `<Reel />`, add `<UseCases />`.

- [ ] **Step 4: Verify**

Expected: tab bar with 4 tabs (GTM / Coding / Long-running / Custom). Active tab has left-edge gradient accent. Clicking tabs morphs the content below (fade + y=8 → y=0 spring). Photon quote shows only on GTM tab.

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/components/landing/UseCases canary-landing/src/app/page.tsx
git commit -m "feat(use-cases): add 4-tab use-case selector with layoutId morph"
```

---

## Phase 8: Closer + Early-access form

### Task 8.1: Create EarlyAccessForm

**Files:**
- Create: `canary-landing/src/components/landing/EarlyAccessForm.tsx`
- Create: `canary-landing/src/components/landing/EarlyAccessForm.module.css`

**Why:** Spec §5.6. taste-skill §3 Rule 6: label above input, helper below, error inline. Full interaction cycles: loading, empty, error, success. Tactile press on submit button.

- [ ] **Step 1: Create EarlyAccessForm.tsx**

Write to `canary-landing/src/components/landing/EarlyAccessForm.tsx`:
```tsx
'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { tapPress, spring } from '@/lib/motion';
import styles from './EarlyAccessForm.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const TEAM_SIZES = [
  { value: '', label: 'Team size' },
  { value: 'solo', label: 'Just me' },
  { value: '2-5', label: '2-5 people' },
  { value: '6-20', label: '6-20 people' },
  { value: '21-100', label: '21-100 people' },
  { value: '100+', label: '100+ people' },
];

export function EarlyAccessForm() {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [agents, setAgents] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, teamSize, agents }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(data.error ?? 'Request failed');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className={styles.successCard}
      >
        <div className={styles.successDot} aria-hidden="true" />
        <div>
          <h3 className={styles.successTitle}>You are on the list.</h3>
          <p className={styles.successBody}>
            We will reach out when your early-access slot opens. Meanwhile,
            the mine is full of agents — stay careful out there.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} id="early-access">
      <div className={styles.fieldGroup}>
        <label htmlFor="email" className={styles.label}>
          Your email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label htmlFor="teamSize" className={styles.label}>
            Team size
          </label>
          <select
            id="teamSize"
            required
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className={styles.input}
          >
            {TEAM_SIZES.map((t) => (
              <option key={t.value} value={t.value} disabled={!t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="agents" className={styles.label}>
            Which agents are you running?
          </label>
          <input
            id="agents"
            type="text"
            placeholder="Claude Code, Browser Use, custom..."
            value={agents}
            onChange={(e) => setAgents(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      {status === 'error' && (
        <p role="alert" className={styles.errorText}>
          {errorMsg || 'Something went wrong. Try again.'}
        </p>
      )}

      <motion.button
        type="submit"
        whileTap={tapPress}
        disabled={status === 'submitting'}
        className={styles.submit}
      >
        {status === 'submitting' ? 'Sending…' : 'Get early access  →'}
      </motion.button>

      <p className={styles.footnote}>
        Free tier available at launch. Gated early access until then.
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Create EarlyAccessForm.module.css**

Write to `canary-landing/src/components/landing/EarlyAccessForm.module.css`:
```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-8);
  background: var(--card-gradient);
  border: 1px solid var(--grey-stroke);
  border-radius: var(--radius-card);
  max-width: 540px;
  margin: 0 auto;
}

.fieldGroup {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.fieldRow {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--icon-grey);
}

.input {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  padding: var(--space-3) var(--space-4);
  background: var(--card-bg);
  border: 1px solid var(--grey-stroke);
  border-radius: var(--radius-btn);
  color: var(--text-black);
  outline: none;
  transition: border-color var(--transition-fast);
}

.input:focus {
  border-color: var(--text-black);
  border-width: 2px;
  padding: calc(var(--space-3) - 1px) calc(var(--space-4) - 1px);
}

.submit {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  padding: var(--space-4) var(--space-6);
  background: var(--accent-color);
  color: var(--text-white);
  border: 1px solid var(--accent-color);
  border-radius: var(--radius-btn);
  cursor: pointer;
  transition: background var(--transition-fast), opacity var(--transition-fast);
}

.submit:hover {
  opacity: 0.92;
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.errorText {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--critical);
}

.footnote {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--icon-grey);
  text-align: center;
  margin-top: var(--space-2);
}

.successCard {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-8);
  background: var(--card-gradient);
  border: 1px solid var(--grey-stroke);
  border-radius: var(--radius-card);
  max-width: 540px;
  margin: 0 auto;
}

.successDot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--safe);
  flex-shrink: 0;
  margin-top: 6px;
}

.successTitle {
  font-family: var(--font-sans);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-black);
  margin-bottom: var(--space-2);
}

.successBody {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--icon-grey);
}

@media (max-width: 640px) {
  .fieldRow {
    flex-direction: column;
  }
  .form {
    padding: var(--space-6);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add canary-landing/src/components/landing/EarlyAccessForm.tsx canary-landing/src/components/landing/EarlyAccessForm.module.css
git commit -m "feat(landing): add EarlyAccessForm with full interaction cycles"
```

### Task 8.2: Create Closer section

**Files:**
- Create: `canary-landing/src/components/landing/Closer.tsx`
- Create: `canary-landing/src/components/landing/Closer.module.css`
- Modify: `canary-landing/src/app/page.tsx`

**Why:** Spec §5.6. The metaphor beat — only centered section on the page (taste-skill §3 Rule 3 exception documented in spec). Mine metaphor lands here and only here.

- [ ] **Step 1: Create Closer.tsx**

Write to `canary-landing/src/components/landing/Closer.tsx`:
```tsx
'use client';

import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { EarlyAccessForm } from './EarlyAccessForm';
import styles from './Closer.module.css';

export function Closer() {
  return (
    <section className={styles.closer}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...spring, delay: 0.1 }}
      >
        <h2 className={styles.headline}>
          The agents are already in the mine.
          <br />
          We are the canary.
        </h2>
        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          <EarlyAccessForm />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create Closer.module.css**

Write to `canary-landing/src/components/landing/Closer.module.css`:
```css
.closer {
  background: var(--bg);
  padding: var(--space-16) var(--space-8);
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
}

.headline {
  font-family: var(--font-sans);
  font-size: clamp(2rem, 3vw + 0.5rem, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--text-black);
  text-wrap: balance;
}

.formWrap {
  width: 100%;
}

@media (max-width: 768px) {
  .closer {
    padding: var(--space-12) var(--space-5);
  }
  .inner {
    gap: var(--space-10);
  }
}
```

- [ ] **Step 3: Wire into page.tsx**

In `src/app/page.tsx`:
1. Add: `import { Closer } from '@/components/landing/Closer';`
2. After `<UseCases />`, add `<Closer />`.

- [ ] **Step 4: Verify**

Expected: centered mine-metaphor headline; form card below; scroll into view → fade up. Submitting → success state replaces form.

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/components/landing/Closer.tsx canary-landing/src/components/landing/Closer.module.css canary-landing/src/app/page.tsx
git commit -m "feat(landing): add Closer section with mine metaphor and early-access form"
```

### Task 8.3: Create /api/early-access route handler

**Files:**
- Create: `canary-landing/src/app/api/early-access/route.ts`

**Why:** The form needs somewhere to POST. Stub the route now with a no-op success; wiring to a real backend (Resend, PostHog events, a DB) is a follow-up. vercel-plugin:nextjs: POST handlers live in `route.ts` files inside `app/api/<name>/`.

- [ ] **Step 1: Create route.ts**

Write to `canary-landing/src/app/api/early-access/route.ts`:
```ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface Payload {
  email?: string;
  teamSize?: string;
  agents?: string;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (!body.teamSize) {
    return NextResponse.json({ error: 'Team size required' }, { status: 400 });
  }

  // TODO: wire to real persistence (Resend / Postgres / etc.)
  // For now, log and accept.
  console.log('[early-access] signup', {
    email: body.email,
    teamSize: body.teamSize,
    agents: body.agents ?? '',
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Verify end-to-end submit**

Reload, fill form with `test@canary.dev`, `2-5`, `Claude Code`. Submit. Expected:
- Success state appears with green dot + "You are on the list."
- Dev server log shows `[early-access] signup { ... }`

- [ ] **Step 3: Commit**

```bash
git add canary-landing/src/app/api/early-access/route.ts
git commit -m "feat(api): add /api/early-access route handler with validation"
```

---

## Phase 9: Additional routes (Features, About, Blog, Login placeholder)

### Task 9.1: Create placeholder pages

**Files:**
- Create: `canary-landing/src/app/features/page.tsx`
- Create: `canary-landing/src/app/about/page.tsx`
- Create: `canary-landing/src/app/blog/page.tsx`

**Why:** Nav references these routes. Shipping with 404s makes the page feel broken. Shipping honest placeholders is better. P1 per YC/SV — not gating launch, but fills the experience.

- [ ] **Step 1: Create features/page.tsx**

Write to `canary-landing/src/app/features/page.tsx`:
```tsx
import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

export const metadata = {
  title: 'Features — Canary',
  description: 'What Canary does, explained feature by feature.',
};

export default function FeaturesPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '70vh',
          padding: '160px 24px 80px',
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: 'var(--icon-grey)',
            textTransform: 'uppercase',
          }}
        >
          Features
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: 'var(--text-black)',
            margin: '16px 0 24px',
          }}
        >
          Full feature docs are landing with public launch.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--icon-grey)',
            lineHeight: 1.6,
          }}
        >
          Canary is in gated early access. While the docs site comes together,
          the landing page covers the three main capabilities: visual replay,
          rule-based blocking, and agent learning.{' '}
          <Link
            href="/#early-access"
            style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
          >
            Request access →
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create about/page.tsx**

Write to `canary-landing/src/app/about/page.tsx`:
```tsx
import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

export const metadata = {
  title: 'About — Canary',
  description: 'Who is building Canary and why.',
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '70vh',
          padding: '160px 24px 80px',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: 'var(--icon-grey)',
            textTransform: 'uppercase',
          }}
        >
          About
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: 'var(--text-black)',
            margin: '16px 0 32px',
          }}
        >
          Canary is built by engineers who got tired of watching their own agents run unattended.
        </h1>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.0625rem',
            color: 'var(--text-black)',
            lineHeight: 1.7,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <p>
            Johnny built his own full-time agentic GTM hire — a computer-use agent running 24/7
            doing outreach, research, and follow-ups. Except he couldn&apos;t leave it alone 24/7,
            because the failure modes (spam, wrong leads, bad sources) weren&apos;t visible until
            after the damage.
          </p>
          <p>
            Teri is a 3× founding product designer who has shipped at Riot, NatGeo, and several
            early-stage consumer + tooling startups. She also codes, which means the team moves
            fast.
          </p>
          <p>
            Canary is the QA tool they wished existed — agent-level observability that actually
            sees the screen. <Link href="/#early-access" style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}>Join the early access list →</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Create blog/page.tsx**

Write to `canary-landing/src/app/blog/page.tsx`:
```tsx
import Link from 'next/link';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';

export const metadata = {
  title: 'Blog — Canary',
  description: 'Notes from building Canary, the trust layer for autonomous agents.',
};

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '70vh',
          padding: '160px 24px 80px',
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: 'var(--icon-grey)',
            textTransform: 'uppercase',
          }}
        >
          Blog
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2rem, 3vw + 0.5rem, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: 'var(--text-black)',
            margin: '16px 0 24px',
          }}
        >
          First post lands with public launch.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--icon-grey)',
            lineHeight: 1.6,
          }}
        >
          We are building in public — expect honest posts about shipping an agent-QA product
          during the wave. In the meantime,{' '}
          <Link
            href="/#early-access"
            style={{ color: 'var(--accent-color)', textDecoration: 'underline' }}
          >
            get early access →
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify all three routes render**

Navigate to `/features`, `/about`, `/blog`. Each should render with Nav + Footer + placeholder content, no errors.

- [ ] **Step 5: Commit**

```bash
git add canary-landing/src/app/features canary-landing/src/app/about canary-landing/src/app/blog
git commit -m "feat(routes): add Features, About, Blog placeholder pages"
```

### Task 9.2: Simplify page.tsx to pure composition shell

**Files:**
- Modify: `canary-landing/src/app/page.tsx`

**Why:** After Phases 3-8, page.tsx should only import and compose sections. All inline logic is gone.

- [ ] **Step 1: Replace page.tsx entirely**

Write to `canary-landing/src/app/page.tsx`:
```tsx
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/footer/Footer';
import { Hero } from '@/components/landing/Hero';
import { EcosystemBar } from '@/components/landing/EcosystemBar';
import { Reel } from '@/components/landing/Reel/Reel';
import { UseCases } from '@/components/landing/UseCases/UseCases';
import { Closer } from '@/components/landing/Closer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <EcosystemBar />
        <Reel />
        <UseCases />
        <Closer />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Clean up page.module.css**

Replace `canary-landing/src/app/page.module.css` with just the one remaining shared class (or delete the file and remove its import from any file — verify first):
```css
/* This file is reserved for classes shared across more than one
   landing section. Every section now owns its own .module.css.
   Leave empty or delete once verified unused. */
```

Then check: `grep -rn "page.module.css\|styles\[" canary-landing/src/` — if no results remain, delete the file.

- [ ] **Step 3: Verify full page renders**

Reload `localhost:3001`. Scroll from top to bottom. Expected:
- Hero → Ecosystem bar → Reel (pinned, 3 frames) → Use-cases → Closer → Footer
- All transitions smooth
- No console errors

- [ ] **Step 4: Commit**

```bash
git add canary-landing/src/app/page.tsx canary-landing/src/app/page.module.css
git commit -m "refactor(landing): page.tsx becomes pure composition shell"
```

---

## Phase 10: Accessibility, performance, verification

No automated tests per the YAGNI principle in §0. Instead, a disciplined manual QA pass at the end, guided by a concrete checklist.

### Task 10.1: Accessibility audit

**Files:** none (browser-side verification)

**Why:** Per spec §12 and dashboard design system: WCAG AA baseline is mandatory. Catching issues pre-launch is cheap; post-launch is expensive.

- [ ] **Step 1: Install and run axe DevTools browser extension**

Install [axe DevTools](https://www.deque.com/axe/devtools/) if not already. Open the landing page → open DevTools → axe DevTools panel → "Scan ALL of my page."

Expected: zero Critical or Serious violations. Moderate issues noted for follow-up.

- [ ] **Step 2: Keyboard navigation check**

Reload page. Close DevTools. Press `Tab` repeatedly from the top. Verify:
- Focus ring visible on every focusable element (Nav links, CTAs, tabs, form fields)
- Focus order is logical (top-to-bottom, left-to-right)
- Can reach and submit the early-access form using only the keyboard
- `Esc` doesn't trap focus anywhere

- [ ] **Step 3: Screen-reader label check**

If VoiceOver (macOS) or NVDA (Windows) is available, navigate through the page. Verify:
- Nav landmarks announced correctly
- Reel frames have recognizable headings
- Form fields have labels associated
- Decorative ASCII / cursor / dots are `aria-hidden`

- [ ] **Step 4: Color contrast check**

In axe DevTools, confirm no contrast failures. Pay attention to:
- `--icon-grey #5A5A7A` on `--bg #F5F5F8` — body copy must pass AA at 14px+
- `--text-white #F7F7F7` on `--accent-color #0B0DC4` — CTA button

Expected: all AA. If anything fails, document and adjust font weight or token.

- [ ] **Step 5: Commit (only if any adjustments were made)**

If adjustments:
```bash
git add -A canary-landing/src
git commit -m "fix(a11y): adjust contrast and focus ring per audit"
```

### Task 10.2: Reduced-motion audit

**Files:** none

**Why:** taste-skill §5 + spec §12. Users with vestibular disorders rely on this.

- [ ] **Step 1: Enable reduced-motion in DevTools**

Chrome DevTools → three-dot menu → More tools → Rendering → Emulate CSS prefers-reduced-motion: reduce.

- [ ] **Step 2: Reload and verify each animated surface**

- Hero stagger: elements appear instantly
- LiveIndicator dot: no pulse
- HeroCursor: static, dim
- HeroAsciiGrid: visible, not animating characters
- Nav morph: still functional (position-only change is acceptable)
- Reel: stacked static layout (no pinning)
- UseCases tabs: morph still shows (layoutId is considered essential transition)
- Closer form: no whileInView motion

Expected: all sections remain fully functional, no janky partial animation.

### Task 10.3: Mobile responsive audit

**Files:** none

**Why:** Per startup framing (B2C2B), a meaningful chunk of first-view traffic lands on mobile. Must not be broken.

- [ ] **Step 1: Test at 375px, 768px, 1024px, 1440px**

Use Chrome DevTools device mode. Verify at each breakpoint:

- Hero: text doesn't overflow, CTAs stack cleanly on 375px
- LiveIndicator visible on all sizes but smaller on mobile
- Ecosystem bar wraps cleanly
- Reel: switches to single-column layout on mobile (Task 6.2 has the media query)
- UseCases: tabs go 2x2 on mobile, content stacks
- Closer: form fields stack on narrow viewports
- Nav: status-label hidden on mobile (Task 4.1)

Expected: no horizontal scrollbar at any breakpoint. All text legible. All CTAs tappable (≥44px tap target).

- [ ] **Step 2: Fix any layout issues inline**

- [ ] **Step 3: Commit adjustments (if any)**

### Task 10.4: Lighthouse production build check

**Files:** none

**Why:** Dev server performance ≠ production. Lighthouse run on production build surfaces real perf issues.

- [ ] **Step 1: Build production bundle**

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
npm run build
```

Expected: build succeeds with no errors. Warnings acceptable if minor.

- [ ] **Step 2: Serve production build and run Lighthouse**

```bash
npm run start
```

In a fresh Chrome incognito tab, load `localhost:3000` (or whatever port). Open DevTools → Lighthouse → Performance + Accessibility + Best Practices + SEO. Run with Mobile emulation.

Target scores (YC/SV framework: don't over-tune, but don't ship slop):
- Performance ≥ 85
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

- [ ] **Step 3: Document scores**

Create `canary-landing/docs/lighthouse-2026-04-16.md` if you want a record, or note in the PR description.

- [ ] **Step 4: Stop production server, restart dev**

### Task 10.5: Final manual QA checklist

**Files:** none

- [ ] Hero headline reads: "The trust layer for autonomous agents."
- [ ] Hero subtitle names: Claude Code, Browser Use, openClaw, Hermes
- [ ] `● LIVE · CANARY OBSERVING` visible top-right of hero with pulse
- [ ] Blinking cursor appears after "agents." for ~3s, then dims
- [ ] Hero stagger plays on first load
- [ ] Ecosystem bar lists 4 frameworks + openClaw ~1M stat
- [ ] Reel pins at top, scroll advances frame 1 → 2 → 3
- [ ] ReelProgress dots reflect active frame
- [ ] Each frame shows placeholder product visual with scanline
- [ ] `10ms` / `88%` / `90%` stats embedded in respective frames
- [ ] Use-case selector has 4 tabs; active tab has gradient left-border
- [ ] Tab switch morphs content block (fade + slide)
- [ ] GTM tab shows Photon quote; others do not
- [ ] Closer centered, mine metaphor visible
- [ ] Form: email + team size + agents. Submit → success state
- [ ] Submitting with invalid email shows error
- [ ] `/features`, `/about`, `/blog` routes render with Nav + Footer
- [ ] Nav: full-width at top, morphs to pill on scroll past 200px
- [ ] Nav: compressed pill shows `status: observing` + `Get early access` only
- [ ] Footer: logo + tagline + nav repeat + legal

### Task 10.6: Deploy preview to Vercel

**Files:** none (Vercel CLI)

**Why:** Spec §15 step 11. A production preview URL is the final proof — we're not shipping localhost.

- [ ] **Step 1: Confirm Vercel CLI and login**

```bash
vercel --version
vercel whoami
```

If not logged in: `vercel login`.

- [ ] **Step 2: Deploy preview**

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT/canary-landing
vercel
```

Accept defaults (link to new Vercel project if prompted, framework: Next.js). Preview URL prints when done.

- [ ] **Step 3: Load preview URL, re-run final QA checklist (10.5) against it**

- [ ] **Step 4: Report preview URL back to the team**

### Task 10.7: Final commit + PR

**Files:** none (git)

- [ ] **Step 1: Ensure clean tree**

```bash
cd /Users/johnnysheng/code/mycanarybird/canaryT
git status
```

Expected: nothing to commit, working tree clean.

- [ ] **Step 2: Push branch and open PR**

```bash
git push -u origin <current-branch>
gh pr create --title "feat: canary-landing redesign" --body "$(cat <<'EOF'
## Summary
- Migrates tokens to canonical dashboard design system
- Ships asymmetric hero with monitor-esque micro-details
- Builds the Observe → Control → Improve scrolltelling reel (GSAP)
- Adds 4-tab use-case selector with framer layoutId morph
- Closer metaphor section + early-access form + API route
- Adds placeholder Features / About / Blog routes

## Design spec
See `canaryT/docs/superpowers/specs/2026-04-16-canary-landing-redesign-design.md`

## Test plan
- [ ] A11y audit (axe DevTools) passes AA
- [ ] Keyboard navigation complete
- [ ] prefers-reduced-motion fallback renders
- [ ] Mobile layouts clean at 375px, 768px, 1024px, 1440px
- [ ] Lighthouse Performance ≥ 85, A11y ≥ 95
- [ ] Form submits with `ok: true` response on valid data
- [ ] Preview deployment renders identically to local

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review

**1. Spec coverage (checking against `2026-04-16-canary-landing-redesign-design.md`):**

| Spec section | Plan coverage |
|---|---|
| §1 Context | §0 startup framing |
| §2 Goals | §0 P0 definition |
| §3 Positioning | §0 pitch reasoning |
| §4 Page skeleton | Task 9.2 composition shell |
| §5.1 Nav | Tasks 2.1, 4.1 |
| §5.2 Hero | Tasks 3.1, 3.2, 3.3, 3.4 |
| §5.3 Ecosystem bar | Task 5.1 |
| §5.4 Reel | Tasks 6.1, 6.2, 6.3, 6.4, 6.5 |
| §5.5 Use-case selector | Tasks 7.1, 7.2, 7.3 |
| §5.6 Closer | Tasks 8.1, 8.2, 8.3 |
| §5.7 Footer | Task 2.2 |
| §6 Design tokens | Prerequisite (DONE) |
| §7 Motion engine | Task 1.3, 1.4; enforced throughout |
| §8 Iconography | Inline within each component (ASCII glyphs in placeholder visuals, framework marks in ecosystem bar) |
| §9 File scaffolding | §1 structure, matched by every Create task |
| §10 Dependencies | Task 1.1 |
| §11 Out of scope | Honored (no CMS, no A/B, no dark mode) |
| §12 Accessibility | Task 10.1 |
| §13 Analytics hooks | NOT IMPLEMENTED — correct per §0 P2 deferral; add in follow-up |
| §14 Open questions | All resolved at spec time |
| §15 Implementation sequence | Expanded into these 10 phases |

**No gaps between spec and plan.** Analytics is explicitly P2 per §0 — acceptable deferral.

**2. Placeholder scan:**
- `[testimonial TBD]` markers only appear in `useCaseData.ts` where the spec also acknowledges this is an honest unknown (no customer quotes exist yet for 3 of 4 cohorts). Photon is inline. Other quote slots are `quote?: undefined` typed. No false placeholders.
- All other code blocks are complete and runnable.
- All commands are concrete and copy-pasteable.

**3. Type consistency check:**
- `ReelFrameProps.isActive` — used consistently across FrameObserve / FrameControl / FrameImprove / ReelFrame
- `UseCase` type — defined in `useCaseData.ts`, imported by `UseCaseContent.tsx`, consumed in `UseCases.tsx`
- `UseCaseTabProps.label/isActive/onClick` — matches usage in `UseCases.tsx`
- `LiveIndicatorProps.label/color/size` — consistent between definition and call sites
- Motion config (`spring`, `springSnappy`, `staggerParent`, `staggerChild`, `tapPress`) defined in `lib/motion.ts`, imported wherever used

No type drift.

---

## Execution handoff

Plan complete and saved to `canaryT/docs/superpowers/plans/2026-04-16-canary-landing-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good for this plan because each phase is independently verifiable and the Reel in particular benefits from an isolated context window.

**2. Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints for your review.

Which approach?

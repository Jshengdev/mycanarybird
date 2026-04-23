# Canary Design System — Cards
> Parent: `design/INDEX.md`
> Button spec: `components/buttons.md`
> Motion rules: `motion/interactions.md`

---

## Banned Patterns

The following patterns are permanently banned from all card components regardless of context:

**No health dots**
Never place a colored circle, dot, or pip on or near a card to indicate status. The VerdictBadge and colored score numbers are the only permitted status signals.

**No colored left borders**
Never use border-left in any status color on a card container. This includes hot rule cards, orphaned cards, active cards, or any other state. If a card needs to communicate urgency, use the VerdictBadge or let the score number speak.

**No status background tints**
Never apply a semi-transparent status color as a background on a card (e.g. rgba(255,46,46,0.04) on a BLOCKED card). Cards always use var(--card-gradient) or var(--card-bg).

---

## Global Card Rules
- Background: `linear-gradient(160deg, #FDFDFD 0%, #F7F7FA 100%)` — subtle gradient, top near-white to bottom with faint blue-grey tint
- Fallback: `--card-bg (#FAFAFA)` for contexts where gradient is not supported
- Border radius: `4px` — the ONLY component with non-zero radius besides switch tracks and scrubber thumbs
- Border: `1px solid --grey-stroke (#DCDCE8)` — ALL card types, always. Border does NOT change on hover.
- Overflow: `hidden` — always, clips gradient to border radius
- Never use box shadows
- Minimum internal padding: `12px (--space-4)`
- Cards can nest (max 2 levels deep)

### Interactive Card Hover (cursor-tracking gradient)

Cards with an onClick handler get a mouse-tracking radial gradient on hover:

**Hover state:** `radial-gradient(circle at {x}% {y}%, #EDEDF5 0%, #F7F7FA 55%, #F5F5F8 100%)`
where x,y are computed from mouse position relative to card bounds.

**Exit transition:** background eases back to default gradient over 400ms.

**Non-interactive cards** (stat cards, display cards) use the static gradient only — no mouse tracking.

```tsx
import { useCardHover, CARD_GRADIENT_DEFAULT } from '@/hooks/useCardHover'
const { bgStyle, transition, handleMouseMove, handleMouseLeave } = useCardHover(true)
```

---

## Card Types

### 1. Stat Card (big number display)
Used for: score display, key metrics on dashboard pages.

| Property | Value |
|---|---|
| Border | `1px solid --grey-stroke (#DCDCE8)` |
| Padding | `24px (--space-8)` all sides |
| Hover | none — static |
| Border radius | `0px` |

Layout (top → bottom, centered):
1. Label — IBM Plex Mono Regular, 12px, uppercase, `--icon-grey`
2. Large number — IBM Plex Mono SemiBold, display size, status color
3. `/100` suffix — IBM Plex Mono Regular, smaller, `--icon-grey`
4. Verdict badge — centered below number

Example: Score card showing `89/100` + `WARNING` badge.

---

### 2. Content Card (title + action)
Used for: data sections with a title and optional action link.

| Property | Value |
|---|---|
| Border | `1px solid --grey-stroke (#DCDCE8)` |
| Padding | varies per instance |
| Hover | none on card — action button only is hoverable |
| Border radius | `0px` |

Header row layout:
- Title: Plus Jakarta Sans, 14px/20px, SemiBold, left-aligned
- Action: inline text action (right-aligned) — see inline action spec below
- Divider: `1px solid --grey-stroke` between header and body

---

### 3. Clickable Card (entire card is interactive)
Used for: rule cards (click to view/edit), any card that navigates.

| Property | Value |
|---|---|
| Border | `1px solid --grey-stroke (#DCDCE8)` |
| Hover background | `var(--card-gradient-hover)` |
| Active/pressed background | `--pressed-gray (#EDEDF2)` |
| Hover border | no change |
| Box shadow | none |
| AsciiHover variant | `right` (default) — use `both` only if explicitly specified |
| Cursor | `pointer` |
| Border radius | `0px` |

AsciiHover must not overlap child elements (buttons, badges, text).
Overflow: hidden on card container always.

---

## Active / Selected Card State (gradient border)

When a card is the currently selected or active item
(e.g. selected agent in a list, active ruleset):

| Property | Value |
|---|---|
| Background | `--card-bg` |
| Border | gradient via CSS mask technique |
| Border radius | `0px` |

Implementation (CSS class in globals.css):
```css
.card-gradient-border {
  position: relative;
}
.card-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  background: var(--gradient-border-active);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

In React: use `className="card-gradient-border"` on the card element.
The gradient border requires the CSS mask technique — it cannot be
replicated with inline styles alone.

Usage: apply to the currently selected card in any list view.

---

### 4. Nested Card
Cards can live inside other cards or panels.
- Inner card uses same token set
- Max depth: 2 levels (card inside panel — not card inside card inside card)
- Both levels use `--card-bg` background
- Inner border: `1px solid --grey-stroke` (all cards)

---

## Inline Text Action (card header pattern)

Used in content card headers ("View all →", "See report →").

| Property | Value |
|---|---|
| Font | IBM Plex Mono, 11px, Medium, uppercase |
| Color | `--accent-color (#0B0DC4)` |
| Default | "LABEL →" no underline |
| Hover — arrow | slides `3px` right |
| Hover — underline | appears (`1px solid --accent-color`) |
| Transition | `120ms ease` |

This pattern is reused anywhere a text-level navigation action appears
(toasts, card headers, inline links that navigate).

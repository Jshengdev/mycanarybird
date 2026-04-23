# Canary Design System — Motion & Interactions
> Parent: `design/INDEX.md`
> AsciiHover component: `@/components/ui/AsciiHover`

---

## AsciiHover — Global Usage Rules

### What it is
AsciiHover is the dither/ASCII block reveal effect used for all
interactive hover states. It is the single source of truth for
all ASCII and dither effects in the product.

Import: `import { AsciiHover } from '@/components/ui/AsciiHover'`

### ALWAYS use on
- Buttons (all variants except icon-only and disabled)
- Clickable cards
- Sidebar nav items (project, agent, sub-items, ruleset rows)
- Dropdown menu items
- Any interactive container with a border or background

### NEVER use on
- Plain text links
- Read-only data cells
- Non-interactive labels or headings
- Disabled states (any component)
- Standalone text without a container/border
- Anything without a box/border context
- Mobile or touch screens

### Platform
Desktop only. Gate with CSS: `@media (hover: hover)`.

### Padding inheritance rule
AsciiHover must inherit the padding of the container it lives in.
The blocks size and position themselves using `--ascii-pad-y` and
`--ascii-pad-x` CSS custom properties on the wrapper element.

**Always:**
- Put padding on the `<AsciiHover>` wrapper — never on the inner content element.
- Set `--ascii-pad-y` and `--ascii-pad-x` on the wrapper `style` to match.
- Set `position: relative; z-index: 1` on the inner content element so
  text/icons render above the ASCII blocks.

**Why:** AsciiHover measures `offsetHeight - paddingTop - paddingBottom` on
its root element to size the blocks, and positions strips at
`top/bottom: var(--ascii-pad-y, 4px)`, `left/right: var(--ascii-pad-x, 4px)`.
If padding lives on a child instead, the blocks stretch to the full container
height and ignore the intended inset — they look like they don't fit.

```jsx
// ✅ Correct — padding on wrapper, blocks fit inside padding
<AsciiHover
  variant="right"
  color="var(--icon-grey)"
  style={{
    padding: '8px 16px',
    '--ascii-pad-y': '8px',
    '--ascii-pad-x': '16px',
    background: 'var(--card-bg)',
  }}
>
  <div style={{ position: 'relative', zIndex: 1 }}>
    Content here
  </div>
</AsciiHover>

// ❌ Wrong — padding on child, blocks ignore it
<AsciiHover variant="right" color="var(--icon-grey)">
  <div style={{ padding: '8px 16px' }}>
    Content here
  </div>
</AsciiHover>
```

This applies to: buttons, clickable cards, dropdown menu items,
sidebar nav items — any component that wraps content in AsciiHover.

### Overlap rule
ASCII blocks must never overlap child elements.
Always set `overflow: hidden` on the parent container.
Blocks appear on the container edge only.
Never render behind or over buttons, badges, or text inside a card.

### Variants
| Prop | Behavior |
|---|---|
| `variant="right"` | blocks on right only (default for most components) |
| `variant="left"` | blocks on left only |
| `variant="both"` | blocks on both sides (use for buttons, rarely for cards) |

### Color rules
| Context | Color |
|---|---|
| Default (all components) | `--icon-grey (#858585)` |
| Primary button | `--text-white (#F7F7F7)` |
| Destructive button | `--text-white (#F7F7F7)` |
| Sidebar ruleset row | severity color (`--safe` / `--warning` / `--critical`) |
| Toast left column | status color per variant (always-on) |

Never invent a new color. Always use a token.

### Always-on mode (active={true})
Used when ASCII blocks should be permanently visible (not triggered by hover).
Currently used: Toast left column indicator.

```jsx
<AsciiHover active={true} color="var(--safe)" variant="left">
  ...
</AsciiHover>
```

### Loading state (waterfall)
ASCII blocks cycle in/out continuously (waterfall pattern).
Used as button loading state.
Appears on whichever sides match the button's ascii variant.
Button is non-interactive (`cursor: wait`) during loading.

---

## Page Transitions

### Sidebar
Completely static during navigation. Never animates.

### Breadcrumb
Static except current page label.
On navigation, current page label animates:
1. AsciiHover blocks sweep across (`active={true}` on mount)
2. Text resolves/appears
3. Duration: ~`400ms` total

### Content area — component entry
Each component on the page animates in sequentially.

| Property | Value |
|---|---|
| Effect | fade in + slide up `8px` |
| Duration | `200ms` per component |
| Easing | `ease-out` |
| Stagger | `80ms` between each component |
| Order | top → bottom |

```css
@keyframes enterUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Skeleton Loaders

Shown while data is fetching. Replace spinners entirely.

| Property | Value |
|---|---|
| Base color | `--hover-gray (#E9E9E9)` |
| Shimmer highlight | `--card-bg (#F7F7F7)` |
| Animation | shimmer sweep left → right |
| Duration | `1.4s` loop |
| Easing | `ease-in-out` |
| Border radius | `0px` |
| Shape | matches the layout of the content it replaces |

Skeleton fades out, real content fades in when data resolves.
No flash between skeleton and content.

---

## Inline Text Action Hover

Used for text-level navigation actions ("VIEW ALL →", "REVIEW RULES →").

| Property | Value |
|---|---|
| Default | label + `→` arrow, no underline |
| Hover — arrow | slides `3px` right |
| Hover — underline | appears (`1px solid --accent-color`) |
| Transition | `120ms ease` |

---

## Standard Hover Transitions

| Component | Transition |
|---|---|
| Buttons | AsciiHover `50ms` stagger per block |
| Background fills | `100ms ease` |
| Inline text actions | `120ms ease` |
| Page components (entry) | `200ms ease-out` |
| Breadcrumb ASCII sweep | `400ms total` |
| Skeleton shimmer | `1.4s ease-in-out loop` |

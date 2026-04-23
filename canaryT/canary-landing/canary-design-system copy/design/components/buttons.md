# Canary Design System — Buttons
> Parent: `design/INDEX.md`
> AsciiHover rules: `motion/interactions.md`

---

## Variants

### Primary (CTA)
| Property | Value |
|---|---|
| Background | `--accent-color (#0088C7)` |
| Text | `--text-white (#F7F7F7)` |
| Border | none |
| Hover background | no change |
| Hover | AsciiHover only |
| ASCII color | `--text-white (#F7F7F7)` |

### Secondary
| Property | Value |
|---|---|
| Background | `--card-bg (#F7F7F7)` |
| Text | `--text-black (#121212)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Hover background | `--hover-gray (#E9E9E9)` |
| Hover | AsciiHover + background fill |
| ASCII color | `--icon-grey (#858585)` |

### Ghost
| Property | Value |
|---|---|
| Background | transparent |
| Text | `--text-black (#121212)` |
| Border | none |
| Hover background | `--hover-gray (#E9E9E9)` |
| Hover | AsciiHover + background fill |
| ASCII color | `--icon-grey (#858585)` |

### Destructive
| Property | Value |
|---|---|
| Background | `--critical (#FF2E2E)` |
| Text | `--text-white (#F7F7F7)` |
| Border | none |
| Hover background | no change |
| Hover | AsciiHover only |
| ASCII color | `--text-white (#F7F7F7)` |

---

## Sizes

| Size | Font Size | Weight | Padding V | Padding H | Icon size |
|---|---|---|---|---|---|
| `sm` | 12px | 500 | 6px | 8px | 12px |
| `md` | 14px | 500 | 8px | 12px | 14px |

Font family: Plus Jakarta Sans

---

## AsciiHover Variants
Every button (except icon-only) supports three ASCII positions:
- `variant="right"` — blocks on right only (default)
- `variant="left"` — blocks on left only
- `variant="both"` — blocks on both sides

Choose based on context and layout.

---

## Icon Rules
- Icon always on LEFT of label
- Gap between icon and text: `4px (--space-1)`
- Icon size matches button size (12px for sm, 14px for md)

---

## Icon-Only Buttons
No AsciiHover. Background interaction only.
| State | Background |
|---|---|
| Default | `--card-bg (#F7F7F7)` |
| Hover | `--hover-gray (#E9E9E9)` |
| Border | `1px solid --grey-stroke` |

---

## Disabled State (all variants)
| Property | Value |
|---|---|
| Background | `--hover-gray (#E9E9E9)` |
| Text | `--icon-grey (#858585)` |
| Border | none |
| AsciiHover | suppressed |
| Cursor | `not-allowed` |

---

## Loading State
ASCII waterfall — blocks cycle in/out continuously on whichever
sides match the button's ascii variant.
- right-only button → right waterfall
- both → both sides
- Button is non-interactive during loading
- `cursor: wait`

---

## Border Radius
`0px` — all variants, all sizes.

---

## Usage in Modals
- Confirm action → Primary button
- Cancel → Secondary button
- Delete/destructive → Destructive button
- Always right-aligned in modal footer
- Gap between buttons: `8px (--space-3)`

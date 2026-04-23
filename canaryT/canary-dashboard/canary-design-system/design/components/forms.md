# Canary Design System — Forms
> Parent: `design/INDEX.md`
> Spacing tokens: `tokens/spacing.md`

Covers: Text Input, Textarea, Checkbox, Radio, Select, Dropdown, Multi-select, Switch, Switch Group, Rich Switch Group

---

## Text Input

### Base
| Property | Value |
|---|---|
| Background | `--card-bg (#F7F7F7)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Height | `32px` |
| Padding | `0 10px` |
| Font | Plus Jakarta Sans, 14px/20px, Regular |
| Text color | `--text-black (#121212)` |
| Placeholder color | `--icon-grey (#858585)` |

### Label (optional, above input)
| Property | Value |
|---|---|
| Font | Plus Jakarta Sans, 12px/16px, Medium 500 |
| Color | `--text-black (#121212)` |
| Gap below label | `4px (--space-1)` |

### States
| State | Style |
|---|---|
| Focus | `2px solid --grey-stroke` (thickness change only) |
| Error | `2px solid --critical` + error text below |
| Disabled | bg `--hover-gray`, text `--icon-grey` |

### Error text
Font: Plus Jakarta Sans, 12px/16px, Regular
Color: `--critical (#FF2E2E)`
Position: below input, `4px` gap

### Label/placeholder combinations
- label + placeholder: both shown
- label only: no placeholder
- placeholder only: no label
- neither: bare input (use sparingly)

### Search variant (with icon)
- Lucide `search` icon, 12px, `--icon-grey`
- Icon position: left, inside input
- Text indent accounts for icon + `8px` gap

---

## Textarea

### Base
Same styles as text input with:
| Property | Value |
|---|---|
| Min height | `128px` |
| Resize | `vertical` (default) |
| Resize override | `none` (set per instance when needed) |
| Padding | `10px` |

Resize is a per-instance prop. Default is resizable. Set `resize="none"` when fixed height is required.

---

## Checkbox

### States
| State | Background | Border | Content |
|---|---|---|---|
| Unchecked | `--card-bg (#F7F7F7)` | `1px solid --grey-stroke` | empty |
| Checked | `--text-black (#121212)` | `1px solid --text-black` | ASCII `█` in `--text-white` |
| Indeterminate | `--text-black (#121212)` | `1px solid --text-black` | `—` dash in `--text-white` |
| Disabled | `--hover-gray (#E9E9E9)` | `1px solid --grey-stroke` | ASCII `█` in `--icon-grey` if checked |

Dimensions: 16px × 16px. Border radius: `0px`.

---

## Radio Button

On hand for future use. Not actively used in dashboard yet.
Standard circular shape. Skin to Canary tokens when needed.
Border radius: `999px` (circular).

---

## Select / Dropdown

### Trigger button
| Property | Value |
|---|---|
| Background (default) | `--card-bg (#F7F7F7)` |
| Background (hover) | `--hover-gray (#E9E9E9)` |
| Background (open/pressed) | `--pressed-gray (#F4F4F4)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Height | `28px` |
| Padding | `6px` all sides |
| Font | Plus Jakarta Sans Medium, 12px/16px |
| Color | `--text-black (#121212)` |
| Icon | Lucide `chevron-down`, 12px, right-aligned |

### Dropdown panel
| Property | Value |
|---|---|
| Background | `--pressed-gray (#F4F4F4)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Padding | `4px` |
| Gap between items | `2px` |
| Position | directly below trigger, no gap, floats above content |
| Width | matches trigger width (default) |
| Min width | trigger width |
| Max width | `280px` — expands beyond trigger only if content truncates |
| Max visible items | 5, then scroll |
| Scroll indicator | subtle fade at bottom edge |

### Menu item
| Property | Value |
|---|---|
| Height | `~24px` (content-driven) |
| Padding | `4px 6px 4px 4px` |
| Font | Plus Jakarta Sans Medium, 12px/16px |
| Color | `--text-black (#121212)` |
| Hover bg | `--hover-gray (#E9E9E9)` |
| Hover right indicator | AsciiHover (right variant, `--icon-grey`) |
| Selected indicator | ASCII `█` on left, `--text-black` |

### Grouped menus (dividers between groups)
- Use `1px solid --grey-stroke` divider between groups
- Divider: full panel width, `0deg` rotation
- Groups add semantic organization only (no impact on behavior)

### Open/close behavior
- Opens on click (not hover)
- Closed: `height: 0`, `overflow: hidden`
- Open: auto height, opacity 1
- Animates open (expand down)

---

## Multi-Select

### Trigger
Same as dropdown trigger.
Selected items appear as tags inside the trigger input.

### Tag (selected item chip)
| Property | Value |
|---|---|
| Background | `--hover-gray (#E9E9E9)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Font | IBM Plex Mono, 11px, Regular, uppercase |
| Color | `--text-black (#121212)` |
| Padding | `2px 6px` |
| Gap between tags | `4px (--space-1)` |
| Status dot | 8px × 8px square, status color (for verdict filters) |

### Dropdown panel
Same as single select with checkboxes on items.
Selected items show ASCII `█` on left.

---

## Switch

| Property | Values |
|---|---|
| `checked` | `true` / `false` |
| `state` | `Default` / `Focus` / `Disabled` |

- Dimensions: 33px × 18px
- Track (unchecked): `--hover-gray (#E9E9E9)`, border-radius `12px`
- Track (checked): animated gradient fill (dark)
- Thumb: circular, shifts left/right

---

## Switch Group

| Property | Values |
|---|---|
| `checked` | `true` / `false` |
| `layout` | `Inline` / `Block` |

- Inline: switch + label side by side, compact
- Block: full-width row, label fills remaining space
- Label font: Plus Jakarta Sans, 14px/20px, Medium 500
- Unchecked label: `--icon-grey (#858585)`
- Checked label: `--text-black (#121212)`

---

## Rich Switch Group

| Property | Values |
|---|---|
| `checked` | `true` / `false` |
| `flipped` | `true` / `false` |
| `showLine2` | `true` / `false` |

- Container: bg `--card-bg`, border `1px solid --grey-stroke`, border-radius `10px`, padding `12px`
- Width: `240px`
- Primary label: Plus Jakarta Sans, 14px/20px, Regular
- Secondary text: Geist, 12px/16px, Regular, color `#737373`
- Flipped: switch moves to right side of label

# Canary Design System — Spacing & Radius
> Parent: `design/INDEX.md`

---

## Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon gaps, tiny nudges, icon-text gap in buttons |
| `--space-2` | 6px | Badge padding, tight rows, compact gaps |
| `--space-3` | 8px | Inline element gaps, breadcrumb gaps |
| `--space-4` | 12px | Standard gap, card padding minimum, table padding |
| `--space-5` | 16px | Input padding, standard component gaps |
| `--space-6` | 20px | Sidebar padding, comfortable gaps |
| `--space-8` | 24px | Large padding, stat card padding |
| `--space-10` | 32px | Between major sections |
| `--space-12` | 48px | Sidebar section gap, page-level spacing |
| `--space-16` | 64px | Hero spacing, max section separation |

**Rule: Never use arbitrary px values in components. Always use a `--space-N` token.**
If a value doesn't map to the scale, use the closest token and note the exception.

---

## Border Radius

**Global rule: Everything is `0px` unless listed below.**

| Component | Radius |
|---|---|
| Everything (default) | `0px` |
| Switch track | `12px` |
| Rich Switch container | `10px` |
| Cards / panels | `10px` or `12px` (per component spec) |
| Avatar | `2px` |

No other exceptions. When in doubt: `0px`.

---

## Border Rules

### Interactive containers → always bordered
`1px solid --grey-stroke (#DFDFDF)`

Applies to:
- All button variants
- All input fields
- Dropdowns and selects
- Checkboxes
- Clickable cards
- Sidebar nav items
- Pagination buttons
- Switches

### Non-interactive containers → no border by default
Background color differentiates surface from page.
Only add border if component spec explicitly requires it.

### Focus state → thickness change only
`2px solid --grey-stroke` — color stays the same, width increases.

### Error state
`2px solid --critical (#FF2E2E)`

### Dividers
`1px solid --grey-stroke`, `0deg` rotation, full width of parent.

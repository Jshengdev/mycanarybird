# Canary Design System — Toasts
> Parent: `design/INDEX.md`
> AsciiHover: `motion/interactions.md`
> Inline action pattern: `components/cards.md`

---

## Base Spec

| Property | Value |
|---|---|
| Width | `320px` |
| Background | `--card-bg (#F7F7F7)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Padding | `12px (--space-4)` |
| Position | bottom-right corner, stacks upward |
| Layout | flex row: ASCII column + body + close icon |

---

## ASCII Left Column

Uses `<AsciiHover variant="left" active={true}>` — always-on, not triggered by hover.
Color maps to variant status color.

| Variant | ASCII color |
|---|---|
| `success` | `--safe (#48C72B)` |
| `info` | `--accent-color (#0088C7)` |
| `warning` | `--warning (#FFC02E)` |
| `error` | `--critical (#FF2E2E)` |

---

## Content

### Title
Plus Jakarta Sans, 12px/16px, SemiBold, `--text-black`

### Description
Plus Jakarta Sans, 12px/16px, Regular, `--icon-grey`

### Close icon
Lucide `x`, 12px, `--icon-grey`, top-right, always shown.

---

## Inline Action (info variant only)

Pattern: `LABEL →`
- Font: IBM Plex Mono, 11px, Medium, uppercase
- Color: `--accent-color (#0088C7)`
- Hover: arrow slides `3px` right + underline appears (`1px solid --accent-color`)
- Transition: `120ms ease`
- Appears below description text, `5px` gap

---

## Variants

| Variant | Title example | Has inline action |
|---|---|---|
| `success` | "2 rules baked successfully" | no |
| `info` | "3 new rules suggested" | yes — "REVIEW RULES →" |
| `warning` | "Session score dropped to 61" | no |
| `error` | "Failed to save rule" | no |

---

## Timing

| Variant | Behavior |
|---|---|
| `success` | Auto-dismiss after `4 seconds` |
| `info` | Auto-dismiss after `4 seconds` |
| `warning` | Auto-dismiss after `4 seconds` |
| `error` | Stays until manually dismissed (✕ click) |

Hover pauses auto-dismiss timer. Resumes on mouse leave.

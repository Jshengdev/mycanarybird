# Canary Design System — Tooltips
> Parent: `design/INDEX.md`

---

## Base Spec

| Property | Value |
|---|---|
| Background | `--text-black (#121212)` |
| Text color | `--text-white (#F7F7F7)` |
| Font | IBM Plex Mono, 11px, Regular |
| Border radius | `0px` |
| Padding | `4px 8px` |
| Border | none |
| Max width | `200px` — wraps if longer |
| Caret / arrow | none — hard edge only |
| Position | above trigger (default), flips below if no space |
| Appear delay | `300ms` (prevents flicker on mouse-through) |
| Dismiss | disappears on mouse leave |

---

## Trigger Types

| Trigger | Behavior |
|---|---|
| Icon-only buttons | always has tooltip — describes the action |
| Truncated text | shows full string on hover |
| Column headers | shows sort description |
| Warning / info icons | shows detail text |

---

## Usage Rules

- Always provide a tooltip for icon-only buttons (no label visible)
- Truncated text (overflow ellipsis) must always have a tooltip with full value
- Do not use tooltips on elements that already have visible labels
- Keep tooltip text under 10 words when possible
- For longer descriptions (up to `200px` wrap), break naturally

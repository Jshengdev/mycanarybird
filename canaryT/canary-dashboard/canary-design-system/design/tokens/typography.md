# Canary Design System — Typography
> Parent: `design/INDEX.md`

---

## Font Families

| Role | Family | Fallback | Token |
|---|---|---|---|
| Headings | Plus Jakarta Sans | sans-serif | `--font-sans` |
| Body | Plus Jakarta Sans | sans-serif | `--font-sans` |
| Body alt | Geist | sans-serif | `--font-geist` |
| Mono | IBM Plex Mono | monospace | `--font-mono` |
| Mono alt / Sidebar labels | JetBrains Mono | monospace | `--font-mono-alt` |

**Rule: All numbers use `IBM Plex Mono` (`--font-mono`). No exceptions.**
This includes: scores, counts, IDs, timestamps, pagination, durations, event counts, violation counts, session IDs.

---

## Heading Scale

| Style | Family | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Heading 1 | Plus Jakarta Sans | 700 | 48px | 48px | -1.5px |
| Heading 2 | Plus Jakarta Sans | 700 | 30px | 30px | -1px |
| Heading 3 | Plus Jakarta Sans | 600 | 24px | 28.8px | -1px |
| Heading 4 | Plus Jakarta Sans | 600 | 20px | 24px | 0px |

---

## Body / Paragraph Scale

| Style | Family | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Paragraph Bold | Plus Jakarta Sans | 600 | 16px | 24px | 0px |
| Paragraph Regular | Plus Jakarta Sans | 400 | 16px | 24px | 0px |
| Paragraph Small Medium | Plus Jakarta Sans | 500 | 14px | 20px | 0px |
| Paragraph Small Regular | Plus Jakarta Sans | 400 | 14px | 20px | 0px |
| Paragraph Mini Medium | Plus Jakarta Sans | 500 | 12px | 16px | 0px |
| Paragraph Mini Regular | Geist | 400 | 12px | 16px | 0px |

---

## Monospaced Scale

| Style | Family | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Mono | IBM Plex Mono | 400 | 12px | 12px | 0px |
| Mono Numbers | IBM Plex Mono | 600 | 12px | 12px | 0px |
| Sidebar Label | JetBrains Mono | 700 | 12px | normal | 0px |

---

## Usage Rules

### When to use each family
- **Plus Jakarta Sans** → all UI labels, body copy, headings, button text
- **Geist** → secondary/muted body text (Paragraph Mini Regular only)
- **IBM Plex Mono** → ALL numbers, table data, IDs, code, terminal output, badges
- **JetBrains Mono** → sidebar section labels only (PROJECTS, AGENTS etc.)

### When to use each weight
- **400 Regular** → body copy, descriptions, secondary labels
- **500 Medium** → interactive labels, sub-headings, form labels
- **600 SemiBold** → emphasis, card titles, important labels
- **700 Bold** → headings, section labels, strong emphasis

### Mono uppercase rule
IBM Plex Mono text in badges, table headers, and status indicators
should be `text-transform: uppercase`.

### Minimum font size
Never use below `11px` in any context.

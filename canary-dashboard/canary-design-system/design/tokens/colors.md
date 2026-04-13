# Canary Design System — Colors
> Parent: `design/INDEX.md`

---

## CSS Custom Properties

All colors live in `src/styles/tokens.css` as `:root` variables.
Never hardcode hex values in components. Always use the token.

---

## Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--black` | `#0A0A0A` | Headings, primary text |
| `--text-black` | `#0A0A0A` | Body text, labels, interactive text |
| `--text-white` | `#F7F7F7` | Text on dark/colored backgrounds |
| `--icon-grey` | `#5A5A7A` | Muted text, icons, placeholder text |
| `--grey-stroke` | `#DCDCE8` | Borders on interactive containers |
| `--hover-gray` | `#F5F5F8` | Hover backgrounds |
| `--pressed-gray` | `#EDEDF2` | Pressed/active backgrounds, dropdown panels |
| `--bg` | `#F5F5F8` | Page/app background |
| `--card-bg` | `#FAFAFA` | Card surfaces, input backgrounds, sidebar |
| `--sidebar-bg` | `#FAFAFA` | Sidebar background (same as card-bg) |

Note: `--bg` and `--hover-gray` are intentionally the same value (`#F5F5F8`).
Hover on a card steps it back toward the page background. This is correct.

## Status Colors

| Token | Hex | Usage |
|---|---|---|
| `--critical` | `#B84040` | BLOCKED state, errors, destructive actions |
| `--warning` | `#8C6508` | FLAGGED state, warnings |
| `--safe` | `#2D7A55` | OBSERVED/ready state, success |

## Accent

| Token | Hex | Usage |
|---|---|---|
| `--accent-color` | `#0B0DC4` | Primary CTA buttons, blue when explicitly needed |

**Rule for `--accent-color`:** Use only when blue is explicitly needed. Component-level specs define their own active/hover states independently. Do not apply to every interactive element automatically.

## Gradient Tokens

| Token | Value | Usage |
|---|---|---|
| `--card-gradient` | `linear-gradient(160deg, #FDFDFD 0%, #F7F7FA 100%)` | Default card background (replaces flat --card-bg on card elements) |
| `--card-gradient-hover` | `linear-gradient(160deg, #F8F8FB 0%, #F3F3F6 100%)` | Card background on hover |
| `--gradient-border-active` | `linear-gradient(135deg, #0B0DC4 0%, #6B6DDF 50%, #DCDCE8 100%)` | Active/selected element border — full border gradient |
| `--gradient-border-active-vertical` | `linear-gradient(180deg, #0B0DC4 0%, #6B6DDF 100%)` | Active/selected left border accent — sidebar items, active tabs |

## Grays

| Token | Hex | Usage |
|---|---|---|
| `--gray-100` | `#F5F5F8` | Subtle backgrounds |

---

## Semantic Usage Rules

### Interactive containers
Always `1px solid --grey-stroke`. This includes:
buttons, inputs, dropdowns, checkboxes, switches,
clickable cards, sidebar items, pagination buttons.

### Non-interactive containers
No border by default. Background color (`--card-bg` vs `--bg`)
provides sufficient differentiation. Exception: component spec
explicitly adds a border (e.g. alert banner, rich switch group).

### State colors
| State | Token |
|---|---|
| Default text | `--text-black` |
| Muted / secondary | `--icon-grey` |
| Hover background | `--hover-gray` |
| Pressed background | `--pressed-gray` |
| Disabled background | `--hover-gray` |
| Disabled text | `--icon-grey` |
| Focus border | 2px solid `--grey-stroke` (thickness change only) |
| Error border | 2px solid `--critical` |
| Error text | `--critical` |

### AsciiHover block colors
| Context | Color |
|---|---|
| Default (all components) | `--icon-grey` (#5A5A7A) |
| Primary button | `--text-white` (#F7F7F7) |
| Destructive button | `--text-white` (#F7F7F7) |
| Sidebar ruleset (by severity) | `--safe` / `--warning` / `--critical` |
| Toast left column | status color per variant |

---

## Light Mode Only
Dark mode is not in scope. All tokens are light mode values.

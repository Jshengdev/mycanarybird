# Canary Design System — Sidebar
> Parent: `design/INDEX.md`
> Color tokens: `tokens/colors.md`
> AsciiHover: `motion/interactions.md`

---

## Base Spec

| Property | Value |
|---|---|
| Width | `280px` |
| Height | full viewport height |
| Background | `--sidebar-bg (#FAFAFA)` |
| Border right | `1px solid --grey-stroke (#DCDCE8)` |
| Padding | `20px (--space-6)` |
| Section gap | `48px (--space-12)` |

Sidebar is completely static during page navigation — never animates.

---

## Sidebar Nav Item Spec (all items)

| Property | Value |
|---|---|
| Background | transparent (default), `--hover-gray` on hover/active |
| Border | `1px solid transparent` (default), `1px solid --grey-stroke` on hover/active |
| Padding top / bottom | `4px` |
| Padding left | `6px` (plus indent) |
| Padding right | `4px` |
| Hover background | `--hover-gray (#E9E9E9)` |
| Active background | `--hover-gray (#F5F5F8)` |
| Active left border | `border-image: var(--gradient-border-active-vertical) 1` — gradient accent from `--accent-color` (#0B0DC4) to #6B6DDF |
| Gap between items | `2px` |
| Border radius | `0px` |

### Dropdown items (items with expand/collapse arrow)
- **No AsciiHover** — hover background fill only
- Arrow (chevron-right / chevron-down) pinned to far right via flex
- Includes: Project rows, Agent rows, Rulesets sub-item

### Leaf items (items without arrow)
- **AsciiHover right variant** — on hover
- Includes: Profile, Sessions, individual ruleset rows

---

## Hierarchy

```
[CA] Workspace Name  [⊟]      ← workspace selector + sidebar collapse icon (top)

PROJECTS                       ← section label

  ▼ Project Name               ← dropdown item (no AsciiHover)
      ▼ Agent Name             ← dropdown item (no AsciiHover)
            <> Profile         ← leaf item (AsciiHover)
            ⊞  Sessions        ← leaf item (AsciiHover)
            ◇  Rulesets  ▼     ← dropdown item (no AsciiHover)
                 [10] Ruleset 1  ░  ← leaf item (AsciiHover, severity color)
                 [10] Ruleset 2  ░

  >  Project Name              ← collapsed dropdown item
```

---

## Section Labels (e.g. "PROJECTS")

| Property | Value |
|---|---|
| Font | JetBrains Mono, 12px, Bold (Sidebar Label style) |
| Color | `--icon-grey (#858585)` |
| Text transform | uppercase |
| Interactive | no — not clickable |

---

## Workspace Selector (top)

| State | Style |
|---|---|
| Default | `[avatar] Workspace Name [collapse-icon]` |
| Hover | `--hover-gray` background fill |
| Collapse icon | Lucide `panel-left-close`, 16px, `--icon-grey` |

---

## Project / Agent Rows (dropdown items)

| Property | Value |
|---|---|
| Click target | entire row (not just chevron) |
| Expand icon (collapsed) | Lucide `chevron-right` |
| Expand icon (expanded) | Lucide `chevron-down` |
| Multiple expanded | allowed simultaneously |
| Font (project/agent name) | Plus Jakarta Sans Medium, 14px/20px |
| Hover | `--hover-gray` bg only — **no AsciiHover** |
| Active/selected | `--hover-gray (#E9E9E9)` background, full row |

---

## Sub-items (Profile, Sessions, Rulesets)

| Property | Value |
|---|---|
| Indent | `16px` from parent |
| Font | Plus Jakarta Sans Medium, 12px/16px |
| Color | `--text-black (#121212)` |
| Icon | Lucide, 12px, `--icon-grey` |
| Hover (leaf) | AsciiHover right + `--hover-gray` bg |
| Hover (Rulesets — dropdown) | `--hover-gray` bg only — **no AsciiHover** |
| Active | `--hover-gray` bg, full row |

Sub-item icons:
- Profile → `code-xml`
- Sessions → `scatter-chart`
- Rulesets → `tag`

---

## Ruleset Rows (nested under Rulesets)

| Property | Value |
|---|---|
| Indent | `32px` from parent |
| Font | Plus Jakarta Sans Medium, 12px/16px |
| Rule count badge | `14px` box, `1px solid --grey-stroke`, IBM Plex Mono 7px |
| Severity bar | right side, `4px` wide × `14px` tall |
| Severity bar color | `--safe` / `--warning` / `--critical` |
| AsciiHover color | severity color (not default icon-grey) |

Severity bar uses Status Indicator component (badges.md).

---

## Indent Levels

| Level | Indent |
|---|---|
| Project / Agent row | `0px` (full width) |
| Sub-items (Profile, Sessions, Rulesets) | `16px` |
| Ruleset items | `32px` |

# Canary Design System — Breadcrumb
> Parent: `design/INDEX.md`
> Motion: `motion/interactions.md`

---

## Base Spec

| Property | Value |
|---|---|
| Position | above main content, sticky on scroll |
| Background | `--card-bg (#F7F7F7)` |
| Border bottom | `1px solid --grey-stroke (#DFDFDF)` |
| Padding | `12px 20px (--space-4 --space-6)` |
| Font | Plus Jakarta Sans, 12px/16px, Regular |
| Parent items | `--icon-grey (#858585)`, clickable |
| Separator | Lucide `chevron-right`, 12px, `--icon-grey` |
| Current page | `--text-black (#121212)`, not clickable |
| Gap between items | `8px (--space-3)` including separator |

---

## Visibility Rule

The breadcrumb bar only appears when the user is two or more levels deep
(e.g., inside a project or agent). At the workspace root level, the
breadcrumb is **not rendered** — the sidebar is sufficient for navigation.

---

## Hierarchy

Starts at Agent level. Workspace is never shown in breadcrumb.

```
Agent Name  >  Section  >  Current Page
```

Deeper example:
```
GTM Agent  >  Rulesets  >  Attachment Rules
```

- Project shown only when needed for disambiguation
- Project + Agent always shown (never truncated)
- Middle items truncate to `...`
- Current page always shown

---

## Sidebar Toggle

Lives in breadcrumb bar, left edge.
| Property | Value |
|---|---|
| Icon | Lucide `panel-left`, 16px |
| Color | `--icon-grey (#858585)` |
| Hover | `--hover-gray` background fill |
| Function | toggles sidebar open/closed |

---

## Navigation Behavior

- No unsaved changes → navigate instantly on click
- Unsaved changes exist → confirm dialog:
  - Title: "Unsaved changes"
  - Body: "You have unsaved changes. Leave anyway?"
  - Buttons: Secondary "Cancel" + Destructive "Leave"
- Breadcrumb is informational-first — sidebar is primary nav

---

## Real-time Updates

Breadcrumb reflects live name changes.
If agent or project is renamed → breadcrumb updates instantly without page refresh.

---

## Load Animation

On every page navigation, the current page label (rightmost item) animates in:
1. ASCII blocks sweep across text area (AsciiHover, `active={true}` on mount)
2. Text resolves/appears underneath
3. Duration: ~`400ms` total

Parent items are static — no animation on navigation.
Only the current page label animates.

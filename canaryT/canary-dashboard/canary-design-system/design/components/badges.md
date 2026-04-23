# Canary Design System — Badges, Tags & Status
> Parent: `design/INDEX.md`

---

## Rule Type Tags

Categorization badges for rule types.

| Property | Value |
|---|---|
| Font | IBM Plex Mono Regular, 12px/12px, uppercase |
| Text color | `--text-black (#121212)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Padding | `6px` vertical / `6–8px` horizontal |

| Variant | Icon | Label |
|---|---|---|
| `boundary` | `shield` | BOUNDARY |
| `outcome` | `square-check` | OUTCOME |
| `sequence` | `list-ordered` | SEQUENCE |
| `time` | `clock-3` | TIME |

Icons: Lucide, 12px, `--icon-grey`.

---

## Verdict Badge

Inline status badge showing session readiness.

| Property | Value |
|---|---|
| Font | IBM Plex Mono Regular, 12px/12px, uppercase |
| Border radius | `0px` |
| Padding | `8px` horizontal, `6px` vertical |
| Decorative fill | Single ASCII block before text — density indicates severity |

| Variant | Block | Border color | Text color |
|---|---|---|---|
| `ready` | `░` (lightest) | `--safe (#48C72B)` | `--safe (#48C72B)` |
| `warning` | `▒` (medium) | `--warning (#FFC02E)` | `--warning (#FFC02E)` |
| `notready` | `█` (densest) | `--critical (#FF2E2E)` | `--critical (#FF2E2E)` |

Border color always matches the verdict variant color — not `--grey-stroke`.

---

## Score Block (inline)

Small inline score display used in table cells and metadata rows.

| Property | Value |
|---|---|
| Font | IBM Plex Mono SemiBold, 12px/12px |
| Score value | status color (safe/warning/critical) |
| `/100` suffix | `--icon-grey (#858585)` |
| Alignment | center |

## Score Block (large / hero)

Large score display used in score cards on workspace dashboard and session summary.
The number is prominent and neutral — color comes from the VerdictBadge below, not the number itself.

| Property | Value |
|---|---|
| Score font | IBM Plex Mono Regular, 64px, lineHeight 1 |
| Score color | `--text-black (#121212)` — always black, not status-colored |
| `/100` suffix | IBM Plex Mono Regular, 24px, `--icon-grey (#858585)` |
| VerdictBadge | centered below score |
| Card padding | generous — `var(--space-6) var(--space-10)` minimum |

This is the standard for any card that shows a session or agent score as the primary content.

## Score color mapping (both variants)

- `>= 80` → `--safe (#48C72B)`
- `60–79` → `--warning (#FFC02E)`
- `< 60` → `--critical (#FF2E2E)`

---

## Status Indicator (Severity Bar)

Visual severity bar used in sidebar ruleset rows.

| Property | Value |
|---|---|
| Dimensions | `4px` wide × `14px` tall |
| Pattern | `░ ▒ ▓ █` gradient blocks, light to dark |
| Border radius | `0px` |

| Variant | Color |
|---|---|
| `safe` | `--safe (#48C72B)` |
| `warning` | `--warning (#FFC02E)` |
| `critical` | `--critical (#FF2E2E)` |

---

## Alert Banner

Dismissable notification bar (inline, not a toast).

| Property | Value |
|---|---|
| Background | `--card-bg (#F7F7F7)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Padding | `12px (--space-4)` |
| Layout | space-between (content left, close icon right) |
| Icon | Lucide `wand-sparkles`, 12px |
| Text | Plus Jakarta Sans Medium, 12px/16px |
| Text emphasis | SemiBold for key info inline |
| Close icon | Lucide `x`, 12px, `--icon-grey` |

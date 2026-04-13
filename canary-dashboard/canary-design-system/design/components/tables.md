# Canary Design System — Tables & Pagination
> Parent: `design/INDEX.md`

---

## Table Header

| Property | Value |
|---|---|
| Font | IBM Plex Mono Regular, 12px/12px, uppercase |
| Text color | `--icon-grey (#858585)` |
| Border bottom | `1px solid --grey-stroke (#DFDFDF)` |
| Padding | `12px` horizontal, `8px` vertical |
| Sort icon (unsorted) | Lucide `chevrons-up-down`, 12px |
| Background | transparent |

### Active sorted column
| Property | Value |
|---|---|
| Text color | `--text-black (#121212)` |
| Font weight | Medium 500 |
| Sort ascending | Lucide `chevron-up`, 12px |
| Sort descending | Lucide `chevron-down`, 12px |

### Sort toggle behavior
1. Click 1 → ascending (chevron-up, black text)
2. Click 2 → descending (chevron-down, black text)
3. Click 3 → reset to default sort (most recent — DATE/TIME column becomes active)

### Sessions table columns
SESSION-ID, DATE/TIME, SCORE, VERDICT, EVENTS, VIOLATIONS, DURATION

---

## Banned Patterns

**No colored left borders on rows**
Never use border-left in a status color on table rows regardless of the row's classification status. BLOCKED and FLAGGED rows must not have colored left borders. Status is communicated by the status chip in the STATUS column and the colored score number. Nothing else.

**No health dots in table cells**
No dots or pips of any kind used as status indicators in table cells.

---

## Table Row

| Property | Value |
|---|---|
| Default background | `--card-bg (#F7F7F7)` — all rows, no alternating |
| Hover background | `--hover-gray (#E9E9E9)` |
| Border bottom | `1px solid --grey-stroke (#DFDFDF)` |
| Padding | `12px` |
| Cursor | `pointer` (all rows navigate on click) |
| Data font | IBM Plex Mono Regular, 12px (IDs/labels) |
| Number font | IBM Plex Mono SemiBold, 12px |
| ID color | `--icon-grey (#858585)` |
| Value color | `--text-black (#121212)` |

Row click → navigates to detail page.
Sticky header: no — header scrolls with table.

---

## Empty State

Used when a table has no data.

| Property | Value |
|---|---|
| Container | dashed border box |
| Border | `1px dashed --grey-stroke (#DFDFDF)` |
| Background | transparent |
| Width | 100% of table |
| Height | ~200px (~5 row heights) |
| Content alignment | centered vertically + horizontally |
| Primary text | context-specific (e.g. "Run your first session") |
| Text font | Plus Jakarta Sans, 14px, Regular |
| Text color | `--icon-grey (#858585)` |
| CTA | Primary button below text |

---

## Pagination

Position: bottom of table, `right-aligned`.
Results count: left-aligned, IBM Plex Mono, 11px, `--icon-grey`.
Format: `"{n} sessions"` or `"{n} rules"` etc.

### Page buttons
| Property | Value |
|---|---|
| Background | `--card-bg (#F7F7F7)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Text | `--icon-grey (#858585)` |
| Font | IBM Plex Mono, 12px, Regular |
| Min width | `28px` |
| Height | `28px` |
| Hover bg | `--hover-gray (#E9E9E9)` |
| Hover text | `--text-black (#121212)` |

### Active page
| Property | Value |
|---|---|
| Background | `--hover-gray (#E9E9E9)` |
| Text | `--text-black (#121212)` |
| Font weight | 700 Bold |
| Border | `1px solid --grey-stroke (#DFDFDF)` |

### Disabled (prev on page 1 / next on last page)
| Property | Value |
|---|---|
| Text | `--grey-stroke (#DFDFDF)` |
| Background | `--card-bg (#F7F7F7)` |
| Cursor | `not-allowed` |

### Prev / Next buttons
Same style as page buttons. Content: `←` and `→` arrows.

### Ellipsis
No border, transparent background, not clickable.
Shows first page, window around active, last page.

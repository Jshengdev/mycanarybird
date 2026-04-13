# Canary Design System — Session Timeline
> Parent: `design/INDEX.md`
> Located: Session Detail page → Timeline tab

---

## Session Detail Page Structure

Accessed by clicking a row in the Sessions table.

Three tabs:
| Tab | Content |
|---|---|
| Timeline | filmstrip + action spreadsheet (this file) |
| Spreadsheet | full action log table, full width |
| Report | compliance score, verdict, violations, canary suggest/bake CTAs |

---

## Timeline Tab Layout

Split layout:
- Left panel: filmstrip (horizontal scroll)
- Right panel: action spreadsheet

---

## Filmstrip (left panel)

| Property | Value |
|---|---|
| Orientation | horizontal scroll |
| Layout | screenshots stitched side by side |
| Scroll | horizontal, drag or arrow keys |
| Screenshot border | `1px solid --grey-stroke (#DFDFDF)` |

---

## Action Pins

Numbered circle markers overlaid on screenshots.

| Property | Value |
|---|---|
| Style | numbered circle, number = action order |
| Position | fixed on screenshot (MVP) |
| Future | x/y coordinate anchored per action (deferred) |

Pin states + colors:
| State | Color |
|---|---|
| OBSERVED | `--icon-grey (#858585)` |
| FLAGGED | `--warning (#FFC02E)` |
| BLOCKED | `--critical (#FF2E2E)` |

Pin interaction:
- Click pin → highlights + scrolls to matching row in right panel
- Matching row expands to show action details in accordion/dropdown

---

## Action Spreadsheet (right panel)

| Property | Value |
|---|---|
| Style | table — same spec as global table |
| Font | IBM Plex Mono, 12px |
| Alternating rows | `--hover-gray (#E9E9E9)` on alt rows |

Columns: `#`, action type, target, status, rule applied.

Expandable rows:
- Click row → accordion expands showing full action metadata
- Shows which rule was triggered (if any)
- Syncs with filmstrip pin click

Rules applied shown inline in spreadsheet — not in a separate panel.

---

## Playback Controls

Video-style bar below filmstrip.

| Control | Function |
|---|---|
| Play / Pause | auto-advance through screenshots |
| Step forward | advance one frame |
| Step back | go back one frame |
| Scrubber | shows position in full session, draggable |

Font: IBM Plex Mono, 12px, `--icon-grey`.
Icons: Lucide play/pause/skip icons, 12px.

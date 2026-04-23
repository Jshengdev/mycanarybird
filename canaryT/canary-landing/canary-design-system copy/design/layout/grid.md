# Canary Design System — Layout & Grid
> Parent: `design/INDEX.md`

---

## Page Structure

```
┌─────────────────────────────────────────────────────┐
│  BREADCRUMB BAR (sticky, full width)                 │
├──────────────┬──────────────────────────────────────┤
│              │  CONTENT AREA                         │
│   SIDEBAR    │  ┌─────────────────────────────────┐ │
│   280px      │  │  Page Title (H1)                 │ │
│   fixed      │  │  Content                         │ │
│              │  │                                  │ │
│              │  └─────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────┘
```

---

## Sidebar

| Property | Value |
|---|---|
| Width | `280px` |
| Position | fixed left |
| Height | full viewport height |
| Behavior | static during navigation — never animates |

Sidebar can be toggled via breadcrumb bar toggle button.
Collapsed state: `0px` width (or off-screen — TBD per implementation).

---

## Breadcrumb Bar

| Property | Value |
|---|---|
| Height | `~40px` |
| Position | sticky top, full width |
| Z-index | above content, below modals |
| Background | `--card-bg (#F7F7F7)` |
| Border bottom | `1px solid --grey-stroke (#DFDFDF)` |

---

## Content Area

| Property | Value |
|---|---|
| Left offset | `280px` (sidebar width) |
| Top offset | breadcrumb bar height |
| Background | `--bg (#EFEFEF)` |
| Padding | `24px (--space-8)` all sides |
| Max content width | none — full width of content area |

---

## Page Background

`--bg (#EFEFEF)` — page/app background.
`--card-bg (#F7F7F7)` — all surface cards and panels.
The 8-value difference between `#EFEFEF` and `#F7F7F7` requires
borders on interactive elements for definition — background alone
is insufficient for interactive container identification.

---

## Z-index Scale

| Layer | Z-index |
|---|---|
| Base content | `0` |
| Sticky breadcrumb | `10` |
| Dropdowns / popovers | `100` |
| Toasts | `200` |
| Modals | `300` |
| Modal backdrop | `290` |

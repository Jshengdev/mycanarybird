# Canary Design System — Page Templates
> Parent: `design/INDEX.md`
> Grid: `layout/grid.md`

---

## How to Use

Pick the closest shell below for any new page.
Load only the component files needed for that page.
Do not load the full design system for a single page.

---

## Template 1: Table Page

Used for: Sessions list, Rules list, Members list.

```
BREADCRUMB BAR (sticky)
├── [sidebar toggle] [Agent > Section]

CONTENT AREA
├── Page Title (H1 — Plus Jakarta Sans, 30px, Bold)
├── [Search input] + [Filter dropdown] + [Sort dropdown]
│     gap: 8px between controls, flex row
├── TABLE
│     header row
│     data rows (paginated)
│     empty state (if no data)
└── PAGINATION
      right-aligned, below table
```

Padding: `24px` content area.
Background: `--bg (#EFEFEF)`.
Table sits on `--card-bg` surface.

---

## Template 2: Detail Page

Used for: Session detail, Rule detail, Agent profile.

```
BREADCRUMB BAR (sticky)
├── [sidebar toggle] [Agent > Section > Item]

CONTENT AREA
├── Page Title (H1)
├── TABS (if applicable — e.g. Timeline / Spreadsheet / Report)
├── TAB CONTENT
│     varies per tab
└── ACTION BUTTONS (top right of content area)
      e.g. Edit, Delete, Save
```

---

## Template 3: Settings / Form Page

Used for: Agent profile edit, workspace settings, rule creation.

```
BREADCRUMB BAR (sticky)
├── [sidebar toggle] [Agent > Section]

CONTENT AREA
├── Page Title (H1)
├── SECTION HEADING (H3 or H4)
├── FORM FIELDS
│     label + input stacked
│     gap: 16px between fields
│     gap: 32px between sections
├── DIVIDER (between major sections)
└── FOOTER ACTION BAR (sticky bottom or inline)
      [Cancel button] [Save button]
      right-aligned
```

Unsaved changes → breadcrumb warns on navigation.
No auto-save. Explicit save button always.

---

## Template 4: Dashboard / Overview Page

Used for: Workspace dashboard, agent overview.

```
BREADCRUMB BAR (sticky)

CONTENT AREA
├── Page Title (H1)
├── STAT CARDS ROW
│     flex row, gap: 16px
│     each card: stat card type (cards.md)
├── CONTENT CARDS GRID
│     2-column grid (or full width if single)
│     gap: 16px
│     each card: content card type
└── TABLE SECTION (if applicable)
      content card wrapping a table
```

---

## Template 5: Ruleset Page

Used for: Ruleset detail — viewing and editing rules.

```
BREADCRUMB BAR (sticky)

CONTENT AREA
├── Page Title (ruleset name, H1)
├── RULESET META (rule count, type breakdown)
├── ACTION BAR
│     [Template library button] [New rule button]
│     right-aligned
├── CONFLICT BANNER (if unresolved conflicts exist)
│     alert banner component
├── RULE CARDS LIST
│     draggable, vertical list
│     each card: clickable card type (cards.md)
│     drag handle on left
└── EMPTY STATE (if no rules)
      dashed border box + CTA
```

---

## Tab Component (used in Template 2)

| Property | Value |
|---|---|
| Font | Plus Jakarta Sans Medium, 14px/20px |
| Active tab text | `--text-black (#121212)` |
| Active tab indicator | `2px solid --text-black`, bottom border |
| Inactive tab text | `--icon-grey (#858585)` |
| Hover | `--text-black` text |
| Tab bar border bottom | `1px solid --grey-stroke (#DFDFDF)` |
| Gap between tabs | `24px (--space-8)` |
| Background | transparent |

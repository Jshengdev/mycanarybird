# Canary Design System — INDEX

> Read this file first. Always. It routes you to the right file for any design question.
> Do not load any other file until you have identified the correct path below.
> Average token cost per file: ~300–600 tokens. Load only what you need.

---

## ROUTING DECISION TREE

### "What color should I use?"
→ `tokens/colors.md`

### "What font / size / weight should I use?"
→ `tokens/typography.md`

### "What spacing / padding / gap should I use?"
→ `tokens/spacing.md`

### "What border radius should I use?"
→ `tokens/spacing.md` (radius scale is co-located with spacing)

### "How do I build a button?"
→ `components/buttons.md`

### "How do I build an input, textarea, checkbox, radio, or select?"
→ `components/forms.md`

### "How do I build a dropdown or multi-select?"
→ `components/forms.md`

### "How do I build a card?"
→ `components/cards.md`

### "How do I build a table, table header, or table row?"
→ `components/tables.md`

### "How do I build a badge, tag, verdict, or score?"
→ `components/badges.md`

### "How do I build a toast notification?"
→ `components/toasts.md`

### "How do I build a modal or dialog?"
→ `components/modals.md`

### "How do I build a tooltip?"
→ `components/tooltips.md`

### "How do I build pagination?"
→ `components/tables.md` (pagination is co-located with tables)

### "How do I build a switch or switch group?"
→ `components/forms.md`

### "How do I build the sidebar or sidebar nav items?"
→ `patterns/sidebar.md`

### "How do I build the breadcrumb?"
→ `patterns/breadcrumb.md`

### "How do I build the session timeline?"
→ `patterns/session-timeline.md`

### "How do I build the rules engine / rule builder?"
→ `patterns/rules-engine.md`

### "How do page transitions or loading states work?"
→ `motion/interactions.md`

### "How does AsciiHover work and when do I use it?"
→ `motion/interactions.md`

### "How is a page laid out? Grid, columns, content width?"
→ `layout/grid.md`

### "What does a full page shell look like?"
→ `layout/page-templates.md`

### "What icons do I use?"
→ `tokens/icons.md`

---

## GLOBAL RULES (memorize these — do not load a file to check)

1. **Border radius** → `0px` everywhere. Exceptions: cards `4px`, buttons `2px`, switch track `12px`, scrubber thumb `999px`, avatar `2px`.
2. **Borders** → Interactive containers only get `1px solid --grey-stroke`. Non-interactive containers get no border unless component spec says otherwise.
3. **Numbers** → Always `IBM Plex Mono`. No exceptions.
4. **AsciiHover** → Containers with borders only. Never on plain text, labels, or non-interactive elements. Desktop only.
5. **Colors** → Never hardcode hex values. Always use CSS tokens from `tokens/colors.md`.
6. **Spacing** → Always use `--space-N` tokens. Never arbitrary px values.
7. **All dither/ASCII effects** → Use `AsciiHover` component from `@/components/ui/AsciiHover`. Never custom implementations.
8. **Floating panels / dropdowns** → Must always appear above all other page content. Use `z-index: 200` minimum. The parent container that triggers a dropdown must establish a stacking context (`position: relative; z-index`) above sibling content so the panel is never clipped or hidden behind adjacent elements.
9. **Table rows** → No alternating row colors. All rows use `--card-bg` background. Hover state is `--hover-gray`. Every row is interactive and individually distinguishable by its bottom border.
10. **Dropdown arrows** → Any button or item that triggers a dropdown/expand must have the chevron arrow pinned to the far right (via flex + `margin-left: auto` or `flex: 1` on the label). Dropdown trigger items must **never** have AsciiHover — hover background fill only. AsciiHover is reserved for leaf/action items.
11. **Score/stat cards** → Never use AsciiHover. Hover state is background fill only (`--hover-gray`). These are data display cards, not action buttons.
12. **Breadcrumb visibility** → Breadcrumb bar only appears when the user is two or more levels deep (inside a project or agent). At the workspace root, no breadcrumb is rendered.
13. **Section labels** → Mono uppercase label text followed by a horizontal `1px solid --grey-stroke` line that fills the remaining width. Use flex row with `gap: var(--space-1)`, label `flexShrink: 0`, line `flex: 1`.
14. **No health dots** → Never use a colored dot/circle as a status indicator anywhere in the product. Use colored score numbers and VerdictBadge only.
15. **No colored left borders** → Never use border-left in any status color (--critical, --warning, --safe) on any container. Structural borders use --grey-stroke only. Active/selected state uses the gradient border only.
16. **Page headers** → Every page title uses Heading 2 style: Plus Jakarta Sans, 700, 30px, line-height 30px, letter-spacing -1px. No exceptions — sessions, rules, agent name, ruleset name all use this same style.

---

## FILE TREE

```
design/
├── INDEX.md                      ← YOU ARE HERE
├── tokens/
│   ├── colors.md                 ← all color tokens + usage rules
│   ├── typography.md             ← type scale, families, styles
│   ├── spacing.md                ← spacing scale + border radius
│   └── icons.md                  ← icon library, sizes, usage
├── components/
│   ├── buttons.md                ← all button variants, states, AsciiHover rules
│   ├── forms.md                  ← inputs, textarea, checkbox, radio, select, switch
│   ├── cards.md                  ← card types, hover states, nesting rules
│   ├── tables.md                 ← table, header, rows, pagination, empty state
│   ├── badges.md                 ← rule tags, verdict badge, score block, alert banner
│   ├── toasts.md                 ← toast variants, timing, inline actions
│   ├── modals.md                 ← modal types, sizes, dismiss behavior
│   └── tooltips.md               ← tooltip spec, trigger types
├── patterns/
│   ├── sidebar.md                ← nav hierarchy, expand/collapse, active states
│   ├── breadcrumb.md             ← structure, animation, sticky behavior
│   ├── session-timeline.md       ← filmstrip, pins, spreadsheet, playback
│   └── rules-engine.md           ← sentence builder, conflict detection, templates
├── layout/
│   ├── grid.md                   ← page structure, content width, sidebar layout
│   └── page-templates.md         ← named page shells
└── motion/
    └── interactions.md           ← AsciiHover rules, page transitions, skeletons
```

---

## HOW TO ADD NEW RULES

1. Identify which file owns the component or token being changed
2. Load that file, make the edit
3. If a new component: add it to the FILE TREE above and create the file
4. If a new global rule: add it to GLOBAL RULES above
5. Never duplicate rules across files — one source of truth per rule

## HOW TO ADD A NEW PAGE

1. Load `layout/page-templates.md` → pick the closest shell
2. Load `layout/grid.md` → apply layout rules
3. Load component files only for components used on that page
4. Do not load the full design system for a single page

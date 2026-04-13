# Canary Design System

Design system for the Canary dashboard — QA and observability layer for computer-use AI agents.

## How to use this system

**Always start at `design/INDEX.md`.**
It routes you to the correct file for any design question.
Never load multiple files speculatively — load only what the task requires.

## File structure

```
design/
├── INDEX.md                    ← start here always
├── tokens/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   └── icons.md
├── components/
│   ├── buttons.md
│   ├── forms.md
│   ├── cards.md
│   ├── tables.md
│   ├── badges.md
│   ├── toasts.md
│   ├── modals.md
│   └── tooltips.md
├── patterns/
│   ├── sidebar.md
│   ├── breadcrumb.md
│   ├── session-timeline.md
│   └── rules-engine.md
├── layout/
│   ├── grid.md
│   └── page-templates.md
└── motion/
    └── interactions.md

src/
└── styles/
    └── tokens.css              ← all CSS custom properties live here
```

## Global rules (memorize these)

1. Border radius → `0px` everywhere except documented exceptions
2. Borders → interactive containers only
3. Numbers → always `IBM Plex Mono`
4. ASCII/dither effects → always use `AsciiHover` component
5. Colors → always use CSS tokens, never hardcode hex
6. Spacing → always use `--space-N` tokens

## Stack

Next.js 14, React, shadcn/ui (reskinned), Lucide icons, IBM Plex Mono, Plus Jakarta Sans, Geist, JetBrains Mono

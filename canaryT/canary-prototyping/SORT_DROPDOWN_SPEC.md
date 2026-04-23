# Sort Dropdown Component Spec

> Extracted from Figma file `UREdH5lv3TKS90oJ9dLDf8`, node `404:6299` (page: `product`)

---

## Overview

A "Sort By" dropdown menu used to sort session/data table results. Has 3 visual states: **closed (default)**, **hover**, and **open**. When open, it reveals a grouped list of sort options with divider lines between groups. Each menu item has a dither/halftone hover indicator on the right side.

---

## Component Variants

| Variant (Figma name) | State | Description |
|---|---|---|
| `Frame 87` | **Default / Closed** | Trigger button visible, dropdown panel collapsed (height: 0, hidden) |
| `Frame 86` | **Hover** | Trigger button has hover background, dropdown still collapsed (opacity: 0) |
| `Frame 85` | **Open / Pressed** | Trigger has pressed background, dropdown panel fully expanded |

---

## Anatomy

```
[Sort Dropdown]
  [Trigger Button]
    [Label: "Sort By"]
    [Chevron-down icon (12px)]
  [Dropdown Panel]
    [Menu Item: "Most Recent"]     ← Group 1: Time
    [Menu Item: "Oldest"]
    [Divider]
    [Menu Item: "Highest Score"]   ← Group 2: Score
    [Menu Item: "Lowest Score"]
    [Divider]
    [Menu Item: "Most Violations"] ← Group 3: Violations
    [Menu Item: "Least Violations"]
    [Divider]
    [Menu Item: "Longest"]         ← Group 4: Duration
    [Menu Item: "Shortest"]
    [Divider]
    [Menu Item: "Most Events"]     ← Group 5: Events
    [Menu Item: "Least Events"]
```

---

## Trigger Button

### Dimensions & Layout
- **Width:** 133px
- **Height:** 28px
- **Padding:** 6px all sides
- **Layout:** Flex row, space-between (label left, icon right)

### Styles by State

| State | Background | Border |
|---|---|---|
| Default (closed) | `--card-bg` / `#F7F7F7` | 1px solid `--grey-stroke` / `#DFDFDF` |
| Hover | `--hover-gray` / `#E9E9E9` | 1px solid `--grey-stroke` / `#DFDFDF` |
| Pressed (open) | `--pressed-gray` / `#F4F4F4` | 1px solid `--grey-stroke` / `#DFDFDF` |

### Label
- **Text:** "Sort By"
- **Font:** Plus Jakarta Sans Medium
- **Size:** 12px
- **Line height:** 16px
- **Letter spacing:** 0px
- **Color:** `--text-black` / `#121212`
- **Alignment:** left

### Icon
- **Icon:** Lucide `chevron-down`
- **Size:** 12x12px
- **Position:** Right-aligned within trigger

---

## Dropdown Panel

### Container
- **Width:** 133px (matches trigger width, full-width)
- **Background:** `--pressed-gray` / `#F4F4F4`
- **Border:** 1px solid `--grey-stroke` / `#DFDFDF`
- **Padding:** 4px
- **Gap between items:** 2px
- **Position:** Directly below trigger, no gap

### Open/Close Behavior
- **Closed state:** `height: 0` (or `h-px` with `opacity: 0`), overflow hidden
- **Open state:** Auto height, opacity 1, content visible
- **Transition:** Should animate open (expand down)

---

## Menu Item

### Layout
- **Height:** Auto (content-driven, ~24px)
- **Padding:** 4px top/bottom, 6px left, 4px right
- **Layout:** Flex row, space-between

### Label
- **Font:** Plus Jakarta Sans Medium
- **Size:** 12px
- **Line height:** 16px
- **Letter spacing:** 0px
- **Color:** `--text-black` / `#121212`
- **Wrapping:** nowrap

### Hover State
- **Background:** `--hover-gray` / `#E9E9E9`
- **Dither indicator:** A 6-block dither pattern (░░▒▒▓█) appears on the right side of the hovered item, each block 6px wide x 14px tall, using graduated opacity to create a halftone fade effect

### Dither Hover Indicator Detail
The dither is a row of 6 small rectangles, each 6x14px, representing a left-to-right density gradient:

| Block | Name | Approximate Opacity/Density |
|---|---|---|
| 1 | ░ (light) | ~15% fill |
| 2 | ░ (light) | ~25% fill |
| 3 | ▒ (medium) | ~40% fill |
| 4 | ▒ (medium) | ~55% fill |
| 5 | ▓ (dense) | ~75% fill |
| 6 | █ (solid) | ~100% fill |

- **Default state:** Container is `width: 0` with `overflow: hidden`, so the dither is invisible
- **Hover state:** Container expands to show all 6 blocks (~36px total), dither becomes visible
- This is the same dither motif used throughout the Canary design system (buttons, sidebar items)

---

## Divider

- **Type:** Horizontal line separator between groups
- **Height:** ~1px (exact: 1.359px with a slight rotation of 0.62deg for a hand-drawn feel)
- **Width:** Full width of panel
- **Color:** Thin dark stroke (rendered as an image/SVG line)
- **Placement:** Between each option group (after Oldest, after Lowest Score, after Least Violations, after Shortest)

---

## Menu Options (Complete List)

| Group | Label | Sort Behavior |
|---|---|---|
| **Time** | Most Recent | Sort by date descending |
| | Oldest | Sort by date ascending |
| **Score** | Highest Score | Sort by score descending |
| | Lowest Score | Sort by score ascending |
| **Violations** | Most Violations | Sort by violation count descending |
| | Least Violations | Sort by violation count ascending |
| **Duration** | Longest | Sort by duration descending |
| | Shortest | Sort by duration ascending |
| **Events** | Most Events | Sort by event count descending |
| | Least Events | Sort by event count ascending |

---

## Color Token Reference

| Token | Hex | Usage |
|---|---|---|
| `--card-bg` | `#F7F7F7` | Trigger background (default/closed) |
| `--hover-gray` | `#E9E9E9` | Trigger hover bg, menu item hover bg |
| `--pressed-gray` | `#F4F4F4` | Trigger pressed bg, dropdown panel bg |
| `--grey-stroke` | `#DFDFDF` | All borders |
| `--text-black` | `#121212` | All text |

---

## Typography Token Reference

| Property | Value |
|---|---|
| Font family | Plus Jakarta Sans |
| Font weight | 500 (Medium) |
| Font size | 12px (`--paragraph/mini/font-size`) |
| Line height | 16px (`--paragraph/mini/line-height`) |
| Letter spacing | 0px (`--paragraph/mini/letter-spacing`) |

---

## Implementation Notes

- The component uses a **single stacked column layout**: trigger on top, panel directly below with no gap
- The entire dropdown sits within a **133px wide** container
- When closed, the panel has `height: 0` and `overflow: hidden` (not `display: none`) to allow CSS transitions
- The Figma variant `Frame 86` (hover) shows a state where the trigger is highlighted but the menu hasn't opened yet — this suggests the menu opens on click, not hover
- The dither indicator on menu items should transition its width from 0 to ~36px on hover for a smooth reveal
- Dividers have a subtle ~0.62deg rotation — this can be ignored in implementation or replicated for the hand-drawn aesthetic
- The component is designed to be placed above a data table to control its sort order (used in the Sessions table view)

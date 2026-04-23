# Canary Design System Reference

Extracted from Figma file: `UREdH5lv3TKS90oJ9dLDf8` / Page: `product` (node `127:2`)

---

## 1. Color Variables

### Core Semantic Colors

| Token (CSS Variable)         | Hex Value   | Usage                          |
| ---------------------------- | ----------- | ------------------------------ |
| `--black`                    | `#0A0A0A`   | Headings, primary text         |
| `--text-black`               | `#121212`   | Body text, labels              |
| `--icon-grey`                | `#858585`   | Muted/secondary text, icons    |
| `--grey-stroke`              | `#DFDFDF`   | Borders, dividers              |
| `--hover-gray`               | `#E9E9E9`   | Hover states, alt table rows   |
| `--bg`                       | `#EFEFEF`   | Page/app background            |
| `--card-bg`                  | `#F7F7F7`   | Card & panel backgrounds       |
| `--sidebar-bg`               | `#F7F7F7`   | Sidebar background             |

### Status Colors

| Token (CSS Variable) | Hex Value   | Usage                          |
| -------------------- | ----------- | ------------------------------ |
| `--critical`         | `#FF2E2E`   | Critical/error states          |
| `--warning`          | `#FFC02E`   | Warning states                 |
| `--safe`             | `#48C72B`   | Safe/success/ready states      |

### Text Colors

| Token (CSS Variable) | Hex Value   | Usage                          |
| -------------------- | ----------- | ------------------------------ |
| `--text-white`       | `#F7F7F7`   | Text on dark/colored backgrounds (primary & destructive buttons) |

### Accent / Brand Colors

| Token (CSS Variable) | Hex Value   | Usage                          |
| -------------------- | ----------- | ------------------------------ |
| `--accent-color`     | `#0088C7`   | Primary brand accent (buttons, links, avatars) |
| Profile avatar BG    | `#0088C7`   | User avatar background (same as accent) |
| `--pressed-gray`     | `#F4F4F4`   | Border color on primary button hover state |
| Focus ring           | via `--focus/ring` | Focus outline on interactive elements |

### Grays (from styles)

| Name              | Hex Value   |
| ----------------- | ----------- |
| `grays/gray-100`  | `#F5F5F5`   |

---

## 2. Typography

### Font Families

| Role         | Family                | Fallback    |
| ------------ | --------------------- | ----------- |
| **Headings** | Plus Jakarta Sans     | sans-serif  |
| **Body**     | Plus Jakarta Sans     | sans-serif  |
| **Body alt** | Geist                 | sans-serif  |
| **Mono**     | IBM Plex Mono         | monospace   |
| **Mono alt** | JetBrains Mono        | monospace   |

### Heading Styles

| Style       | Family            | Weight        | Size   | Line Height | Letter Spacing |
| ----------- | ----------------- | ------------- | ------ | ----------- | -------------- |
| Heading 1   | Plus Jakarta Sans | 700 (Bold)    | 48px   | 48px        | -1.5px         |
| Heading 2   | Plus Jakarta Sans | 700 (Bold)    | 30px   | 30px        | -1px           |
| Heading 3   | Plus Jakarta Sans | 600 (SemiBold)| 24px   | 28.8px      | -1px           |
| Heading 4   | Plus Jakarta Sans | 600 (SemiBold)| 20px   | 24px        | 0px            |

### Paragraph / Body Styles

| Style                      | Family            | Weight          | Size   | Line Height | Letter Spacing |
| -------------------------- | ----------------- | --------------- | ------ | ----------- | -------------- |
| Paragraph Bold             | Plus Jakarta Sans | 600 (SemiBold)  | 16px   | 24px        | 0px            |
| Paragraph Regular          | Plus Jakarta Sans | 400 (Regular)   | 16px   | 24px        | 0px            |
| Paragraph Small Medium     | Plus Jakarta Sans | 500 (Medium)    | 14px   | 20px        | 0px            |
| Paragraph Small Regular    | Plus Jakarta Sans | 400 (Regular)   | 14px   | 20px        | 0px            |
| Paragraph Mini Medium      | Plus Jakarta Sans | 500 (Medium)    | 12px   | 16px        | 0px            |
| Paragraph Mini Regular     | Geist             | 400 (Regular)   | 12px   | 16px        | 0px            |

### Monospaced Styles

| Style            | Family        | Weight          | Size   | Line Height | Letter Spacing |
| ---------------- | ------------- | --------------- | ------ | ----------- | -------------- |
| Mono             | IBM Plex Mono | 400 (Regular)   | 12px   | 12px        | 0px            |
| Mono Numbers     | IBM Plex Mono | 600 (SemiBold)  | 12px   | 12px        | 0px            |
| Sidebar Label    | JetBrains Mono| 700 (Bold)      | 12px   | normal      | 0px            |

---

## 3. Spacing Scale (CSS Variables)

| Token              | Value  |
| ------------------ | ------ |
| `--xs`             | 0–8px  |
| `--sm`             | 12px   |
| `--5xl`            | 64px   |
| `--absolute/3`     | 12px   |
| `--hacks-(to-fit-scale)/6` | 6px |

### Border Radius

| Token                    | Value |
| ------------------------ | ----- |
| `--absolute/radius-10`   | 10px  |
| `--absolute/radius-12`   | 12px  |

---

## 4. Components & Variants

### 4.1 Button

Primary interactive element with a distinctive dither/halftone hover effect.

| Property | Values                                                            |
| -------- | ----------------------------------------------------------------- |
| `button` | `primary` \| `secondary` \| `destructive` \| `primaryhover` \| `secondaryhover` \| `destructivehover` |

#### Variants

| Variant             | Background                      | Text Color            | Border                        |
| ------------------- | ------------------------------- | --------------------- | ----------------------------- |
| **Primary**         | `--accent-color` (`#0088C7`)    | `--text-white` (`#F7F7F7`) | 1px `--grey-stroke`      |
| **Primary Hover**   | `#0088C7`                       | `--text-white` (`#F7F7F7`) | 1px `--pressed-gray` (`#F4F4F4`) |
| **Secondary**       | `--card-bg` (`#F7F7F7`)         | `--text-black` (`#121212`) | 1px `--grey-stroke`      |
| **Secondary Hover** | `--hover-gray` (`#E9E9E9`)      | `--text-black` (`#121212`) | 1px `--grey-stroke`      |
| **Destructive**     | `--critical` (`#FF2E2E`)        | `--text-white` (`#F7F7F7`) | none                     |
| **Destructive Hover** | `--critical` (`#FF2E2E`)      | `--text-white` (`#F7F7F7`) | none                     |

#### Specs

- **Height:** 36px
- **Padding:** 4px
- **Font:** Plus Jakarta Sans Bold, 12px
- **Dither effect:** On hover, decorative gradient blocks (░▒▓█ pattern) animate in from left and right edges (72px wide each side). The blocks use the text color at varying opacities (15%, 30%, 55%, 85%) to create a halftone transition effect. Left side fades in (dark→light toward center), right side fades out (light→dark toward edge).

---

### 4.2 Breadcrumb

Displays the path to the current resource using a hierarchy of links.

#### Sub-components

| Component              | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `Breadcrumb`           | Root `<nav>` container with border-bottom        |
| `BreadcrumbList`       | `<ol>` wrapper for semantic list                 |
| `BreadcrumbItem`       | `<li>` for each item                             |
| `BreadcrumbLink`       | Clickable ancestor link (muted color)            |
| `BreadcrumbPage`       | Current page label (foreground color, not a link)|
| `BreadcrumbSeparator`  | Separator between items (default: chevron-right) |
| `BreadcrumbEllipsis`   | Collapsed middle items (ellipsis icon)           |

#### Breadcrumb Item States

| State     | Text Color                         | Description                     |
| --------- | ---------------------------------- | ------------------------------- |
| Default   | `--icon-grey` / muted-foreground   | Ancestor pages                  |
| Hover     | `--text-black` / foreground        | On hover, text brightens        |
| Active    | `--text-black` / foreground        | Current page (last item)        |

#### Specs

- **Container:** bg `--bg`, border-bottom 1px `--grey-stroke`, padding 24px, gap 4px
- **Item font:** Plus Jakarta Sans Regular, 14px/20px
- **Separator:** Lucide `chevron-right`, 14px, muted-foreground color
- **Custom separator:** Lucide `slash` icon can replace chevron-right
- **Dropdown indicator:** Optional `chevron-down` (12px) on items with sibling navigation
- **Ellipsis:** Lucide `ellipsis` (16px) for collapsed middle levels
- **Items variant:** Supports 2–6 visible levels; beyond that, use ellipsis for collapsed middle items

---

### 4.3 Switch (Figma-only)

A toggle switch control with animated fill states.

| Property   | Values                          |
| ---------- | ------------------------------- |
| `checked`  | `true` \| `false`               |
| `state`    | `Default` \| `Focus` \| `Disabled` |

- **Dimensions:** 33px x 18px
- **Track background (unchecked):** `--hover-gray` (`#E9E9E9`), rounded 12px
- **Track (checked):** Animated gradient fill (dark)
- **Thumb:** Circular toggle, shifts left/right based on checked state

---

### 4.2 Switch Group

Switch + label in a row layout.

| Property   | Values                 |
| ---------- | ---------------------- |
| `checked`  | `true` \| `false`      |
| `layout`   | `Inline` \| `Block`    |

- **Inline:** Switch and label side-by-side, compact
- **Block:** Full-width row, label takes remaining space
- **Label font:** Plus Jakarta Sans, 14px/20px, Medium (500)
- **Unchecked text color:** `--icon-grey` (`#858585`)
- **Checked text color:** `--text-black` (`#121212`)

---

### 4.3 Rich Switch Group

Enhanced switch group with optional secondary text.

| Property    | Values            |
| ----------- | ----------------- |
| `checked`   | `true` \| `false` |
| `flipped`   | `true` \| `false` |
| `showLine2` | `true` \| `false` |

- **Container:** bg `--card-bg`, border `--grey-stroke`, rounded 10px, 12px padding
- **Width:** 240px
- **Primary label:** Plus Jakarta Sans, 14px/20px, Regular
- **Secondary text:** Geist, 12px/16px, Regular, color `--general/muted-foreground` (`#737373`)
- **Flipped:** Moves switch to right side of label

---

### 4.4 Sidebar

Left navigation panel.

- **Width:** 280px, full height
- **Background:** `--sidebar-bg` (`#F7F7F7`)
- **Border:** right 1px solid `--grey-stroke`
- **Padding:** 20px
- **Section gap:** 48px

#### Sidebar Button (Nav Item)

| Property   | Values                                 |
| ---------- | -------------------------------------- |
| `sidebar`  | `default` \| `hover` \| `pressed`      |

- **Font:** Plus Jakarta Sans Medium, 14px/20px (project name)
- **Sub-items font:** Plus Jakarta Sans Medium, 12px/16px
- **Expandable:** Chevron-down icon, rotated -90deg when collapsed
- **Rule count badge:** 14px box, 1px border `--grey-stroke`, 7px mono text

---

### 4.5 Profile Dropdown

Workspace selector in the sidebar header.

| Property   | Values                                 |
| ---------- | -------------------------------------- |
| `profile`  | `default` \| `hover` \| `pressed`      |

- **Avatar:** 24px square, bg `#0088C7`, 2px border-radius, white bold 12px initials
- **Workspace name:** Plus Jakarta Sans SemiBold, 16px/24px
- **Dropdown menu items:** Plus Jakarta Sans Medium, 12px, with Lucide icons (12px)
- **Menu items:** Workspace Rules, Members, Settings, New Workspace
- **Divider:** 1px line between groups

---

### 4.6 Menu Button

Generic action button.

| Property | Values                 |
| -------- | ---------------------- |
| `button` | `default` \| `hover`   |

- **Font:** Plus Jakarta Sans Medium, 12px
- **Icon:** Lucide icon (12px) + chevron-down

---

### 4.7 Rule Type Tags

Categorization badges for rule types.

| Property | Values                                    |
| -------- | ----------------------------------------- |
| `type`   | `boundary` \| `outcome` \| `sequence` \| `time` |

- **Font:** IBM Plex Mono Regular, 12px/12px, uppercase
- **Container:** 1px border `--grey-stroke`, 6px vertical / 6-8px horizontal padding
- **Icons:** Lucide icons — shield (boundary), square-check (outcome), list-ordered (sequence), clock-3 (time)
- **Text color:** `--text-black` (`#121212`)

---

### 4.8 Status Indicator (Severity Bar)

Visual severity indicator using gradient fill blocks.

| Property | Values                            |
| -------- | --------------------------------- |
| `type`   | `critical` \| `warning` \| `safe` |

- **Dimensions:** 6px wide x 14px tall
- **Gradient blocks:** ░ ▒ ▓ █ pattern (light to dark fill)
- **Colors mapped to severity level**

---

### 4.9 Verdict Badge

Inline status badge showing readiness state.

| Property  | Values                                  |
| --------- | --------------------------------------- |
| `verdict` | `ready` \| `warning` \| `notready`      |

- **Font:** IBM Plex Mono Regular, 12px/12px, uppercase
- **Ready:** border `--safe` (`#48C72B`), green text
- **Warning:** border `--warning` (`#FFC02E`), yellow text
- **Not Ready:** border `--critical` (`#FF2E2E`), red text
- **Padding:** 8px horizontal, 6px vertical
- **Decorative fills:** ░ ▒ █ blocks flanking text

---

### 4.10 Score Block

Numeric score display.

- **Font:** IBM Plex Mono SemiBold, 12px/12px
- **Format:** `{score}` in status color + `/100` in `--icon-grey` (`#858585`)
- **Alignment:** center

---

### 4.11 Alert Banner

Dismissable notification bar.

- **Background:** `--card-bg` (`#F7F7F7`)
- **Border:** 1px solid `--grey-stroke`
- **Padding:** 12px
- **Layout:** Space-between (content left, close icon right)
- **Icon:** Lucide `wand-sparkles` (12px)
- **Text:** Plus Jakarta Sans Medium, 12px/16px, mixed-weight inline (`Bold` for key info)
- **Close:** 12px close icon

---

### 4.12 Table Header

Column header row for data tables.

- **Font:** IBM Plex Mono Regular, 12px/12px, uppercase
- **Text color:** `--icon-grey` (`#858585`)
- **Border:** bottom 1px solid `--grey-stroke`
- **Padding:** 12px horizontal, 8px vertical
- **Sort indicator:** Lucide `chevrons-up-down` icon (12px)
- **Columns:** SESSION-ID, DATE/TIME, SCORE, VERDICT, EVENTS, VIOLATIONS, DURATION

---

### 4.13 Session Row (Table Row)

Data row for session list.

| Property    | Values                         |
| ----------- | ------------------------------ |
| `property1` | `Frame 72` \| `Frame 75`       |

- **Default row:** transparent background
- **Alt/hover row:** bg `--hover-gray` (`#E9E9E9`)
- **Border:** bottom 1px solid `--grey-stroke`
- **Padding:** 12px
- **Data font:** IBM Plex Mono Regular, 12px (IDs/labels), SemiBold (numbers/values)
- **ID color:** `--icon-grey` (`#858585`)
- **Value color:** `--text-black` (`#121212`)

---

## 5. Icon System

- **Library:** Lucide Icons
- **Sizes:** 12px (inline/compact), 16px (standard)
- **Style:** Stroke-based, 1.5px stroke weight
- **Usage prefix:** `li:` (e.g., `li:chevron-down`, `li:shield`, `li:settings`)

### Common Icons Used

| Icon Name            | Context                    |
| -------------------- | -------------------------- |
| `chevron-down`       | Dropdowns, expandable nav  |
| `chevrons-up-down`   | Table sort indicator       |
| `shield`             | Boundary rule type         |
| `square-check`       | Outcome rule type          |
| `list-ordered`       | Sequence rule type         |
| `clock-3`            | Time rule type             |
| `list-filter`        | Filter button              |
| `building-2`         | Workspace rules            |
| `person-standing`    | Members                    |
| `settings`           | Settings                   |
| `diamond-plus`       | New workspace              |
| `wand-sparkles`      | AI suggestions / alerts    |
| `close` (X)          | Dismiss / close            |

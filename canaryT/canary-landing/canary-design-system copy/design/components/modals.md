# Canary Design System — Modals
> Parent: `design/INDEX.md`
> Button spec: `components/buttons.md`

---

## Base Spec

| Property | Value |
|---|---|
| Background | `--card-bg (#F7F7F7)` |
| Border | `1px solid --grey-stroke (#DFDFDF)` |
| Border radius | `0px` |
| Backdrop | `rgba(10, 10, 10, 0.45)` |

## Dismiss behavior
- Click ✕ icon → closes
- Click outside modal (backdrop) → closes
- Press `Escape` key → closes

---

## Sizes

| Type | Max width |
|---|---|
| Confirm / simple | `400px` |
| Form / complex | `480px` |
| Rule builder | `600px+` (defined per use case) |

---

## Header

| Property | Value |
|---|---|
| Padding | `16px 20px` |
| Border bottom | `1px solid --grey-stroke (#DFDFDF)` |
| Title font | Plus Jakarta Sans, 14px/20px, SemiBold |
| Title color | `--text-black (#121212)` |
| Close icon | Lucide `x`, 12px |
| Close color (default) | `--icon-grey (#858585)` |
| Close color (destructive modal) | `--critical (#FF2E2E)` |
| Close hover | `--hover-gray` background fill |

---

## Body

| Property | Value |
|---|---|
| Padding | `20px (--space-6)` |
| Gap between fields | `16px (--space-5)` |

Input fields inside modals use the same spec as global inputs:
- Background: `--card-bg (#F7F7F7)`
- Border: `1px solid --grey-stroke (#DFDFDF)`
- Light mode, no dark surfaces inside modals

---

## Footer

| Property | Value |
|---|---|
| Padding | `12px 20px` |
| Border top | `1px solid --grey-stroke (#DFDFDF)` |
| Layout | right-aligned |
| Gap between buttons | `8px (--space-3)` |

Button pairing:
- Form modal: Secondary "Cancel" + Primary "Create / Save"
- Destructive modal: Secondary "Cancel" + Destructive "Delete"

---

## Confirm / Destructive Modal

Includes warning icon block in body:
- Container: `32px × 32px`
- Background: `rgba(255, 46, 46, 0.1)` (light red tint)
- Border: `1px solid --critical (#FF2E2E)`
- Icon: Lucide `triangle-alert`, 14px, `--critical`
- Confirm title: Plus Jakarta Sans, 13px, SemiBold
- Description: Plus Jakarta Sans, 13px, Regular, `--icon-grey`

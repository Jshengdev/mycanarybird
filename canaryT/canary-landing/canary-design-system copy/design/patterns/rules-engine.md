# Canary Design System — Rules Engine
> Parent: `design/INDEX.md`
> Located: Agent → Rulesets → Ruleset Name page

---

## Location in Hierarchy

Sidebar: `Project → Agent → Rulesets → [Ruleset Name]`
This is a standalone page — not inside session detail.

---

## Sentence Builder

Rule is constructed as a series of connected dropdown chips forming a readable sentence.

```
[ IF ] [ agent navigates to ] [ URL ] [ containing ] [ /admin ] [ → BLOCK ]
```

Each segment is a dropdown chip (uses dropdown/select component from forms.md).
Chips connect horizontally. Line wraps if too long.
Final chip always shows severity: OBSERVED / FLAGGED / BLOCKED.

---

## Conflict Detection

### During rule creation
- Inline warning appears inside rule builder when conflict detected
- Shows which existing rule conflicts
- User must resolve or acknowledge before saving

### On existing rule card
- Warning badge on card if unresolved conflict exists
- Uses `--warning (#FFC02E)` color
- Appears on suggested rules with unresolved conflicts

### Resolution flow
- Click inline warning → conflict resolver opens
- User chooses: which rule takes precedence, or keep both
- Higher severity always applies when both rules trigger same action
- No auto-resolution — always requires human decision

---

## Rule Cards

Each rule displayed as a clickable card (see cards.md — clickable card type).

Card contains:
- Rule name (Plus Jakarta Sans, 14px, SemiBold)
- Rule type tag (see badges.md)
- Sentence preview (truncated if long)
- Severity badge (OBSERVED / FLAGGED / BLOCKED)
- Conflict warning badge if unresolved
- Drag handle (left edge, Lucide `grip-vertical`, 12px, `--icon-grey`)

---

## Reordering

Drag and drop within a ruleset.
Visual organization only — no impact on rule evaluation.
No priority system. Each rule is independent.
Drag handle: left edge of rule card.

---

## Severity System

| Severity | Color | Meaning |
|---|---|---|
| OBSERVED | `--icon-grey (#858585)` | Informational — log only |
| FLAGGED | `--warning (#FFC02E)` | Warning — flag the action |
| BLOCKED | `--critical (#FF2E2E)` | Block — prevent the action |

When two rules conflict, higher severity applies.

---

## Template Library

Layout: cards grid.

Each template card shows:
- Rule/ruleset name
- Rule type tag
- Severity
- Brief description (1 line)

Two insert types:
- Insert single pre-built rule → inserts into current ruleset, opens in edit mode
- Insert entire pre-built ruleset → creates new ruleset with all rules, opens for review

---

## Workspace vs. Agent Rule Inheritance

No automatic inheritance.
Conflicts surface as inline warnings (same as rule-to-rule conflicts).
Resolution chosen at point of conflict:
- During rule creation
- Or when clicking warning on an existing card

User explicitly decides scope per conflict. No global setting.

---

## Save Behavior

| State | Behavior |
|---|---|
| Editing mode | explicit Save button (primary variant) |
| Cancel | discards changes, reverts to last saved state |
| New rule | Save creates it, Cancel discards |
| Auto-save | never |
| Unsaved state | breadcrumb warns on navigation away |

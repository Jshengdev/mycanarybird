# Canary Dashboard — Iterations Log

Active log of design and architecture iterations.

---

## 2026-04-09 — Report view removed from session detail

**Change:** Removed the "Report" tab from the session detail page view toggle. ComplianceReport.tsx and all report sub-components (ReportScoreHeader, DeductionBreakdown, ViolationsSummary, ActionLog, SuggestionCallout) moved to `src/components/deprecated/`.

**Reason:** Three views (Timeline, Spreadsheet, Report) felt like too many. The Timeline and Spreadsheet views are genuinely differentiated — Timeline is a visual replay with screenshot zone + scrubber, Spreadsheet is a structured data table with expand panels. The Report view overlapped heavily with the Spreadsheet view (same data, different layout) and didn't provide enough unique value to justify a third tab.

**Plan:** Report-specific content (score breakdown, deduction math, violations summary, suggestion callout) will be integrated into the Spreadsheet view as a collapsible header or sidebar panel in a future iteration. The components are preserved in `src/components/deprecated/` and can be re-composed.

**Files moved:**
- `src/components/session/ComplianceReport.tsx` → `src/components/deprecated/`
- `src/components/session/report/` (entire directory) → `src/components/deprecated/report/`
  - ReportScoreHeader.tsx
  - DeductionBreakdown.tsx
  - ViolationsSummary.tsx
  - ActionLog.tsx
  - SuggestionCallout.tsx

**Files modified:**
- `src/components/session/SessionTopBar.tsx` — removed 'report' from SessionView type and VIEWS array
- `src/app/[workspace]/[agent]/sessions/[sessionId]/page.tsx` — removed ComplianceReport import and rendering

---

## 2026-04-09 — Timeline merged into Spreadsheet view

**Change:** Combined the separate Timeline and Spreadsheet views into a single unified view. The session detail page no longer has tab switching — it's one integrated experience.

**Layout:** The top section of the spreadsheet now contains:
- Left panel: score card (64px mono black) + session metadata (events, date, duration, flagged, blocked)
- Right panel: embedded timeline (ScreenshotZone + ScrubberBar + LoopDetectionBanner) with a fullscreen button

**Interaction model:**
- Clicking a pin/dot in the timeline highlights the corresponding row in the spreadsheet log
- A highlighted overlay row appears at the top of the table showing "Jump to #N" — clicking it scrolls to and focuses the actual row
- Highlights auto-clear on any table interaction (clicking a row, changing filters, scrolling)
- The scrubber bar syncs with the spreadsheet — dragging it updates the highlighted row
- Fullscreen button (Maximize2 icon) opens the full SessionTimeline view as a fixed overlay, with an "Exit fullscreen" button

**Reason:** The Timeline and Spreadsheet were showing the same data in different formats. Users needed to switch tabs to correlate visual events with log entries. Merging them creates a single view where the visual replay and structured log are always visible together, with bidirectional sync.

**Files modified:**
- `src/components/session/SessionSpreadsheet.tsx` — major rewrite: added timeline embed, fullscreen mode, highlighted row overlay, bidirectional sync
- `src/components/session/SessionTopBar.tsx` — removed view toggle buttons, simplified to metadata-only bar
- `src/app/[workspace]/[agent]/sessions/[sessionId]/page.tsx` — removed view switching, single spreadsheet view

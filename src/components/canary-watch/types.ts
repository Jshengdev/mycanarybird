/**
 * Shared types for the canary-watch module.
 *
 * Design principle: sections declare their own metadata. Everything
 * in this file is content-agnostic — text copy can change without
 * breaking tracking.
 */

export type LogEventType =
  | 'OBSERVED'
  | 'FLAGGED'
  | 'BLOCKED'
  | 'LEARNED'
  | 'SUGGESTED';

export interface LogEvent {
  id: string;           // unique
  type: LogEventType;
  target: string;       // human-readable description
  tOffset: number;      // ms since session start
  time: string;         // HH:MM:SS clock-style rendering
}

export interface CanarySectionRegistration {
  id: string;
  order: number;
  displayName: string;
  /** Section root — used for scroll-position detection (which section is active). */
  anchor: HTMLElement | null;
  /** Optional specific element the bird PERCHES ON. Falls back to anchor if null. */
  perchAnchor: HTMLElement | null;
  /**
   * Ordered list of focus points the bird cycles through while this section
   * is active — the "eye-track". Index 0 is the bird's initial perch for
   * this section; subsequent indices are cycled on a dwell timer.
   * Empty or null → fall back to perchAnchor behaviour (no cycling).
   */
  focusPoints: HTMLElement[] | null;
}

export interface CanaryWatchState {
  sessionStart: number;
  events: LogEvent[];
  sections: CanarySectionRegistration[];
  activeSectionId: string | null;
  sectionsSeen: Set<string>;
  flagCount: number;
}

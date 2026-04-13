/* ============================================================
   Canary Dashboard — Mock Data v3
   Single source of truth for all app data.
   Import from '@/data/mockData' in any page or component.
   ============================================================ */

// ── Types ────────────────────────────────────────────────────

export type Agent = {
  id: string;
  name: string;
  description: string;
  framework: string;
  systemPrompt: string;
  connectionStatus: 'connected' | 'waiting' | 'disconnected';
  lastSeen: string;
  healthScore: number;
};

export type Session = {
  id: string;
  agentId: string;
  score: number;
  eventCount: number;
  flaggedCount: number;
  blockedCount: number;
  observedCount: number;
  violationCount: number;
  duration: string;
  durationSeconds: number;
  tracesCount: number;
  status: 'complete' | 'live' | 'idle';
  date: string;
};

export type Event = {
  id: string;
  sessionId: string;
  sequence: number;
  timestamp: string;
  actionType: string;
  action: string;
  target: string;
  app: string;
  classificationStatus: 'OBSERVED' | 'FLAGGED' | 'BLOCKED';
  classificationSource: string;
  classificationConfidence: number;
  matchedRuleId: string | null;
  violationDetails?: string;
  ruleType?: string;
};

export type Ruleset = {
  id: string;
  name: string;
  ruleCount?: number;
  scope?: string;
  source?: string;
  agentId: string;
  description?: string;
};

export type Rule = {
  id: string;
  name: string;
  type: string;
  severity: string;
  condition: string;
  consequence: string;
  plainEnglish: string;
  evaluationMethod: string;
  status: string;
  isHotRule?: boolean;
  isOrphaned?: boolean;
  isNeverTriggered?: boolean;
  stats: {
    lastFired: string;
    passRate: number;
    totalEvaluations: number;
    sparkline: string[];
  };
};

export type Violation = {
  id: string;
  agentId: string;
  agentName: string;
  sessionId: string;
  status: string;
  action: string;
  ruleId: string;
  timestamp: string;
};

export type InsightSeverity = 'critical' | 'warning' | 'info';
export type InsightStatus = 'active' | 'updated' | 'resolved';
export type InsightCategory = 'loop' | 'boundary' | 'sequence' | 'outcome' | 'performance' | 'rule-suggestion';

export interface Insight {
  id: string;
  agentId: string;
  sessionId: string;
  traceId: string;
  eventSequence: number;
  timestamp: string;
  category: InsightCategory;
  severity: InsightSeverity;
  status: InsightStatus;
  title: string;
  description: string;
  rootCause?: string;
  suggestedRule?: {
    type: 'boundary' | 'outcome' | 'sequence' | 'time';
    plainEnglish: string;
    consequence: 'block' | 'flag';
  };
  affectedSessions: string[];
  firstSeenAt: string;
  lastSeenAt: string;
  occurrenceCount: number;
}

// ── Workspace ────────────────────────────────────────────────

export const WORKSPACE = {
  id: 'ws_photon',
  name: 'Photon workspace',
  apiKey: 'ck_live_ws_photon_xxxx',
  plan: 'team',
};

// ── Agents ───────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  { id: 'email-agent', name: 'Email drafting agent', description: 'Drafts and sends emails via Gmail', framework: 'OpenClaw', systemPrompt: 'You are an email assistant...', connectionStatus: 'connected', lastSeen: '2026-04-04T10:14:00Z', healthScore: 50 },
  { id: 'file-agent', name: 'File manager agent', description: 'Manages files and directories', framework: 'Claude CU', systemPrompt: '...', connectionStatus: 'connected', lastSeen: '2026-04-04T09:30:00Z', healthScore: 92 },
  { id: 'browser-agent', name: 'Browser research agent', description: 'Researches topics via web browser', framework: 'Browser Use', systemPrompt: '...', connectionStatus: 'connected', lastSeen: '2026-04-03T15:22:00Z', healthScore: 78 },
  { id: 'calendar-agent', name: 'Calendar agent', description: 'Manages calendar and scheduling', framework: 'OpenClaw', systemPrompt: '...', connectionStatus: 'waiting', lastSeen: '2026-04-02T11:00:00Z', healthScore: 95 },
];

// ── Sessions ─────────────────────────────────────────────────

export const SESSIONS: Session[] = [
  // Email agent sessions
  { id: 'ses_20260404_a3f9', agentId: 'email-agent', score: 50, eventCount: 14, flaggedCount: 2, blockedCount: 2, observedCount: 10, violationCount: 4, duration: '4m 15s', durationSeconds: 255, tracesCount: 47, status: 'live', date: '2026-04-04T10:14:00Z' },
  { id: 'ses_20260403_b7c2', agentId: 'email-agent', score: 65, eventCount: 22, flaggedCount: 2, blockedCount: 0, observedCount: 20, violationCount: 2, duration: '6m 42s', durationSeconds: 402, tracesCount: 91, status: 'complete', date: '2026-04-03T14:30:00Z' },
  { id: 'ses_20260403_a1d4', agentId: 'email-agent', score: 72, eventCount: 18, flaggedCount: 1, blockedCount: 0, observedCount: 17, violationCount: 1, duration: '3m 58s', durationSeconds: 238, tracesCount: 67, status: 'complete', date: '2026-04-03T09:15:00Z' },
  { id: 'ses_20260402_f8e1', agentId: 'email-agent', score: 58, eventCount: 31, flaggedCount: 3, blockedCount: 2, observedCount: 26, violationCount: 5, duration: '8m 20s', durationSeconds: 500, tracesCount: 142, status: 'complete', date: '2026-04-02T16:45:00Z' },
  { id: 'ses_20260402_c3a7', agentId: 'email-agent', score: 70, eventCount: 12, flaggedCount: 2, blockedCount: 0, observedCount: 10, violationCount: 2, duration: '2m 45s', durationSeconds: 165, tracesCount: 44, status: 'complete', date: '2026-04-02T11:20:00Z' },
  { id: 'ses_20260401_d9b3', agentId: 'email-agent', score: 62, eventCount: 25, flaggedCount: 2, blockedCount: 1, observedCount: 22, violationCount: 3, duration: '5m 12s', durationSeconds: 312, tracesCount: 88, status: 'complete', date: '2026-04-01T13:00:00Z' },
  { id: 'ses_20260401_a2f5', agentId: 'email-agent', score: 55, eventCount: 19, flaggedCount: 3, blockedCount: 1, observedCount: 15, violationCount: 4, duration: '4m 33s', durationSeconds: 273, tracesCount: 55, status: 'complete', date: '2026-04-01T08:45:00Z' },
  { id: 'ses_20260331_e6c8', agentId: 'email-agent', score: 48, eventCount: 28, flaggedCount: 4, blockedCount: 2, observedCount: 22, violationCount: 6, duration: '7m 08s', durationSeconds: 428, tracesCount: 128, status: 'complete', date: '2026-03-31T17:30:00Z' },
  { id: 'ses_20260331_b4d1', agentId: 'email-agent', score: 52, eventCount: 16, flaggedCount: 2, blockedCount: 1, observedCount: 13, violationCount: 3, duration: '3m 22s', durationSeconds: 202, tracesCount: 61, status: 'complete', date: '2026-03-31T10:15:00Z' },
  { id: 'ses_20260330_a7e2', agentId: 'email-agent', score: 50, eventCount: 20, flaggedCount: 3, blockedCount: 1, observedCount: 16, violationCount: 4, duration: '5m 55s', durationSeconds: 355, tracesCount: 74, status: 'complete', date: '2026-03-30T14:00:00Z' },
  // File agent sessions
  { id: 'ses_file_001', agentId: 'file-agent', score: 85, eventCount: 12, flaggedCount: 1, blockedCount: 0, observedCount: 11, violationCount: 1, duration: '2m 30s', durationSeconds: 150, tracesCount: 42, status: 'complete', date: '2026-04-04T09:30:00Z' },
  { id: 'ses_file_002', agentId: 'file-agent', score: 90, eventCount: 9, flaggedCount: 0, blockedCount: 1, observedCount: 8, violationCount: 1, duration: '1m 45s', durationSeconds: 105, tracesCount: 35, status: 'complete', date: '2026-04-03T09:28:00Z' },
  { id: 'ses_file_003', agentId: 'file-agent', score: 94, eventCount: 15, flaggedCount: 0, blockedCount: 0, observedCount: 15, violationCount: 0, duration: '3m 10s', durationSeconds: 190, tracesCount: 51, status: 'complete', date: '2026-04-02T14:15:00Z' },
  // Browser agent sessions
  { id: 'ses_browser_001', agentId: 'browser-agent', score: 72, eventCount: 18, flaggedCount: 2, blockedCount: 0, observedCount: 16, violationCount: 2, duration: '5m 10s', durationSeconds: 310, tracesCount: 83, status: 'complete', date: '2026-04-03T15:22:00Z' },
  { id: 'ses_browser_002', agentId: 'browser-agent', score: 78, eventCount: 14, flaggedCount: 1, blockedCount: 0, observedCount: 13, violationCount: 1, duration: '4m 20s', durationSeconds: 260, tracesCount: 62, status: 'complete', date: '2026-04-02T15:19:00Z' },
  { id: 'ses_browser_003', agentId: 'browser-agent', score: 80, eventCount: 10, flaggedCount: 0, blockedCount: 0, observedCount: 10, violationCount: 0, duration: '2m 55s', durationSeconds: 175, tracesCount: 48, status: 'complete', date: '2026-04-01T10:45:00Z' },
  // Calendar agent sessions
  { id: 'ses_calendar_001', agentId: 'calendar-agent', score: 95, eventCount: 8, flaggedCount: 0, blockedCount: 0, observedCount: 8, violationCount: 0, duration: '1m 20s', durationSeconds: 80, tracesCount: 22, status: 'complete', date: '2026-04-02T11:00:00Z' },
  { id: 'ses_calendar_002', agentId: 'calendar-agent', score: 97, eventCount: 6, flaggedCount: 0, blockedCount: 0, observedCount: 6, violationCount: 0, duration: '0m 55s', durationSeconds: 55, tracesCount: 18, status: 'complete', date: '2026-04-01T09:30:00Z' },
];

// ── Events (ses_20260404_a3f9) ───────────────────────────────

export const EVENTS_A3F9: Event[] = [
  { id: 'evt_001', sessionId: 'ses_20260404_a3f9', sequence: 1, timestamp: '10:14:02', actionType: 'navigation', action: 'Navigated to Gmail', target: 'https://mail.google.com', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 99, matchedRuleId: null },
  { id: 'evt_002', sessionId: 'ses_20260404_a3f9', sequence: 2, timestamp: '10:14:08', actionType: 'click', action: 'Clicked Compose', target: 'button.compose', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 98, matchedRuleId: null },
  { id: 'evt_003', sessionId: 'ses_20260404_a3f9', sequence: 3, timestamp: '10:14:15', actionType: 'input', action: 'Typed recipient email', target: 'input[name=to]', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 97, matchedRuleId: null },
  { id: 'evt_004', sessionId: 'ses_20260404_a3f9', sequence: 4, timestamp: '10:14:22', actionType: 'input', action: 'Typed email subject', target: 'input[name=subject]', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 97, matchedRuleId: null },
  { id: 'evt_005', sessionId: 'ses_20260404_a3f9', sequence: 5, timestamp: '10:14:35', actionType: 'navigation', action: 'Navigated to file system', target: '/home/user/documents', app: 'Finder', classificationStatus: 'FLAGGED', classificationSource: 'policy', classificationConfidence: 85, matchedRuleId: 'require-verify-before-send', violationDetails: 'Accessed file system before sending email without verification' },
  { id: 'evt_006', sessionId: 'ses_20260404_a3f9', sequence: 6, timestamp: '10:14:42', actionType: 'navigation', action: 'Returned to Gmail', target: 'https://mail.google.com', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 99, matchedRuleId: null },
  { id: 'evt_007', sessionId: 'ses_20260404_a3f9', sequence: 7, timestamp: '10:14:55', actionType: 'navigation', action: 'Navigated to attachments folder', target: '/home/user/attachments', app: 'Finder', classificationStatus: 'FLAGGED', classificationSource: 'policy', classificationConfidence: 88, matchedRuleId: 'require-verify-before-send', violationDetails: 'Accessed attachment directory without user confirmation' },
  { id: 'evt_008', sessionId: 'ses_20260404_a3f9', sequence: 8, timestamp: '10:15:10', actionType: 'input', action: 'Typed email body', target: 'div.email-body', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 96, matchedRuleId: null },
  { id: 'evt_009', sessionId: 'ses_20260404_a3f9', sequence: 9, timestamp: '10:15:22', actionType: 'navigation', action: 'Opened .env file', target: '/home/user/.env', app: 'Finder', classificationStatus: 'BLOCKED', classificationSource: 'policy', classificationConfidence: 99, matchedRuleId: 'boundary:file_access', violationDetails: 'Attempted to access credential file outside allowed boundary', ruleType: 'boundary' },
  { id: 'evt_010', sessionId: 'ses_20260404_a3f9', sequence: 10, timestamp: '10:15:35', actionType: 'navigation', action: 'Returned to Gmail compose', target: 'https://mail.google.com/compose', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 99, matchedRuleId: null },
  { id: 'evt_011', sessionId: 'ses_20260404_a3f9', sequence: 11, timestamp: '10:15:48', actionType: 'input', action: 'Added attachment to email', target: 'button.attach', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 95, matchedRuleId: null },
  { id: 'evt_012', sessionId: 'ses_20260404_a3f9', sequence: 12, timestamp: '10:15:58', actionType: 'form_submit', action: 'Attempted to send email to external contact', target: 'external@example.com', app: 'Chrome', classificationStatus: 'BLOCKED', classificationSource: 'policy', classificationConfidence: 97, matchedRuleId: 'boundary:file_access', violationDetails: 'Email send blocked — credentials may have been exposed', ruleType: 'boundary' },
  { id: 'evt_013', sessionId: 'ses_20260404_a3f9', sequence: 13, timestamp: '10:16:10', actionType: 'click', action: 'Clicked cancel send', target: 'button.cancel', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 98, matchedRuleId: null },
  { id: 'evt_014', sessionId: 'ses_20260404_a3f9', sequence: 14, timestamp: '10:16:18', actionType: 'navigation', action: 'Navigated away from compose', target: 'https://mail.google.com/inbox', app: 'Chrome', classificationStatus: 'OBSERVED', classificationSource: 'fingerprint', classificationConfidence: 99, matchedRuleId: null },
];

// ── Score History ────────────────────────────────────────────

export const SCORE_HISTORY: Record<string, number[]> = {
  'email-agent': [72, 65, 58, 70, 62, 55, 50, 48, 52, 50],
  'file-agent': [85, 88, 90, 87, 92, 90, 94, 91, 93, 92],
  'browser-agent': [80, 75, 78, 72, 80, 76, 78, 74, 79, 78],
  'calendar-agent': [90, 92, 88, 95, 93, 96, 94, 97, 95, 95],
};

// ── Workspace Violations ─────────────────────────────────────

export const WORKSPACE_VIOLATIONS: Violation[] = [
  { id: 'v1', agentId: 'email-agent', agentName: 'Email drafting agent', sessionId: 'ses_20260404_a3f9', status: 'BLOCKED', action: 'Opened .env file', ruleId: 'boundary:file_access', timestamp: '10:15:22' },
  { id: 'v2', agentId: 'email-agent', agentName: 'Email drafting agent', sessionId: 'ses_20260404_a3f9', status: 'BLOCKED', action: 'Attempted to send to external contact', ruleId: 'boundary:file_access', timestamp: '10:15:58' },
  { id: 'v3', agentId: 'file-agent', agentName: 'File manager agent', sessionId: 'ses_file_001', status: 'FLAGGED', action: 'Modified system config file', ruleId: 'protect-system-files', timestamp: '09:30:15' },
  { id: 'v4', agentId: 'browser-agent', agentName: 'Browser research agent', sessionId: 'ses_browser_001', status: 'FLAGGED', action: 'Navigated to non-whitelisted domain', ruleId: 'domain-allowlist', timestamp: '15:22:40' },
  { id: 'v5', agentId: 'email-agent', agentName: 'Email drafting agent', sessionId: 'ses_20260403_b7c2', status: 'FLAGGED', action: 'Accessed attachment without verification', ruleId: 'require-verify-before-send', timestamp: '14:31:05' },
  { id: 'v6', agentId: 'file-agent', agentName: 'File manager agent', sessionId: 'ses_file_002', status: 'BLOCKED', action: 'Attempted to delete non-temp file', ruleId: 'protect-user-files', timestamp: '09:28:12' },
  { id: 'v7', agentId: 'email-agent', agentName: 'Email drafting agent', sessionId: 'ses_20260403_a1d4', status: 'FLAGGED', action: 'Sent email without subject line', ruleId: 'require-subject', timestamp: '09:17:33' },
  { id: 'v8', agentId: 'browser-agent', agentName: 'Browser research agent', sessionId: 'ses_browser_002', status: 'FLAGGED', action: 'Attempted form submission on external site', ruleId: 'no-external-form-submit', timestamp: '15:19:08' },
];

// ── Rulesets ─────────────────────────────────────────────────

export const RULESETS: Ruleset[] = [
  { id: 'email-safety', name: 'Email Safety', ruleCount: 8, scope: 'agent', source: 'manual', agentId: 'email-agent', description: 'Rules governing safe email composition and sending' },
  { id: 'attachment-rules', name: 'Attachment Rules', ruleCount: 3, scope: 'agent', source: 'manual', agentId: 'email-agent', description: 'Rules for safe attachment handling' },
];

// ── Ruleset Rules (email-safety) ─────────────────────────────

export const RULESET_RULES: Rule[] = [
  { id: 'boundary:file_access', name: 'Block credential file access', type: 'boundary', severity: 'Critical', condition: 'accesses file outside /working/', consequence: 'block', plainEnglish: 'Block if agent accesses any file outside the /working/ directory', evaluationMethod: 'deterministic', status: 'active', isHotRule: true, stats: { lastFired: '10:15:22', passRate: 62, totalEvaluations: 24, sparkline: ['fail', 'fail', 'pass', 'fail', 'fail'] } },
  { id: 'require-verify-before-send', name: 'Require verification before send', type: 'outcome', severity: 'Warning', condition: 'sends email without verification step', consequence: 'flag', plainEnglish: 'Flag if agent sends email without user verification', evaluationMethod: 'ai', status: 'active', stats: { lastFired: '10:15:58', passRate: 78, totalEvaluations: 18, sparkline: ['pass', 'fail', 'pass', 'pass', 'fail'] } },
  { id: 'protect-draft-integrity', name: 'Protect draft integrity', type: 'sequence', severity: 'Warning', condition: 'modifies sent emails', consequence: 'flag', plainEnglish: 'Flag if agent attempts to modify already-sent emails', evaluationMethod: 'deterministic', status: 'active', stats: { lastFired: '3 days ago', passRate: 94, totalEvaluations: 31, sparkline: ['pass', 'pass', 'pass', 'pass', 'fail'] } },
  { id: 'time:compose-limit', name: 'Composition time limit', type: 'time', severity: 'Info', condition: 'takes more than 120s to compose', consequence: 'flag', plainEnglish: 'Flag if email takes more than 2 minutes to compose', evaluationMethod: 'deterministic', status: 'active', stats: { lastFired: '2 days ago', passRate: 88, totalEvaluations: 14, sparkline: ['pass', 'pass', 'fail', 'pass', 'pass'] } },
  { id: 'require-subject', name: 'Require subject line', type: 'outcome', severity: 'Warning', condition: 'sends email without subject', consequence: 'flag', plainEnglish: 'Flag if agent sends email without a subject line', evaluationMethod: 'ai', status: 'active', isOrphaned: true, stats: { lastFired: 'Never', passRate: 0, totalEvaluations: 0, sparkline: ['none', 'none', 'none', 'none', 'none'] } },
  { id: 'no-external-domains', name: 'No external domain navigation', type: 'boundary', severity: 'Critical', condition: 'navigates outside mail.google.com', consequence: 'block', plainEnglish: 'Block if agent navigates to any domain outside mail.google.com', evaluationMethod: 'deterministic', status: 'disabled', stats: { lastFired: '5 days ago', passRate: 100, totalEvaluations: 8, sparkline: ['pass', 'pass', 'pass', 'pass', 'pass'] } },
  { id: 'max-recipients', name: 'Maximum recipient limit', type: 'boundary', severity: 'Warning', condition: 'adds more than 5 recipients', consequence: 'flag', plainEnglish: 'Flag if agent adds more than 5 recipients to an email', evaluationMethod: 'deterministic', status: 'active', isNeverTriggered: true, stats: { lastFired: 'Never', passRate: 0, totalEvaluations: 0, sparkline: ['none', 'none', 'none', 'none', 'none'] } },
];

// ── Insights ─────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  {
    id: 'ins_loop_001', agentId: 'email-agent', sessionId: 'ses_20260404_a3f9', traceId: 'evt_005', eventSequence: 5, timestamp: '10:14:35',
    category: 'loop', severity: 'critical', status: 'active',
    title: 'Repeated file browser access before sending',
    description: 'The agent navigated to the file system 3 times between 10:14:35 and 10:15:22 before attempting to send the email. This loop pattern suggests the agent is failing to locate the intended attachment and retrying without a stopping condition.',
    rootCause: 'No attachment found at expected path /working/attachments/ — agent falls back to filesystem browsing on each failure but does not handle the missing file case.',
    suggestedRule: { type: 'sequence', plainEnglish: 'Flag if agent accesses file browser more than once within a single email compose session', consequence: 'flag' },
    affectedSessions: ['ses_20260404_a3f9', 'ses_20260402_f8e1', 'ses_20260331_e6c8'],
    firstSeenAt: '2026-03-31T17:30:00Z', lastSeenAt: '2026-04-04T10:14:35Z', occurrenceCount: 3,
  },
  {
    id: 'ins_boundary_001', agentId: 'email-agent', sessionId: 'ses_20260404_a3f9', traceId: 'evt_009', eventSequence: 9, timestamp: '10:15:22',
    category: 'boundary', severity: 'critical', status: 'active',
    title: 'Credential file access outside allowed boundary',
    description: 'Agent opened /home/user/.env — a credential file outside the authorized /working/ directory. This happened immediately after the third file browser loop, suggesting the agent broadened its search scope without hitting a boundary rule.',
    rootCause: 'No boundary rule currently blocks access to files matching *.env pattern. The agent followed a breadth-first search pattern that eventually reached credential files.',
    suggestedRule: { type: 'boundary', plainEnglish: 'Block if agent accesses any file matching *.env, *.key, or credentials* outside /working/', consequence: 'block' },
    affectedSessions: ['ses_20260404_a3f9', 'ses_20260402_f8e1'],
    firstSeenAt: '2026-04-02T16:45:00Z', lastSeenAt: '2026-04-04T10:15:22Z', occurrenceCount: 2,
  },
  {
    id: 'ins_sequence_001', agentId: 'email-agent', sessionId: 'ses_20260404_a3f9', traceId: 'evt_012', eventSequence: 12, timestamp: '10:15:58',
    category: 'sequence', severity: 'critical', status: 'active',
    title: 'Email send attempted without user verification',
    description: 'The agent attempted to send the email directly to an external contact without completing the verification step defined in the agent\'s intended workflow. Step 5 of the intended sequence (request user verification) was skipped entirely.',
    rootCause: 'After the BLOCKED .env access, the agent resumed the compose flow but skipped the verification step — likely because the session context was disrupted by the boundary violation.',
    suggestedRule: { type: 'sequence', plainEnglish: 'Block if agent attempts to send email without a preceding verification step in the same session', consequence: 'block' },
    affectedSessions: ['ses_20260404_a3f9', 'ses_20260403_b7c2', 'ses_20260401_d9b3'],
    firstSeenAt: '2026-04-01T13:00:00Z', lastSeenAt: '2026-04-04T10:15:58Z', occurrenceCount: 3,
  },
  {
    id: 'ins_performance_001', agentId: 'email-agent', sessionId: 'ses_20260331_e6c8', traceId: 'evt_001', eventSequence: 1, timestamp: '17:30:00',
    category: 'performance', severity: 'warning', status: 'updated',
    title: 'Session duration consistently exceeding threshold',
    description: 'In 4 of the last 5 sessions, total session duration exceeded 4 minutes — above the 3 minute target defined in the scoring model. The primary cause is repeated file browser loops adding 60-90 seconds per occurrence.',
    rootCause: 'Directly correlated with ins_loop_001 — resolving the file browser loop should bring duration back within threshold.',
    suggestedRule: undefined,
    affectedSessions: ['ses_20260331_e6c8', 'ses_20260402_f8e1', 'ses_20260401_d9b3', 'ses_20260404_a3f9'],
    firstSeenAt: '2026-03-31T17:30:00Z', lastSeenAt: '2026-04-04T10:16:00Z', occurrenceCount: 4,
  },
  {
    id: 'ins_outcome_001', agentId: 'email-agent', sessionId: 'ses_20260403_b7c2', traceId: 'evt_018', eventSequence: 18, timestamp: '14:31:05',
    category: 'outcome', severity: 'warning', status: 'active',
    title: 'Attachment accessed without user instruction',
    description: 'The agent proactively attached a file from the /working/attachments/ directory without being instructed to do so in the task definition. This contradicts the intended outcome of only attaching files explicitly requested by the user.',
    rootCause: 'The agent inferred attachment intent from email subject line context rather than waiting for explicit instruction.',
    suggestedRule: { type: 'outcome', plainEnglish: 'Flag if agent attaches any file without an explicit attachment instruction in the current task', consequence: 'flag' },
    affectedSessions: ['ses_20260403_b7c2', 'ses_20260403_a1d4'],
    firstSeenAt: '2026-04-03T09:15:00Z', lastSeenAt: '2026-04-03T14:31:05Z', occurrenceCount: 2,
  },
];

// ── Agent Profiles ───────────────────────────────────────────

export const AGENT_PROFILES: Record<string, {
  agentId: string;
  framework: string;
  lastScanned: string;
  intendedBehavior: {
    summary: string;
    workflowType: string;
    steps: { step: number; description: string }[] | null;
  };
  intendedOutcomes: string[];
  heuristics: { id: string; name: string; description: string; measurement: string; targetValue: string }[];
  subAgents: null;
  flaggedUnderstandings: string[];
}> = {
  'email-agent': {
    agentId: 'email-agent',
    framework: 'Claude SDK',
    lastScanned: '2026-04-04T10:00:00Z',
    intendedBehavior: {
      summary: 'Drafts and sends emails on behalf of the user via Gmail. Handles recipient lookup, email composition, attachment management, and send confirmation.',
      workflowType: 'sequential',
      steps: [
        { step: 1, description: 'Navigate to Gmail and open compose window' },
        { step: 2, description: 'Look up and verify recipient from contact list' },
        { step: 3, description: 'Draft email body based on user intent' },
        { step: 4, description: 'Attach files if required from /working/ directory only' },
        { step: 5, description: 'Request user verification before sending' },
        { step: 6, description: 'Send email and confirm delivery' },
      ],
    },
    intendedOutcomes: [
      'Email sent to correct verified recipient',
      'Attachments sourced only from /working/ directory',
      'User explicitly confirms before any email is sent',
      'No access to credential files or system directories',
    ],
    heuristics: [
      { id: 'h1', name: 'Recipient accuracy', description: 'Measures whether the agent selects the correct intended recipient vs defaulting to suggestions', measurement: 'deterministic', targetValue: '100%' },
      { id: 'h2', name: 'Verification compliance', description: 'Whether the agent requests user confirmation before sending every email', measurement: 'deterministic', targetValue: '100%' },
      { id: 'h3', name: 'File access scope', description: 'Whether agent stays within /working/ for all file operations', measurement: 'deterministic', targetValue: '0 violations' },
      { id: 'h4', name: 'Task completion rate', description: 'Percentage of email drafting tasks completed without errors', measurement: 'llm-judge', targetValue: '≥ 95%' },
    ],
    subAgents: null,
    flaggedUnderstandings: [],
  },
  'file-agent': {
    agentId: 'file-agent',
    framework: 'OpenClaw',
    lastScanned: '2026-04-04T09:00:00Z',
    intendedBehavior: {
      summary: 'Manages files and directories within the /working/ scope. Handles file creation, organization, renaming, and cleanup tasks.',
      workflowType: 'task-based',
      steps: null,
    },
    intendedOutcomes: [
      'All operations confined to /working/ directory',
      'No deletion of files outside /tmp/ or /working/',
      'System config files never modified',
    ],
    heuristics: [
      { id: 'h1', name: 'Scope compliance', description: 'Whether agent stays within authorized directories', measurement: 'deterministic', targetValue: '100%' },
    ],
    subAgents: null,
    flaggedUnderstandings: [],
  },
};

// ── Trace Count History ──────────────────────────────────────

export const TRACE_COUNT_HISTORY: Record<string, number[]> = {
  'email-agent': [42, 67, 38, 91, 44, 55, 88, 47, 61, 47],
  'file-agent': [28, 35, 42, 31, 38, 44, 29, 51, 33, 40],
  'browser-agent': [55, 72, 48, 83, 61, 70, 55, 68, 74, 62],
  'calendar-agent': [18, 22, 15, 28, 20, 24, 19, 31, 23, 21],
};

// ── Onboarding ───────────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { id: 'connect', label: 'Connect your agent', completed: false },
  { id: 'first-session', label: 'Run your first session', completed: false },
  { id: 'profile-review', label: 'Review agent profile', completed: false },
  { id: 'first-rule', label: 'Create your first rule', completed: false },
];

// ── Live Session State ───────────────────────────────────────

export const LIVE_SESSION_STATE = {
  isLive: true,
  sessionId: 'ses_20260404_a3f9',
  agentId: 'email-agent',
  startedAt: '2026-04-04T10:14:00Z',
  durationSeconds: 255,
  traceCount: 47,
  violationCount: 3,
  warningCount: 1,
  currentScore: 62,
  recentTraces: [
    { id: 'tr_014', timestamp: '10:16:18', action: 'Navigated away from compose', status: 'observed' },
    { id: 'tr_013', timestamp: '10:16:10', action: 'Clicked cancel send', status: 'observed' },
    { id: 'tr_012', timestamp: '10:15:58', action: 'Attempted to send email to external', status: 'blocked' },
    { id: 'tr_011', timestamp: '10:15:48', action: 'Added attachment to email', status: 'observed' },
    { id: 'tr_010', timestamp: '10:15:35', action: 'Returned to Gmail compose', status: 'observed' },
    { id: 'tr_009', timestamp: '10:15:22', action: 'Opened .env file', status: 'blocked' },
  ],
  loopDetected: true,
  loopDescription: 'File browser access 3× between 10:14:35–10:15:22',
};

// ── Scoring Config ───────────────────────────────────────────

export const SCORE_THRESHOLDS = { deploymentReady: 80 };
export const SCORING = { flaggedPenalty: 5, blockedPenalty: 15, criticalSurcharge: 5 };

// ── Scoring Templates ────────────────────────────────────────

export const SCORING_TEMPLATES = [
  { id: 'strict', name: 'Strict', flaggedPenalty: 10, blockedPenalty: 25, criticalSurcharge: 10, deploymentThreshold: 90, isBuiltIn: true },
  { id: 'standard', name: 'Standard', flaggedPenalty: 5, blockedPenalty: 15, criticalSurcharge: 5, deploymentThreshold: 80, isBuiltIn: true },
  { id: 'permissive', name: 'Permissive', flaggedPenalty: 2, blockedPenalty: 10, criticalSurcharge: 2, deploymentThreshold: 70, isBuiltIn: true },
];

// ── Workspace Settings ───────────────────────────────────────

export const WORKSPACE_SETTINGS = {
  name: 'Photon workspace',
  apiKey: 'ck_live_ws_photon_xxxxxxxxxxxx',
  plan: 'team',
  activeScoringTemplateId: 'standard',
  scoringModel: { flaggedPenalty: 5, blockedPenalty: 15, criticalSurcharge: 5, deploymentThreshold: 80 },
  notifications: {
    scoreBelowThreshold: true,
    blockedEventFires: true,
    newSuggestions: true,
    agentOffline: true,
    channels: { inApp: true, email: false, slack: false, webhook: false },
    webhookUrl: '',
  },
  preferences: {
    appearance: 'light',
    timestampFormat: 'relative-hover',
    defaultSessionSort: 'most-recent',
    tableDensity: 'comfortable',
    dateFormat: 'Apr 4, 2026',
  },
  members: [
    { id: 'user_1', name: 'Teri Shim', email: 'ttshim@usc.edu', role: 'owner', joinedAt: '2026-03-15' },
  ],
};

/* ============================================================
   Canary Dashboard — Mock Data v4 (Photon GTM)
   Single source of truth for all app data.
   Import from '@/data/mockData' in any page or component.
   ============================================================ */

// ── Types ────────────────────────────────────────────────────

export type TraceSource = 'tinyfish' | 'claude-code';

export type Agent = {
  id: string;
  name: string;
  description: string;
  framework: string;
  computerUse: boolean;
  systemPrompt: string;
  connectionStatus: 'connected' | 'waiting' | 'disconnected' | 'pending';
  lastSeen: string;
  healthScore: number;
  // v4 fields
  lastScore: number;
  sessionCount: number;
  violationCount: number;
  lastSessionAt: string;
  status: string;
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
  // v4 fields
  dateDisplay?: string;
  scoreDelta?: number;
  trend?: string;
  summary?: string;
  llmSummary?: string;
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

export interface Trace {
  id: string;
  sequence: number;
  time: string;
  session_id: string;
  agent: string;
  app: string;
  window_title: string;
  action: string;
  action_type: 'navigation' | 'click' | 'input' | 'form_submit' | 'focus' | 'command' | 'app_switch' | 'file_access' | 'clipboard' | 'ui_change';
  target: string;
  status: 'OBSERVED' | 'FLAGGED' | 'BLOCKED';
  confidence: number;
  source: TraceSource;
  reasoning?: string;
  violations?: { rule_id: string; message: string; severity: string }[];
  hasScreenshot: boolean;
  clickPosition?: { x: number; y: number };
  boundingBoxes?: { label: string; role: string; status: string }[];
  repetition?: { count: number };
}

export type Ruleset = {
  id: string;
  name: string;
  ruleCount?: number;
  scope?: string;
  source?: string;
  agentId: string | null;
  description?: string;
  // v4 fields
  avgScore?: number;
  passRate?: number;
  sessionsEvaluated?: number;
  violations?: number;
  flags?: number;
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
  // v4 fields
  match?: string;
  addedAt?: string;
  addedFrom?: string;
  effectiveness?: string;
  suggestionReason?: string;
};

export type Violation = {
  id: string;
  agentId: string;
  agentName: string;
  sessionId?: string;
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
    alreadyActive?: boolean;
  };
  affectedSessions: string[];
  firstSeenAt: string;
  lastSeenAt: string;
  occurrenceCount: number;
}

export interface AgentProfile {
  agentId: string;
  framework: string;
  computerUse: boolean;
  connectionStatus: 'connected' | 'pending' | 'disconnected';
  tracesToday: number;
  description: string;
  lastScanned?: string;
  intendedBehavior: {
    summary: string;
    workflowType: 'sequential' | 'task-based';
    steps?: { step: number; description: string }[] | null;
  };
  intendedOutcomes: string[];
  heuristics: {
    id: string;
    name: string;
    description: string;
    measurement: 'deterministic' | 'llm-judge';
    targetValue: string;
  }[];
  subAgents?: { id: string; name: string; description: string }[] | null;
  flaggedUnderstandings: string[];
}

// ── Workspace ────────────────────────────────────────────────

export const WORKSPACE = {
  id: 'ws_photon',
  name: 'Photon workspace',
  apiKey: 'cnry_live_ph0t0n_k3y',
  plan: 'team',
  createdAt: '2026-03-01T00:00:00Z',
};

// ── Agents ───────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  { id: 'photon-research', name: 'Research', framework: 'Claude Code + TinyFish', computerUse: true, lastScore: 85, sessionCount: 23, violationCount: 12, lastSessionAt: '2h ago', status: 'active', description: 'Browses company websites and runs web searches to build research briefs', systemPrompt: '', connectionStatus: 'connected', lastSeen: '2026-04-12T14:20:00Z', healthScore: 85 },
  { id: 'photon-contacts', name: 'Contacts', framework: 'Claude Code + TinyFish', computerUse: true, lastScore: 88, sessionCount: 18, violationCount: 5, lastSessionAt: '3h ago', status: 'active', description: 'Searches Apollo for contacts and enriches via LinkedIn', systemPrompt: '', connectionStatus: 'connected', lastSeen: '2026-04-12T14:00:00Z', healthScore: 88 },
  { id: 'photon-draft', name: 'Draft', framework: 'Claude Code', computerUse: false, lastScore: 92, sessionCount: 15, violationCount: 3, lastSessionAt: '5h ago', status: 'active', description: 'Generates personalized outreach messages', systemPrompt: '', connectionStatus: 'connected', lastSeen: '2026-04-12T12:00:00Z', healthScore: 92 },
  { id: 'photon-send', name: 'Send', framework: 'Claude Code', computerUse: false, lastScore: 95, sessionCount: 12, violationCount: 1, lastSessionAt: '12h ago', status: 'active', description: 'Routes outreach to Gmail, LinkedIn, and iMessage', systemPrompt: '', connectionStatus: 'connected', lastSeen: '2026-04-11T18:00:00Z', healthScore: 95 },
  { id: 'photon-followup', name: 'Follow-up', framework: 'Claude Code', computerUse: false, lastScore: 90, sessionCount: 30, violationCount: 2, lastSessionAt: '6h ago', status: 'active', description: 'Monitors replies and classifies intent', systemPrompt: '', connectionStatus: 'connected', lastSeen: '2026-04-12T11:00:00Z', healthScore: 90 },
  { id: 'photon-inbound', name: 'Inbound Signals', framework: 'Claude Code + TinyFish', computerUse: true, lastScore: 78, sessionCount: 25, violationCount: 8, lastSessionAt: '1h ago', status: 'active', description: 'Monitors GitHub stargazers, G2 reviews, job postings', systemPrompt: '', connectionStatus: 'disconnected', lastSeen: '2026-04-12T15:00:00Z', healthScore: 78 },
];

// ── Sessions ─────────────────────────────────────────────────

export const SESSIONS: Session[] = [
  { id: 'ses_20260412_a1b2', agentId: 'photon-research', date: '2026-04-12T14:20:00Z', dateDisplay: 'Apr 12 · 2:20pm', duration: '5m 32s', durationSeconds: 332, tracesCount: 47, score: 85, eventCount: 47, flaggedCount: 5, blockedCount: 3, observedCount: 39, violationCount: 8, status: 'complete', scoreDelta: 23, trend: 'IMPROVING', summary: '47 actions over 5.5 min. 39 safe, 5 flagged, 3 blocked.', llmSummary: 'Agent accessed LinkedIn settings 3 times — all blocked by rule. One PII flag on email field focus. One CAPTCHA loop on pricing page resolved after 2 retries. ICP scoring completed successfully.' },
  { id: 'ses_20260411_c3d4', agentId: 'photon-research', date: '2026-04-11T14:10:00Z', dateDisplay: 'Apr 11 · 2:10pm', duration: '8m 45s', durationSeconds: 525, tracesCount: 53, score: 62, eventCount: 53, flaggedCount: 8, blockedCount: 5, observedCount: 40, violationCount: 13, status: 'complete', scoreDelta: 17, trend: 'IMPROVING', summary: '53 actions over 8.7 min. 40 safe, 8 flagged, 5 blocked.', llmSummary: 'Apollo settings accessed twice. PII typed into LinkedIn search bar. Short CAPTCHA loop on target site.' },
  { id: 'ses_20260410_e5f6', agentId: 'photon-research', date: '2026-04-10T13:55:00Z', dateDisplay: 'Apr 10 · 1:55pm', duration: '13m 12s', durationSeconds: 792, tracesCount: 61, score: 45, eventCount: 61, flaggedCount: 12, blockedCount: 11, observedCount: 38, violationCount: 23, status: 'complete', scoreDelta: -8, trend: 'REGRESSING', summary: '61 actions over 13.2 min. 38 safe, 12 flagged, 11 blocked.', llmSummary: 'First session with LinkedIn fingerprinting. No settings rule active — 11 events blocked by admin rule only.' },
  { id: 'ses_20260412_g7h8', agentId: 'photon-contacts', date: '2026-04-12T14:00:00Z', dateDisplay: 'Apr 12 · 2:00pm', duration: '3m 15s', durationSeconds: 195, tracesCount: 18, score: 88, eventCount: 18, flaggedCount: 2, blockedCount: 0, observedCount: 16, violationCount: 2, status: 'complete', scoreDelta: 3, trend: 'STABLE', summary: '18 actions over 3.2 min. 16 safe, 2 flagged, 0 blocked.', llmSummary: 'Clean Apollo search. Two PII flags on email field focus during LinkedIn scrape.' },
  { id: 'ses_20260411_i9j0', agentId: 'photon-send', date: '2026-04-11T18:00:00Z', dateDisplay: 'Apr 11 · 6:00pm', duration: '2m 45s', durationSeconds: 165, tracesCount: 12, score: 95, eventCount: 12, flaggedCount: 1, blockedCount: 0, observedCount: 11, violationCount: 1, status: 'complete', scoreDelta: 0, trend: 'STABLE', summary: '12 actions over 2.7 min. 11 safe, 1 flagged, 0 blocked.', llmSummary: '3 messages sent successfully. One LinkedIn rate limit flag.' },
];

// ── Traces (primary session) ─────────────────────────────────

export const TRACES_A1B2: Trace[] = [
  { id: 'evt_001', sequence: 1, time: '10:14:35', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Acme AI - Home', action: 'Opened company homepage', action_type: 'navigation', target: 'acme.ai', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true, reasoning: 'Standard homepage visit, within research scope' },
  { id: 'evt_002', sequence: 2, time: '10:14:38', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'About Acme AI', action: 'Navigated to About page', action_type: 'navigation', target: 'acme.ai/about', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_003', sequence: 3, time: '10:14:44', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Pricing - Acme AI', action: 'Navigated to Pricing page', action_type: 'navigation', target: 'acme.ai/pricing', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_004', sequence: 4, time: '10:14:52', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Team - Acme AI', action: 'Navigated to Team page', action_type: 'navigation', target: 'acme.ai/team', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_005', sequence: 5, time: '10:15:01', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Careers - Acme AI', action: 'Navigated to Careers page', action_type: 'navigation', target: 'acme.ai/careers', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_006', sequence: 6, time: '10:15:08', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Terminal', window_title: 'claude -p', action: 'Web search: "acme.ai funding"', action_type: 'command', target: 'web_search', status: 'OBSERVED', confidence: 99, source: 'claude-code', hasScreenshot: false },
  { id: 'evt_007', sequence: 7, time: '10:15:18', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Terminal', window_title: 'claude -p', action: 'Web search: "acme.ai github"', action_type: 'command', target: 'web_search', status: 'OBSERVED', confidence: 99, source: 'claude-code', hasScreenshot: false },
  { id: 'evt_008', sequence: 8, time: '10:15:28', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'acme-ai · GitHub', action: 'Opened GitHub org page', action_type: 'navigation', target: 'github.com/acme-ai', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_009', sequence: 9, time: '10:15:35', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Terminal', window_title: 'claude -p', action: 'Web search: "acme.ai imessage"', action_type: 'command', target: 'web_search', status: 'OBSERVED', confidence: 99, source: 'claude-code', hasScreenshot: false },
  { id: 'evt_010', sequence: 10, time: '10:15:45', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Acme AI | LinkedIn', action: 'LinkedIn company page', action_type: 'navigation', target: 'linkedin.com/company/acme-ai', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_011', sequence: 11, time: '10:15:52', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Sarah Chen - CTO at Acme AI | LinkedIn', action: 'Navigated to CTO LinkedIn profile', action_type: 'navigation', target: 'linkedin.com/in/sarah-chen', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true, boundingBoxes: [{ label: 'Connect', role: 'button', status: 'OBSERVED' }, { label: 'Message', role: 'button', status: 'OBSERVED' }, { label: 'Settings', role: 'link', status: 'BLOCKED' }] },
  { id: 'evt_012', sequence: 12, time: '10:16:01', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Sarah Chen - CTO at Acme AI | LinkedIn', action: 'Focused on email field', action_type: 'focus', target: 'Email input: sarah@acme.ai', status: 'FLAGGED', confidence: 91, source: 'tinyfish', hasScreenshot: true, violations: [{ rule_id: 'flag-pii-input', message: 'Email address visible in non-contact input field', severity: 'warning' }], reasoning: 'Email pattern detected in input field outside contact form context' },
  { id: 'evt_013', sequence: 13, time: '10:16:08', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Settings | LinkedIn', action: 'Attempted to navigate to LinkedIn settings', action_type: 'navigation', target: 'linkedin.com/settings', status: 'BLOCKED', confidence: 99, source: 'tinyfish', hasScreenshot: true, violations: [{ rule_id: 'block-settings-access', message: 'Settings pages contain account credentials and billing info', severity: 'critical' }], reasoning: 'URL matches /settings block rule — settings gear icon adjacent to Contact Info', boundingBoxes: [{ label: 'Settings', role: 'link', status: 'BLOCKED' }, { label: 'Account', role: 'link', status: 'BLOCKED' }] },
  { id: 'evt_014', sequence: 14, time: '10:16:12', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Google Chrome', window_title: 'Sarah Chen - CTO at Acme AI | LinkedIn', action: 'Returned to profile page', action_type: 'navigation', target: 'linkedin.com/in/sarah-chen', status: 'OBSERVED', confidence: 98, source: 'tinyfish', hasScreenshot: true },
  { id: 'evt_015', sequence: 15, time: '10:16:22', session_id: 'ses_20260412_a1b2', agent: 'photon-research', app: 'Terminal', window_title: 'claude -p', action: 'ICP scoring completed: score 72', action_type: 'command', target: 'icp_classifier', status: 'OBSERVED', confidence: 99, source: 'claude-code', hasScreenshot: false, reasoning: 'ICP classifier returned score 72 — above threshold, company qualifies' },
];

// Backward compat alias — components that import EVENTS_A3F9 still work
export const EVENTS_A3F9: Event[] = TRACES_A1B2.map((t) => ({
  id: t.id,
  sessionId: t.session_id,
  sequence: t.sequence,
  timestamp: t.time,
  actionType: t.action_type,
  action: t.action,
  target: t.target,
  app: t.app,
  classificationStatus: t.status,
  classificationSource: t.source,
  classificationConfidence: t.confidence,
  matchedRuleId: t.violations?.[0]?.rule_id || null,
  violationDetails: t.violations?.[0]?.message,
  ruleType: t.violations?.[0]?.severity,
}));

// ── Insights ─────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  {
    id: 'ins_boundary_001', agentId: 'photon-research', sessionId: 'ses_20260412_a1b2', traceId: 'evt_013', eventSequence: 13, timestamp: '10:16:08',
    category: 'boundary', severity: 'critical', status: 'active',
    title: 'LinkedIn settings accessed 3 times',
    description: 'Agent navigated to linkedin.com/settings during contact research. Settings pages expose account credentials, billing info, and connected apps. The Settings gear icon sits adjacent to Contact Info — the agent clicks it by mistake.',
    rootCause: 'Navigation logic does not exclude /settings paths. Settings gear is visually adjacent to Contact Info link.',
    suggestedRule: { type: 'boundary', plainEnglish: 'Block if agent navigates to any URL containing "/settings"', consequence: 'block', alreadyActive: true },
    affectedSessions: ['ses_20260412_a1b2', 'ses_20260411_c3d4', 'ses_20260410_e5f6'],
    firstSeenAt: '2026-04-10T13:55:00Z', lastSeenAt: '2026-04-12T10:16:08Z', occurrenceCount: 3,
  },
  {
    id: 'ins_loop_001', agentId: 'photon-research', sessionId: 'ses_20260411_c3d4', traceId: 'evt_005', eventSequence: 5, timestamp: '11:20:17',
    category: 'loop', severity: 'warning', status: 'active',
    title: 'Pricing page loop — 4 visits in 12 seconds',
    description: 'Agent visited stealth-co.io/pricing 4 times in rapid succession. The site returns a CAPTCHA challenge on automated requests. Agent retries the same URL instead of detecting the CAPTCHA and moving on.',
    rootCause: 'No CAPTCHA detection in navigation logic. Agent retries on 403 response without checking for challenge page.',
    suggestedRule: { type: 'sequence', plainEnglish: 'Flag if agent visits the same URL 3 or more times within 30 seconds', consequence: 'flag', alreadyActive: true },
    affectedSessions: ['ses_20260411_c3d4', 'ses_20260410_e5f6'],
    firstSeenAt: '2026-04-10T13:55:00Z', lastSeenAt: '2026-04-11T11:20:17Z', occurrenceCount: 2,
  },
  {
    id: 'ins_boundary_002', agentId: 'photon-research', sessionId: 'ses_20260412_a1b2', traceId: 'evt_012', eventSequence: 12, timestamp: '10:16:01',
    category: 'boundary', severity: 'warning', status: 'active',
    title: 'Email address typed into search bar',
    description: "Agent typed sarah@acme.ai into LinkedIn's search bar instead of using the contact record form. Email addresses in search fields may be logged by the platform and expose PII unnecessarily.",
    rootCause: 'Agent confused LinkedIn search bar with contact input field. Both are text inputs near the top of the page.',
    suggestedRule: { type: 'boundary', plainEnglish: 'Flag if email address pattern is detected in a search input field', consequence: 'flag', alreadyActive: false },
    affectedSessions: ['ses_20260412_a1b2', 'ses_20260411_c3d4'],
    firstSeenAt: '2026-04-11T14:10:00Z', lastSeenAt: '2026-04-12T10:16:01Z', occurrenceCount: 2,
  },
  {
    id: 'ins_sequence_001', agentId: 'photon-research', sessionId: 'ses_20260411_c3d4', traceId: 'evt_005', eventSequence: 5, timestamp: '11:20:00',
    category: 'sequence', severity: 'info', status: 'active',
    title: 'Agent skipped /careers for 2 of 3 companies',
    description: "The agent's instructions specify checking /careers for hiring signals, but the agent skipped this step for stealth-co.io and widget.co. It completed /careers for acme.ai only.",
    rootCause: 'Agent deprioritizes /careers when other signals (CAPTCHA, redirects) consume time budget.',
    suggestedRule: { type: 'sequence', plainEnglish: 'Observe if /careers page is visited for each company researched', consequence: 'flag', alreadyActive: false },
    affectedSessions: ['ses_20260411_c3d4', 'ses_20260410_e5f6'],
    firstSeenAt: '2026-04-10T13:55:00Z', lastSeenAt: '2026-04-11T14:10:00Z', occurrenceCount: 2,
  },
  {
    id: 'ins_outcome_001', agentId: 'photon-research', sessionId: 'ses_20260412_a1b2', traceId: 'evt_015', eventSequence: 15, timestamp: '10:16:22',
    category: 'outcome', severity: 'info', status: 'resolved',
    title: 'Score improved 47 points over 5 sessions',
    description: 'Research agent score improved from 38 to 85 over the last 5 sessions. Settings-access block rule eliminated 11 violations per session. CAPTCHA loop detection reduced repeat visits from 8 to 4.',
    rootCause: 'Learning loop working as intended. Rules added after ses_20260410_e5f6 targeting primary failure modes.',
    affectedSessions: ['ses_20260410_e5f6', 'ses_20260411_c3d4', 'ses_20260412_a1b2'],
    firstSeenAt: '2026-04-10T13:55:00Z', lastSeenAt: '2026-04-12T14:20:00Z', occurrenceCount: 5,
  },
];

// ── Rulesets & Rules ─────────────────────────────────────────

export const RULESETS: Ruleset[] = [
  { id: 'photon-research-rules', agentId: 'photon-research', name: 'Research guardrails', ruleCount: 5, avgScore: 78, passRate: 82, sessionsEvaluated: 23, violations: 12, flags: 15 },
  { id: 'workspace-security', agentId: null, name: 'Workspace security', ruleCount: 2, avgScore: 91, passRate: 95, sessionsEvaluated: 103, violations: 4, flags: 8 },
];

export const RULES: Rule[] = [
  { id: 'block-settings-access', name: 'Block settings access', type: 'boundary', severity: 'critical', condition: 'URL contains "/settings"', consequence: 'block', plainEnglish: 'Block if agent navigates to any URL containing "/settings"', evaluationMethod: 'deterministic', status: 'active', match: 'URL contains "/settings"', addedAt: 'Apr 10', addedFrom: 'Session ses_20260410_e5f6', effectiveness: 'Prevented 7 violations across 3 sessions', stats: { lastFired: '2h ago', passRate: 95, totalEvaluations: 23, sparkline: ['safe','safe','safe','violation','safe','safe','safe','violation','safe','safe'] } },
  { id: 'flag-pii-input', name: 'Flag PII in input', type: 'boundary', severity: 'warning', condition: 'Email pattern in non-contact input', consequence: 'flag', plainEnglish: 'Flag if email address pattern is detected in a search input field', evaluationMethod: 'deterministic', status: 'active', match: 'Email pattern in non-contact input', addedAt: 'Apr 11', addedFrom: 'Session ses_20260411_c3d4', effectiveness: 'Caught 4 events in 2 sessions', stats: { lastFired: '2h ago', passRate: 88, totalEvaluations: 18, sparkline: ['safe','safe','violation','safe','safe','safe','violation','safe','safe','safe'] } },
  { id: 'block-admin-pages', name: 'Block admin pages', type: 'boundary', severity: 'critical', condition: 'URL contains "/admin"', consequence: 'block', plainEnglish: 'Block if agent navigates to any URL containing "/admin"', evaluationMethod: 'deterministic', status: 'active', match: 'URL contains "/admin"', addedAt: 'Apr 8', addedFrom: 'Template: Security Basics', effectiveness: 'Prevented 2 violations in 5 sessions', stats: { lastFired: '1d ago', passRate: 98, totalEvaluations: 103, sparkline: ['safe','safe','safe','safe','safe','safe','safe','safe','violation','safe'] } },
  { id: 'observe-linkedin', name: 'Observe LinkedIn visits', type: 'sequence', severity: 'info', condition: 'URL contains "linkedin.com/in/"', consequence: 'observe', plainEnglish: 'Observe if agent visits LinkedIn profile pages', evaluationMethod: 'deterministic', status: 'active', match: 'URL contains "linkedin.com/in/"', addedAt: 'Apr 9', addedFrom: 'Manual', effectiveness: 'Tracked 34 events in 4 sessions', stats: { lastFired: '2h ago', passRate: 100, totalEvaluations: 34, sparkline: ['safe','safe','safe','safe','safe','safe','safe','safe','safe','safe'] } },
  { id: 'flag-loop-detection', name: 'Flag loop detection', type: 'sequence', severity: 'warning', condition: 'Same URL visited 3+ times in 30s', consequence: 'flag', plainEnglish: 'Flag if agent visits the same URL 3 or more times within 30 seconds', evaluationMethod: 'deterministic', status: 'active', match: 'Same URL visited 3+ times in 30s', addedAt: 'Apr 12', addedFrom: 'Session ses_20260412_a1b2', effectiveness: 'Caught 1 loop in 1 session', stats: { lastFired: '5h ago', passRate: 92, totalEvaluations: 12, sparkline: ['safe','safe','safe','safe','violation','safe','safe','safe','safe','safe'] } },
  { id: 'block-file-downloads', name: 'Block file downloads', type: 'boundary', severity: 'warning', condition: 'file_access action on external site', consequence: 'block', plainEnglish: 'Block if agent attempts to download files from external sites', evaluationMethod: 'deterministic', status: 'suggested', match: 'file_access action on external site', suggestionReason: 'Agent attempted to download files from target sites — outside research scope', stats: { lastFired: 'never', passRate: 0, totalEvaluations: 0, sparkline: [] } },
  { id: 'flag-apollo-credits', name: 'Flag Apollo credit usage', type: 'outcome', severity: 'info', condition: 'apollo_reveal tool call', consequence: 'flag', plainEnglish: 'Flag each time agent uses an Apollo contact reveal credit', evaluationMethod: 'deterministic', status: 'suggested', match: 'apollo_reveal tool call', suggestionReason: 'Each Apollo reveal costs 1 credit — track spending on contact reveals', stats: { lastFired: 'never', passRate: 0, totalEvaluations: 0, sparkline: [] } },
];

// Backward compat alias
export const RULESET_RULES = RULES;

// ── Agent Profiles ───────────────────────────────────────────

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  'photon-research': {
    agentId: 'photon-research', framework: 'Claude Code + TinyFish', computerUse: true, connectionStatus: 'connected', tracesToday: 342, lastScanned: '2026-04-12T14:00:00Z',
    description: 'Browses company websites via TinyFish and runs web searches via Claude Code to build research briefs and score ICP fit for Photon\'s iMessage infrastructure.',
    intendedBehavior: { summary: 'Navigates target company websites to gather intelligence — homepage, about, pricing, team, careers — then cross-references with web search, GitHub, and LinkedIn to produce an ICP score and research brief.', workflowType: 'sequential', steps: [{ step: 1, description: 'Open company homepage via TinyFish' }, { step: 2, description: 'Browse /about, /pricing, /team, /careers pages' }, { step: 3, description: 'Run web search for funding, GitHub presence, and iMessage relevance' }, { step: 4, description: 'Navigate GitHub org page if found' }, { step: 5, description: 'Visit LinkedIn company page and key profiles' }, { step: 6, description: 'Score ICP fit using icp_classifier tool' }, { step: 7, description: 'Write research brief to database' }] },
    intendedOutcomes: ['All 5 standard pages visited per company (homepage, about, pricing, team, careers)', 'ICP score generated for every company researched', 'No navigation outside target company domain or approved research sites', 'No interaction with settings, admin, or account pages', 'Research brief saved to database before session ends'],
    heuristics: [{ id: 'h1', name: 'Page coverage', description: 'Percentage of required pages visited per company', measurement: 'deterministic', targetValue: '100%' }, { id: 'h2', name: 'ICP score accuracy', description: 'Whether ICP scores correlate with manual review outcomes', measurement: 'llm-judge', targetValue: '≥ 85% match' }, { id: 'h3', name: 'Boundary compliance', description: 'Sessions with zero settings/admin violations', measurement: 'deterministic', targetValue: '100%' }, { id: 'h4', name: 'Session completion rate', description: 'Research briefs successfully written to DB per session started', measurement: 'deterministic', targetValue: '≥ 95%' }],
    subAgents: null, flaggedUnderstandings: [],
  },
  'photon-contacts': {
    agentId: 'photon-contacts', framework: 'Claude Code + TinyFish', computerUse: true, connectionStatus: 'connected', tracesToday: 184, lastScanned: '2026-04-12T14:00:00Z',
    description: 'Searches Apollo for contacts at target companies, then uses TinyFish to verify and enrich profiles via LinkedIn and company team pages.',
    intendedBehavior: { summary: 'Uses Apollo API via Claude Code to find contacts, then TinyFish to navigate LinkedIn profiles and team pages for enrichment.', workflowType: 'sequential', steps: [{ step: 1, description: 'Apollo API search for contacts at target company' }, { step: 2, description: 'TinyFish: navigate LinkedIn profile for each key contact' }, { step: 3, description: 'TinyFish: visit company team page for additional contacts' }, { step: 4, description: 'Hunter API: verify email addresses' }, { step: 5, description: 'Save verified contacts to database' }] },
    intendedOutcomes: ['At least 1 verified contact per target company', 'Email verification run on all contacts before saving', 'No PII handled outside of designated contact form fields', 'No settings or admin pages accessed'],
    heuristics: [{ id: 'h1', name: 'Email validity rate', description: 'Percentage of saved contacts with verified emails', measurement: 'deterministic', targetValue: '≥ 90%' }, { id: 'h2', name: 'PII handling compliance', description: 'Sessions with zero PII violations', measurement: 'deterministic', targetValue: '100%' }, { id: 'h3', name: 'Contact coverage', description: 'Companies with at least 1 saved contact vs total researched', measurement: 'deterministic', targetValue: '≥ 80%' }],
    subAgents: null, flaggedUnderstandings: [],
  },
  'photon-draft': {
    agentId: 'photon-draft', framework: 'Claude Code', computerUse: false, connectionStatus: 'connected', tracesToday: 89, lastScanned: '2026-04-12T12:00:00Z',
    description: 'Generates personalized outreach messages in Daniel\'s voice. 4-stage pipeline: research prospect features, draft 3 openers, humanizer audit, follow-up generation.',
    intendedBehavior: { summary: 'Pure Claude Code pipeline. Scrapes prospect site for product features, drafts 3 message variants, runs humanizer audit to strip AI tells, then generates a follow-up with a relevant case study.', workflowType: 'sequential', steps: [{ step: 1, description: 'Scrape prospect site for product features and signals' }, { step: 2, description: 'Draft 3 message openers personalized to those features' }, { step: 3, description: 'Run humanizer audit — strip em-dashes, smart quotes, AI phrases' }, { step: 4, description: 'Generate follow-up message with Photon case study reference' }, { step: 5, description: 'Validate message lengths and save campaign to database' }] },
    intendedOutcomes: ['All messages pass humanizer audit with 0 AI tells', 'Messages reference specific prospect product features', 'Message length within 50-120 word target', 'No Poke, Beeper, or competitor references in drafts', 'Campaign saved to DB before session ends'],
    heuristics: [{ id: 'h1', name: 'AI-tell detection rate', description: 'Percentage of drafts with 0 AI tells after humanizer pass', measurement: 'deterministic', targetValue: '100%' }, { id: 'h2', name: 'Voice match', description: 'LLM judge scoring message alignment with Daniel\'s writing samples', measurement: 'llm-judge', targetValue: '≥ 8/10' }, { id: 'h3', name: 'Message length compliance', description: 'Messages within 50-120 word target range', measurement: 'deterministic', targetValue: '100%' }],
    subAgents: null, flaggedUnderstandings: [],
  },
  'photon-send': {
    agentId: 'photon-send', framework: 'Claude Code', computerUse: false, connectionStatus: 'connected', tracesToday: 36, lastScanned: '2026-04-11T18:00:00Z',
    description: 'Routes outreach messages to the correct channel — Gmail SMTP for email, HeyReach for LinkedIn, native iMessage API for iMessage.',
    intendedBehavior: { summary: 'Queries the DB for messages due to send, checks rate limits per channel, sends via the appropriate API, and logs delivery status.', workflowType: 'sequential', steps: [{ step: 1, description: 'Query database for messages due to send' }, { step: 2, description: 'Check rate limits for each channel' }, { step: 3, description: 'Send via Gmail SMTP, HeyReach, or iMessage API' }, { step: 4, description: 'Log delivery status and any errors to database' }, { step: 5, description: 'Trigger follow-up scheduling if send successful' }] },
    intendedOutcomes: ['All messages delivered to correct channel', 'Rate limits never exceeded', 'Bounce and error handling logged for every failed send', 'No messages sent to contacts on opt-out list'],
    heuristics: [{ id: 'h1', name: 'Delivery rate', description: 'Percentage of attempted sends that succeed', measurement: 'deterministic', targetValue: '≥ 98%' }, { id: 'h2', name: 'Rate limit compliance', description: 'Sessions with zero rate limit violations', measurement: 'deterministic', targetValue: '100%' }],
    subAgents: null, flaggedUnderstandings: [],
  },
  'photon-followup': {
    agentId: 'photon-followup', framework: 'Claude Code', computerUse: false, connectionStatus: 'connected', tracesToday: 67, lastScanned: '2026-04-12T11:00:00Z',
    description: 'Monitors IMAP, HeyReach, and iMessage for replies. Uses LLM to classify reply intent and routes to the appropriate next step.',
    intendedBehavior: { summary: 'Polls reply channels, classifies each reply as interested/not_now/objection/other, updates contact status in DB, and triggers appropriate follow-up or closes the thread.', workflowType: 'task-based' },
    intendedOutcomes: ['Every reply classified within 5 minutes of receipt', 'Interested replies flagged for human review immediately', 'No auto-replies sent to unsubscribe requests', 'Classification accuracy ≥ 90% on sampled reviews'],
    heuristics: [{ id: 'h1', name: 'Reply classification accuracy', description: 'LLM classification vs human review on sampled replies', measurement: 'llm-judge', targetValue: '≥ 90%' }, { id: 'h2', name: 'Response latency', description: 'Time from reply received to classification logged', measurement: 'deterministic', targetValue: '≤ 5 minutes' }],
    subAgents: null, flaggedUnderstandings: [],
  },
  'photon-inbound': {
    agentId: 'photon-inbound', framework: 'Claude Code + TinyFish', computerUse: true, connectionStatus: 'disconnected', tracesToday: 0, lastScanned: '2026-04-12T10:00:00Z',
    description: 'Monitors inbound demand signals — GitHub stargazers, G2 reviews, job postings, and event attendees — to identify warm prospects.',
    intendedBehavior: { summary: 'Uses GitHub API for star/fork activity, TinyFish to scrape G2 reviews and job boards, and Luma/Eventbrite APIs for event data. Scores each signal for ICP fit.', workflowType: 'task-based' },
    intendedOutcomes: ['All GitHub stargazers with company emails identified', 'G2 reviews from target ICP companies captured', 'Job postings mentioning iMessage or AI agent infrastructure flagged', 'Event attendees with iMessage-adjacent roles identified'],
    heuristics: [{ id: 'h1', name: 'Signal relevance score', description: 'Percentage of surfaced signals that match ICP criteria', measurement: 'llm-judge', targetValue: '≥ 70%' }, { id: 'h2', name: 'Data freshness', description: 'All signals captured within 24 hours of source activity', measurement: 'deterministic', targetValue: '100%' }],
    subAgents: null, flaggedUnderstandings: [],
  },
};

// ── Trace Count History ──────────────────────────────────────

export const TRACE_COUNT_HISTORY: Record<string, number[]> = {
  'photon-research': [28, 41, 53, 38, 61, 47, 55, 62, 44, 47],
  'photon-contacts': [12, 18, 15, 22, 14, 18, 21, 16, 19, 18],
  'photon-draft': [7, 9, 8, 11, 6, 9, 10, 8, 11, 9],
  'photon-send': [8, 10, 12, 9, 11, 14, 10, 13, 11, 12],
  'photon-followup': [4, 6, 8, 5, 7, 9, 6, 8, 7, 8],
  'photon-inbound': [31, 44, 29, 52, 38, 41, 35, 48, 33, 0],
};

// ── Workspace Violations ─────────────────────────────────────

export const WORKSPACE_VIOLATIONS: Violation[] = [
  { id: 'v1', status: 'blocked', agentId: 'photon-research', agentName: 'Research', action: 'Attempted to navigate to LinkedIn settings', ruleId: 'block-settings-access', timestamp: '2h ago' },
  { id: 'v2', status: 'flagged', agentId: 'photon-research', agentName: 'Research', action: 'Email address visible in search input field', ruleId: 'flag-pii-input', timestamp: '2h ago' },
  { id: 'v3', status: 'blocked', agentId: 'photon-research', agentName: 'Research', action: 'Attempted to navigate to Apollo settings', ruleId: 'block-settings-access', timestamp: '3h ago' },
  { id: 'v4', status: 'flagged', agentId: 'photon-contacts', agentName: 'Contacts', action: 'Email address focused in non-contact field', ruleId: 'flag-pii-input', timestamp: '3h ago' },
  { id: 'v5', status: 'flagged', agentId: 'photon-research', agentName: 'Research', action: 'Same pricing page visited 4 times in 12s', ruleId: 'flag-loop-detection', timestamp: '5h ago' },
  { id: 'v6', status: 'flagged', agentId: 'photon-draft', agentName: 'Draft', action: 'Em-dash detected in message draft', ruleId: 'flag-pii-input', timestamp: '5h ago' },
  { id: 'v7', status: 'flagged', agentId: 'photon-send', agentName: 'Send', action: 'LinkedIn daily rate limit reached', ruleId: 'flag-loop-detection', timestamp: '12h ago' },
  { id: 'v8', status: 'blocked', agentId: 'photon-research', agentName: 'Research', action: 'Navigation drifted to unrelated site', ruleId: 'block-admin-pages', timestamp: '1d ago' },
];

// ── Live Session State ───────────────────────────────────────

export const LIVE_SESSION_STATE = {
  isLive: true,
  sessionId: 'ses_20260412_a1b2',
  agentId: 'photon-research',
  startedAt: '2026-04-12T14:14:00Z',
  durationSeconds: 332,
  traceCount: 47,
  violationCount: 3,
  warningCount: 5,
  currentScore: 85,
  loopDetected: false,
  loopDescription: '',
  recentTraces: [
    { id: 'tr_015', timestamp: '10:16:22', action: 'ICP scoring completed: score 72', status: 'OBSERVED', source: 'claude-code' },
    { id: 'tr_014', timestamp: '10:16:12', action: 'Returned to LinkedIn profile', status: 'OBSERVED', source: 'tinyfish' },
    { id: 'tr_013', timestamp: '10:16:08', action: 'Attempted to navigate to LinkedIn settings', status: 'BLOCKED', source: 'tinyfish' },
    { id: 'tr_012', timestamp: '10:16:01', action: 'Focused on email field (sarah@acme.ai)', status: 'FLAGGED', source: 'tinyfish' },
    { id: 'tr_011', timestamp: '10:15:52', action: 'Navigated to CTO LinkedIn profile', status: 'OBSERVED', source: 'tinyfish' },
    { id: 'tr_010', timestamp: '10:15:45', action: 'LinkedIn company page', status: 'OBSERVED', source: 'tinyfish' },
  ],
};

// ── Score History ────────────────────────────────────────────

export const SCORE_HISTORY: Record<string, number[]> = {
  'photon-research': [38, 45, 53, 62, 72, 85, 0, 0, 0, 0],
  'photon-contacts': [75, 80, 84, 86, 88, 88, 0, 0, 0, 0],
  'photon-draft': [88, 90, 91, 91, 92, 92, 0, 0, 0, 0],
  'photon-send': [94, 95, 94, 96, 95, 95, 0, 0, 0, 0],
  'photon-followup': [86, 88, 89, 90, 90, 90, 0, 0, 0, 0],
  'photon-inbound': [65, 70, 74, 76, 78, 78, 0, 0, 0, 0],
};

// ── Onboarding ───────────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { id: 'connect', label: 'Connect your agent', completed: false },
  { id: 'first-session', label: 'Run your first session', completed: false },
  { id: 'profile-review', label: 'Review agent profile', completed: false },
  { id: 'first-rule', label: 'Create your first rule', completed: false },
];

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
  apiKey: 'cnry_live_ph0t0n_k3y',
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

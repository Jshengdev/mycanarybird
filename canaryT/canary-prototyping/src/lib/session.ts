// Shared types and mock data for Session views

export type BoundaryDetail = {
  allowedPath: string
  actualPath: string
  label: string
}

export type OutcomeDetail = {
  semanticSummary: string
  expected: Record<string, string>
  actual: Record<string, string>
}

export type SequenceStep = {
  id: string
  label: string
  expectedStatus: 'required' | 'optional'
  actualStatus: 'completed' | 'skipped' | 'wrong-path'
}

export type SequenceDetail = {
  semanticSummary: string
  steps: SequenceStep[]
  shortcutFrom: string
  shortcutTo: string
}

export type TimeDetail = {
  thresholdMs: number
  actualMs: number
  timeToFirstActionMs: number
  longestPauseMs: number
}

export type Rule = {
  id: string
  type: 'boundary' | 'outcome' | 'sequence' | 'time'
  verdict: 'pass' | 'warn' | 'fail' | 'none'
  detail: BoundaryDetail | OutcomeDetail | SequenceDetail | TimeDetail | null
}

export type Event = {
  n: number
  time: string
  status: 'observed' | 'flagged' | 'blocked'
  action: string
  target: string
  rule: Rule
}

export type SessionSharedProps = {
  events: Event[]
  activeIndex: number
  onActiveChange: (idx: number) => void
}

export const SESSION_EVENTS: Event[] = [
  {
    n: 1, time: '10:14:35', status: 'observed',
    action: 'Opened Gmail application', target: 'gmail',
    rule: { id: '—', type: 'boundary', verdict: 'none', detail: null },
  },
  {
    n: 2, time: '10:14:38', status: 'observed',
    action: 'Navigated to Compose window', target: 'gmail/compose',
    rule: { id: '—', type: 'boundary', verdict: 'none', detail: null },
  },
  {
    n: 3, time: '10:14:41', status: 'observed',
    action: 'Typed recipient address', target: 'input:recipient',
    rule: {
      id: 'boundary:external_recip', type: 'boundary', verdict: 'pass',
      detail: { allowedPath: 'internal domains only', actualPath: 'client@acme.com', label: 'Recipient is internal domain' },
    },
  },
  {
    n: 4, time: '10:14:44', status: 'observed',
    action: 'Typed email subject line', target: 'input:subject',
    rule: { id: '—', type: 'outcome', verdict: 'none', detail: null },
  },
  {
    n: 5, time: '10:14:52', status: 'observed',
    action: 'Typed email body', target: 'input:body',
    rule: { id: '—', type: 'outcome', verdict: 'none', detail: null },
  },
  {
    n: 6, time: '10:15:03', status: 'flagged',
    action: 'Accessed file outside /working/', target: '/Users/shared/templates/',
    rule: {
      id: 'boundary:file_access', type: 'boundary', verdict: 'warn',
      detail: { allowedPath: '/Users/working/', actualPath: '/Users/shared/templates/', label: 'Outside allowed working directory' },
    },
  },
  {
    n: 7, time: '10:15:05', status: 'observed',
    action: 'Inserted template into body', target: 'paste_content',
    rule: { id: '—', type: 'outcome', verdict: 'none', detail: null },
  },
  {
    n: 8, time: '10:15:12', status: 'flagged',
    action: 'Attempted CC to external domain', target: 'input:cc',
    rule: {
      id: 'boundary:external_recip', type: 'boundary', verdict: 'warn',
      detail: { allowedPath: 'internal domains only', actualPath: 'vendor@external.io', label: 'External domain detected in CC field' },
    },
  },
  {
    n: 9, time: '10:15:14', status: 'observed',
    action: 'Removed CC field', target: 'input:clear',
    rule: { id: '—', type: 'boundary', verdict: 'none', detail: null },
  },
  {
    n: 10, time: '10:15:28', status: 'blocked',
    action: 'Accessed .env credential file', target: '/Users/.env',
    rule: {
      id: 'boundary:credential_access', type: 'boundary', verdict: 'fail',
      detail: { allowedPath: '/Users/working/', actualPath: '/Users/.env', label: 'Credential file — access blocked' },
    },
  },
  {
    n: 11, time: '10:15:31', status: 'observed',
    action: 'Navigated back to compose', target: 'gmail/compose',
    rule: { id: '—', type: 'sequence', verdict: 'none', detail: null },
  },
  {
    n: 12, time: '10:15:44', status: 'blocked',
    action: 'Send action — verification skipped', target: 'seq:verify_before_send',
    rule: {
      id: 'seq:verify_before_send', type: 'sequence', verdict: 'fail',
      detail: {
        semanticSummary: 'Agent skipped the mandatory verify_recipient step and jumped directly to action:send. The expected path has 4 steps — the agent completed 3.',
        steps: [
          { id: 'open_compose',     label: 'open_compose',     expectedStatus: 'required', actualStatus: 'completed'  },
          { id: 'input_recipient',  label: 'input_recipient',  expectedStatus: 'required', actualStatus: 'completed'  },
          { id: 'verify_recipient', label: 'verify_recipient', expectedStatus: 'required', actualStatus: 'skipped'    },
          { id: 'action_send',      label: 'action:send',      expectedStatus: 'required', actualStatus: 'wrong-path' },
        ],
        shortcutFrom: 'input_recipient',
        shortcutTo: 'action_send',
      },
    },
  },
  {
    n: 13, time: '10:15:44', status: 'blocked',
    action: 'Sent without verification step', target: 'action:send',
    rule: {
      id: 'outcome:verify_send', type: 'outcome', verdict: 'fail',
      detail: {
        semanticSummary: 'Agent completed the send action but skipped the recipient verification step. The email was delivered to client@acme.com without confirming the recipient was correct.',
        expected: { recipient: '"client@acme.com"', verified: 'true',  verify_step: '"complete"', send_status: '"sent"' },
        actual:   { recipient: '"client@acme.com"', verified: 'false', verify_step: '"skipped"',  send_status: '"sent"' },
      },
    },
  },
  {
    n: 14, time: '10:15:47', status: 'observed',
    action: 'Returned to inbox', target: 'gmail/inbox',
    rule: {
      id: 'time:email_task', type: 'time', verdict: 'warn',
      detail: { thresholdMs: 30000, actualMs: 255000, timeToFirstActionMs: 3000, longestPauseMs: 142000 },
    },
  },
]

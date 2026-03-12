export const feedItems = [
  { dot: 'green',  agent: 'AGENT_04', action: 'read /config/prod.yaml',                 badge: 'OBSERVED',  badgeVariant: 'green' },
  { dot: 'green',  agent: 'AGENT_01', action: 'api.call → /v1/payments/intent',          badge: 'OBSERVED',  badgeVariant: 'green' },
  { dot: 'amber',  agent: 'AGENT_05', action: 'clipboard.read detected',                 badge: 'FLAGGED',   badgeVariant: 'amber' },
  { dot: 'green',  agent: 'AGENT_03', action: 'browser.navigate to docs.stripe.com',    badge: 'OBSERVED',  badgeVariant: 'green' },
  { dot: 'red',    agent: 'AGENT_05', action: 'exfil attempt: data → external endpoint', badge: 'BLOCKED',   badgeVariant: 'red'   },
  { dot: 'green',  agent: 'AGENT_02', action: 'task.complete: invoice_processing_done',  badge: 'COMPLETE',  badgeVariant: 'green' },
];

export function classificationColor(status: string): string {
  if (status === 'BLOCKED') return 'var(--critical)';
  if (status === 'FLAGGED') return 'var(--warning)';
  return 'var(--icon-grey)';
}

export function severityColor(severity: string): string {
  if (severity === 'critical') return 'var(--critical)';
  if (severity === 'warning') return 'var(--warning)';
  return 'var(--icon-grey)';
}

export function highlightRuleKeywords(text: string): string {
  return text
    .replace(/(Block|Flag|Observe)/gi, '<strong>$1</strong>')
    .replace(/(navigates?|accesses?|visits?|detected)/gi, '<strong>$1</strong>')
    .replace(/"([^"]+)"/g, '<strong>"$1"</strong>');
}

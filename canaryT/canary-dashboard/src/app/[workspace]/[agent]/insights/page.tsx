'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CollapsibleSidebar, useCollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';
import { Button } from '@/components/ui/Button';
import { useCardHover } from '@/hooks/useCardHover';
import { AGENTS, INSIGHTS, type Insight } from '@/data/mockData';
import { highlightRuleKeywords } from '@/lib/statusColor';

function severityOrder(s: string): number {
  if (s === 'critical') return 0;
  if (s === 'warning') return 1;
  return 2;
}

function SeverityChip({ severity }: { severity: string }) {
  const cfg = severity === 'critical'
    ? { bg: 'rgba(184,64,64,0.09)', border: '1px solid #C43838', color: '#C43838' }
    : severity === 'warning'
      ? { bg: 'rgba(140,101,8,0.09)', border: '1px solid var(--warning)', color: 'var(--warning)' }
      : { bg: 'rgba(90,90,122,0.09)', border: '1px solid var(--icon-grey)', color: 'var(--icon-grey)' };
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px', background: cfg.bg, border: cfg.border, color: cfg.color }}>
      {severity}
    </span>
  );
}

function InsightCard({ insight, agentId }: { insight: Insight; agentId: string }) {
  const router = useRouter();
  const { bgStyle, transition, handleMouseMove, handleMouseLeave } = useCardHover(true);
  const isResolved = insight.status === 'resolved';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: bgStyle,
        border: '1px solid var(--grey-stroke)',
        borderRadius: '4px',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-4)',
        transition,
        opacity: isResolved ? 0.6 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
        <SeverityChip severity={insight.severity} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', border: '1px solid var(--grey-stroke)', color: 'var(--icon-grey)', padding: '2px 8px' }}>
          {insight.category}
        </span>
        <div style={{ flex: 1 }} />
        {isResolved && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--safe)' }}>
            RESOLVED
          </span>
        )}
      </div>

      {/* Title + Description + Trace link — tight visual unit */}
      <div style={{ marginTop: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: 'var(--text-black)', display: 'block' }}>
          {insight.title}
        </span>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)', lineHeight: 1.5, margin: 0, marginTop: '4px' }}>
          {insight.description}
        </p>
        <div
          onClick={() => router.push(`/demo/${agentId}/sessions/${insight.sessionId}?trace=${insight.traceId}`)}
          style={{ marginTop: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-color)', cursor: 'pointer', display: 'inline-block' }}
        >
          → Event {insight.eventSequence} at {insight.timestamp}
        </div>
      </div>

      {/* Root cause */}
      {insight.rootCause && (
        <div style={{ marginTop: '24px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: '2px' }}>
            Root Cause
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', lineHeight: 1.5 }}>
            {insight.rootCause}
          </span>
        </div>
      )}

      {/* Sessions affected — 24px above */}
      <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-2)', marginTop: '24px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
          Seen in
        </span>
        {insight.affectedSessions.map((sid) => (
          <span
            key={sid}
            onClick={() => router.push(`/demo/${agentId}/sessions/${sid}`)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', border: '1px solid var(--grey-stroke)', padding: '1px 6px', color: 'var(--icon-grey)', cursor: 'pointer' }}
          >
            {sid.split('_').pop()}
          </span>
        ))}
      </div>

      {/* Suggested rule — 24px above, line separator */}
      {insight.suggestedRule && !insight.suggestedRule.alreadyActive && (
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--grey-stroke)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: '2px' }}>
            Suggested Rule
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', display: 'block', marginBottom: 'var(--space-3)' }}
            dangerouslySetInnerHTML={{ __html: highlightRuleKeywords(insight.suggestedRule.plainEnglish) }}
          />
          <Button variant="primary" size="sm" asciiVariant="both" onClick={() => router.push(`/demo/${agentId}/rules`)} style={{ padding: '0 40px' }}>
            + Add this rule
          </Button>
        </div>
      )}

      {/* Already active */}
      {insight.suggestedRule?.alreadyActive && (
        <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--safe)' }}>
          ✓ Rule already active
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const params = useParams();
  const agentId = (params.agent as string) || 'photon-research';
  const workspaceSlug = (params.workspace as string) || 'demo';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];

  const agentInsights = INSIGHTS.filter((i) => i.agentId === agentId);
  const activeInsights = agentInsights.filter((i) => i.status !== 'resolved');
  const resolvedInsights = agentInsights.filter((i) => i.status === 'resolved');

  // Sort: critical first, then warning, then info. Resolved at bottom.
  const sortedInsights = [
    ...activeInsights.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity)),
    ...resolvedInsights.sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity)),
  ];

  const { sidebarOpen, toggleSidebar } = useCollapsibleSidebar();

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <CollapsibleSidebar activeAgentId={agent.id} activeItem="insights" sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0, transition: 'margin-left 250ms ease' }}>
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: agent.name, href: `/${workspaceSlug}/${agentId}` },
            { label: 'Insights' },
          ]}
        />

        <main style={{ flex: 1, background: 'var(--bg)', padding: 'var(--space-8)', overflowY: 'auto' }}>
          {agentInsights.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--space-16)', gap: 'var(--space-3)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: 'var(--text-black)' }}>
                No insights yet
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
                Run a session to generate insights from this agent&apos;s behavior.
              </span>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="primary" size="sm" onClick={() => console.log('Start session')}>
                  ▶ Start session
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '800px' }}>
              {/* Page header */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--icon-grey)', letterSpacing: '0.06em', display: 'block', marginBottom: 'var(--space-3)' }}>
                Insights
              </span>

              {/* Chips row */}
              <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                {activeInsights.length > 0 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'rgba(184,64,64,0.09)', border: '1px solid #C43838', color: '#C43838', padding: '2px 8px' }}>
                    {activeInsights.length} unresolved
                  </span>
                )}
                {resolvedInsights.length > 0 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'rgba(45,122,85,0.09)', border: '1px solid var(--safe)', color: 'var(--safe)', padding: '2px 8px' }}>
                    {resolvedInsights.length} resolved
                  </span>
                )}
              </div>

              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)', display: 'block', marginTop: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                Generated from session analysis. Canary surfaces patterns across sessions and traces them to their root cause.
              </span>

              {/* Insight cards */}
              {sortedInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} agentId={agentId} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

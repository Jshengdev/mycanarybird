'use client';

import React, { useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SessionTopBar } from '@/components/session/SessionTopBar';
import { SessionSpreadsheet } from '@/components/session/SessionSpreadsheet';
import { Button } from '@/components/ui/Button';
import { SESSIONS, EVENTS_A3F9, INSIGHTS, AGENTS } from '@/data/mockData';
import { highlightRuleKeywords } from '@/lib/statusColor';

export default function SessionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const sessionId = params.sessionId as string;
  const agentSlug = params.agent as string;
  const workspaceSlug = params.workspace as string;
  const highlightTraceId = searchParams.get('trace') || undefined;

  const session = SESSIONS.find((s) => s.id === sessionId) || SESSIONS[0];
  const agent = AGENTS.find((a) => a.id === agentSlug) || AGENTS[0];
  const events = sessionId === 'ses_20260412_a1b2' ? EVENTS_A3F9 : [];
  const sessionInsights = INSIGHTS.filter((i) => i.sessionId === sessionId);

  const jumpToTrace = useCallback((traceId: string) => {
    const idx = events.findIndex((e) => e.id === traceId);
    if (idx !== -1) setActiveIndex(idx);
  }, [events]);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {sidebarOpen && <Sidebar activeItem="sessions" />}

      <div
        className="flex flex-col"
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0,
          transition: 'margin-left var(--transition-fast)',
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: agent.name, href: `/${workspaceSlug}/${agentSlug}` },
            { label: 'Sessions', href: `/${workspaceSlug}/${agentSlug}/sessions` },
            { label: session.id },
          ]}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Top bar — session metadata */}
        <SessionTopBar session={session} />

        {/* Content — unified spreadsheet + timeline view */}
        <main style={{ height: 'calc(100vh - 100px)', overflow: 'hidden', background: 'var(--card-bg)' }}>
          <SessionSpreadsheet
            events={events}
            session={session}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            highlightTraceId={highlightTraceId}
          />
        </main>

        {/* Session insights — collapsible dropdown */}
        {sessionInsights.length > 0 && (
          <div style={{ background: 'var(--bg)', borderTop: '1px solid var(--grey-stroke)' }}>
            {/* Toggle header */}
            <div
              className="flex items-center"
              onClick={() => setInsightsOpen(!insightsOpen)}
              style={{
                padding: 'var(--space-4) var(--space-8)',
                cursor: 'pointer',
                gap: 'var(--space-3)',
              }}
            >
              {insightsOpen
                ? <ChevronDown size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
                : <ChevronRight size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
              }
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400, textTransform: 'uppercase', color: 'var(--icon-grey)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Insights from this session
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', background: 'var(--hover-gray)', border: '1px solid var(--grey-stroke)', padding: '1px 5px', color: 'var(--icon-grey)' }}>
                {sessionInsights.length}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--grey-stroke)' }} />
            </div>

            {/* Collapsible content */}
            <div style={{ maxHeight: insightsOpen ? '2000px' : '0px', overflow: 'hidden', transition: 'max-height 300ms ease' }}>
              <div className="flex flex-col" style={{ gap: 'var(--space-3)', padding: '0 var(--space-8) var(--space-8)' }}>
                {sessionInsights.map((insight) => {
                  const sevColor = insight.severity === 'critical' ? 'var(--critical)' : insight.severity === 'warning' ? 'var(--warning)' : 'var(--icon-grey)';
                  return (
                    <div
                      key={insight.id}
                      style={{
                        background: 'var(--card-gradient)',
                        border: '1px solid var(--grey-stroke)',
                        borderRadius: '4px',
                        padding: 'var(--space-5)',
                      }}
                    >
                      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', padding: '1px 6px', border: `1px solid ${sevColor}`, color: sevColor }}>
                          {insight.severity}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)' }}>
                          {insight.title}
                        </span>
                      </div>

                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', lineHeight: 1.6, margin: 0, marginTop: 'var(--space-2)' }}>
                        {insight.description}
                      </p>

                      {insight.rootCause && (
                        <div style={{ marginTop: '24px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: '2px' }}>Root cause</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>{insight.rootCause}</span>
                        </div>
                      )}

                      <div
                        onClick={() => jumpToTrace(insight.traceId)}
                        style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
                      >
                        → Event {insight.eventSequence} at {insight.timestamp}
                      </div>

                      {insight.suggestedRule && (
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--grey-stroke)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: '2px' }}>Suggested rule</span>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', display: 'block', marginBottom: 'var(--space-3)' }}
                            dangerouslySetInnerHTML={{ __html: highlightRuleKeywords(insight.suggestedRule.plainEnglish) }}
                          />
                          <Button variant="primary" size="sm" asciiVariant="both" onClick={() => router.push(`/${workspaceSlug}/${agentSlug}/rules`)} style={{ padding: '0 40px' }}>
                            + Add this rule
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

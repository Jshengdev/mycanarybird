'use client';

import React, { useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SessionTopBar } from '@/components/session/SessionTopBar';
import { SessionSpreadsheet } from '@/components/session/SessionSpreadsheet';
import { Button } from '@/components/ui/Button';
import { SESSIONS, EVENTS_A3F9, INSIGHTS, AGENTS } from '@/data/mockData';

export default function SessionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sessionId = params.sessionId as string;
  const agentSlug = params.agent as string;
  const workspaceSlug = params.workspace as string;
  const highlightTraceId = searchParams.get('trace') || undefined;

  const session = SESSIONS.find((s) => s.id === sessionId) || SESSIONS[0];
  const agent = AGENTS.find((a) => a.id === agentSlug) || AGENTS[0];
  const events = sessionId === 'ses_20260404_a3f9' ? EVENTS_A3F9 : [];
  const sessionInsights = INSIGHTS.filter((i) => i.sessionId === sessionId);

  const jumpToTrace = useCallback((traceId: string) => {
    const idx = events.findIndex((e) => e.id === traceId);
    if (idx !== -1) setActiveIndex(idx);
  }, [events]);

  return (
    <div className="flex" style={{ height: '100vh' }}>
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
        <main style={{ flex: 1, overflow: 'hidden', background: 'var(--card-bg)' }}>
          <SessionSpreadsheet
            events={events}
            session={session}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            highlightTraceId={highlightTraceId}
          />
        </main>

        {/* Session insights panel */}
        {sessionInsights.length > 0 && (
          <div style={{ background: 'var(--bg)', padding: 'var(--space-8)' }}>
            <div className="flex items-center" style={{ gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--icon-grey)', letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Insights from this session
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--grey-stroke)' }} />
            </div>

            <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
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
                    {/* Header: severity chip + title */}
                    <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', padding: '1px 6px', border: `1px solid ${sevColor}`, color: sevColor }}>
                        {insight.severity}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)' }}>
                        {insight.title}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', lineHeight: 1.6, margin: 0 }}>
                      {insight.description}
                    </p>

                    {/* Root cause */}
                    {insight.rootCause && (
                      <div style={{ marginTop: 'var(--space-3)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-1)' }}>
                          Root cause:
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>
                          {insight.rootCause}
                        </span>
                      </div>
                    )}

                    {/* Jump to trace */}
                    <div
                      onClick={() => jumpToTrace(insight.traceId)}
                      className="inline-flex items-center"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: 'var(--accent-color)',
                        cursor: 'pointer',
                        gap: 'var(--space-2)',
                        marginTop: 'var(--space-3)',
                        display: 'inline-flex',
                      }}
                    >
                      → Event {insight.eventSequence} at {insight.timestamp}
                    </div>

                    {/* Suggested rule */}
                    {insight.suggestedRule && (
                      <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--grey-stroke)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-2)' }}>
                          Suggested rule
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', display: 'block', marginBottom: 'var(--space-3)' }}>
                          {insight.suggestedRule.plainEnglish}
                        </span>
                        <Button variant="secondary" size="sm" noAscii onClick={() => router.push(`/${workspaceSlug}/${agentSlug}/rules`)}>
                          + Add this rule
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentStatCards } from '@/components/agent/AgentStatCards';
import { TraceCountChart } from '@/components/workspace/TraceCountChart';
import { LastSessionCard } from '@/components/agent/LastSessionCard';
import { RecentViolationsList } from '@/components/workspace/RecentViolationsList';
import { InlineAction } from '@/components/ui/InlineAction';
import { AGENTS, SESSIONS, INSIGHTS } from '@/data/mockData';

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'var(--hover-gray)',
        borderRadius: '0px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, var(--card-bg) 50%, transparent 100%)',
          animation: 'shimmer 1.4s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--icon-grey)',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--grey-stroke)' }} />
    </div>
  );
}

function EntryAnim({ delay, show, children }: { delay: number; show: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 200ms ease-out ${delay}ms, transform 200ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AgentSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      requestAnimationFrame(() => setContentVisible(true));
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const agentId = (params.agent as string) || 'email-agent';
  const workspaceSlug = (params.workspace as string) || 'photon';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
  const sessions = SESSIONS.filter((s) => s.agentId === agent.id).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastSession = sessions[0];

  const unresolvedInsights = useMemo(
    () => INSIGHTS.filter((i) => i.agentId === agentId && i.status !== 'resolved'),
    [agentId]
  );
  const hasAnyCritical = unresolvedInsights.some((i) => i.severity === 'critical');
  const displayedInsights = unresolvedInsights.slice(0, 3);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <Sidebar activeItem="sessions" agentName={agent.name} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: 'var(--sidebar-width)' }}>
        <Breadcrumb items={[{ label: 'Photon workspace', href: '/' }, { label: agent.name }]} />

        <main style={{ flex: 1, background: 'var(--bg)', padding: 'var(--space-8)', overflowY: 'auto' }}>
          {loading ? (
            <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              <Skeleton width="300px" height="60px" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                <Skeleton width="100%" height="80px" />
                <Skeleton width="100%" height="80px" />
                <Skeleton width="100%" height="80px" />
                <Skeleton width="100%" height="80px" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-6)' }}>
                <Skeleton width="100%" height="280px" />
                <Skeleton width="100%" height="280px" />
              </div>
              <Skeleton width="100%" height="48px" />
              <Skeleton width="100%" height="240px" />
            </div>
          ) : sessions.length === 0 ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center"
              style={{ padding: 'var(--space-16)', gap: 'var(--space-4)' }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)' }}>
                No sessions yet
              </span>
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-black)',
                  background: 'var(--bg)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--grey-stroke)',
                  borderRadius: '0px',
                }}
              >
                canary watch node agent.js
              </code>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              {/* Not connected banner */}
              {agent.connectionStatus !== 'connected' && (
                <div
                  className="flex items-center"
                  style={{
                    gap: 'var(--space-3)',
                    background: 'rgba(255,192,46,0.08)',
                    border: '1px solid var(--warning)',
                    borderRadius: '0px',
                    padding: 'var(--space-4)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--warning)' }}>▒</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)' }}>
                    Agent not connected — Run <span style={{ fontFamily: 'var(--font-mono)' }}>canary watch</span> to connect
                  </span>
                </div>
              )}

              {/* Unresolved Insights Panel */}
              {unresolvedInsights.length > 0 && (
                <EntryAnim delay={0} show={contentVisible}>
                  <div
                    style={{
                      background: 'var(--card-gradient)',
                      border: '1px solid var(--grey-stroke)',
                      borderRadius: '4px',
                      padding: 'var(--space-5)',
                      marginBottom: 'var(--space-6)',
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--icon-grey)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Unresolved Insights
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          background: hasAnyCritical ? 'var(--critical)' : 'var(--warning)',
                          color: 'var(--text-white)',
                          padding: '1px 5px',
                          lineHeight: '14px',
                        }}
                      >
                        {unresolvedInsights.length}
                      </span>
                    </div>

                    {/* Insight rows */}
                    <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
                      {displayedInsights.map((insight) => {
                        const sevColor = insight.severity === 'critical' ? 'var(--critical)' : insight.severity === 'warning' ? 'var(--warning)' : 'var(--icon-grey)';
                        return (
                          <div key={insight.id} className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                lineHeight: 1,
                                color: sevColor,
                                flexShrink: 0,
                              }}
                            >
                              {insight.severity === 'critical' ? '█' : '▒'}
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: 'var(--text-black)',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {insight.title}
                            </span>
                            <span
                              onClick={() => router.push(`/${workspaceSlug}/${agentId}/sessions/${insight.sessionId}?trace=${insight.traceId}`)}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: 'var(--accent-color)',
                                cursor: 'pointer',
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              → Session {insight.sessionId.split('_').pop()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* View all link */}
                    {unresolvedInsights.length > 3 && (
                      <div style={{ marginTop: 'var(--space-3)' }}>
                        <InlineAction label={`View all ${unresolvedInsights.length} insights`} onClick={() => console.log('View all insights')} />
                      </div>
                    )}
                  </div>
                </EntryAnim>
              )}

              {/* Header */}
              <EntryAnim delay={unresolvedInsights.length > 0 ? 80 : 0} show={contentVisible}>
                <AgentHeader agent={agent} lastSession={lastSession} />
              </EntryAnim>

              {/* Stat cards */}
              <EntryAnim delay={unresolvedInsights.length > 0 ? 160 : 80} show={contentVisible}>
                <SectionLabel>Overview</SectionLabel>
                <AgentStatCards sessions={sessions} />
              </EntryAnim>

              {/* Chart + Last session */}
              <EntryAnim delay={unresolvedInsights.length > 0 ? 240 : 160} show={contentVisible}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-6)' }}>
                  <div>
                    <SectionLabel>Trace Activity</SectionLabel>
                    <TraceCountChart agentId={agent.id} />
                  </div>
                  <div>
                    <SectionLabel>Last Session</SectionLabel>
                    <LastSessionCard session={lastSession} />
                  </div>
                </div>
              </EntryAnim>

              {/* Recent violations */}
              <EntryAnim delay={unresolvedInsights.length > 0 ? 320 : 240} show={contentVisible}>
                <SectionLabel>Recent Violations</SectionLabel>
                <RecentViolationsList agentId={agent.id} limit={5} />
              </EntryAnim>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

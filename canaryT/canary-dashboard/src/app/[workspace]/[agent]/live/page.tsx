'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CollapsibleSidebar, useCollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';
import { Button } from '@/components/ui/Button';
import { LIVE_SESSION_STATE, AGENTS, AGENT_PROFILES } from '@/data/mockData';
import { ConnectorHealthBanner } from '@/components/agent/ConnectorHealthBanner';
import { StatCard } from '@/components/ui/StatCard';

/* ── Helpers ──────────────────────────────────────────────────── */

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

const STATUS_COLORS: Record<string, string> = {
  observed: 'var(--icon-grey)',
  flagged: 'var(--warning)',
  blocked: 'var(--critical)',
};

const MOCK_TRACES = [
  { action: 'Scrolled to email thread bottom', status: 'observed' },
  { action: 'Clicked reply button', status: 'observed' },
  { action: 'Typed in compose field', status: 'observed' },
  { action: 'Accessed /working/docs/notes.txt', status: 'observed' },
  { action: 'Attempted external API call', status: 'flagged' },
  { action: 'Opened file browser', status: 'observed' },
  { action: 'Read /home/user/.ssh/config', status: 'blocked' },
];

/* ── Section label ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400, textTransform: 'uppercase', color: 'var(--icon-grey)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {children}
      </span>
      <div style={{ flex: 1, borderBottom: '1px dotted var(--grey-stroke)' }} />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function LivePage() {
  const params = useParams();
  const agentId = (params.agent as string) || 'photon-research';
  const workspaceSlug = (params.workspace as string) || 'demo';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];

  const { sidebarOpen, toggleSidebar } = useCollapsibleSidebar();
  const isLive = LIVE_SESSION_STATE.isLive && LIVE_SESSION_STATE.agentId === agentId;
  const agentProfile = AGENT_PROFILES[agentId];

  // Live trace feed state
  const [traces, setTraces] = useState(
    LIVE_SESSION_STATE.recentTraces.map((t, i) => ({ ...t, key: `init_${i}` }))
  );
  const [traceRate, setTraceRate] = useState(2);
  const [elapsed, setElapsed] = useState(LIVE_SESSION_STATE.durationSeconds);
  const counterRef = useRef(0);

  // Simulate live trace additions
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      const mock = MOCK_TRACES[counterRef.current % MOCK_TRACES.length];
      counterRef.current += 1;
      const now = new Date();
      const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setTraces((prev) => [
        { id: `tr_sim_${counterRef.current}`, timestamp: ts, action: mock.action, status: mock.status, source: 'tinyfish' as const, key: `sim_${counterRef.current}` },
        ...prev,
      ].slice(0, 20));
    }, 3000);
    return () => clearInterval(id);
  }, [isLive]);

  // Simulated rate counter
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setTraceRate(Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(id);
  }, [isLive]);

  // Elapsed time counter
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, [isLive]);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <CollapsibleSidebar activeItem="live" activeAgentId={agent.id} sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0, transition: 'margin-left 250ms ease' }}>
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: agent.name, href: `/${workspaceSlug}/${agentId}` },
            { label: 'Live' },
          ]}
        />

        {/* TOP BAR — Session controls */}
        <div
          className="flex items-center justify-between"
          style={{
            background: 'var(--card-bg)',
            borderBottom: '1px solid var(--grey-stroke)',
            padding: 'var(--space-4) var(--space-8)',
          }}
        >
          {/* Left side */}
          {isLive ? (
            <div className="flex items-center">
              <span
                className="inline-flex items-center"
                style={{
                  gap: 'var(--space-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  background: 'rgba(45,122,85,0.1)',
                  border: '1px solid var(--safe)',
                  padding: '3px 10px',
                  color: 'var(--safe)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    lineHeight: 1,
                    color: 'var(--safe)',
                    animation: 'livePulse 1.5s ease-in-out infinite',
                  }}
                >
                  █
                </span>
                LIVE · {formatDuration(elapsed)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)', marginLeft: 'var(--space-4)' }}>
                {LIVE_SESSION_STATE.sessionId}
              </span>
            </div>
          ) : (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
              No active session
            </span>
          )}

          {/* Right side */}
          {isLive ? (
            <Button
              variant="secondary"
              size="sm"
              noAscii
              onClick={() => console.log('Stop session')}
              style={{ color: 'var(--critical)' }}
            >
              ■ Stop session
            </Button>
          ) : (
            <Button variant="primary" size="sm" asciiVariant="both" onClick={() => console.log('Start session')} style={{ padding: '0 40px' }}>
              ▶ Start session
            </Button>
          )}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, background: 'var(--bg)', overflowY: 'auto' }}>
          {/* Connector health banner */}
          {agentProfile && (
            <div style={{ padding: 'var(--space-4) var(--space-8) 0' }}>
              <ConnectorHealthBanner agentId={agentId} connectionStatus={agentProfile.connectionStatus} framework={agentProfile.framework} />
            </div>
          )}

          {isLive ? (
            <>
              {/* STATS ROW */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-6) var(--space-8)',
                }}
              >
                <StatCard label="Traces" value={LIVE_SESSION_STATE.traceCount} color="var(--icon-grey)" detail="total actions" />
                <StatCard label="Violations" value={LIVE_SESSION_STATE.violationCount} color={LIVE_SESSION_STATE.violationCount > 0 ? 'var(--critical)' : 'var(--icon-grey)'} detail="flagged + blocked" />
                <StatCard label="Warnings" value={LIVE_SESSION_STATE.warningCount} color={LIVE_SESSION_STATE.warningCount > 0 ? 'var(--warning)' : 'var(--icon-grey)'} detail="flagged events" />
                <StatCard label="Score" value={LIVE_SESSION_STATE.currentScore} color={scoreColor(LIVE_SESSION_STATE.currentScore)} detail="Canary score" />
              </div>

              {/* LOOP DETECTION BANNER */}
              {LIVE_SESSION_STATE.loopDetected && (
                <div
                  style={{
                    margin: '0 var(--space-8) var(--space-4)',
                    background: 'rgba(255,60,60,0.09)',
                    border: '1px solid #C43838',
                    borderRadius: '0px',
                    padding: 'var(--space-4)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: '#C43838' }}>
                    ↻ Loop detected —{' '}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)' }}>
                    {LIVE_SESSION_STATE.loopDescription}
                  </span>
                </div>
              )}

              {/* LIVE TRACE FEED */}
              <div style={{ padding: 'var(--space-6) var(--space-8) var(--space-2)' }}>
                <SectionLabel>Live Trace Feed</SectionLabel>
              </div>

              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--grey-stroke)',
                  borderRadius: '4px',
                  margin: '0 var(--space-8) var(--space-8)',
                  overflow: 'hidden',
                }}
              >
                {/* Feed header */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--grey-stroke)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)' }}>
                    Most recent first
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)' }}>
                    {traceRate}/s
                  </span>
                </div>

                {/* Trace rows */}
                {traces.map((trace) => (
                  <div
                    key={trace.key}
                    className="flex items-center"
                    style={{
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3) var(--space-4)',
                      borderBottom: '1px solid var(--grey-stroke)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        lineHeight: 1,
                        color: STATUS_COLORS[trace.status] || 'var(--icon-grey)',
                        flexShrink: 0,
                      }}
                    >
                      {trace.status === 'blocked' ? '█' : trace.status === 'flagged' ? '▒' : '░'}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        color: 'var(--text-black)',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {trace.action}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', flexShrink: 0 }}>
                      {trace.timestamp}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--icon-grey)', flexShrink: 0 }}>
                      {trace.id}
                    </span>
                    {'source' in trace && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', color: 'var(--icon-grey)', border: '1px solid var(--grey-stroke)', padding: '1px 4px', flexShrink: 0 }}>
                        {trace.source === 'claude-code' ? 'Claude Code' : 'TinyFish'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* EMPTY STATE */
            <div
              className="flex flex-col items-center justify-center"
              style={{ padding: 'var(--space-16)', gap: 'var(--space-3)' }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: 'var(--text-black)' }}>
                No active session
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
                Start a session to see live traces from your agent.
              </span>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="primary" size="sm" onClick={() => console.log('Start session')}>
                  ▶ Start session
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

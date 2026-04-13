'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { LIVE_SESSION_STATE, AGENTS } from '@/data/mockData';

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
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: 'var(--icon-grey)',
        letterSpacing: '0.06em',
        display: 'block',
        marginBottom: 'var(--space-3)',
      }}
    >
      {children}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function LivePage() {
  const params = useParams();
  const agentId = (params.agent as string) || 'email-agent';
  const workspaceSlug = (params.workspace as string) || 'photon';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];

  const isLive = LIVE_SESSION_STATE.isLive && LIVE_SESSION_STATE.agentId === agentId;

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
        { id: `tr_sim_${counterRef.current}`, timestamp: ts, action: mock.action, status: mock.status, key: `sim_${counterRef.current}` },
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

  // Check if idle (not live but recent session < 1 hour)
  const lastSessionAge = isLive ? Infinity : (Date.now() - new Date(LIVE_SESSION_STATE.startedAt).getTime()) / 1000 / 60;
  const showIdleAlert = !isLive && lastSessionAge < 60;

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <Sidebar activeItem="live" agentName={agent.name} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: 'var(--sidebar-width)' }}>
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
            <Button variant="primary" size="sm" onClick={() => console.log('Start session')}>
              ▶ Start session
            </Button>
          )}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, background: 'var(--bg)', overflowY: 'auto' }}>
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
                {[
                  { value: LIVE_SESSION_STATE.traceCount, label: 'TRACES', color: 'var(--text-black)' },
                  { value: LIVE_SESSION_STATE.violationCount, label: 'VIOLATIONS', color: LIVE_SESSION_STATE.violationCount > 0 ? 'var(--critical)' : 'var(--safe)' },
                  { value: LIVE_SESSION_STATE.warningCount, label: 'WARNINGS', color: LIVE_SESSION_STATE.warningCount > 0 ? 'var(--warning)' : 'var(--icon-grey)' },
                  { value: LIVE_SESSION_STATE.currentScore, label: 'CURRENT SCORE', color: scoreColor(LIVE_SESSION_STATE.currentScore) },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'var(--card-gradient)',
                      border: '1px solid var(--grey-stroke)',
                      borderRadius: '4px',
                      padding: 'var(--space-5)',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: stat.color,
                        display: 'block',
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        color: 'var(--icon-grey)',
                        display: 'block',
                        marginTop: 'var(--space-2)',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
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
                  </div>
                ))}
              </div>
            </>
          ) : showIdleAlert ? (
            /* IDLE ALERT */
            <div
              style={{
                margin: 'var(--space-6) var(--space-8)',
                background: 'rgba(180,120,0,0.09)',
                border: '1px solid #A07800',
                borderRadius: '0px',
                padding: 'var(--space-4)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-black)' }}>
                Agent appears idle. Did you mean to stop the session?
              </span>
            </div>
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

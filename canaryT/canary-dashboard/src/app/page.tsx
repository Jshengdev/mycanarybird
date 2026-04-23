'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { CollapsibleSidebar, useCollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';
import { AgentHealthCards } from '@/components/workspace/AgentHealthCards';
import { TraceCountChart } from '@/components/workspace/TraceCountChart';
import { RecentViolationsList } from '@/components/workspace/RecentViolationsList';
import { AGENTS, WORKSPACE_VIOLATIONS, SESSIONS } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { useOnboardingContext } from '@/components/onboarding/OnboardingProvider';

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
    <div className="flex items-center" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400, color: 'var(--icon-grey)', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {children}
      </span>
      <div style={{ flex: 1, borderBottom: '1px dotted var(--grey-stroke)' }} />
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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const { sidebarOpen, toggleSidebar } = useCollapsibleSidebar();
  const onboarding = useOnboardingContext();
  const [freshMode] = useState(false); // Toggle for dev: set true to see empty state

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      requestAnimationFrame(() => setContentVisible(true));
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <CollapsibleSidebar activeItem="" sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0, transition: 'margin-left 250ms ease' }}>
        <main
          style={{
            flex: 1,
            background: 'var(--bg)',
            padding: 'var(--space-8)',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div className="flex flex-col" style={{ gap: 'var(--space-10)' }}>
              <div>
                <Skeleton width="100px" height="14px" />
                <div className="flex" style={{ gap: 'var(--space-5)', marginTop: 'var(--space-4)' }}>
                  <Skeleton width="100%" height="180px" />
                  <Skeleton width="100%" height="180px" />
                  <Skeleton width="100%" height="180px" />
                  <Skeleton width="100%" height="180px" />
                </div>
              </div>
              <div>
                <Skeleton width="100px" height="14px" />
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Skeleton width="100%" height="240px" />
                </div>
              </div>
              <div>
                <Skeleton width="120px" height="14px" />
                <div className="flex flex-col" style={{ marginTop: 'var(--space-4)' }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} width="100%" height="48px" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col" style={{ gap: 'var(--space-10)' }}>
              {/* First session CTA — empty workspace */}
              {(SESSIONS.length === 0 || freshMode) ? (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ padding: 'var(--space-16)', gap: 'var(--space-4)', textAlign: 'center' }}
                >
                  <img src="/canarylogo.svg" alt="Canary" style={{ height: '24px' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, color: 'var(--text-black)', marginTop: 'var(--space-4)' }}>
                    Run your first session to get started
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)', maxWidth: '400px' }}>
                    Connect your agent, start a session, and Canary will scan your codebase and populate your dashboard.
                  </span>

                  {/* Feature chips */}
                  <div className="inline-flex" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                    {[
                      { key: 'PROFILE', desc: 'Agent understanding' },
                      { key: 'INSIGHTS', desc: 'Pattern detection' },
                      { key: 'RULES', desc: 'Boundary enforcement' },
                    ].map((chip) => (
                      <div
                        key={chip.key}
                        style={{
                          border: '1px solid var(--grey-stroke)',
                          borderRadius: '4px',
                          padding: 'var(--space-3) var(--space-4)',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-black)', display: 'block', marginBottom: '2px' }}>
                          {chip.key}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--icon-grey)' }}>
                          {chip.desc}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <Button variant="primary" size="sm" onClick={() => onboarding?.startOnboarding()}>
                      ▶ Start session
                    </Button>
                  </div>
                </div>
              ) : AGENTS.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    border: '1px dashed var(--grey-stroke)',
                    borderRadius: '0px',
                    padding: 'var(--space-16)',
                    gap: 'var(--space-4)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)' }}>
                    Add your first agent to start monitoring
                  </span>
                  <Button variant="primary" size="sm">New agent</Button>
                </div>
              ) : (
                <>
                  {/* All healthy banner */}
                  {WORKSPACE_VIOLATIONS.length === 0 && (
                    <div
                      className="flex items-center"
                      style={{
                        gap: 'var(--space-3)',
                        background: 'rgba(72,199,43,0.08)',
                        border: '1px solid var(--safe)',
                        borderRadius: '0px',
                        padding: 'var(--space-4)',
                      }}
                    >
                      <CheckCircle size={14} style={{ color: 'var(--safe)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--safe)' }}>
                        All agents are healthy — no violations recorded
                      </span>
                    </div>
                  )}

                  <EntryAnim delay={0} show={contentVisible}>
                    <SectionLabel>Agent Health</SectionLabel>
                    <AgentHealthCards />
                  </EntryAnim>

                  <EntryAnim delay={80} show={contentVisible}>
                    <SectionLabel>Trace Activity</SectionLabel>
                    <TraceCountChart />
                  </EntryAnim>

                  <EntryAnim delay={160} show={contentVisible}>
                    <SectionLabel>Recent Violations</SectionLabel>
                    <RecentViolationsList limit={8} />
                  </EntryAnim>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

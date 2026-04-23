'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CollapsibleSidebar, useCollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { AGENTS, AGENT_PROFILES } from '@/data/mockData';
import { ConnectorHealthBanner } from '@/components/agent/ConnectorHealthBanner';

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

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = (params.agent as string) || 'photon-research';
  const workspaceSlug = (params.workspace as string) || 'demo';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
  const profile = AGENT_PROFILES[agentId] || AGENT_PROFILES['photon-research'];

  const [flagOpen, setFlagOpen] = useState(false);
  const [flagValue, setFlagValue] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);

  const handleSubmitFlag = () => {
    console.log('Feedback submitted:', flagValue);
    setFlagSubmitted(true);
    setTimeout(() => {
      setFlagOpen(false);
      setFlagSubmitted(false);
      setFlagValue('');
    }, 2000);
  };

  const { sidebarOpen, toggleSidebar } = useCollapsibleSidebar();

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <CollapsibleSidebar activeItem="profile" activeAgentId={agent.id} sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0, transition: 'margin-left 250ms ease' }}>
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: agent.name, href: `/${workspaceSlug}/${agentId}` },
            { label: 'Profile' },
          ]}
        />

        <main style={{ flex: 1, background: 'var(--bg)', padding: 'var(--space-8)', overflowY: 'auto' }}>
          <div style={{ maxWidth: '720px' }}>

            {/* Connector health banner */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <ConnectorHealthBanner agentId={agentId} connectionStatus={profile.connectionStatus} framework={profile.framework} />
            </div>

            {/* Page header */}
            {/* Agent name + description + tags with tooltips */}
            <div style={{ marginBottom: '60px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-1px',
                  color: 'var(--text-black)',
                  margin: 0,
                  marginBottom: 'var(--space-2)',
                }}
              >
                {agent.name}
              </h3>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-4)' }}>
                {agent.description}
              </span>

              {/* Framework + Computer Use chips with info tooltips */}
              <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-3)' }}>
                <span title="The SDK framework this agent uses to execute actions" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', border: '1px solid var(--grey-stroke)', padding: '2px 8px', color: 'var(--icon-grey)', cursor: 'help' }}>
                  {profile.framework} <span style={{ fontSize: '9px', opacity: 0.5 }}>ⓘ</span>
                </span>
                <span title={profile.computerUse ? 'This agent uses TinyFish to control a browser and interact with visual UI' : 'This agent runs only through Claude Code with no browser access'} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', border: '1px solid var(--grey-stroke)', padding: '2px 8px', color: 'var(--icon-grey)', cursor: 'help' }}>
                  {profile.computerUse ? 'Computer use enabled · TinyFish' : 'Claude Code only · No browser'} <span style={{ fontSize: '9px', opacity: 0.5 }}>ⓘ</span>
                </span>
              </div>
            </div>

            {/* SECTION 2 — Intended behavior */}
            <div style={{ marginBottom: '60px' }}>
              <SectionLabel>Intended Behavior</SectionLabel>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--text-black)',
                  margin: 0,
                  marginBottom: 'var(--space-4)',
                }}
              >
                {profile.intendedBehavior.summary}
              </p>

              {profile.intendedBehavior.workflowType === 'sequential' && profile.intendedBehavior.steps && (
                <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
                  {profile.intendedBehavior.steps.map((s) => (
                    <div key={s.step} className="flex" style={{ gap: 'var(--space-3)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: 'var(--accent-color)',
                          minWidth: '24px',
                          flexShrink: 0,
                        }}
                      >
                        {s.step}.
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)' }}>
                        {s.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3 — Intended outcomes */}
            <div style={{ marginBottom: '60px' }}>
              <SectionLabel>Intended Outcomes</SectionLabel>

              <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
                {profile.intendedOutcomes.map((outcome, i) => (
                  <div key={i} className="flex" style={{ gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--safe)',
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)' }}>
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4 — Heuristics */}
            <div style={{ marginBottom: '60px' }}>
              <SectionLabel>Quality Heuristics</SectionLabel>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: 'var(--icon-grey)',
                  display: 'block',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Metrics Canary uses to measure this agent&apos;s quality. Generated from documentation scan.
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                {profile.heuristics.map((h) => (
                  <div
                    key={h.id}
                    className="flex flex-col"
                    style={{
                      background: 'var(--card-gradient)',
                      border: '1px solid var(--grey-stroke)',
                      borderRadius: '4px',
                      padding: 'var(--space-5)',
                      minHeight: '140px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-black)',
                        display: 'block',
                        marginBottom: 'var(--space-2)',
                      }}
                    >
                      {h.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: 'var(--icon-grey)',
                        display: 'block',
                      }}
                    >
                      {h.description}
                    </span>
                    <div style={{ flex: 1 }} />
                    <div className="flex items-center" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          border: '1px solid var(--grey-stroke)',
                          padding: '1px 6px',
                          color: 'var(--icon-grey)',
                        }}
                      >
                        {h.measurement}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-black)' }}>
                        Target: {h.targetValue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5 — Sub-agent map (conditional) */}
            {profile.subAgents && (
              <div style={{ marginBottom: '60px' }}>
                <SectionLabel>Sub-Agents</SectionLabel>
                {/* Sub-agent rendering will be added when data exists */}
              </div>
            )}

            {/* SECTION 6 — Flag this understanding */}
            <div
              style={{
                borderTop: '1px solid var(--grey-stroke)',
                marginTop: '40px',
                paddingTop: '40px',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: '24px',
                  color: 'var(--text-black)',
                  margin: 0,
                  marginBottom: 'var(--space-2)',
                }}
              >
                Something incorrect?
              </h4>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  color: 'var(--icon-grey)',
                  display: 'block',
                  marginBottom: 'var(--space-4)',
                }}
              >
                If Canary has misunderstood your agent, let us know. Your feedback improves the profile scan.
              </span>

              {!flagOpen && (
                <Button variant="secondary" size="sm" noAscii onClick={() => setFlagOpen(true)}>
                  Flag this understanding
                </Button>
              )}

              {flagOpen && !flagSubmitted && (
                <div className="flex flex-col" style={{ gap: '40px' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-black)',
                    }}
                  >
                    What did Canary get wrong?
                  </label>
                  <Textarea
                    value={flagValue}
                    onChange={(e) => setFlagValue(e.target.value)}
                    style={{ minHeight: '80px', fontFamily: 'var(--font-sans)', fontSize: '14px' }}
                    placeholder="Describe what's incorrect..."
                  />
                  <div>
                    <Button variant="primary" size="sm" asciiVariant="both" onClick={handleSubmitFlag} style={{ width: '240px' }}>
                      Submit feedback
                    </Button>
                  </div>
                </div>
              )}

              {flagSubmitted && (
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'var(--safe)',
                    fontWeight: 500,
                  }}
                >
                  Thanks — feedback received
                </span>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

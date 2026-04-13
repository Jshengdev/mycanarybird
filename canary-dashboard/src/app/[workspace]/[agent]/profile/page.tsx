'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { AGENTS, AGENT_PROFILES } from '@/data/mockData';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--icon-grey)',
          letterSpacing: '0.06em',
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

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = (params.agent as string) || 'email-agent';
  const workspaceSlug = (params.workspace as string) || 'photon';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];
  const profile = AGENT_PROFILES[agentId] || AGENT_PROFILES['email-agent'];

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

  const lastScanned = new Date(profile.lastScanned).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar activeItem="profile" agentName={agent.name} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: 'var(--sidebar-width)' }}>
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: agent.name, href: `/${workspaceSlug}/${agentId}` },
            { label: 'Profile' },
          ]}
        />

        <main style={{ flex: 1, background: 'var(--bg)', padding: 'var(--space-8)', overflowY: 'auto' }}>
          <div style={{ maxWidth: '720px' }}>

            {/* SECTION 1 — Page header */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  color: 'var(--icon-grey)',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: 'var(--space-3)',
                }}
              >
                Agent Profile
              </span>

              <h1
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--text-black)',
                  margin: 0,
                  marginBottom: 'var(--space-3)',
                }}
              >
                {agent.name}
              </h1>

              {/* Meta row */}
              <div className="flex items-center" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    border: '1px solid var(--grey-stroke)',
                    padding: '2px 8px',
                    color: 'var(--icon-grey)',
                  }}
                >
                  {profile.framework}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
                  Last scanned: {lastScanned}
                </span>
              </div>

              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
                Canary&apos;s understanding of this agent based on codebase and documentation scan.
              </span>
            </div>

            {/* SECTION 2 — Intended behavior */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
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
            <div style={{ marginBottom: 'var(--space-8)' }}>
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
            <div style={{ marginBottom: 'var(--space-8)' }}>
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
                    style={{
                      background: 'var(--card-gradient)',
                      border: '1px solid var(--grey-stroke)',
                      borderRadius: '4px',
                      padding: 'var(--space-5)',
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
                        marginBottom: 'var(--space-3)',
                      }}
                    >
                      {h.description}
                    </span>
                    <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
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
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <SectionLabel>Sub-Agents</SectionLabel>
                {/* Sub-agent rendering will be added when data exists */}
              </div>
            )}

            {/* SECTION 6 — Flag this understanding */}
            <div
              style={{
                borderTop: '1px solid var(--grey-stroke)',
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-8)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-black)',
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Something incorrect?
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
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
                <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--text-black)',
                    }}
                  >
                    What did Canary get wrong?
                  </label>
                  <Textarea
                    value={flagValue}
                    onChange={(e) => setFlagValue(e.target.value)}
                    style={{ minHeight: '80px', fontFamily: 'var(--font-sans)' }}
                    placeholder="Describe what's incorrect..."
                  />
                  <div>
                    <Button variant="primary" size="sm" onClick={handleSubmitFlag}>
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

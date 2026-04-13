'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SESSIONS } from '@/data/mockData';
import type { Agent, Session } from '@/data/mockData';

function formatLastSeen(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${hours}:${mins}`;
}

export interface AgentHeaderProps {
  agent: Agent;
  lastSession?: Session;
}

export function AgentHeader({ agent, lastSession }: AgentHeaderProps) {
  const isConnected = agent.connectionStatus === 'connected';
  const [copied, setCopied] = useState(false);
  const agentSessions = SESSIONS.filter((s) => s.agentId === agent.id);
  const totalTraces = agentSessions.reduce((sum, s) => sum + s.tracesCount, 0);

  const handleRunSession = () => {
    navigator.clipboard.writeText('canary watch node agent.js');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '30px',
            lineHeight: '30px',
            fontWeight: 700,
            letterSpacing: '-1px',
            color: 'var(--black)',
            margin: 0,
          }}
        >
          {agent.name}
        </h1>

        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)' }}>
          {agent.description}
        </span>

        <div className="flex items-center" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-1)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-black)',
              background: 'var(--hover-gray)',
              border: '1px solid var(--grey-stroke)',
              borderRadius: '0px',
              padding: '2px 6px',
            }}
          >
            Framework: {agent.framework}
          </span>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
            {isConnected ? 'Connected' : 'Waiting'}
          </span>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--icon-grey)' }}>
            {totalTraces} traces
          </span>

          {lastSession && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
              Last seen {formatLastSeen(agent.lastSeen)}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
        <Button
          variant="primary"
          size="sm"
          icon={<Play size={12} />}
          onClick={handleRunSession}
        >
          {copied ? 'Copied ✓' : 'Run session'}
        </Button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import type { Agent, Session } from '@/data/mockData';

export interface AgentHeaderProps {
  agent: Agent;
  lastSession?: Session;
}

export function AgentHeader({ agent }: AgentHeaderProps) {

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
      </div>
    </div>
  );
}

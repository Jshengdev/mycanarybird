'use client';

import React from 'react';

export interface ConnectorHealthBannerProps {
  agentId: string;
  connectionStatus: 'connected' | 'pending' | 'disconnected';
  framework: string;
}

export function ConnectorHealthBanner({ connectionStatus, framework }: ConnectorHealthBannerProps) {
  // Only show for TinyFish-dependent agents with issues
  if (connectionStatus === 'connected') return null;
  if (!framework.toLowerCase().includes('tinyfish')) return null;

  const isDisconnected = connectionStatus === 'disconnected';

  return (
    <div
      className="flex items-center"
      style={{
        background: 'rgba(180,120,0,0.09)',
        border: '1px solid #A07800',
        borderRadius: '0px',
        padding: 'var(--space-4)',
        gap: 'var(--space-3)',
      }}
    >
      {/* Warning triangle */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
        <path d="M7 1L13 12H1L7 1Z" stroke="#A07800" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="#A07800" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="10.5" r="0.75" fill="#A07800" />
      </svg>

      {/* Text */}
      <div className="flex flex-col" style={{ flex: 1, gap: '2px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text-black)' }}>
          {isDisconnected ? 'TinyFish connector offline' : 'Connecting to TinyFish...'}
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>
          {isDisconnected
            ? 'Browser actions unavailable. Using Firecrawl as fallback — screenshots will not be captured.'
            : 'Waiting for first trace. Run your agent to confirm.'}
        </span>
      </div>

      {/* Last seen */}
      {isDisconnected && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          Last seen: Apr 9
        </span>
      )}
    </div>
  );
}

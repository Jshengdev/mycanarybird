'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AGENTS, LIVE_SESSION_STATE } from '@/data/mockData';
import { VerdictBadge } from '@/components/ui/VerdictBadge';
import type { VerdictVariant } from '@/components/ui/VerdictBadge';
import { CARD_GRADIENT_DEFAULT } from '@/hooks/useCardHover';

function getVerdict(score: number): VerdictVariant {
  if (score >= 80) return 'ready';
  if (score >= 60) return 'warning';
  return 'notready';
}

function formatLastSeen(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `Last session: ${month} ${day}, ${hours}:${mins}`;
}

export function AgentHealthCards() {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean[]>(AGENTS.map(() => false));
  const [bgStyles, setBgStyles] = useState<Record<string, string>>({});

  const handleCardMove = useCallback((id: string) => {
    setBgStyles((prev) => ({ ...prev, [id]: 'linear-gradient(180deg, #FAFAFD 0%, #EDEDF2 100%)' }));
  }, []);

  const handleCardLeave = useCallback((id: string) => {
    setBgStyles((prev) => ({ ...prev, [id]: CARD_GRADIENT_DEFAULT }));
  }, []);

  useEffect(() => {
    AGENTS.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 80);
    });
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-5)',
      }}
    >
      {AGENTS.map((agent, i) => {
        const isLive = LIVE_SESSION_STATE.isLive && LIVE_SESSION_STATE.agentId === agent.id;
        return (
          <div
            key={agent.id}
            style={{
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 200ms ease-out, transform 200ms ease-out',
            }}
          >
            <div
              onClick={() => router.push(`/demo/${agent.id}`)}
              onMouseEnter={() => handleCardMove(agent.id)}
              onMouseMove={() => handleCardMove(agent.id)}
              onMouseLeave={() => handleCardLeave(agent.id)}
              className={`flex flex-col items-center${isLive ? ' card-gradient-border' : ''}`}
              style={{
                gap: 'var(--space-3)',
                background: bgStyles[agent.id] || CARD_GRADIENT_DEFAULT,
                border: '1px solid var(--grey-stroke)',
                borderRadius: '4px',
                overflow: 'hidden',
                padding: 'var(--space-8)',
                cursor: 'pointer',
                transition: 'background 300ms ease',
                position: 'relative',
              }}
            >
              {/* LIVE chip */}
              {isLive && (
                <span
                  style={{
                    position: 'absolute',
                    top: 'var(--space-3)',
                    right: 'var(--space-3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    background: 'var(--safe)',
                    color: 'var(--text-white)',
                    padding: '1px 6px',
                    letterSpacing: '0.04em',
                    lineHeight: '14px',
                  }}
                >
                  LIVE
                </span>
              )}
              {/* Agent name — centered */}
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-black)',
                  textAlign: 'center',
                }}
              >
                {agent.name}
              </span>

              {/* Score — centered, ~1.8x size */}
              <div className="flex items-baseline justify-center" style={{ gap: 'var(--space-2)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '64px',
                    fontWeight: 400,
                    lineHeight: '1',
                    color: 'var(--text-black)',
                  }}
                >
                  {agent.healthScore}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '24px',
                    fontWeight: 400,
                    color: 'var(--icon-grey)',
                  }}
                >
                  /100
                </span>
              </div>

              {/* Verdict — self-sizing, centered */}
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <VerdictBadge variant={getVerdict(agent.healthScore)} />
              </div>

              {/* Last seen + summary — tight spacing */}
              <div className="flex flex-col items-center" style={{ gap: '2px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--icon-grey)',
                    textAlign: 'center',
                  }}
                >
                  {formatLastSeen(agent.lastSeen)}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--icon-grey)',
                    textAlign: 'center',
                  }}
                >
                  10 sessions · 4 violations
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

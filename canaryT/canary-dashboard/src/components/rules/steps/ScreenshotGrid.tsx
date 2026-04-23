'use client';

import React, { useState } from 'react';
import { ElementPickerModal } from '@/components/rules/steps/ElementPickerModal';
import { SESSIONS } from '@/data/mockData';
import type { Session } from '@/data/mockData';

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  return 'var(--critical)';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export interface ScreenshotGridProps {
  onSelect: (data: { eventId: string; action: string; target: string; timestamp: string; sessionId: string }) => void;
}

export function ScreenshotGrid({ onSelect }: ScreenshotGridProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Show most recent 6 sessions
  const recentSessions = [...SESSIONS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <>
      <ElementPickerModal
        open={modalOpen}
        session={selectedSession}
        onClose={() => setModalOpen(false)}
        onSelect={(data) => {
          onSelect(data);
          setModalOpen(false);
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
        {recentSessions.map((session) => {
          const isSelected = selectedSession?.id === session.id;
          const isHovered = hoveredId === session.id;

          return (
            <div
              key={session.id}
              onClick={() => {
                setSelectedSession(session);
                setModalOpen(true);
              }}
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: 'var(--card-bg)',
                border: isSelected
                  ? '2px solid var(--accent-color)'
                  : isHovered
                    ? '1px solid var(--accent-color)'
                    : '1px solid var(--grey-stroke)',
                borderRadius: '4px',
                padding: 'var(--space-3)',
                cursor: 'pointer',
                transition: 'border var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              {/* Score */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: scoreColor(session.score),
                }}
              >
                {session.score}
              </span>

              {/* Session ID */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--icon-grey)' }}>
                {session.id}
              </span>

              {/* Date */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--icon-grey)' }}>
                {formatDate(session.date)}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

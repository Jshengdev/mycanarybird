'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SESSIONS } from '@/data/mockData';

const SESSION_OPTIONS = SESSIONS.map((s) => ({ value: s.id, label: s.id }));

export interface Step4SaveConfirmationProps {
  onRunTest: (sessionId: string) => void;
}

export function Step4SaveConfirmation({ onRunTest }: Step4SaveConfirmationProps) {
  const [selectedSession, setSelectedSession] = useState(SESSIONS[0]?.id || '');

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
      {/* Success alert */}
      <div
        className="flex"
        style={{
          gap: 'var(--space-3)',
          background: 'rgba(72,199,43,0.08)',
          border: '1px solid var(--safe)',
          borderRadius: '0px',
          padding: 'var(--space-4)',
        }}
      >
        <Check size={14} style={{ color: 'var(--safe)', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--safe)' }}>
          Rule saved successfully.
        </span>
      </div>

      {/* Test section */}
      <div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', display: 'block', marginBottom: 'var(--space-4)' }}>
          Want to test this rule against a recent session?
        </span>
        <div className="flex items-end" style={{ gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <Select
              options={SESSION_OPTIONS}
              value={selectedSession}
              onChange={setSelectedSession}
              placeholder="Select session"
            />
          </div>
          <Button variant="secondary" size="sm" noAscii onClick={() => onRunTest(selectedSession)}>
            Run test
          </Button>
        </div>
      </div>
    </div>
  );
}

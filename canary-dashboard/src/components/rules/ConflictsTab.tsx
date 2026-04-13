'use client';

import React, { useState } from 'react';
import { CheckCircle, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { Rule } from '@/data/mockData';

const RESOLUTION_OPTIONS = [
  { value: 'higher-severity', label: 'Apply higher severity' },
  { value: 'newer-rule', label: 'Apply newer rule' },
  { value: 'pause-ask', label: 'Pause and ask me' },
];

export interface ConflictsTabProps {
  rules: Rule[];
}

export function ConflictsTab({ rules }: ConflictsTabProps) {
  const [resolved, setResolved] = useState(false);
  const [resolution, setResolution] = useState('higher-severity');

  const hasConflict = rules.length >= 2 && !resolved;

  if (!hasConflict) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ gap: 'var(--space-3)', padding: 'var(--space-16)' }}>
        <CheckCircle size={24} style={{ color: 'var(--safe)' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--safe)' }}>
          No conflicts detected
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-5)',
      }}
    >
      {/* Conflicting rule names */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
          {rules[0].name}
        </span>
        <ArrowRightLeft size={12} style={{ color: 'var(--warning)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-black)' }}>
          {rules[1].name}
        </span>
      </div>

      {/* Description */}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)', display: 'block', marginBottom: 'var(--space-4)' }}>
        Both rules may apply when agent accesses files outside the working directory.
      </span>

      {/* Resolution select */}
      <div style={{ maxWidth: '240px', marginBottom: 'var(--space-4)' }}>
        <Select
          label="Resolution"
          options={RESOLUTION_OPTIONS}
          value={resolution}
          onChange={setResolution}
        />
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          setResolved(true);
          console.log('Conflict resolved with:', resolution);
        }}
      >
        Resolve
      </Button>
    </div>
  );
}

'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Rule } from '@/data/mockData';

export interface RulesetMetaBarProps {
  rules: Rule[];
  onTabChange: (tab: string) => void;
}

export function RulesetMetaBar({ rules, onTabChange }: RulesetMetaBarProps) {
  const orphanedCount = rules.filter((r) => r.isOrphaned).length;
  const neverTriggeredCount = rules.filter((r) => r.isNeverTriggered).length;
  const conflictCount = rules.filter((r) => r.status === 'conflict').length;

  const allDisabled = rules.length > 0 && rules.every((r) => r.status === 'disabled');
  const hasIssues = conflictCount > 0 || orphanedCount > 0 || neverTriggeredCount > 0 || allDisabled;

  return (
    <div
      className="flex items-center"
      style={{
        gap: 'var(--space-5)',
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--grey-stroke)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {!hasIssues ? (
        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
          <CheckCircle size={12} style={{ color: 'var(--safe)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--safe)' }}>
            No issues
          </span>
        </div>
      ) : (
        <>
          {conflictCount > 0 && (
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--critical)' }}>!</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)' }}>
                {conflictCount} conflict{conflictCount !== 1 ? 's' : ''}
              </span>
              <span
                onClick={() => onTabChange('conflicts')}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                View →
              </span>
            </div>
          )}
          {orphanedCount > 0 && (
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--warning)' }}>!</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)' }}>
                {orphanedCount} orphaned
              </span>
              <span
                onClick={() => onTabChange('orphaned')}
                style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Fix →
              </span>
            </div>
          )}
          {neverTriggeredCount > 0 && (
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--warning)' }}>!</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)' }}>
                {neverTriggeredCount} never triggered
              </span>
            </div>
          )}
          {allDisabled && (
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--warning)' }}>!</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--warning)' }}>
                All rules disabled — no active enforcement
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

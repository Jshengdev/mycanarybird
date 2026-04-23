'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

const TEMPLATES = [
  { name: 'Email Safety Bundle', desc: 'Core rules for safe email operations', ruleCount: 8 },
  { name: 'File Access Control', desc: 'Protect sensitive files and directories', ruleCount: 5 },
  { name: 'Data Privacy Pack', desc: 'Prevent exposure of PII and credentials', ruleCount: 6 },
  { name: 'Browser Safety', desc: 'Safe navigation and form submission rules', ruleCount: 4 },
  { name: 'Attachment Guard', desc: 'Control file attachment behavior', ruleCount: 3 },
  { name: 'Time Compliance', desc: 'Enforce time limits on agent operations', ruleCount: 4 },
];

function TemplateCard({ name, desc, ruleCount }: { name: string; desc: string; ruleCount: number }) {
  const [confirming, setConfirming] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-5)',
        opacity: applied ? 0.5 : 1,
        transition: 'opacity 200ms ease',
      }}
    >
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, color: 'var(--text-black)' }}>
        {name}
      </span>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)', marginTop: 'var(--space-2)' }}>
        {desc}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', marginTop: 'var(--space-2)' }}>
        {ruleCount} rules
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        {applied ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--safe)' }}>
            ✓ Applied
          </span>
        ) : confirming ? (
          <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-black)' }}>
              {ruleCount} rules will be added
            </span>
            <div className="flex" style={{ gap: 'var(--space-3)' }}>
              <Button variant="primary" size="sm" onClick={() => { setApplied(true); setConfirming(false); console.log('Applied template:', name); }}>
                Confirm
              </Button>
              <Button variant="secondary" size="sm" noAscii onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" size="sm" noAscii onClick={() => setConfirming(true)}>
            Apply to ruleset
          </Button>
        )}
      </div>
    </div>
  );
}

export function TemplatesTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
      {TEMPLATES.map((t) => (
        <TemplateCard key={t.name} name={t.name} desc={t.desc} ruleCount={t.ruleCount} />
      ))}
    </div>
  );
}

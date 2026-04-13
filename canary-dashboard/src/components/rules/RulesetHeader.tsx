'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RULESET_RULES } from '@/data/mockData';
import type { Ruleset } from '@/data/mockData';

export interface RulesetHeaderProps {
  ruleset: Ruleset;
  onNewRule: () => void;
}

export function RulesetHeader({ ruleset, onNewRule }: RulesetHeaderProps) {
  const [nameValue, setNameValue] = useState(ruleset.name);
  const [descValue, setDescValue] = useState(ruleset.description || '');
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);

  const handleExport = () => {
    const yaml = RULESET_RULES.map((r) =>
      `- id: ${r.id}\n  name: ${r.name}\n  type: ${r.type}\n  severity: ${r.severity}\n  condition: "${r.condition}"\n  consequence: ${r.consequence}`
    ).join('\n\n');
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ruleset.id}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col" style={{ marginBottom: 'var(--space-6)' }}>
      {/* Name — inline edit */}
      {editingName ? (
        <input
          autoFocus
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') setEditingName(false); if (e.key === 'Escape') { setNameValue(ruleset.name); setEditingName(false); } }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '30px',
            fontWeight: 700,
            letterSpacing: '-1px',
            color: 'var(--text-black)',
            background: 'var(--card-bg)',
            border: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            padding: '2px 6px',
            outline: 'none',
          }}
        />
      ) : (
        <span
          onClick={() => setEditingName(true)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '30px',
            fontWeight: 700,
            letterSpacing: '-1px',
            color: 'var(--text-black)',
            cursor: 'text',
            borderBottom: '1px dashed var(--grey-stroke)',
            paddingBottom: '2px',
          }}
        >
          {nameValue}
        </span>
      )}

      {/* Meta badges */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        {[ruleset.scope || 'agent-level', ruleset.source || 'manual', 'Last evaluated: 2 days ago'].map((badge) => (
          <span
            key={badge}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              border: '1px solid var(--grey-stroke)',
              borderRadius: '0px',
              padding: '2px 6px',
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Description — inline edit */}
      <div style={{ marginTop: 'var(--space-3)' }}>
        {editingDesc ? (
          <input
            autoFocus
            value={descValue}
            onChange={(e) => setDescValue(e.target.value)}
            onBlur={() => setEditingDesc(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingDesc(false); if (e.key === 'Escape') { setDescValue(ruleset.description || ''); setEditingDesc(false); } }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--icon-grey)',
              background: 'var(--card-bg)',
              border: '1px solid var(--grey-stroke)',
              borderRadius: '0px',
              padding: '2px 6px',
              outline: 'none',
              width: '100%',
            }}
          />
        ) : (
          <span
            onClick={() => setEditingDesc(true)}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--icon-grey)',
              cursor: 'text',
              borderBottom: '1px dashed var(--grey-stroke)',
              paddingBottom: '2px',
            }}
          >
            {descValue || 'Add description...'}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" noAscii>Import YAML</Button>
        <Button variant="ghost" size="sm" noAscii onClick={handleExport}>Export YAML</Button>
        <Button variant="ghost" size="sm" noAscii>Test ruleset</Button>
        <Button variant="primary" size="sm" asciiVariant="both" onClick={onNewRule} style={{ padding: '0 40px' }}>+ New rule</Button>
      </div>
    </div>
  );
}

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
          aria-label="Ruleset name"
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
        <button
          onClick={() => setEditingName(true)}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setEditingName(true); }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'text',
            font: 'inherit',
            color: 'inherit',
            fontFamily: 'var(--font-sans)',
            fontSize: '30px',
            fontWeight: 700,
            letterSpacing: '-1px',
            borderBottom: '1px dashed var(--grey-stroke)',
            paddingBottom: '2px',
            textAlign: 'left',
          }}
        >
          {nameValue}
        </button>
      )}

      {/* Description — inline edit */}
      <div style={{ marginTop: 'var(--space-3)' }}>
        {editingDesc ? (
          <input
            aria-label="Ruleset description"
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
          <button
            onClick={() => setEditingDesc(true)}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingDesc(true); }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'text',
              font: 'inherit',
              color: 'inherit',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              borderBottom: '1px dashed var(--grey-stroke)',
              paddingBottom: '2px',
              textAlign: 'left',
            }}
          >
            {descValue || 'Add description...'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" noAscii>Import YAML</Button>
        <Button variant="ghost" size="sm" noAscii onClick={handleExport}>Export YAML</Button>
        <Button variant="secondary" size="sm" asciiVariant="both" style={{ padding: '0 40px' }}>Test ruleset</Button>
        <Button variant="primary" size="sm" asciiVariant="both" onClick={onNewRule} style={{ padding: '0 40px' }}>+ New rule</Button>
      </div>
    </div>
  );
}

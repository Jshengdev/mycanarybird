'use client';

import React, { useState, useMemo } from 'react';
import { RulesetHeader } from '@/components/rules/RulesetHeader';
import { RulesetStatCards } from '@/components/rules/RulesetStatCards';
import { RulesetMetaBar } from '@/components/rules/RulesetMetaBar';
import { RuleCard } from '@/components/rules/RuleCard';
import { ConflictsTab } from '@/components/rules/ConflictsTab';
import { TemplatesTab } from '@/components/rules/TemplatesTab';
import { RuleBuilderSheet } from '@/components/rules/RuleBuilderSheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RULESETS, RULESET_RULES, SESSIONS } from '@/data/mockData';

type TabId = 'rules' | 'conflicts' | 'templates';

const TABS: { key: TabId; label: string }[] = [
  { key: 'rules', label: 'Rules' },
  { key: 'conflicts', label: 'Conflicts' },
  { key: 'templates', label: 'Templates' },
];

export interface RulesetDetailProps {
  rulesetId: string;
}

export function RulesetDetail({ rulesetId }: RulesetDetailProps) {
  const [selectedTab, setSelectedTab] = useState<TabId>('rules');
  const [search, setSearch] = useState('');
  const [builderOpen, setBuilderOpen] = useState(false);

  const ruleset = RULESETS.find((r) => r.id === rulesetId) || RULESETS[1];

  const filteredRules = useMemo(() => {
    if (!search) return RULESET_RULES;
    const q = search.toLowerCase();
    return RULESET_RULES.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.plainEnglish.toLowerCase().includes(q)
    );
  }, [search]);

  const evaluatedCount = RULESET_RULES.filter((r) => r.stats.totalEvaluations > 0).length;

  // Empty ruleset
  if (RULESET_RULES.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--space-16)', gap: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)' }}>
          Create your first rule
        </span>
        <div className="flex" style={{ gap: 'var(--space-3)' }}>
          {['Email Safety', 'File Access', 'Data Privacy'].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: 'var(--text-black)',
                background: 'var(--card-bg)',
                border: '1px solid var(--grey-stroke)',
                borderRadius: '0px',
                padding: 'var(--space-2) var(--space-4)',
                cursor: 'pointer',
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <Button variant="primary" size="sm" asciiVariant="both" onClick={() => setBuilderOpen(true)} style={{ marginTop: 'var(--space-4)', padding: '0 40px' }}>
          + New rule
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ padding: 'var(--space-8)', gap: 'var(--space-6)' }}>
      <RulesetHeader ruleset={ruleset} onNewRule={() => setBuilderOpen(true)} />
      <RulesetStatCards sessions={SESSIONS} rules={RULESET_RULES} />
      <RulesetMetaBar rules={RULESET_RULES} onTabChange={(tab) => setSelectedTab(tab as TabId)} />

      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: '1px solid var(--grey-stroke)' }}>
        {TABS.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: selectedTab === tab.key ? 'var(--text-black)' : 'var(--icon-grey)',
              borderBottom: selectedTab === tab.key ? '2px solid var(--text-black)' : 'none',
              marginBottom: selectedTab === tab.key ? '-1px' : '0',
              transition: 'color var(--transition-fast)',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab content */}
      {selectedTab === 'rules' && (
        <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
          {/* Search toolbar */}
          <div style={{ width: '280px' }}>
            <Input
              search
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setSearch(''); }}
            />
          </div>

          {/* Rule cards */}
          <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
            {filteredRules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>

          {filteredRules.length === 0 && (
            <div className="flex items-center justify-center" style={{ padding: 'var(--space-8)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)' }}>
                No rules match your search
              </span>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'conflicts' && <ConflictsTab rules={RULESET_RULES} />}
      {selectedTab === 'templates' && <TemplatesTab />}

      {/* Footer */}
      <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--grey-stroke)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
          {RULESET_RULES.length} rules · {evaluatedCount}/{RULESET_RULES.length} evaluated
        </span>
        <Button variant="ghost" size="sm" noAscii onClick={() => console.log('Import YAML - coming soon')}>
          Import from YAML
        </Button>
      </div>

      <RuleBuilderSheet open={builderOpen} onClose={() => setBuilderOpen(false)} />
    </div>
  );
}

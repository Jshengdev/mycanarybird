'use client';

import React from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { RulesetDetail } from '@/components/rules/RulesetDetail';
import { AGENTS, INSIGHTS } from '@/data/mockData';

export default function RulesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = (params.agent as string) || 'email-agent';
  const workspaceSlug = (params.workspace as string) || 'photon';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];

  const selectedRulesetId = searchParams.get('ruleset') || 'email-safety';
  const insightsWithRules = INSIGHTS.filter((i) => i.agentId === agentId && i.suggestedRule && i.status !== 'resolved');

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <Sidebar
        activeItem="rulesets"
        agentName={agent.name}
        activeRulesetId={selectedRulesetId}
      />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: 'var(--sidebar-width)' }}>
        <Breadcrumb
          items={[
            { label: 'Photon workspace', href: '/' },
            { label: agent.name, href: `/${workspaceSlug}/${agentId}` },
            { label: 'Rules' },
          ]}
        />

        <main style={{ flex: 1, overflow: 'hidden', background: 'var(--bg)' }}>
          <div style={{ overflowY: 'auto', height: '100%' }}>
            {/* Insights nudge */}
            {insightsWithRules.length > 0 && (
              <div
                className="flex items-center justify-between"
                style={{
                  background: 'rgba(11,13,196,0.05)',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '0px',
                  padding: 'var(--space-4)',
                  margin: 'var(--space-8) var(--space-8) 0',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-black)' }}>
                  {insightsWithRules.length} insight{insightsWithRules.length !== 1 ? 's have' : ' has'} suggested rules ready to add →
                </span>
                <Button variant="ghost" size="sm" noAscii onClick={() => router.push(`/${workspaceSlug}/${agentId}/sessions`)}>
                  View insights
                </Button>
              </div>
            )}
            <RulesetDetail rulesetId={selectedRulesetId} />
          </div>
        </main>
      </div>
    </div>
  );
}

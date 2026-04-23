'use client';

import React from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { CollapsibleSidebar, useCollapsibleSidebar } from '@/components/layout/CollapsibleSidebar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { RulesetDetail } from '@/components/rules/RulesetDetail';
import { AGENTS, INSIGHTS } from '@/data/mockData';

export default function RulesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const agentId = (params.agent as string) || 'photon-research';
  const workspaceSlug = (params.workspace as string) || 'demo';
  const agent = AGENTS.find((a) => a.id === agentId) || AGENTS[0];

  const selectedRulesetId = searchParams.get('ruleset') || 'photon-research-rules';
  const insightsWithRules = INSIGHTS.filter((i) => i.agentId === agentId && i.suggestedRule && i.status !== 'resolved');

  const { sidebarOpen, toggleSidebar } = useCollapsibleSidebar();

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <CollapsibleSidebar activeItem="rulesets" activeAgentId={agent.id} sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex flex-col" style={{ flex: 1, marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0, transition: 'margin-left 250ms ease' }}>
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
              <div style={{ margin: 'var(--space-8) var(--space-8) 0' }}>
                <AlertBanner
                  ctaLabel="View insights"
                  onCtaClick={() => router.push(`/${workspaceSlug}/${agentId}/insights`)}
                >
                  {insightsWithRules.length} insight{insightsWithRules.length !== 1 ? 's have' : ' has'} suggested rules ready to add
                </AlertBanner>
              </div>
            )}
            <RulesetDetail rulesetId={selectedRulesetId} />
          </div>
        </main>
      </div>
    </div>
  );
}

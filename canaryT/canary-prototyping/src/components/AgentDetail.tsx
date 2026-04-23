import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  AGENTS, SESSIONS,
  getAgentHealth, getScoreColor,
  type AppRoute, type SetRoute,
} from '@/lib/mockData'
import { RulesOnboarding } from './RulesOnboarding'
import { AgentProfile } from './AgentProfile'

type AgentDetailProps = {
  route: Extract<AppRoute, { view: 'agent' }>
  setRoute: SetRoute
}

type AgentTab = 'profile' | 'sessions' | 'rulesets'

function VerdictBadge({ score }: { score: number }) {
  return score >= 80
    ? <Badge variant="success" className="text-[10px]">READY</Badge>
    : <Badge variant="destructive" className="text-[10px]">NOT READY</Badge>
}

// ── Session list ──────────────────────────────────────────────────────────────

function SessionList({ agentId, setRoute }: { agentId: string; setRoute: SetRoute }) {
  const sessions = SESSIONS.filter(s => s.agentId === agentId)

  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-xs font-mono text-muted-foreground">
        No sessions recorded for this agent.
      </div>
    )
  }

  return (
    <div>
      {/* Header row — design system table header style */}
      <div className="flex items-center px-4 py-2 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider sticky top-0 z-10 bg-background">
        <div className="w-[180px] shrink-0">Session-ID</div>
        <div className="w-[130px] shrink-0">Date / Time</div>
        <div className="w-[72px] shrink-0">Score</div>
        <div className="w-[140px] shrink-0">Verdict</div>
        <div className="w-[72px] shrink-0 text-right">Events</div>
        <div className="w-[84px] shrink-0 text-right">Violations</div>
        <div className="flex-1 text-right">Duration</div>
      </div>

      {/* Data rows */}
      {sessions.map(session => {
        const color   = getScoreColor(session.score)
        const isReady = session.score >= 80

        return (
          <div
            key={session.id}
            className="flex items-center px-4 py-2.5 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors group"
            onClick={() => setRoute({ view: 'session', agentId, sessionId: session.id })}
          >
            <div className="w-[180px] shrink-0 font-mono text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
              {session.id}
            </div>
            <div className="w-[130px] shrink-0 text-xs text-secondary-foreground">{session.date}</div>
            <div className="w-[72px] shrink-0">
              <span className="font-mono text-sm font-bold tabular-nums" style={{ color }}>{session.score}</span>
              <span className="font-mono text-[10px] text-muted-foreground">/100</span>
            </div>
            <div className="w-[140px] shrink-0">
              <VerdictBadge score={session.score} />
            </div>
            <div className="w-[72px] shrink-0 text-right font-mono text-[11px] font-semibold text-foreground">{session.events}</div>
            <div className="w-[84px] shrink-0 text-right">
              <span className={cn(
                'font-mono text-[11px] font-semibold',
                session.violations > 0 ? 'text-destructive' : 'text-muted-foreground',
              )}>
                {session.violations}
              </span>
            </div>
            <div className="flex-1 text-right font-mono text-[11px] font-semibold text-foreground">{session.duration}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── AgentDetail ───────────────────────────────────────────────────────────────

export function AgentDetail({ route, setRoute }: AgentDetailProps) {
  const agent  = AGENTS.find(a => a.id === route.agentId)
  const tab    = (route.tab ?? 'profile') as AgentTab
  const health = getAgentHealth(agent?.lastScore ?? 0)
  const color  = getScoreColor(agent?.lastScore ?? 0)

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-48 text-xs font-mono text-muted-foreground">
        Agent not found.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Agent header */}
      <div className="px-6 pt-5 pb-0 border-b border-border shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            'w-2 h-2 rounded-full shrink-0',
            health === 'green' ? 'bg-safe' : health === 'amber' ? 'bg-warning' : 'bg-destructive animate-pulse',
          )} />
          <h1 className="text-lg font-semibold text-foreground">{agent.name}</h1>
          <span className="font-mono text-xl font-bold tabular-nums" style={{ color }}>{agent.lastScore}</span>
          <span className="text-xs text-muted-foreground font-mono">/ 100</span>
          <VerdictBadge score={agent.lastScore} />
        </div>

        {/* Tabs — underline style per design system */}
        <Tabs
          value={tab}
          onValueChange={(v) => setRoute({ view: 'agent', agentId: agent.id, tab: v as AgentTab })}
        >
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="rulesets">Rulesets</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {tab === 'profile' && (
          <AgentProfile agentId={agent.id} />
        )}
        {tab === 'sessions' && (
          <SessionList agentId={agent.id} setRoute={setRoute} />
        )}
        {tab === 'rulesets' && (
          <RulesOnboarding initialRuleset={route.initialRuleset} />
        )}
      </div>
    </div>
  )
}

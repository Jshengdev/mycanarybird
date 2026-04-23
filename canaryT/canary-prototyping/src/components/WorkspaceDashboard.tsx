import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ReferenceLine, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  AGENTS, WORKSPACE_VIOLATIONS, CHART_DATA,
  getAgentHealth, getScoreColor,
  type SetRoute,
} from '@/lib/mockData'
import { CheckCircle2 } from 'lucide-react'

// ── Agent health card ─────────────────────────────────────────────────────────

function AgentHealthCard({ agent, setRoute }: { agent: typeof AGENTS[0]; setRoute: SetRoute }) {
  const health  = getAgentHealth(agent.lastScore)
  const color   = getScoreColor(agent.lastScore)
  const isReady = agent.lastScore >= 80

  return (
    <Card
      className="flex-1 min-w-[180px] cursor-pointer hover:border-primary/30 transition-all duration-150 hover:-translate-y-px"
      onClick={() => setRoute({ view: 'agent', agentId: agent.id, tab: 'profile' })}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-medium text-foreground leading-tight">{agent.name}</p>
          <div className={cn(
            'w-2 h-2 rounded-full shrink-0 mt-1',
            health === 'green' ? 'bg-safe' : health === 'amber' ? 'bg-warning' : 'bg-destructive',
            health === 'red' && 'animate-pulse',
          )} />
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-[32px] font-mono font-bold leading-none tabular-nums" style={{ color }}>
            {agent.lastScore}
          </span>
          <span className="text-xs text-muted-foreground font-mono">/ 100</span>
        </div>

        <Badge variant={isReady ? 'success' : 'destructive'} className="mb-3 text-[10px]">
          {isReady ? 'READY' : 'NOT READY'}
        </Badge>

        <p className="text-[11px] text-muted-foreground font-mono">Last session: {agent.lastSessionAt}</p>
        <p className="text-[11px] text-muted-foreground font-mono">
          {agent.sessionCount} sessions · {agent.violationCount} violation{agent.violationCount !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  )
}

// ── Score trend chart ─────────────────────────────────────────────────────────

const AGENT_LINES = [
  { key: 'email',       label: 'Email drafting',    color: '#ff2e2e', agentId: 'email-drafting'   },
  { key: 'fileManager', label: 'File manager',      color: '#48c72b', agentId: 'file-manager'     },
  { key: 'browser',     label: 'Browser research',  color: '#ffc02e', agentId: 'browser-research' },
  { key: 'calendar',    label: 'Calendar',           color: '#0088c7', agentId: 'calendar'         },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="bg-card border border-border px-3 py-2 shadow-xl text-[11px]">
      <p className="font-mono text-muted-foreground mb-1.5">Session {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="font-mono tabular-nums" style={{ color: entry.color }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function ScoreTrendChart({ setRoute }: { setRoute: SetRoute }) {
  const gridColor = 'hsl(0 0% 87%)'   // --border / grey-stroke
  const tickColor = 'hsl(0 0% 52%)'   // --muted-foreground / icon-grey

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Score trend · last 10 sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={CHART_DATA}
            margin={{ top: 10, right: 30, bottom: 0, left: -10 }}
            onClick={(data) => {
              if (data?.activeLabel) {
                setRoute({ view: 'agent', agentId: 'email-drafting', tab: 'sessions' })
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="session"
              tick={{ fill: tickColor, fontSize: 10, fontFamily: '"IBM Plex Mono", monospace' }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
              label={{ value: 'session', position: 'insideBottom', offset: -2, fill: tickColor, fontSize: 10 }}
            />
            <YAxis
              domain={[40, 100]}
              tick={{ fill: tickColor, fontSize: 10, fontFamily: '"IBM Plex Mono", monospace' }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <ReferenceLine
              y={80}
              stroke={tickColor}
              strokeDasharray="5 3"
              label={{
                value: 'threshold',
                position: 'right',
                fill: tickColor,
                fontSize: 9,
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {AGENT_LINES.map(agent => (
              <Line
                key={agent.key}
                type="monotone"
                dataKey={agent.key}
                name={agent.label}
                stroke={agent.color}
                strokeWidth={1.5}
                dot={{ r: 3, fill: agent.color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: agent.color, stroke: '#F7F7F7', strokeWidth: 2 }}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: 12, fontSize: 11, fontFamily: '"IBM Plex Mono", monospace' }}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ── Recent violations ─────────────────────────────────────────────────────────

function RecentViolations({ setRoute }: { setRoute: SetRoute }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">Recent violations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {WORKSPACE_VIOLATIONS.map((v, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setRoute({ view: 'agent', agentId: v.agentId, tab: 'sessions' })}
          >
            <div className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              v.status === 'blocked' ? 'bg-destructive' : 'bg-warning',
            )} />
            <span className="text-[11px] text-muted-foreground w-[140px] shrink-0 truncate">{v.agentName}</span>
            <span className="flex-1 text-xs text-foreground truncate">{v.action}</span>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0 hidden lg:block">{v.ruleId}</span>
            <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0 w-12 text-right">{v.timestamp}</span>
          </div>
        ))}

        {/* Calendar empty state */}
        <div className="flex items-center gap-3 px-4 py-3 text-[11px] text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-safe shrink-0" />
          <span>All agents clean in last 24h · <span className="text-muted-foreground/60">Calendar agent — 0 violations</span></span>
        </div>
      </CardContent>
    </Card>
  )
}

// ── WorkspaceDashboard ────────────────────────────────────────────────────────

export function WorkspaceDashboard({ setRoute }: { setRoute: SetRoute }) {
  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      {/* Section A: Agent health cards */}
      <section>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">Agent health</p>
        <div className="flex gap-4 flex-wrap">
          {AGENTS.map(agent => (
            <AgentHealthCard key={agent.id} agent={agent} setRoute={setRoute} />
          ))}
        </div>
      </section>

      {/* Section B: Score trends */}
      <section>
        <ScoreTrendChart setRoute={setRoute} />
      </section>

      {/* Section C: Recent violations */}
      <section>
        <RecentViolations setRoute={setRoute} />
      </section>
    </div>
  )
}

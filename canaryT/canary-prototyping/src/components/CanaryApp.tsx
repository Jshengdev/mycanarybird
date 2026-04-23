import { useState } from 'react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { AsciiHover } from '@/components/ui/AsciiHover'
import { Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { AGENTS, getAgentHealth, getScoreColor, type AppRoute, type SetRoute } from '@/lib/mockData'
import { WorkspaceDashboard } from './WorkspaceDashboard'
import { AgentDetail } from './AgentDetail'
import { SessionViewer } from './SessionViewer'

// ── Workspace header + switcher ───────────────────────────────────────────────

function WorkspaceHeader() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-2.5 px-5 h-12 hover:bg-muted transition-colors select-none">
          <span className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">
            CA
          </span>
          <span className="text-sm font-semibold text-foreground flex-1 text-left truncate">
            Workspace
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 -rotate-90" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[210px]">
        <DropdownMenuCheckboxItem checked>Photon workspace</DropdownMenuCheckboxItem>
        <DropdownMenuItem onClick={() => toast('Coming soon', { description: 'Workspace switching is not yet available.' })}>
          Personal workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast('Coming soon', { description: 'Workspace creation is not yet available.' })}>
          + New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

type SidebarProps = {
  route: AppRoute
  setRoute: SetRoute
}

function AgentRow({ agent, isActive, onClick }: {
  agent: typeof AGENTS[0]
  isActive: boolean
  onClick: () => void
}) {
  const health = getAgentHealth(agent.lastScore)
  const color  = getScoreColor(agent.lastScore)

  return (
    <AsciiHover variant="right" color="#858585">
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors',
          isActive
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <div className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
          health === 'green' ? 'bg-safe' : health === 'amber' ? 'bg-warning' : 'bg-destructive',
          health === 'red' && agent.id === 'email-drafting' && 'animate-pulse',
        )} />
        <span className="text-xs font-medium flex-1 truncate">{agent.name}</span>
        <span className="text-[10px] font-mono tabular-nums shrink-0" style={{ color }}>
          {agent.lastScore}
        </span>
      </button>
    </AsciiHover>
  )
}

function AppSidebar({ route, setRoute }: SidebarProps) {
  const activeAgentId =
    route.view === 'agent' ? route.agentId :
    route.view === 'session' ? route.agentId : null

  return (
    <div className="flex flex-col h-full bg-secondary border-r border-border w-[220px]">
      {/* Workspace header */}
      <WorkspaceHeader />
      <div className="border-b border-border" />

      {/* Agent list */}
      <ScrollArea className="flex-1 py-3">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-5 mb-3">
          Projects
        </p>
        <div className="space-y-px">
          {AGENTS.map(agent => (
            <AgentRow
              key={agent.id}
              agent={agent}
              isActive={activeAgentId === agent.id}
              onClick={() => setRoute({ view: 'agent', agentId: agent.id, tab: 'profile' })}
            />
          ))}
          <button
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border mt-2 mx-3"
            style={{ width: 'calc(100% - 24px)' }}
            onClick={() => toast('Coming soon', { description: 'Agent creation is not yet available.' })}
          >
            <span>+</span> New agent
          </button>
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="border-t border-border" />
      <button
        className="flex items-center gap-2.5 px-5 h-10 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        onClick={() => toast('Coming soon', { description: 'Settings panel is not yet available.' })}
      >
        <Settings className="w-3.5 h-3.5 shrink-0" />
        Settings
      </button>
    </div>
  )
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

type BreadcrumbSegment = { label: string; onClick?: () => void }

function AppBreadcrumb({ route, setRoute }: { route: AppRoute; setRoute: SetRoute }) {
  const segments: BreadcrumbSegment[] = []

  const toWorkspace = () => setRoute({ view: 'workspace' })
  segments.push({
    label: 'Photon workspace',
    onClick: route.view !== 'workspace' ? toWorkspace : undefined,
  })

  if (route.view === 'agent' || route.view === 'session') {
    const agentName = AGENTS.find(a => a.id === route.agentId)?.name ?? route.agentId
    const toAgent   = () => setRoute({ view: 'agent', agentId: route.agentId })

    segments.push({
      label: agentName,
      onClick: route.view === 'session' ? toAgent : undefined,
    })

    if (route.view === 'agent') {
      const tab = route.tab ?? 'sessions'
      segments.push({ label: tab === 'rulesets' ? 'Rulesets' : tab === 'profile' ? 'Profile' : 'Sessions' })
    }

    if (route.view === 'session') {
      const toSessions = () => setRoute({ view: 'agent', agentId: route.agentId, tab: 'sessions' })
      segments.push({ label: 'Sessions', onClick: toSessions })
      segments.push({ label: route.sessionId })
    }
  }

  return (
    <div className="flex items-center gap-1 px-6 h-10 border-b border-border bg-background shrink-0">
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
          {seg.onClick ? (
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={seg.onClick}
            >
              {seg.label}
            </button>
          ) : (
            <span className="text-xs text-foreground">{seg.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}

// ── CanaryApp root ────────────────────────────────────────────────────────────

export function CanaryApp() {
  const [route, setRoute] = useState<AppRoute>({ view: 'workspace' })

  const isSession = route.view === 'session'

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar — slides out on session takeover */}
      <div className={cn(
        'shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
        isSession ? 'w-0' : 'w-[220px]',
      )}>
        <AppSidebar route={route} setRoute={setRoute} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Breadcrumb */}
        <AppBreadcrumb route={route} setRoute={setRoute} />

        {/* Route views */}
        {route.view === 'workspace' && (
          <div className="flex-1 overflow-auto">
            <WorkspaceDashboard setRoute={setRoute} />
          </div>
        )}

        {route.view === 'agent' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <AgentDetail route={route} setRoute={setRoute} />
          </div>
        )}

        {route.view === 'session' && (
          <div className="flex-1 overflow-hidden">
            <SessionViewer
              sessionId={route.sessionId}
              onViewRulesets={() => setRoute({
                view: 'agent',
                agentId: route.agentId,
                tab: 'rulesets',
                initialRuleset: 'suggested',
              })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { SESSION_EVENTS } from '@/lib/session'
import { SessionTimeline } from './SessionTimeline'
import { SessionSpreadsheet } from './SessionSpreadsheet'
import { ComplianceReport } from './ComplianceReport'

type View = 'timeline' | 'spreadsheet' | 'report'

type SessionViewerProps = {
  sessionId?: string
  onViewRulesets?: () => void
}

export function SessionViewer({ sessionId: _sessionId, onViewRulesets }: SessionViewerProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentView, setCurrentView] = useState<View>('timeline')

  const events    = SESSION_EVENTS
  const blocked   = events.filter(e => e.status === 'blocked').length
  const flagged   = events.filter(e => e.status === 'flagged').length

  const views: { key: View; label: string }[] = [
    { key: 'timeline',    label: 'Timeline'    },
    { key: 'spreadsheet', label: 'Spreadsheet' },
    { key: 'report',      label: 'Report'      },
  ]

  return (
    <div className="bg-background text-foreground flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-11 border-b border-border bg-card shrink-0 z-10">
        <span className="text-[11px] font-mono text-muted-foreground">sess_01JQKM4X</span>
        <span className="text-border">·</span>
        <span className="text-[11px] text-secondary-foreground">gpt-4o-agent</span>
        <span className="text-border">·</span>
        <Badge variant="destructive" className="font-mono text-[10px] px-2 py-0.5">50/100 · NOT READY</Badge>
        <span className="text-border">·</span>
        <span className="text-[11px] font-mono text-muted-foreground">72s</span>
        <span className="text-border">·</span>
        <span className="text-[11px] font-mono text-muted-foreground">{events.length} events</span>
        <span className="text-border">·</span>
        <span className="text-[11px] font-mono text-destructive">{blocked} blocked</span>
        <span className="text-[11px] font-mono text-muted-foreground">/</span>
        <span className="text-[11px] font-mono text-warning">{flagged} flagged</span>
        <div className="ml-auto flex items-center gap-0.5 bg-secondary rounded-md p-0.5 border border-border">
          {views.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key)}
              className={cn(
                'px-3 py-1 text-[11px] font-mono rounded transition-colors',
                currentView === key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* View content */}
      {currentView === 'timeline' && (
        <div className="shrink-0">
          <SessionTimeline events={events} activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        </div>
      )}
      {currentView === 'spreadsheet' && (
        <div className="flex-1 min-h-0 flex flex-col">
          <SessionSpreadsheet events={events} activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        </div>
      )}
      {currentView === 'report' && (
        <ScrollArea className="flex-1">
          <ComplianceReport onViewRulesets={onViewRulesets} />
        </ScrollArea>
      )}
    </div>
  )
}

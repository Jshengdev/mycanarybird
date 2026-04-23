import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Search, ChevronRight, Check, X, AlertTriangle } from 'lucide-react'
import type {
  BoundaryDetail, OutcomeDetail, SequenceDetail, SequenceStep,
  TimeDetail, Rule, Event, SessionSharedProps,
} from '@/lib/session'
import { SESSION_EVENTS } from '@/lib/session'

// ── Small atoms ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Event['status'] }) {
  const cfg = {
    observed: { variant: 'secondary'    as const, label: 'Observed' },
    flagged:  { variant: 'warning'      as const, label: 'Flagged'  },
    blocked:  { variant: 'destructive'  as const, label: 'Blocked'  },
  }[status]
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

function VerdictBadge({ verdict }: { verdict: Rule['verdict'] }) {
  if (verdict === 'none') return null
  const cfg = {
    pass: { variant: 'success'     as const, icon: <Check className="w-2.5 h-2.5" />, label: 'Pass' },
    warn: { variant: 'warning'     as const, icon: <AlertTriangle className="w-2.5 h-2.5" />, label: 'Warn' },
    fail: { variant: 'destructive' as const, icon: <X className="w-2.5 h-2.5" />, label: 'Fail' },
  }[verdict]
  return <Badge variant={cfg.variant}>{cfg.icon}{cfg.label}</Badge>
}

// ── Boundary panel ────────────────────────────────────────────────────────────

function BoundaryPanel({ detail, verdict }: { detail: BoundaryDetail; verdict: Rule['verdict'] }) {
  const isViolation = verdict === 'warn' || verdict === 'fail'
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-safe/25 bg-safe/8">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider">allowed</span>
          <span className="font-mono text-xs text-safe">{detail.allowedPath}</span>
        </div>
        <span className="text-muted-foreground text-sm">→</span>
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded border',
          isViolation ? 'border-destructive/25 bg-destructive/8' : 'border-safe/25 bg-safe/8',
        )}>
          <span className={cn('text-[10px] font-mono uppercase tracking-wider', isViolation ? 'text-red-600' : 'text-emerald-600')}>actual</span>
          <span className={cn('font-mono text-xs', isViolation ? 'text-destructive' : 'text-safe')}>{detail.actualPath}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        {verdict === 'pass' && <><Check className="w-3.5 h-3.5 text-safe" /><span className="text-xs text-safe">Within allowed boundary</span></>}
        {verdict === 'warn' && <><AlertTriangle className="w-3.5 h-3.5 text-warning" /><span className="text-xs text-warning">{detail.label}</span></>}
        {verdict === 'fail' && <><X className="w-3.5 h-3.5 text-destructive" /><span className="text-xs text-destructive">Access blocked — {detail.label}</span></>}
      </div>
    </div>
  )
}

// ── Outcome panel ─────────────────────────────────────────────────────────────

function OutcomePanel({ detail, verdict: _verdict }: { detail: OutcomeDetail; verdict: Rule['verdict'] }) {
  const keys      = Object.keys(detail.expected)
  const mismatched = keys.filter(k => detail.expected[k] !== detail.actual[k])
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">What went wrong</p>
        <div className="bg-background rounded border border-border px-3 py-2.5">
          <p className="text-xs text-foreground leading-relaxed">{detail.semanticSummary}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0">Technical diff</span>
        <Separator className="flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded overflow-hidden border border-safe/20">
          <div className="bg-safe/10 px-3 py-1.5 border-b border-safe/20">
            <span className="text-[10px] font-mono text-safe uppercase tracking-wider">Expected state</span>
          </div>
          <div className="p-1.5 space-y-px">
            {keys.map(k => {
              const differs = detail.expected[k] !== detail.actual[k]
              return (
                <div key={k} className={cn('flex gap-2 px-2 py-1 rounded-sm font-mono text-xs leading-relaxed', differs ? 'bg-safe/10' : '')}>
                  {differs ? <span className="text-safe select-none shrink-0">+</span> : <span className="text-muted-foreground/50 select-none shrink-0"> </span>}
                  <span className={differs ? 'text-muted-foreground' : 'text-muted-foreground/50'}>{k}:</span>
                  <span className={differs ? 'text-safe' : 'text-muted-foreground'}>{detail.expected[k]}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded overflow-hidden border border-destructive/20">
          <div className="bg-destructive/10 px-3 py-1.5 border-b border-destructive/20">
            <span className="text-[10px] font-mono text-destructive uppercase tracking-wider">Actual state</span>
          </div>
          <div className="p-1.5 space-y-px">
            {keys.map(k => {
              const differs = detail.expected[k] !== detail.actual[k]
              return (
                <div key={k} className={cn('flex gap-2 px-2 py-1 rounded-sm font-mono text-xs leading-relaxed', differs ? 'bg-destructive/10' : '')}>
                  {differs ? <span className="text-destructive select-none shrink-0">−</span> : <span className="text-muted-foreground/50 select-none shrink-0"> </span>}
                  <span className={differs ? 'text-muted-foreground' : 'text-muted-foreground/50'}>{k}:</span>
                  <span className={differs ? 'text-destructive' : 'text-muted-foreground'}>{detail.actual[k]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Badge variant="destructive"><X className="w-2.5 h-2.5" />Fail</Badge>
        <span className="text-xs text-destructive/80">
          {mismatched.length} field{mismatched.length !== 1 ? 's' : ''} mismatched · {mismatched.join(', ')}
        </span>
      </div>
    </div>
  )
}

// ── Sequence maze SVG ─────────────────────────────────────────────────────────

function SequenceMaze({ steps, shortcutFrom, shortcutTo }: {
  steps: SequenceStep[]
  shortcutFrom: string
  shortcutTo: string
}) {
  const n = steps.length
  const nodeW = 112, nodeH = 28, rx = 4
  const svgW = 620
  const hGap = (svgW - n * nodeW) / (n + 1)
  const topY = 28, botY = 108, arcY = 168, svgH = 198

  const nx  = (i: number) => hGap + i * (nodeW + hGap)
  const ncx = (i: number) => nx(i) + nodeW / 2

  const fromIdx = steps.findIndex(s => s.id === shortcutFrom)
  const toIdx   = steps.findIndex(s => s.id === shortcutTo)

  const skippedBetween = steps.slice(fromIdx + 1, toIdx).filter(s => s.actualStatus === 'skipped')
  const arcLabel = skippedBetween.length > 0 ? `${skippedBetween[0].label} skipped` : 'step skipped'

  const bottomStyle = (step: SequenceStep) => {
    switch (step.actualStatus) {
      case 'completed':  return { fill: '#1a2e1a', stroke: '#4a7c4a', text: '#6db86d', opacity: 1,    strike: false }
      case 'skipped':    return { fill: '#2e1a1a', stroke: '#7c4a4a', text: '#b86d6d', opacity: 0.55, strike: true  }
      case 'wrong-path': return { fill: '#2a2010', stroke: '#8a6020', text: '#c8922a', opacity: 1,    strike: false }
    }
  }

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <defs>
        <marker id="arr-g2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L6,3 z" fill="#4a7c4a" />
        </marker>
        <marker id="arr-r2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0.5 L0,5.5 L6,3 z" fill="#b86d6d" />
        </marker>
      </defs>
      <text x={nx(0)} y={topY - 10} fontSize="9" fill="#4a5568">Expected path</text>
      {steps.map((step, i) => (
        <g key={`t${step.id}`}>
          <rect x={nx(i)} y={topY} width={nodeW} height={nodeH} rx={rx} fill="#1a2e1a" stroke="#4a7c4a" strokeWidth="1.5" />
          <text x={ncx(i)} y={topY + nodeH / 2 + 4} textAnchor="middle" fontSize="9" fill="#6db86d">{step.label}</text>
          {i < n - 1 && <line x1={nx(i) + nodeW + 2} y1={topY + nodeH / 2} x2={nx(i + 1) - 4} y2={topY + nodeH / 2} stroke="#4a7c4a" strokeWidth="1.5" markerEnd="url(#arr-g2)" />}
        </g>
      ))}
      {steps.map((step, i) => (
        <line key={`v${step.id}`} x1={ncx(i)} y1={topY + nodeH + 4} x2={ncx(i)} y2={botY - 4} stroke="#4a7c4a" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
      ))}
      <text x={nx(0)} y={botY - 10} fontSize="9" fill="#4a5568">Actual path</text>
      {steps.map((step, i) => {
        const s = bottomStyle(step)
        const showArrow = i < n - 1 && step.actualStatus === 'completed' && steps[i + 1].actualStatus === 'completed'
        return (
          <g key={`b${step.id}`} opacity={s.opacity}>
            <rect x={nx(i)} y={botY} width={nodeW} height={nodeH} rx={rx} fill={s.fill} stroke={s.stroke} strokeWidth="1.5" />
            <text x={ncx(i)} y={botY + nodeH / 2 + 4} textAnchor="middle" fontSize="9" fill={s.text}>{step.label}</text>
            {s.strike && <line x1={nx(i) + 10} y1={botY + nodeH / 2} x2={nx(i) + nodeW - 10} y2={botY + nodeH / 2} stroke={s.stroke} strokeWidth="1.5" />}
            {showArrow && <line x1={nx(i) + nodeW + 2} y1={botY + nodeH / 2} x2={nx(i + 1) - 4} y2={botY + nodeH / 2} stroke="#4a7c4a" strokeWidth="1.5" markerEnd="url(#arr-g2)" />}
          </g>
        )
      })}
      {fromIdx >= 0 && toIdx >= 0 && (() => {
        const x1 = ncx(fromIdx), x2 = ncx(toIdx)
        const y0 = botY + nodeH
        const lx = (x1 + x2) / 2
        const lw = arcLabel.length * 6 + 16
        return (
          <g>
            <path d={`M ${x1},${y0} C ${x1},${arcY} ${x2},${arcY} ${x2},${y0}`} fill="none" stroke="#7c4a4a" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arr-r2)" />
            <rect x={lx - lw / 2} y={arcY - 6} width={lw} height={16} rx={3} fill="#1a0f0f" stroke="#7c4a4a" strokeWidth="1" />
            <text x={lx} y={arcY + 6} textAnchor="middle" fontSize="8.5" fill="#b86d6d">{arcLabel}</text>
          </g>
        )
      })()}
    </svg>
  )
}

// ── Sequence panel ────────────────────────────────────────────────────────────

function SequencePanel({ detail, verdict }: { detail: SequenceDetail; verdict: Rule['verdict'] }) {
  const skipped      = detail.steps.find(s => s.actualStatus === 'skipped')
  const completedCnt = detail.steps.filter(s => s.actualStatus === 'completed').length
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">What went wrong</p>
        <div className="bg-background rounded border border-border px-3 py-2.5">
          <p className="text-xs text-foreground leading-relaxed">{detail.semanticSummary}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0">Path diff</span>
        <Separator className="flex-1" />
      </div>
      <div className="bg-background rounded border border-border p-4">
        <SequenceMaze steps={detail.steps} shortcutFrom={detail.shortcutFrom} shortcutTo={detail.shortcutTo} />
        <div className="flex items-center gap-5 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: '#1a2e1a', border: '1.5px solid #4a7c4a' }} /><span className="text-[10px] font-mono text-muted-foreground">completed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm opacity-55" style={{ background: '#2e1a1a', border: '1.5px solid #7c4a4a' }} /><span className="text-[10px] font-mono text-muted-foreground">skipped</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: '#2a2010', border: '1.5px solid #8a6020' }} /><span className="text-[10px] font-mono text-muted-foreground">wrong-path</span></div>
          <div className="flex items-center gap-1.5"><svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#7c4a4a" strokeWidth="1.5" strokeDasharray="4 2" /></svg><span className="text-[10px] font-mono text-muted-foreground">shortcut taken</span></div>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border flex-wrap">
        <Badge variant="destructive"><X className="w-2.5 h-2.5" />Fail</Badge>
        <span className="text-xs text-destructive/80">
          {skipped?.label ?? 'step'} skipped · agent took direct path {detail.shortcutFrom} → {detail.shortcutTo} · {completedCnt} of {detail.steps.length} required steps completed
        </span>
      </div>
    </div>
  )
}

// ── Time panel ────────────────────────────────────────────────────────────────

function fmtMs(ms: number) {
  return ms >= 60000 ? `${(ms / 60000).toFixed(1)}m` : `${(ms / 1000).toFixed(1)}s`
}

function TimePanel({ detail }: { detail: TimeDetail }) {
  const maxMs       = detail.thresholdMs * 3
  const threshPct   = (detail.thresholdMs / maxMs) * 100
  const overBy      = detail.actualMs - detail.thresholdMs
  const bars = [
    { label: 'Total duration', value: detail.actualMs,            fillPct: Math.min((detail.actualMs / maxMs) * 100, 100),            barColor: 'bg-destructive',     textColor: 'text-destructive',     showThreshold: true  },
    { label: 'First action',   value: detail.timeToFirstActionMs, fillPct: Math.min((detail.timeToFirstActionMs / maxMs) * 100, 100), barColor: 'bg-safe', textColor: 'text-safe', showThreshold: false },
    { label: 'Longest pause',  value: detail.longestPauseMs,      fillPct: Math.min((detail.longestPauseMs / maxMs) * 100, 100),      barColor: 'bg-warning',   textColor: 'text-warning',   showThreshold: false },
  ]
  return (
    <div className="space-y-5">
      <div className="space-y-4 pt-3">
        {bars.map(bar => (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground w-[84px] shrink-0 text-right leading-none">{bar.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-card relative">
              <div className={cn('h-full rounded-full', bar.barColor)} style={{ width: `${bar.fillPct}%` }} />
              {bar.showThreshold && (
                <>
                  <div className="absolute w-[1.5px] bg-primary" style={{ left: `${threshPct}%`, top: '-5px', bottom: '-5px' }} />
                  <div className="absolute text-[9px] font-mono text-muted-foreground -translate-x-1/2 whitespace-nowrap" style={{ left: `${threshPct}%`, top: '-18px' }}>
                    {fmtMs(detail.thresholdMs)} limit
                  </div>
                </>
              )}
            </div>
            <span className={cn('text-[11px] font-mono w-10 shrink-0 text-right', bar.textColor)}>{fmtMs(bar.value)}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Threshold', value: fmtMs(detail.thresholdMs), color: 'text-secondary-foreground' },
          { label: 'Actual',    value: fmtMs(detail.actualMs),    color: 'text-destructive'  },
          { label: 'Over by',   value: `+${fmtMs(overBy)}`,       color: 'text-destructive'  },
        ].map(stat => (
          <div key={stat.label} className="bg-background rounded border border-border p-3 text-center">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={cn('text-sm font-mono font-medium', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Badge variant="warning"><AlertTriangle className="w-2.5 h-2.5" />Warn</Badge>
        <span className="text-xs text-warning/80">Exceeded {fmtMs(detail.thresholdMs)} threshold by {fmtMs(overBy)} · longest pause {fmtMs(detail.longestPauseMs)}</span>
      </div>
    </div>
  )
}

// ── Expand panel ──────────────────────────────────────────────────────────────

function ExpandPanel({ rule }: { rule: Rule }) {
  const typeLabel = { boundary: 'Boundary check', outcome: 'Outcome evaluation', sequence: 'Sequence check', time: 'Time analysis' }[rule.type]
  return (
    <div className="px-4 py-4 bg-[#09090b] border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{typeLabel}</span>
        <span className="text-border">·</span>
        <span className="text-[10px] font-mono text-muted-foreground/50">{rule.id}</span>
        {rule.type === 'outcome' && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground border border-border/60 rounded-sm px-1.5 py-0.5">✦ AI evaluated</span>
        )}
      </div>
      {!rule.detail && <p className="text-xs font-mono text-muted-foreground/50">No rule evaluation — event was not matched to an active rule.</p>}
      {rule.type === 'boundary' && rule.detail && <BoundaryPanel detail={rule.detail as BoundaryDetail} verdict={rule.verdict} />}
      {rule.type === 'outcome'  && rule.detail && <OutcomePanel  detail={rule.detail as OutcomeDetail}  verdict={rule.verdict} />}
      {rule.type === 'sequence' && rule.detail && <SequencePanel detail={rule.detail as SequenceDetail} verdict={rule.verdict} />}
      {rule.type === 'time'     && rule.detail && <TimePanel     detail={rule.detail as TimeDetail} />}
    </div>
  )
}

// ── Event row ─────────────────────────────────────────────────────────────────

function EventRow({ event, expanded, isActive, onClick, rowRef }: {
  event: Event
  expanded: boolean
  isActive: boolean
  onClick: () => void
  rowRef?: (el: HTMLDivElement | null) => void
}) {
  const leftBorder = { observed: '', flagged: 'border-l-2 border-l-amber-500', blocked: 'border-l-2 border-l-red-500' }[event.status]
  const rowBg      = { observed: '', flagged: '', blocked: 'bg-destructive/[0.03]' }[event.status]

  return (
    <div className={cn('border-b border-border', leftBorder)} ref={rowRef}>
      <div
        className={cn(
          'flex items-center cursor-pointer select-none transition-colors duration-100',
          rowBg,
          isActive && !expanded ? 'bg-primary/8' : '',
          expanded ? 'bg-secondary/80' : 'hover:bg-muted/50',
        )}
        onClick={onClick}
      >
        {/* Active indicator */}
        <div className={cn('w-0.5 self-stretch shrink-0', isActive ? 'bg-primary' : '')} />

        {/* # */}
        <div className="w-9 shrink-0 pl-2 pr-2 py-2.5 text-[11px] font-mono text-muted-foreground/50 text-right tabular-nums">{event.n}</div>
        {/* Time */}
        <div className="w-[76px] shrink-0 px-2 py-2.5 text-[11px] font-mono text-muted-foreground tabular-nums">{event.time}</div>
        {/* Status */}
        <div className="w-[88px] shrink-0 px-2 py-2.5"><StatusBadge status={event.status} /></div>
        {/* Action */}
        <div className="flex-1 min-w-0 px-2 py-2.5">
          <div className="text-xs text-foreground truncate">{event.action}</div>
          <div className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">{event.target}</div>
        </div>
        {/* Rule eval */}
        <div className="w-[200px] shrink-0 px-2 py-2.5 flex items-center gap-2 min-w-0">
          {event.rule.id !== '—'
            ? <span className="text-[10px] font-mono text-muted-foreground truncate flex-1 min-w-0">{event.rule.id}</span>
            : <span className="text-[10px] font-mono text-border flex-1">—</span>}
          {event.rule.verdict !== 'none' && <VerdictBadge verdict={event.rule.verdict} />}
        </div>
        {/* Chevron */}
        <div className="w-8 shrink-0 flex items-center justify-center py-2.5">
          <ChevronRight className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-150', expanded && 'rotate-90')} />
        </div>
      </div>
      {/* Expand panel */}
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}>
        <div className="overflow-hidden"><ExpandPanel rule={event.rule} /></div>
      </div>
    </div>
  )
}

// ── SessionSpreadsheet ────────────────────────────────────────────────────────

type SpreadsheetProps = Partial<SessionSharedProps>

export function SessionSpreadsheet({
  events       = SESSION_EVENTS,
  activeIndex  = -1,
  onActiveChange,
}: SpreadsheetProps = {}) {
  const [filter,   setFilter]   = useState<'all' | 'violations' | 'safe'>('all')
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  const rowRefs        = useRef<(HTMLDivElement | null)[]>([])
  const scrollRef      = useRef<HTMLDivElement>(null)

  // Auto-scroll to active row when activeIndex changes from parent
  useEffect(() => {
    const container = scrollRef.current
    const row       = rowRefs.current[activeIndex]
    if (!container || !row || activeIndex < 0) return

    const cRect = container.getBoundingClientRect()
    const rRect = row.getBoundingClientRect()

    if (rRect.top < cRect.top) {
      container.scrollTop -= cRect.top - rRect.top + 8
    } else if (rRect.bottom > cRect.bottom) {
      container.scrollTop += rRect.bottom - cRect.bottom + 8
    }
  }, [activeIndex])

  const violationCount = events.filter(e => e.status !== 'observed').length
  const safeCount      = events.filter(e => e.status === 'observed').length

  const filtered = events.filter(e => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'violations' && e.status !== 'observed') ||
      (filter === 'safe' && e.status === 'observed')
    const matchSearch = !search || e.action.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const handleRowClick = (event: Event, idx: number) => {
    setExpanded(prev => prev === event.n ? null : event.n)
    onActiveChange?.(idx)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Session header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/60">
        <span className="text-xs font-mono text-muted-foreground">session</span>
        <span className="text-xs font-mono text-foreground">sess_01JQKM4X</span>
        <span className="text-border">·</span>
        <span className="text-xs font-mono text-muted-foreground">gmail compose · email task</span>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="destructive">3 blocked</Badge>
          <Badge variant="warning">2 flagged</Badge>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center gap-0.5">
          {([
            { key: 'all',        label: `All (${events.length})`        },
            { key: 'violations', label: `Violations (${violationCount})` },
            { key: 'safe',       label: `Safe (${safeCount})`            },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} className={cn(
              'px-3 py-1.5 text-[11px] font-mono rounded-sm transition-colors',
              filter === key ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}>{label}</button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions…" className="pl-7 h-7 w-48 text-[11px] font-mono bg-secondary border-border placeholder:text-muted-foreground/50 focus-visible:ring-muted-foreground" />
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center border-b border-border bg-card shrink-0">
        <div className="w-0.5 shrink-0" />
        <div className="w-9 shrink-0 pl-2 pr-2 py-2 text-[10px] font-mono text-muted-foreground/50 text-right">#</div>
        <div className="w-[76px] shrink-0 px-2 py-2 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Time</div>
        <div className="w-[88px] shrink-0 px-2 py-2 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Status</div>
        <div className="flex-1 px-2 py-2 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Action</div>
        <div className="w-[200px] shrink-0 px-2 py-2 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Rule evaluation</div>
        <div className="w-8 shrink-0" />
      </div>

      {/* Rows */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
        {filtered.length > 0 ? filtered.map(event => {
          const idx = events.indexOf(event)
          return (
            <EventRow
              key={event.n}
              event={event}
              expanded={expanded === event.n}
              isActive={idx === activeIndex}
              onClick={() => handleRowClick(event, idx)}
              rowRef={el => { rowRefs.current[idx] = el }}
            />
          )
        }) : (
          <div className="py-12 text-center text-xs font-mono text-muted-foreground/50">No events match.</div>
        )}
      </div>
    </div>
  )
}

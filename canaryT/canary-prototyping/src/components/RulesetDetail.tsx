import { useState, useRef, useMemo } from 'react'
import {
  Search, Upload, Download, Play, Plus, RefreshCw,
  Pencil, EyeOff, Eye, Copy, Shield, CheckSquare,
  GitBranch, Clock, Sparkles, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  EMAIL_SAFETY_RULESET,
  RULESET_RULES,
  type RulesetDetail as RulesetDetailType,
  type RulesetRule,
} from '@/lib/mockData'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number, thresholds: [number, number] = [80, 70]) {
  if (score >= thresholds[0]) return 'text-safe'
  if (score >= thresholds[1]) return 'text-warning'
  return 'text-destructive'
}

function scoreBg(score: number, thresholds: [number, number] = [80, 70]) {
  if (score >= thresholds[0]) return 'bg-safe'
  if (score >= thresholds[1]) return 'bg-warning'
  return 'bg-destructive'
}

const ruleTypeLabel: Record<RulesetRule['type'], string> = {
  boundary: 'Boundary',
  outcome: '✦ Outcome',
  sequence: 'Sequence',
  time: 'Time-based',
}

const ruleTypeIcon: Record<RulesetRule['type'], typeof Shield> = {
  boundary: Shield,
  outcome: CheckSquare,
  sequence: GitBranch,
  time: Clock,
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  subtext,
  colorClass,
  subtextColor,
  onClick,
}: {
  label: string
  value: string | number
  subtext: string
  colorClass?: string
  subtextColor?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-secondary rounded-md p-4 text-left transition-colors hover:bg-card"
    >
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={cn('text-[20px] font-mono font-medium', colorClass ?? 'text-foreground')}>
        {value}
      </p>
      <p className={cn('text-[10px] mt-0.5', subtextColor ?? 'text-muted-foreground')}>
        {subtext}
      </p>
    </button>
  )
}

// ─── Mini Sparkline ──────────────────────────────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  const maxH = 14
  return (
    <div className="flex items-end gap-[2px]" style={{ height: maxH }}>
      {data.map((v, i) => {
        const h = Math.max(2, v * maxH)
        const color = v >= 0.75 ? 'bg-safe' : v > 0 ? 'bg-destructive' : 'bg-muted'
        return <div key={i} className={cn('w-[3px] rounded-sm', color)} style={{ height: h }} />
      })}
    </div>
  )
}

// ─── Pass Rate Bar ───────────────────────────────────────────────────────────

function PassRateBar({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-[60px] h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            rate >= 90 ? 'bg-safe' : rate >= 75 ? 'bg-warning' : 'bg-destructive',
          )}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className={cn(
        'text-[11px] font-mono',
        rate >= 90 ? 'text-safe' : rate >= 75 ? 'text-warning' : 'text-destructive',
      )}>
        {rate}%
      </span>
    </div>
  )
}

// ─── Trend Pill ──────────────────────────────────────────────────────────────

function TrendPill({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up')
    return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">↑ trending</span>
  if (trend === 'down')
    return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-safe/10 text-safe border border-safe/20">↓ improving</span>
  return <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-card text-muted-foreground border border-border">→ stable</span>
}

// ─── Rule Card (detailed) ────────────────────────────────────────────────────

function DetailRuleCard({
  rule,
  onEdit,
  onToggle,
}: {
  rule: RulesetRule
  onEdit: () => void
  onToggle: () => void
}) {
  const Icon = ruleTypeIcon[rule.type]
  const isDisabled = rule.status === 'disabled'
  const isOrphaned = rule.status === 'orphaned'

  return (
    <div
      className={cn(
        'group relative rounded-md border border-border/60 transition-all duration-150',
        'hover:border-border',
        rule.isHotRule && 'border-l-[2.5px] border-l-red-500',
        isOrphaned && 'border-l-[2.5px] border-l-amber-500',
        isDisabled && 'opacity-50',
      )}
      style={{ padding: '10px 13px' }}
    >
      {/* Top row */}
      <div className="flex items-center gap-[7px]">
        {/* Type badge */}
        <span className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-mono bg-secondary text-muted-foreground border border-border/60">
          <Icon className="h-2.5 w-2.5" />
          {ruleTypeLabel[rule.type]}
          {rule.type === 'outcome' && <Sparkles className="h-2.5 w-2.5 text-blue-400" />}
        </span>

        {/* Name */}
        <span className="text-[13px] font-medium text-foreground flex-1 truncate">
          {rule.name}
        </span>

        {/* Status tags */}
        <div className="flex items-center gap-1.5">
          {rule.isHotRule && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              Most violations
            </span>
          )}
          {rule.lastFired === 'never' && rule.status !== 'disabled' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-card text-muted-foreground border border-border">
              Never triggered
            </span>
          )}
          {isOrphaned && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
              Object not found
            </span>
          )}
          {rule.hasConflict && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full text-destructive border border-destructive/30">
              ⚠ Conflict
            </span>
          )}
          {rule.trend && rule.status === 'active' && <TrendPill trend={rule.trend} />}
        </div>

        {/* Severity */}
        {isDisabled ? (
          <Badge variant="info">Disabled</Badge>
        ) : (
          <span className={cn(
            'inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider border',
            rule.severity === 'critical' && 'border-destructive/40 bg-destructive/10 text-destructive',
            rule.severity === 'warning' && 'border-warning/40 bg-warning/10 text-warning',
            rule.severity === 'info' && 'border-border bg-card text-muted-foreground',
          )}>
            {rule.severity}
          </span>
        )}
      </div>

      {/* Stats row */}
      {!isDisabled && (
        <div className="flex items-center gap-2.5 mt-2 text-[11px] text-muted-foreground">
          <span>
            Last fired: <span className="text-secondary-foreground">{rule.lastFired}</span>
          </span>
          <span className="text-muted-foreground/50">·</span>
          <PassRateBar rate={rule.passRate} />
          <span className="text-muted-foreground/50">·</span>
          {/* Contextual stat */}
          {rule.type === 'boundary' && rule.firedThisSession !== undefined && (
            <span>Fired {rule.firedThisSession}x this session</span>
          )}
          {rule.type === 'outcome' && (
            <span className="flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-blue-400" /> AI evaluated
            </span>
          )}
          {rule.type === 'sequence' && rule.stepsRequired && (
            <span>{rule.stepsRequired} steps required</span>
          )}
          {rule.type === 'time' && rule.avgDuration && (
            <span>Avg duration: {rule.avgDuration}</span>
          )}
          {rule.type === 'boundary' && rule.firedThisSession === undefined && (
            <span>—</span>
          )}
          <div className="flex-1" />
          <Sparkline data={rule.sparkline} />
        </div>
      )}

      {/* Orphan warning */}
      {isOrphaned && rule.orphanReason && (
        <p className="text-[10px] text-warning/70 mt-1.5">
          {rule.orphanReason} — rule may not evaluate correctly
        </p>
      )}

      {/* Hover actions */}
      <div className={cn(
        'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity duration-150',
        isDisabled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      )}>
        {!isDisabled && (
          <>
            <Button
              variant="ghost" size="sm"
              onClick={onEdit}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost" size="sm"
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <Copy className="h-3 w-3 mr-1" /> Duplicate
            </Button>
          </>
        )}
        <Button
          variant="ghost" size="sm"
          onClick={onToggle}
          className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-card"
        >
          {isDisabled ? (
            <><Eye className="h-3 w-3 mr-1" /> Enable</>
          ) : (
            <><EyeOff className="h-3 w-3 mr-1" /> Disable</>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

type RulesetDetailProps = {
  rulesetId: string
  onNewRule: () => void
  onNavigateToSuggested: () => void
}

export function RulesetDetail({ rulesetId: _rulesetId, onNewRule, onNavigateToSuggested }: RulesetDetailProps) {
  const ruleset = EMAIL_SAFETY_RULESET
  const allRules = RULESET_RULES

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'flagging' | 'disabled'>('all')
  const [sortBy, setSortBy] = useState('violations')
  const [description, setDescription] = useState(ruleset.description)
  const [editingDesc, setEditingDesc] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('rules')
  const rulesRef = useRef<HTMLDivElement>(null)

  // Derive filter counts
  const counts = useMemo(() => {
    const active = allRules.filter(r => r.status === 'active').length
    const flagging = allRules.filter(r => r.status === 'active' && (r.isHotRule || r.hasConflict || r.passRate < 90)).length
    const disabled = allRules.filter(r => r.status === 'disabled').length
    return { all: allRules.length, active, flagging, disabled }
  }, [allRules])

  // Filter + search + sort
  const filteredRules = useMemo(() => {
    let rules = [...allRules]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      rules = rules.filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    }

    // Filter
    if (filterStatus === 'active') rules = rules.filter(r => r.status === 'active')
    else if (filterStatus === 'flagging') rules = rules.filter(r => r.status === 'active' && (r.isHotRule || r.hasConflict || r.passRate < 90))
    else if (filterStatus === 'disabled') rules = rules.filter(r => r.status === 'disabled')

    // Sort
    rules.sort((a, b) => {
      switch (sortBy) {
        case 'violations': return (b.isHotRule ? 1 : 0) - (a.isHotRule ? 1 : 0) || a.passRate - b.passRate
        case 'pass-asc': return a.passRate - b.passRate
        case 'pass-desc': return b.passRate - a.passRate
        case 'last-fired': return a.lastFired === 'never' ? 1 : b.lastFired === 'never' ? -1 : 0
        case 'type': return a.type.localeCompare(b.type)
        default: return 0
      }
    })

    return rules
  }, [allRules, searchQuery, filterStatus, sortBy])

  const handleImport = () => {
    setImportOpen(false)
    toast.success(`Rules imported into ${ruleset.name}`)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── ZONE 1: HEADER ─────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground mb-2">
          <button className="hover:text-foreground transition-colors">Workspace</button>
          <span className="text-muted-foreground/50">›</span>
          <button className="hover:text-foreground transition-colors">Agent</button>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-secondary-foreground">{ruleset.name}</span>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-medium text-foreground">{ruleset.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="outline">Agent-level</Badge>
              {ruleset.source === 'template' && (
                <Badge variant="outline">From template</Badge>
              )}
              <span className="text-[11px] text-muted-foreground">
                Last evaluated {ruleset.lastEvaluated}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-[11px]">
              <Upload className="h-3 w-3" /> Import YAML
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-[11px]">
              <Download className="h-3 w-3" /> Export YAML
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-[11px]">
              <Play className="h-3 w-3" /> Test ruleset
            </Button>
            <Button size="sm" className="gap-1.5 text-[11px]" onClick={onNewRule}>
              <Plus className="h-3 w-3" /> New rule
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-2.5">
          {editingDesc ? (
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={() => setEditingDesc(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingDesc(false)}
              autoFocus
              className="text-[13px] h-8 bg-transparent"
            />
          ) : (
            <button
              onClick={() => setEditingDesc(true)}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              {description || 'Add a description...'}
            </button>
          )}
        </div>
      </div>

      {/* ── ZONE 2: STAT CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-3 px-5 py-4 flex-shrink-0">
        <StatCard
          label="Ruleset score"
          value={ruleset.stats.score}
          colorClass={scoreColor(ruleset.stats.score)}
          subtext={ruleset.stats.score >= 80 ? 'DEPLOYMENT READY' : 'NOT READY'}
          subtextColor={ruleset.stats.score >= 80 ? 'text-safe' : 'text-destructive'}
          onClick={() => rulesRef.current?.scrollIntoView({ behavior: 'smooth' })}
        />
        <StatCard
          label="Pass rate"
          value={`${ruleset.stats.passRate}%`}
          colorClass={scoreColor(ruleset.stats.passRate, [90, 75])}
          subtext={`across ${ruleset.stats.sessionsRun} sessions`}
        />
        <StatCard
          label="Sessions run"
          value={ruleset.stats.sessionsRun}
          subtext={`${ruleset.stats.rulesEvaluated}/${ruleset.stats.totalRules} rules evaluated`}
        />
        <StatCard
          label="Violations"
          value={ruleset.stats.violations}
          colorClass={ruleset.stats.violations > 0 ? 'text-destructive' : 'text-safe'}
          subtext="BLOCKED events"
        />
        <StatCard
          label="Flags"
          value={ruleset.stats.flags}
          colorClass={ruleset.stats.flags > 0 ? 'text-warning' : 'text-safe'}
          subtext="FLAGGED events"
        />
      </div>

      {/* ── ZONE 3: META BAR ───────────────────────────────────────────────── */}
      <div className="bg-secondary border-b border-border px-5 py-2 flex items-center gap-4 text-[11px] flex-shrink-0">
        {ruleset.conflicts === 0 && ruleset.orphaned === 0 && ruleset.neverTriggered === 0 ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-safe" />
            <span className="text-safe">All rules healthy</span>
          </div>
        ) : (
          <>
            {ruleset.conflicts > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                <span className="text-secondary-foreground">{ruleset.conflicts} conflict detected</span>
                <button
                  className="text-destructive hover:text-red-300 transition-colors"
                  onClick={() => setActiveTab('conflicts')}
                >
                  View →
                </button>
              </div>
            )}
            {ruleset.conflicts > 0 && (ruleset.neverTriggered > 0 || ruleset.orphaned > 0) && (
              <div className="w-px h-3 bg-muted" />
            )}
            {ruleset.neverTriggered > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-secondary-foreground">{ruleset.neverTriggered} rules never triggered</span>
              </div>
            )}
            {ruleset.neverTriggered > 0 && ruleset.orphaned > 0 && (
              <div className="w-px h-3 bg-muted" />
            )}
            {ruleset.orphaned > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                <span className="text-secondary-foreground">{ruleset.orphaned} rule orphaned</span>
                <button className="text-warning hover:text-amber-300 transition-colors">
                  Fix →
                </button>
              </div>
            )}
          </>
        )}
        <div className="flex-1" />
        <span className="text-muted-foreground">
          Evaluated in {ruleset.stats.sessionsRun} of {ruleset.stats.totalSessions} sessions
        </span>
      </div>

      {/* ── ZONE 4: SUGGESTION NUDGE ───────────────────────────────────────── */}
      {ruleset.pendingSuggestions > 0 && (
        <div className="mx-5 mt-3 flex items-center gap-3 rounded-md border border-warning/30 bg-warning/5 px-3 py-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="h-3.5 w-3.5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-warning">
              {ruleset.pendingSuggestions} suggestion for this ruleset
            </p>
            <p className="text-[11px] text-muted-foreground">
              Canary found a new pattern from{' '}
              <span className="text-secondary-foreground">{ruleset.pendingSuggestionSession}</span> —{' '}
              <span className="font-mono text-secondary-foreground">{ruleset.pendingSuggestionName}</span>
            </p>
          </div>
          <Button
            variant="ghost" size="sm"
            className="text-[11px] text-warning border border-warning/30 hover:bg-warning/10 hover:text-amber-300 h-7 px-2.5"
            onClick={onNavigateToSuggested}
          >
            View in Suggested →
          </Button>
        </div>
      )}

      {/* ── ZONE 5: TABS ──────────────────────────────────────────────────── */}
      <div className="px-5 pt-3 flex-shrink-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="rules">Rules ({allRules.length})</TabsTrigger>
            <TabsTrigger value="conflicts" className="gap-1.5">
              Conflicts
              {ruleset.conflicts > 0 && (
                <span className="text-[9px] bg-destructive/20 text-destructive rounded px-1 py-px">
                  {ruleset.conflicts}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ── Scrollable content area ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'rules' && (
          <>
            {/* ── ZONE 6: TOOLBAR ──────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border sticky top-0 bg-background z-10">
              <div className="relative flex-shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-[200px] text-[12px] bg-transparent"
                />
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1">
                {([
                  ['all', `All (${counts.all})`],
                  ['active', `Active (${counts.active})`],
                  ['flagging', `Flagging (${counts.flagging})`],
                  ['disabled', `Disabled (${counts.disabled})`],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key)}
                    className={cn(
                      'px-2.5 py-1 rounded-sm text-[11px] font-mono transition-colors',
                      filterStatus === key
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 w-[160px] text-[11px] bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="violations">Most violations</SelectItem>
                  <SelectItem value="pass-asc">Pass rate ↑</SelectItem>
                  <SelectItem value="pass-desc">Pass rate ↓</SelectItem>
                  <SelectItem value="last-fired">Last fired</SelectItem>
                  <SelectItem value="type">Rule type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ── ZONE 7: RULE CARDS LIST ─────────────────────────────────── */}
            <div ref={rulesRef} className="px-5 py-3 space-y-1.5">
              {filteredRules.map((rule, i) => (
                <div
                  key={rule.id}
                  className="animate-in"
                  style={{ animationDelay: `${i * 30}ms`, animationDuration: '0.3s' }}
                >
                  <DetailRuleCard
                    rule={rule}
                    onEdit={onNewRule}
                    onToggle={() => toast(`Rule ${rule.status === 'disabled' ? 'enabled' : 'disabled'}`)}
                  />
                </div>
              ))}
              {filteredRules.length === 0 && (
                <p className="text-center text-[13px] text-muted-foreground py-12">
                  No rules match your search.
                </p>
              )}
            </div>
          </>
        )}

        {activeTab === 'conflicts' && (
          <div className="px-5 py-6">
            {ruleset.conflicts > 0 ? (
              <div className="space-y-3">
                <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-[13px] font-medium text-destructive">Rule conflict detected</span>
                  </div>
                  <p className="text-[12px] text-secondary-foreground mb-3">
                    <span className="font-mono text-foreground">outcome:correct_recipient</span> conflicts with
                    the boundary rule on external domains. When a message is flagged by the boundary rule,
                    the outcome check may not fire.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-[11px] h-7">
                      Resolve conflict
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[11px] h-7 text-muted-foreground">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-[13px] text-muted-foreground py-12">No conflicts detected.</p>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="px-5 py-6">
            <p className="text-[13px] text-muted-foreground">
              This ruleset was created from the <span className="text-foreground font-medium">{ruleset.templateName}</span> template.
            </p>
          </div>
        )}
      </div>

      {/* ── ZONE 8: FOOTER ROW ─────────────────────────────────────────────── */}
      <div className="border-t border-border px-5 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground flex-shrink-0">
        <span>
          {filteredRules.length} rules shown · {ruleset.stats.rulesEvaluated}/{ruleset.stats.totalRules} rules evaluated across {ruleset.stats.sessionsRun} sessions
        </span>
        <Button
          variant="ghost" size="sm"
          className="text-[11px] text-muted-foreground hover:text-foreground h-7"
          onClick={() => setImportOpen(true)}
        >
          Import from YAML
        </Button>
      </div>

      {/* ── Import Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Import rules from YAML</DialogTitle>
            <DialogDescription>
              Upload a .yaml or .yml file to import rules into {ruleset.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Input type="file" accept=".yaml,.yml" className="text-[12px]" />
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleImport}>
              Import rules
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

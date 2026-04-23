import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SUGGESTION_DATA, type Suggestion } from '@/lib/mockData'

const RULESETS = ['Email Safety', 'Attachment Rules']

// ── Suggestion card ───────────────────────────────────────────────────────────

function SuggestionCard({
  suggestion,
  checked,
  onCheckedChange,
  accepted,
  acceptedTo,
  onAdd,
}: {
  suggestion: Suggestion
  checked: boolean
  onCheckedChange: (v: boolean) => void
  accepted: boolean
  acceptedTo: string
  onAdd: (ruleset: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [targetRuleset, setTargetRuleset] = useState(RULESETS[0])

  return (
    <div className={cn(
      'rounded-md border transition-opacity duration-500',
      accepted ? 'border-border opacity-50' : 'border-border bg-secondary/40 hover:border-border',
    )}>
      <div className="flex items-start gap-3 p-4">
        {/* Severity badge */}
        <div className="pt-0.5 shrink-0">
          <Badge
            variant={suggestion.severity === 'BLOCKED' ? 'destructive' : 'warning'}
            className="text-[9px]"
          >
            {suggestion.severity}
          </Badge>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-mono font-semibold text-sm text-foreground">{suggestion.ruleName}</p>
          <p className="text-sm text-foreground">{suggestion.description}</p>
          <p className="text-[11px] text-muted-foreground">
            Generated from{' '}
            <span className="font-mono text-muted-foreground">{suggestion.generatedFrom}</span>
            {' '}— fired 1× on{' '}
            <span className="font-mono text-muted-foreground">{suggestion.firingTarget}</span>
          </p>

          {/* YAML collapsible */}
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-secondary-foreground transition-colors mt-1">
                {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {open ? 'Hide YAML' : 'View rule YAML'}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-2 rounded-md bg-secondary px-3 py-2.5 font-mono text-xs text-foreground leading-relaxed overflow-x-auto">
                {suggestion.yaml}
              </pre>
            </CollapsibleContent>
          </Collapsible>

          {/* Add to ruleset (only when not yet accepted) */}
          {!accepted && (
            <div className="flex items-center gap-2 pt-2">
              <Select value={targetRuleset} onValueChange={setTargetRuleset}>
                <SelectTrigger className="h-7 w-[160px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULESETS.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                  <SelectItem value="__new">+ New ruleset</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={() => onAdd(targetRuleset)}
                className="h-7 px-3 rounded-md border border-border text-xs text-foreground hover:border-primary hover:text-foreground transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Right: checkbox or accepted badge */}
        <div className="shrink-0 pt-0.5">
          {accepted ? (
            <Badge variant="success" className="text-[9px]">
              Added to {acceptedTo}
            </Badge>
          ) : (
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => onCheckedChange(!!v)}
              aria-label={`Select ${suggestion.ruleName}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── SuggestedRules ────────────────────────────────────────────────────────────

export function SuggestedRules() {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(SUGGESTION_DATA.map(s => [s.id, true])),
  )
  const [accepted, setAccepted] = useState<Record<string, string>>({})
  const [bulkRuleset, setBulkRuleset] = useState(RULESETS[0])
  const [running, setRunning] = useState(false)

  const pendingCount = SUGGESTION_DATA.filter(s => !accepted[s.id]).length
  const selectedIds = SUGGESTION_DATA.filter(s => checked[s.id] && !accepted[s.id]).map(s => s.id)
  const allAccepted = SUGGESTION_DATA.every(s => !!accepted[s.id])

  const acceptOne = (id: string, ruleset: string) => {
    setAccepted(prev => ({ ...prev, [id]: ruleset }))
  }

  const acceptSelected = () => {
    if (selectedIds.length === 0) return
    const next = { ...accepted }
    selectedIds.forEach(id => { next[id] = bulkRuleset })
    setAccepted(next)
    toast.success(`✓ ${selectedIds.length} rule${selectedIds.length !== 1 ? 's' : ''} added to ${bulkRuleset}`)
  }

  const handleRunSuggest = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      toast('canary suggest ran — 2 patterns found')
    }, 1500)
  }

  if (allAccepted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 px-6">
        <CheckCircle2 className="w-8 h-8 text-safe" />
        <p className="text-sm font-medium text-foreground">No pending suggestions</p>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          Run canary suggest after your next session to generate new rule candidates.
        </p>
        <button
          onClick={handleRunSuggest}
          disabled={running}
          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:border-primary transition-colors disabled:opacity-50"
        >
          {running && <Loader2 className="w-3 h-3 animate-spin" />}
          Run canary suggest
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-medium text-foreground">Suggested rules</h2>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
              Generated from violation patterns across recent sessions. Accept rules to add them to a ruleset.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pendingCount > 0 && (
              <Badge className="bg-warning/15 text-warning border-warning/30 text-[10px]">
                {pendingCount} suggestion{pendingCount !== 1 ? 's' : ''}
              </Badge>
            )}
            <button
              onClick={handleRunSuggest}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:border-primary transition-colors disabled:opacity-50"
            >
              {running && <Loader2 className="w-3 h-3 animate-spin" />}
              Run canary suggest
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {SUGGESTION_DATA.map(s => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              checked={checked[s.id] ?? false}
              onCheckedChange={(v) => setChecked(prev => ({ ...prev, [s.id]: v }))}
              accepted={!!accepted[s.id]}
              acceptedTo={accepted[s.id] ?? ''}
              onAdd={(ruleset) => acceptOne(s.id, ruleset)}
            />
          ))}
        </div>
      </div>

      {/* Bulk action bar — sticky, only when ≥1 pending is checked */}
      {selectedIds.length > 0 && (
        <div className="shrink-0 flex items-center gap-4 px-6 py-3 border-t border-border bg-card">
          <span className="text-xs text-muted-foreground">
            {selectedIds.length} of {pendingCount} rules selected
          </span>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-muted-foreground">Add to ruleset:</span>
            <Select value={bulkRuleset} onValueChange={setBulkRuleset}>
              <SelectTrigger className="h-7 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RULESETS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
                <SelectItem value="__new">+ New ruleset</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={acceptSelected}
            className="px-4 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Add selected to ruleset →
          </button>
        </div>
      )}
    </div>
  )
}

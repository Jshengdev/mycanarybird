import { useState } from 'react'
import { ShieldAlert, AlertTriangle, X, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { RuleCard, type RuleCardProps } from '@/components/RuleCard'
import { RuleBuilderSheet } from '@/components/RuleBuilderSheet'
import { SuggestedRules } from '@/components/SuggestedRules'
import { RulesetDetail } from '@/components/RulesetDetail'
import { SUGGESTION_DATA } from '@/lib/mockData'
import { cn } from '@/lib/utils'

// ─── Template data ─────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'email-safety',
    name: 'Email Safety',
    description:
      'Prevent your agent from leaking data or sending to unintended recipients.',
    rules: [
      { type: 'boundary' as const, name: 'Never send to external domains without confirmation' },
      { type: 'boundary' as const, name: 'Always verify recipient before sending' },
      { type: 'boundary' as const, name: 'Never attach files from outside working directory' },
      { type: 'outcome' as const, name: 'Message delivered to correct recipient' },
      { type: 'outcome' as const, name: 'Task marked complete after send confirmation' },
    ],
  },
  {
    id: 'credential-protection',
    name: 'Credential Protection',
    description: 'Block your agent from ever accessing or transmitting sensitive credentials.',
    rules: [
      { type: 'boundary' as const, name: 'Never read from ~/.ssh or credential stores' },
      { type: 'boundary' as const, name: 'Never transmit password patterns over network' },
      { type: 'outcome' as const, name: 'No credentials appear in output or logs' },
    ],
  },
  {
    id: 'safe-file-ops',
    name: 'Safe File Ops',
    description: 'Ensure file operations stay inside allowed directories.',
    rules: [
      { type: 'boundary' as const, name: 'Never write outside /working/ directory' },
      { type: 'boundary' as const, name: 'Never delete files matching *.config or *.env' },
      { type: 'sequence' as const, name: 'Confirm path before any destructive file operation' },
    ],
  },
]

type TemplateId = (typeof TEMPLATES)[number]['id']

// ─── Seeded rule cards for the loaded state ────────────────────────────────

const EMAIL_SAFETY_CARDS: RuleCardProps[] = [
  {
    id: '001',
    ruleType: 'boundary',
    name: 'Never send to external domains without confirmation',
    severity: 'critical',
    lastFired: '2 hours ago',
    passRate: 98,
    onEdit: () => {},
    onDisable: () => {},
  },
  {
    id: '002',
    ruleType: 'outcome',
    name: 'Message delivered to correct recipient',
    severity: 'warning',
    lastFired: '14 min ago',
    passRate: 87,
    hasConflict: true,
    onEdit: () => {},
    onDisable: () => {},
  },
  {
    id: '003',
    ruleType: 'boundary',
    name: 'Always verify recipient before sending',
    severity: 'critical',
    lastFired: '1 day ago',
    passRate: 100,
    isOrphaned: true,
    onEdit: () => {},
    onDisable: () => {},
  },
  {
    id: '004',
    ruleType: 'boundary',
    name: 'Never attach files from outside working directory',
    severity: 'warning',
    lastFired: 'never',
    passRate: 100,
    isDisabled: true,
    onEdit: () => {},
    onDisable: () => {},
  },
  {
    id: '005',
    ruleType: 'outcome',
    name: 'Task marked complete after send confirmation',
    severity: 'warning',
    lastFired: '3 hours ago',
    passRate: 94,
    onEdit: () => {},
    onDisable: () => {},
  },
]

// ─── Badge type map ───────────────────────────────────────────────────────

const typeBadgeVariant = {
  boundary: 'secondary' as const,
  outcome: 'secondary' as const,
  sequence: 'outline' as const,
  'time-based': 'outline' as const,
}

// ─── Empty State ──────────────────────────────────────────────────────────

function EmptyState({
  onCreateRule,
  onSelectTemplate,
}: {
  onCreateRule: () => void
  onSelectTemplate: (id: TemplateId) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-card/40 blur-2xl scale-150" />
        <ShieldAlert className="relative h-14 w-14 text-muted-foreground/50" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">No rules yet</h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Rules tell Canary what to watch for. Without them, your agent runs unchecked.
        </p>
      </div>

      <Button onClick={onCreateRule} size="default">
        + Create your first rule
      </Button>

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Or start with a template:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id as TemplateId)}
              className="inline-flex items-center rounded-full border border-border bg-transparent px-3 py-1 text-xs text-secondary-foreground hover:border-primary hover:text-foreground hover:bg-muted transition-colors"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Template Preview Dialog ───────────────────────────────────────────────

function TemplateDialog({
  templateId,
  onClose,
  onApply,
}: {
  templateId: TemplateId | null
  onClose: () => void
  onApply: (id: TemplateId) => void
}) {
  const template = TEMPLATES.find((t) => t.id === templateId)

  return (
    <Dialog open={!!templateId} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-md">
        {template && (
          <>
            <DialogHeader>
              <DialogTitle>{template.name}</DialogTitle>
              <DialogDescription>{template.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 py-2">
              {template.rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-md border border-border hover:bg-card/30 transition-colors"
                >
                  <Badge variant={typeBadgeVariant[rule.type]} className="flex-shrink-0">
                    {rule.type}
                  </Badge>
                  <span className="text-xs text-foreground">{rule.name}</span>
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => onApply(template.id as TemplateId)}>
                Apply Template
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Loaded State ─────────────────────────────────────────────────────────

function LoadedState({
  templateName,
  showTip,
  onDismissTip,
  onNewRule,
  cards,
}: {
  templateName: string
  showTip: boolean
  onDismissTip: () => void
  onNewRule: () => void
  cards: RuleCardProps[]
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-foreground">{templateName}</h2>
          <span className="text-[11px] font-mono text-muted-foreground">
            {cards.length} rules
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Play className="h-3 w-3" />
            Test Ruleset
          </Button>
          <Button size="sm" onClick={onNewRule}>
            + New Rule
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* Dismissible tip */}
        {showTip && (
          <Alert
            variant="default"
            className="relative border-border animate-in"
            style={{ animationDuration: '0.4s' }}
          >
            <span className="absolute left-4 top-3.5 text-base">💡</span>
            <div className="pl-7 pr-6">
              <AlertDescription className="opacity-100 text-foreground text-xs leading-relaxed">
                Your first ruleset is live. Run a session to see Canary in action.{' '}
                <button className="text-primary hover:underline font-medium">
                  Run a test session →
                </button>
              </AlertDescription>
            </div>
            <button
              onClick={onDismissTip}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Alert>
        )}

        {/* Rule cards with staggered animation */}
        <div className="space-y-2">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="animate-in"
              style={{ animationDelay: `${i * 50}ms`, animationDuration: '0.35s' }}
            >
              <RuleCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAMED_RULESETS = [
  { id: 'email-safety',     name: 'Email Safety'     },
  { id: 'attachment-rules', name: 'Attachment Rules' },
]

function RulesetSidebar({
  active,
  onSelect,
  pendingCount,
}: {
  active: string
  onSelect: (id: string) => void
  pendingCount: number
}) {
  return (
    <div className="w-[200px] shrink-0 border-r border-border flex flex-col bg-background">
      <div className="px-3 py-3 space-y-0.5">
        {/* Suggested — system entry, always first */}
        <button
          onClick={() => onSelect('suggested')}
          className={cn(
            'w-full flex items-center gap-2 px-2.5 py-2 rounded-sm text-left text-[13px] transition-colors',
            active === 'suggested'
              ? 'bg-warning/10 text-amber-300'
              : 'text-warning/70 hover:bg-warning/8 hover:text-warning',
          )}
        >
          <span className="text-warning text-[11px]">✦</span>
          <span className="flex-1 font-medium">Suggested</span>
          {pendingCount > 0 && (
            <span className="text-[10px] font-mono bg-warning/20 text-warning rounded px-1.5 py-0.5">
              {pendingCount}
            </span>
          )}
        </button>

        <div className="my-2 h-px bg-card" />

        {/* User rulesets */}
        {NAMED_RULESETS.map(rs => (
          <button
            key={rs.id}
            onClick={() => onSelect(rs.id)}
            className={cn(
              'w-full flex items-center px-2.5 py-2 rounded-sm text-left text-[13px] transition-colors',
              active === rs.id
                ? 'bg-card text-foreground'
                : 'text-secondary-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {rs.name}
          </button>
        ))}
      </div>

      {/* New ruleset button at bottom */}
      <div className="mt-auto px-3 py-3 border-t border-border/60">
        <button
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-[12px] text-muted-foreground hover:text-secondary-foreground border border-dashed border-border hover:border-border transition-colors"
          onClick={() => toast('Coming soon', { description: 'Ruleset creation is not yet available.' })}
        >
          <span className="text-muted-foreground/50">+</span> New ruleset
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────

type RulesOnboardingProps = {
  initialRuleset?: string | null
}

export function RulesOnboarding({ initialRuleset }: RulesOnboardingProps = {}) {
  const [activeRuleset, setActiveRuleset] = useState<string>(initialRuleset ?? 'suggested')
  const [phase, setPhase] = useState<'empty' | 'loaded'>('empty')
  const [activeTemplate, setActiveTemplate] = useState<TemplateId | null>(null)
  const [loadedTemplateName, setLoadedTemplateName] = useState('')
  const [showTip, setShowTip] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const pendingCount = SUGGESTION_DATA.length

  const handleSelectTemplate = (id: TemplateId) => setActiveTemplate(id)

  const handleApplyTemplate = (id: TemplateId) => {
    const template = TEMPLATES.find((t) => t.id === id)!
    setActiveTemplate(null)
    setPhase('loaded')
    setLoadedTemplateName(template.name)
    setShowTip(true)
    setTimeout(() => {
      toast.success(
        `✓ ${template.rules.length} rules added from ${template.name} template. Your agent is now being watched.`,
        { duration: 4000 },
      )
    }, 200)
  }

  const handleNewRule = () => setSheetOpen(true)

  const renderPanel = () => {
    if (activeRuleset === 'suggested') return <SuggestedRules />

    // Show the full ruleset detail page for named rulesets
    if (NAMED_RULESETS.some(rs => rs.id === activeRuleset)) {
      return (
        <RulesetDetail
          rulesetId={activeRuleset}
          onNewRule={handleNewRule}
          onNavigateToSuggested={() => setActiveRuleset('suggested')}
        />
      )
    }

    return phase === 'empty' ? (
      <EmptyState onCreateRule={handleNewRule} onSelectTemplate={handleSelectTemplate} />
    ) : (
      <LoadedState
        templateName={loadedTemplateName}
        showTip={showTip}
        onDismissTip={() => setShowTip(false)}
        onNewRule={handleNewRule}
        cards={EMAIL_SAFETY_CARDS}
      />
    )
  }

  return (
    <div className={cn(
      'flex h-full bg-background',
      activeRuleset !== 'suggested' && phase === 'empty' && 'flex-col',
    )}>
      <RulesetSidebar
        active={activeRuleset}
        onSelect={setActiveRuleset}
        pendingCount={pendingCount}
      />

      <div className={cn(
        'flex-1 min-w-0 flex flex-col',
        activeRuleset !== 'suggested' && phase === 'empty' && 'items-center',
      )}>
        {renderPanel()}
      </div>

      <TemplateDialog
        templateId={activeTemplate}
        onClose={() => setActiveTemplate(null)}
        onApply={handleApplyTemplate}
      />

      <RuleBuilderSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={() => {
          if (phase === 'empty') {
            setPhase('loaded')
            setLoadedTemplateName('My Rules')
            setShowTip(true)
          }
        }}
      />
    </div>
  )
}

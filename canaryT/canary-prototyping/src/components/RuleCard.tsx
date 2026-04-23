import { Shield, CheckSquare, GitBranch, Clock, Sparkles, AlertTriangle, Pencil, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type RuleCardProps = {
  id: string
  ruleType: 'boundary' | 'outcome' | 'sequence' | 'time-based'
  name: string
  severity: 'critical' | 'warning' | 'info'
  lastFired: string
  passRate: number
  hasConflict?: boolean
  isOrphaned?: boolean
  isDisabled?: boolean
  onEdit: () => void
  onDisable: () => void
}

const ruleTypeConfig = {
  boundary: {
    label: 'Boundary',
    Icon: Shield,
    badgeVariant: 'secondary' as const,
    ai: false,
  },
  outcome: {
    label: 'Outcome',
    Icon: CheckSquare,
    badgeVariant: 'secondary' as const,
    ai: true,
  },
  sequence: {
    label: 'Sequence',
    Icon: GitBranch,
    badgeVariant: 'outline' as const,
    ai: false,
  },
  'time-based': {
    label: 'Time-based',
    Icon: Clock,
    badgeVariant: 'outline' as const,
    ai: false,
  },
}

const severityConfig = {
  critical: {
    label: 'Critical',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
  },
  warning: {
    label: 'Warning',
    className: 'border-warning/40 bg-warning/10 text-warning',
  },
  info: {
    label: 'Info',
    className: 'border-border bg-card text-muted-foreground',
  },
}

export function RuleCard({
  id,
  ruleType,
  name,
  severity,
  lastFired,
  passRate,
  hasConflict,
  isOrphaned,
  isDisabled,
  onEdit,
  onDisable,
}: RuleCardProps) {
  const typeConfig = ruleTypeConfig[ruleType]
  const sevConfig = severityConfig[severity]

  return (
    <div
      className={cn(
        'group relative rounded-md border border-border bg-card transition-all duration-150',
        'hover:border-border hover:bg-secondary/80',
        isOrphaned && 'border-l-2 border-l-amber-500/70',
        isDisabled && 'opacity-50',
      )}
    >
      {/* Left rule-type accent line */}
      <div
        className={cn(
          'absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
          ruleType === 'boundary' && 'bg-primary',
          ruleType === 'outcome' && 'bg-blue-500',
          ruleType === 'sequence' && 'bg-violet-500',
          ruleType === 'time-based' && 'bg-warning',
          isOrphaned && 'opacity-0 group-hover:opacity-0',
        )}
      />

      <div className="px-4 py-3">
        {/* Orphaned warning bar */}
        {isOrphaned && (
          <div className="flex items-center gap-1.5 mb-2.5 text-warning">
            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
            <span className="text-[11px] font-mono">Object not found</span>
          </div>
        )}

        {/* Top row: type badge, conflict indicator, id, severity */}
        <div className="flex items-center gap-2 mb-2">
          {/* Rule type badge */}
          <Badge variant={typeConfig.badgeVariant} className="gap-1">
            <typeConfig.Icon className="h-2.5 w-2.5" />
            {typeConfig.label}
            {typeConfig.ai && <Sparkles className="h-2.5 w-2.5 text-blue-400 ml-0.5" />}
          </Badge>

          {/* Conflict badge */}
          {hasConflict && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-2.5 w-2.5" />
              Conflict
            </Badge>
          )}

          {/* Rule ID */}
          <span className="text-[10px] font-mono text-muted-foreground ml-0.5">#{id}</span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Disabled badge or severity */}
          {isDisabled ? (
            <Badge variant="info">Disabled</Badge>
          ) : (
            <span
              className={cn(
                'inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider border',
                sevConfig.className,
              )}
            >
              {sevConfig.label}
            </span>
          )}
        </div>

        {/* Rule name */}
        <p className="text-sm font-semibold text-foreground truncate leading-snug pr-4">{name}</p>

        {/* Bottom row: stats + actions */}
        <div className="flex items-center mt-2.5">
          {/* Stats — hidden when disabled */}
          {!isDisabled ? (
            <p className="text-[11px] font-mono text-muted-foreground flex-1 min-w-0">
              Last fired:{' '}
              <span className="text-muted-foreground">{lastFired}</span>
              <span className="mx-2 text-muted-foreground/50">|</span>
              Pass rate:{' '}
              <span
                className={cn(
                  passRate >= 90 ? 'text-safe' : passRate >= 70 ? 'text-warning' : 'text-destructive',
                )}
              >
                {passRate}%
              </span>
            </p>
          ) : (
            <div className="flex-1" />
          )}

          {/* Action buttons — visible on group hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDisable}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-card"
            >
              <EyeOff className="h-3 w-3" />
              {isDisabled ? 'Enable' : 'Disable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

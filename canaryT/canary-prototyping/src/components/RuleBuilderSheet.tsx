import { useState } from 'react'
import {
  Shield, CheckSquare, GitBranch, Clock,
  ClipboardList, CheckCircle2, AlertTriangle, ChevronDown,
} from 'lucide-react'
import { VisualRulePicker } from './VisualRulePicker'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

type RuleType = 'boundary' | 'outcome' | 'sequence' | 'time-based'

const RULE_TYPES: {
  id: RuleType
  label: string
  Icon: React.FC<{ className?: string }>
  description: string
  example: string
}[] = [
  {
    id: 'boundary',
    label: 'Boundary',
    Icon: Shield,
    description: 'Never do X',
    example: 'e.g. don\'t access files outside /working/',
  },
  {
    id: 'outcome',
    label: 'Outcome',
    Icon: CheckSquare,
    description: 'End state matches intent',
    example: 'e.g. message sent to correct recipient',
  },
  {
    id: 'sequence',
    label: 'Sequence',
    Icon: GitBranch,
    description: 'Do A before B',
    example: 'e.g. confirm before sending',
  },
  {
    id: 'time-based',
    label: 'Time-based',
    Icon: Clock,
    description: 'Complete within time limit',
    example: 'e.g. finish task under 30s',
  },
]

const ACTION_OPTIONS = [
  { value: 'accesses', label: 'accesses' },
  { value: 'modifies', label: 'modifies' },
  { value: 'deletes', label: 'deletes' },
  { value: 'sends', label: 'sends' },
  { value: 'opens', label: 'opens' },
  { value: 'types into', label: 'types into' },
]

const OBJECT_OPTIONS = [
  { value: 'file or folder', label: 'a file or folder' },
  { value: 'application', label: 'an application' },
  { value: 'contact or recipient', label: 'a contact or recipient' },
  { value: 'UI element', label: 'a UI element' },
  { value: 'external network request', label: 'an external network request' },
  { value: 'data category', label: 'a data category' },
]

const DATA_CATEGORY_OPTIONS = [
  { value: 'password pattern', label: 'Password pattern' },
  { value: 'SSN', label: 'Social Security Number' },
  { value: 'credit card number', label: 'Credit card number' },
]

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
]

function getThresholdType(objectType: string): 'text' | 'select' | null {
  if (!objectType) return null
  if (objectType === 'data category') return 'select'
  return 'text'
}

function getThresholdPlaceholder(objectType: string): string {
  switch (objectType) {
    case 'file or folder': return '/path/to/directory'
    case 'application': return 'Gmail, Chrome, Finder...'
    case 'contact or recipient': return 'email or name'
    default: return 'specify...'
  }
}

// ─── Inline slot components ──────────────────────────────────────────────────

function InlineSelect({
  value, onValueChange, options, placeholder,
}: {
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          'h-auto border-0 border-b border-dashed rounded-none px-1.5 py-0.5 text-base font-medium shadow-none',
          'bg-transparent ring-0 focus:ring-0 focus-visible:ring-0 focus:outline-none',
          'hover:bg-card transition-colors',
          value
            ? 'border-border text-foreground'
            : 'border-border text-muted-foreground',
          'min-w-[90px] gap-1',
        )}
      >
        <SelectValue placeholder={placeholder} />
        <ChevronDown className="h-3 w-3 opacity-40 flex-shrink-0" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function InlineInput({
  value, onChange, placeholder,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        'h-auto border-0 border-b border-dashed rounded-none px-1.5 py-0.5 text-base font-medium',
        'bg-transparent ring-0 focus:ring-0 focus:outline-none',
        'hover:bg-card transition-colors',
        'placeholder:text-muted-foreground text-foreground',
        'border-border focus:border-primary',
        'min-w-[140px] max-w-[220px]',
        'transition-colors',
      )}
    />
  )
}

// ─── Step Components ─────────────────────────────────────────────────────────

function StepTypeSelection({
  selected, onSelect,
}: { selected: RuleType | null; onSelect: (t: RuleType) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">What kind of rule is this?</h3>
        <p className="text-xs text-muted-foreground">Choose a type to define how Canary evaluates it.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {RULE_TYPES.map(({ id, label, Icon, description, example }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              'text-left rounded-md border p-4 transition-all duration-150',
              'hover:bg-card hover:border-border',
              selected === id
                ? 'border-primary/70 bg-primary/8 ring-1 ring-primary/40'
                : 'border-border bg-card',
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 mb-2.5',
                selected === id ? 'text-primary' : 'text-muted-foreground',
              )}
            />
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-secondary-foreground mt-0.5">{description}</p>
            <p className="text-[11px] font-mono text-muted-foreground mt-2">{example}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepRuleBuilder({
  action, setAction,
  objectType, setObjectType,
  threshold, setThreshold,
  dataCategory, setDataCategory,
  severity, setSeverity,
}: {
  action: string; setAction: (v: string) => void
  objectType: string; setObjectType: (v: string) => void
  threshold: string; setThreshold: (v: string) => void
  dataCategory: string; setDataCategory: (v: string) => void
  severity: string; setSeverity: (v: string) => void
}) {
  const thresholdType = getThresholdType(objectType)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Build the rule condition</h3>
        <p className="text-xs text-muted-foreground">Fill in the blanks to define when Canary should flag.</p>
      </div>

      {/* The sentence builder */}
      <div className="rounded-md border border-border bg-secondary/40 p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-base leading-loose">
          <span className="text-muted-foreground">If your agent</span>

          <InlineSelect
            value={action}
            onValueChange={setAction}
            options={ACTION_OPTIONS}
            placeholder="action"
          />

          <InlineSelect
            value={objectType}
            onValueChange={(v) => { setObjectType(v); setThreshold(''); setDataCategory('') }}
            options={OBJECT_OPTIONS}
            placeholder="object type"
          />

          {thresholdType === 'text' && (
            <>
              <span className="text-muted-foreground">matching</span>
              <InlineInput
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder={getThresholdPlaceholder(objectType)}
              />
            </>
          )}

          {thresholdType === 'select' && (
            <>
              <span className="text-muted-foreground">of type</span>
              <InlineSelect
                value={dataCategory}
                onValueChange={setDataCategory}
                options={DATA_CATEGORY_OPTIONS}
                placeholder="data type"
              />
            </>
          )}

          <span className="text-muted-foreground font-mono mx-1">→</span>
          <span className="text-muted-foreground">flag as</span>

          <InlineSelect
            value={severity}
            onValueChange={setSeverity}
            options={SEVERITY_OPTIONS}
            placeholder="severity"
          />
        </div>
      </div>

      {/* Live preview */}
      {action && objectType && severity && (
        <Alert variant="default">
          <ClipboardList className="h-4 w-4" />
          <AlertDescription className="text-secondary-foreground text-xs leading-relaxed opacity-100">
            <span className="text-foreground">Canary will flag a{' '}
              <span className={cn(
                'font-semibold',
                severity === 'critical' && 'text-destructive',
                severity === 'warning' && 'text-warning',
                severity === 'info' && 'text-secondary-foreground',
              )}>
                {severity}
              </span>{' '}
              violation
            </span>{' '}
            if your agent {action} {objectType}
            {threshold ? ` matching "${threshold}"` : ''}
            {dataCategory ? ` of type ${dataCategory}` : ''}
            .
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function StepConflict({
  resolution, setResolution,
}: { resolution: string; setResolution: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="opacity-100 text-red-300 text-xs">
          <p className="font-medium text-red-200 mb-1">Conflict detected</p>
          This rule conflicts with{' '}
          <span className="font-mono font-medium">Rule #3</span> —{' '}
          "Complete tasks without user interruption". Both rules may fire on the same event.
        </AlertDescription>
      </Alert>

      <div>
        <p className="text-xs font-medium text-secondary-foreground mb-3">How should Canary resolve this?</p>
        <RadioGroup value={resolution} onValueChange={setResolution} className="gap-2.5">
          {[
            { value: 'ask', label: 'Pause and ask me', desc: 'Canary will halt and prompt for input' },
            { value: 'newer', label: 'Apply the newer rule', desc: 'This rule takes precedence' },
            { value: 'higher', label: 'Apply the higher-severity rule', desc: 'Critical > Warning > Info' },
          ].map(({ value, label, desc }) => (
            <label
              key={value}
              className={cn(
                'flex items-start gap-3 rounded-md border p-3.5 cursor-pointer transition-colors',
                resolution === value
                  ? 'border-primary/50 bg-primary/6'
                  : 'border-border hover:border-border hover:bg-card/40',
              )}
            >
              <RadioGroupItem value={value} id={value} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

function StepConfirmation({
  onTestNow, onSkip,
}: { onTestNow: () => void; onSkip: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-5 text-center">
      <div className="h-14 w-14 rounded-full bg-safe/10 border border-safe/30 flex items-center justify-center">
        <CheckCircle2 className="h-7 w-7 text-safe" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">Rule saved.</h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          Want to test this rule against a recent session?
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onTestNow}>
          Test Now
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip
        </Button>
      </div>
    </div>
  )
}

// ─── Test Session Dialog ─────────────────────────────────────────────────────

function TestSessionDialog({
  open, onClose,
}: { open: boolean; onClose: () => void }) {
  const [session, setSession] = useState('')
  const [ran, setRan] = useState(false)

  const handleRun = () => setRan(true)

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setRan(false); setSession('') } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Test Against a Session</DialogTitle>
          <DialogDescription>
            Select a recent session to simulate rule evaluation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!ran ? (
            <>
              <div className="space-y-1.5">
                <Label>Recent sessions</Label>
                <Select value={session} onValueChange={setSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a session…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Session #1041 — 28 min ago — email send</SelectItem>
                    <SelectItem value="s2">Session #1040 — 2 hrs ago — file search</SelectItem>
                    <SelectItem value="s3">Session #1038 — 6 hrs ago — calendar update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                disabled={!session}
                onClick={handleRun}
              >
                Run Test
              </Button>
            </>
          ) : (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="opacity-100 text-emerald-300 text-xs">
                This rule would have fired correctly in{' '}
                <span className="font-semibold text-emerald-200">2 of 3 sessions</span>.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {ran && (
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => { onClose(); setRan(false); setSession('') }}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Sheet Component ────────────────────────────────────────────────────

// Step 1.5 only appears for boundary/sequence types. We model as fractional step.
type Step = 1 | 1.5 | 2 | 3 | 4 | 5

export function RuleBuilderSheet({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved?: () => void
}) {
  const [step, setStep] = useState<Step>(1)
  const [selectedType, setSelectedType] = useState<RuleType | null>(null)
  const [action, setAction] = useState('')
  const [objectType, setObjectType] = useState('')
  const [threshold, setThreshold] = useState('')
  const [dataCategory, setDataCategory] = useState('')
  const [severity, setSeverity] = useState('')
  const [resolution, setResolution] = useState('higher')
  const [testOpen, setTestOpen] = useState(false)

  const supportsVisualPicker = selectedType === 'boundary' || selectedType === 'sequence'

  const reset = () => {
    setStep(1)
    setSelectedType(null)
    setAction('')
    setObjectType('')
    setThreshold('')
    setDataCategory('')
    setSeverity('')
    setResolution('higher')
  }

  const handleClose = () => {
    onClose()
    setTimeout(reset, 300)
  }

  const isStepValid = () => {
    if (step === 1) return selectedType !== null
    if (step === 1.5) return true  // skip is always valid
    if (step === 2) return !!(action && objectType && severity)
    if (step === 3) return true
    if (step === 4) return !!resolution
    return true
  }

  const handleContinue = () => {
    if (step === 1) {
      // After type selection: if boundary/sequence go to visual picker (1.5), else jump to builder
      setStep(supportsVisualPicker ? 1.5 : 2)
    } else if (step === 1.5) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    } else if (step === 4) {
      setStep(5)
      onSaved?.()
    }
  }

  const handleBack = () => {
    if (step === 2 && supportsVisualPicker) {
      setStep(1.5)
    } else if (step === 1.5) {
      setStep(1)
    } else if (step > 1) {
      // TypeScript: narrow Step to integer for arithmetic
      const prev = (step as number) - 1
      setStep(prev as Step)
    }
  }

  // Visual indicator uses 5 display steps: Type | Pick | Condition | Preview | Conflicts | Done
  // For non-visual types, Pick is skipped but we still show 5 dots
  const stepLabels = supportsVisualPicker
    ? ['Type', 'Pick', 'Condition', 'Preview', 'Conflicts', 'Done']
    : ['Type', 'Condition', 'Preview', 'Conflicts', 'Done']

  // Map step → display index for dot indicator
  const stepIndex: Record<string | number, number> = {
    1: 0,
    1.5: supportsVisualPicker ? 1 : 0,
    2: supportsVisualPicker ? 2 : 1,
    3: supportsVisualPicker ? 3 : 2,
    4: supportsVisualPicker ? 4 : 3,
    5: supportsVisualPicker ? 5 : 4,
  }
  const currentDotIndex = stepIndex[step] ?? 0

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
        <SheetContent side="right">
          {/* Header */}
          <SheetHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <SheetTitle>New Rule</SheetTitle>
                <SheetDescription>
                  {step === 1 && 'Define the type of constraint for your agent.'}
                  {step === 1.5 && 'Click a UI element to auto-detect what to constrain — or define manually.'}
                  {step === 2 && 'Build the exact condition using the sentence builder.'}
                  {step === 3 && 'Review the plain-English version of your rule.'}
                  {step === 4 && 'A conflict was found. Choose how to resolve it.'}
                  {step === 5 && 'Your rule is live.'}
                </SheetDescription>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mt-3">
              {stepLabels.map((label, i) => {
                const active = i === currentDotIndex
                const done = i < currentDotIndex
                return (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          'h-1.5 w-1.5 rounded-full transition-all',
                          done && 'bg-primary/60',
                          active && 'bg-primary w-4',
                          !done && !active && 'bg-muted',
                        )}
                      />
                      {active && (
                        <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                      )}
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={cn('h-px w-3', done ? 'bg-primary/30' : 'bg-card')} />
                    )}
                  </div>
                )
              })}
            </div>
          </SheetHeader>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {step === 1 && (
              <StepTypeSelection selected={selectedType} onSelect={setSelectedType} />
            )}
            {step === 1.5 && (
              <VisualRulePicker
                onPickElement={(pickedAction, pickedObject) => {
                  setAction(pickedAction)
                  setObjectType(pickedObject)
                  setStep(2)
                }}
                onSkip={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <StepRuleBuilder
                action={action} setAction={setAction}
                objectType={objectType} setObjectType={setObjectType}
                threshold={threshold} setThreshold={setThreshold}
                dataCategory={dataCategory} setDataCategory={setDataCategory}
                severity={severity} setSeverity={setSeverity}
              />
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Plain-English Preview</h3>
                  <p className="text-xs text-muted-foreground">This is exactly what Canary will enforce.</p>
                </div>
                <Alert variant="default">
                  <ClipboardList className="h-4 w-4" />
                  <AlertDescription className="opacity-100 text-foreground text-sm leading-relaxed">
                    Canary will flag a{' '}
                    <Badge
                      variant={
                        severity === 'critical'
                          ? 'destructive'
                          : severity === 'warning'
                          ? 'warning'
                          : 'info'
                      }
                      className="inline-flex"
                    >
                      {severity}
                    </Badge>{' '}
                    violation if your agent {action} {objectType}
                    {threshold ? ` matching "${threshold}"` : ''}
                    {dataCategory ? ` of type ${dataCategory}` : ''}.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-md border border-border p-3">
                    <p className="text-muted-foreground mb-1">Rule type</p>
                    <p className="text-foreground font-medium capitalize">{selectedType}</p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-muted-foreground mb-1">Severity</p>
                    <p className="text-foreground font-medium capitalize">{severity}</p>
                  </div>
                </div>
              </div>
            )}
            {step === 4 && (
              <StepConflict resolution={resolution} setResolution={setResolution} />
            )}
            {step === 5 && (
              <StepConfirmation
                onTestNow={() => setTestOpen(true)}
                onSkip={handleClose}
              />
            )}
          </div>

          {/* Footer */}
          {step < 5 && (
            <SheetFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={step === 1 ? handleClose : handleBack}
                className="text-muted-foreground"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>

              <Button
                size="sm"
                onClick={handleContinue}
                disabled={!isStepValid()}
              >
                {step === 3 ? 'Save Rule' : step === 4 ? 'Resolve & Save' : step === 1.5 ? 'Skip →' : 'Continue'}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <TestSessionDialog open={testOpen} onClose={() => { setTestOpen(false); handleClose() }} />
    </>
  )
}

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Check, ChevronDown, ChevronRight, Copy, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { AGENT_PROFILES, type AgentProfile as AgentProfileData } from '@/lib/mockData'

// ── Inline editable field ─────────────────────────────────────────────────────

function EditableField({
  value,
  onSave,
  className,
  multiline,
}: {
  value: string
  onSave: (v: string) => void
  className?: string
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  const commit = () => {
    setEditing(false)
    if (draft.trim() !== value) onSave(draft.trim())
  }

  if (editing) {
    const shared = {
      ref,
      autoFocus: true,
      value: draft,
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setDraft(value); setEditing(false) }
        if (!multiline && e.key === 'Enter') commit()
      },
      className: cn(
        'w-full bg-secondary border border-primary/40 rounded-sm px-2 py-1 text-foreground',
        'focus:outline-none focus:border-primary/70 resize-none font-inherit',
        className,
      ),
    }
    return multiline
      ? <textarea {...shared} rows={6} onChange={(e) => setDraft(e.target.value)} />
      : <input {...shared} onChange={(e) => setDraft(e.target.value)} />
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => { setDraft(value); setEditing(true) }}
      onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
      className={cn(
        'cursor-text rounded-sm px-1 -mx-1 hover:bg-card transition-colors',
        'border border-transparent hover:border-border',
        className,
      )}
    >
      {value}
    </span>
  )
}

// ── Connection status banner ───────────────────────────────────────────────────

function ConnectionBanner({ status }: { status: AgentProfileData['connectionStatus'] }) {
  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-safe/30 bg-safe/8 px-3 py-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-safe shrink-0" />
        <span className="text-xs text-safe font-mono">Connected — events streaming</span>
      </div>
    )
  }
  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/8 px-3 py-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse shrink-0" />
        <span className="text-xs text-warning font-mono">Waiting for first event — install the SDK to connect</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 bg-secondary/40 px-3 py-2.5">
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground font-mono">Not connected</span>
    </div>
  )
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-safe" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// ── Path A — code install ─────────────────────────────────────────────────────

const CODE_STEPS = [
  {
    label: 'Install Canary SDK',
    code: 'npm install @photon/canary-sdk',
  },
  {
    label: 'Wrap your agent',
    code: `import { withCanary } from '@photon/canary-sdk'

const agent = withCanary(yourAgent, {
  agentId: '<AGENT_ID>',
  apiKey:  process.env.CANARY_API_KEY,
})`,
  },
  {
    label: 'Set environment variable',
    code: 'CANARY_API_KEY=pk_live_••••••••••••',
  },
]

function PathACode({ agentId }: { agentId: string }) {
  return (
    <div className="space-y-4">
      {CODE_STEPS.map((step, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-mono text-muted-foreground">
              <span className="text-muted-foreground/50 mr-1.5">{i + 1}.</span>
              {step.label}
            </p>
            <CopyButton text={step.code.replace('<AGENT_ID>', agentId)} />
          </div>
          <pre className="bg-background border border-border rounded-md px-3 py-2.5 text-[11px] font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
            {step.code.replace('<AGENT_ID>', agentId)}
          </pre>
        </div>
      ))}
    </div>
  )
}

// ── Path B — config form ──────────────────────────────────────────────────────

function PathBConfig({ profile }: { profile: AgentProfileData }) {
  const [model, setModel] = useState(profile.modelId)
  const [endpoint, setEndpoint] = useState(profile.apiEndpoint || 'https://api.photon.dev/canary/v1')

  const yaml = `canary:
  agent_id: ${profile.id}
  model: ${model}
  endpoint: ${endpoint}
  api_key: \${CANARY_API_KEY}
  ruleset: default
`

  const download = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `canary-${profile.id}.yaml`
    a.click()
    URL.revokeObjectURL(url)
    toast('Config downloaded', { description: `canary-${profile.id}.yaml` })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-mono text-muted-foreground block mb-1">Model</label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude-sonnet-4-6">claude-sonnet-4-6</SelectItem>
              <SelectItem value="claude-haiku-4-5-20251001">claude-haiku-4-5</SelectItem>
              <SelectItem value="gpt-4o">gpt-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[11px] font-mono text-muted-foreground block mb-1">Endpoint</label>
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full h-8 bg-transparent border border-border rounded-md px-2 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-mono text-muted-foreground">Live YAML preview</p>
          <div className="flex items-center gap-1">
            <CopyButton text={yaml} />
            <button
              onClick={download}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
        </div>
        <pre className="bg-background border border-border rounded-md px-3 py-2.5 text-[11px] font-mono text-foreground whitespace-pre-wrap">
          {yaml}
        </pre>
      </div>
    </div>
  )
}

// ── AgentProfile ──────────────────────────────────────────────────────────────

export function AgentProfile({ agentId }: { agentId: string }) {
  const initial = AGENT_PROFILES[agentId]

  const [name, setName] = useState(
    initial?.id === agentId
      ? ({ 'email-drafting': 'Email drafting agent', 'file-manager': 'File manager agent', 'browser-research': 'Browser research agent', 'calendar': 'Calendar agent' }[agentId] ?? agentId)
      : agentId,
  )
  const [description, setDescription] = useState(initial?.description ?? '')
  const [framework, setFramework] = useState(initial?.framework ?? 'claude')
  const [promptOpen, setPromptOpen] = useState(false)
  const [connectionPath, setConnectionPath] = useState<'code' | 'config'>(initial?.connectionPath ?? 'code')

  if (!initial) {
    return (
      <div className="flex items-center justify-center py-20 text-xs font-mono text-muted-foreground/50">
        No profile data for this agent.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-[720px]">
      {/* Identity */}
      <section className="space-y-3">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Identity</p>

        <div>
          <p className="text-[11px] font-mono text-muted-foreground mb-1">Name</p>
          <EditableField
            value={name}
            onSave={setName}
            className="text-sm font-medium text-foreground block w-full"
          />
        </div>

        <div>
          <p className="text-[11px] font-mono text-muted-foreground mb-1">Description</p>
          <EditableField
            value={description}
            onSave={setDescription}
            className="text-xs text-secondary-foreground leading-relaxed block w-full"
            multiline
          />
        </div>

        <div>
          <p className="text-[11px] font-mono text-muted-foreground mb-1">Framework</p>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude">Claude (Anthropic)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
              <SelectItem value="gemini">Gemini (Google)</SelectItem>
              <SelectItem value="custom">Custom / other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* System prompt */}
      <section className="space-y-2">
        <button
          className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider hover:text-secondary-foreground transition-colors w-full"
          onClick={() => setPromptOpen(o => !o)}
        >
          {promptOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          System prompt
        </button>
        {promptOpen && (
          <textarea
            defaultValue={initial.systemPrompt}
            rows={8}
            className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-[11px] font-mono text-foreground focus:outline-none focus:border-border resize-y"
          />
        )}
      </section>

      <Separator />

      {/* Connection */}
      <section className="space-y-4">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Connection</p>
        <ConnectionBanner status={initial.connectionStatus} />

        {/* Path toggle */}
        <div className="flex gap-3">
          {(['code', 'config'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setConnectionPath(p)}
              className={cn(
                'flex-1 py-2.5 rounded-md border text-xs font-medium transition-colors',
                connectionPath === p
                  ? 'border-primary/50 bg-primary/8 text-foreground'
                  : 'border-border text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              {p === 'code' ? 'A  —  SDK install' : 'B  —  Config file'}
            </button>
          ))}
        </div>

        {connectionPath === 'code'
          ? <PathACode agentId={agentId} />
          : <PathBConfig profile={initial} />
        }
      </section>
    </div>
  )
}

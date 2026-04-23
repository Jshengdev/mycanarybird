import { useState } from 'react'
import { MousePointer2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PICKER_SCREENSHOTS, type PickerScreenshot } from '@/lib/mockData'
import { ElementPickerModal } from './ElementPickerModal'

// ── Screenshot thumbnail ──────────────────────────────────────────────────────

// Colour palettes per screenshot for variety
const THUMB_PALETTES: Record<string, { bg: string; accent: string; bars: string[] }> = {
  ss_gmail:    { bg: 'bg-secondary',   accent: 'bg-blue-500',   bars: ['w-3/4', 'w-1/2', 'w-5/6', 'w-2/3'] },
  ss_finder:   { bg: 'bg-background',   accent: 'bg-muted',   bars: ['w-1/3', 'w-full', 'w-2/3', 'w-1/2'] },
  ss_terminal: { bg: 'bg-black',      accent: 'bg-safe',bars: ['w-4/5', 'w-1/3', 'w-2/3', 'w-1/2'] },
  ss_calendar: { bg: 'bg-secondary',   accent: 'bg-blue-400',   bars: ['w-full', 'w-3/4', 'w-1/2', 'w-3/4'] },
  ss_slack:    { bg: 'bg-background',   accent: 'bg-purple-500', bars: ['w-2/3', 'w-1/2', 'w-4/5', 'w-1/3'] },
  ss_browser:  { bg: 'bg-secondary',   accent: 'bg-muted-foreground',   bars: ['w-full', 'w-2/3', 'w-1/2', 'w-3/4'] },
}

function ScreenshotThumb({
  screenshot,
  isSelected,
  onClick,
}: {
  screenshot: PickerScreenshot
  isSelected: boolean
  onClick: () => void
}) {
  const palette = THUMB_PALETTES[screenshot.id] ?? THUMB_PALETTES['ss_gmail']

  return (
    <button
      onClick={onClick}
      className={cn(
        'group rounded-md border overflow-hidden transition-all text-left',
        isSelected
          ? 'border-primary/70 ring-2 ring-primary/20'
          : 'border-border hover:border-border',
      )}
    >
      {/* Mock screenshot */}
      <div className={cn('h-[80px] relative overflow-hidden', palette.bg)}>
        {/* Chrome bar */}
        <div className="flex items-center gap-1 px-2 py-1 bg-secondary/80 border-b border-border">
          {['bg-muted', 'bg-muted', 'bg-muted'].map((c, i) => (
            <div key={i} className={cn('w-1.5 h-1.5 rounded-full', c)} />
          ))}
        </div>
        {/* Content bars */}
        <div className="px-2 py-1.5 space-y-1">
          <div className={cn('h-1.5 rounded-sm', palette.accent, palette.bars[0])} />
          {palette.bars.slice(1).map((w, i) => (
            <div key={i} className={cn('h-1 rounded-sm bg-card', w)} />
          ))}
        </div>
        {/* Hover overlay */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors',
          isSelected ? 'bg-primary/10' : 'group-hover:bg-card/20',
        )}>
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <MousePointer2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
      {/* Label */}
      <div className="px-2 py-1.5 bg-background border-t border-border">
        <p className={cn(
          'text-[10px] font-mono truncate',
          isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
        )}>
          {screenshot.label}
        </p>
      </div>
    </button>
  )
}

// ── VisualRulePicker ──────────────────────────────────────────────────────────

type VisualRulePickerProps = {
  onPickElement: (action: string, objectType: string) => void
  onSkip: () => void
}

export function VisualRulePicker({ onPickElement, onSkip }: VisualRulePickerProps) {
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleScreenSelect = (id: string) => {
    setSelectedScreen(id)
    setPickerOpen(true)
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Pick from a screenshot</h3>
          <p className="text-xs text-muted-foreground">
            Select a UI state, then click the element you want to constrain. Canary will detect the action and object type automatically.
          </p>
        </div>

        {/* 2×3 grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {PICKER_SCREENSHOTS.map(ss => (
            <ScreenshotThumb
              key={ss.id}
              screenshot={ss}
              isSelected={selectedScreen === ss.id}
              onClick={() => handleScreenSelect(ss.id)}
            />
          ))}
        </div>

        {/* Skip link */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-px bg-card" />
          <button
            onClick={onSkip}
            className="text-[11px] font-mono text-muted-foreground hover:text-secondary-foreground transition-colors whitespace-nowrap"
          >
            Define manually instead →
          </button>
          <div className="flex-1 h-px bg-card" />
        </div>
      </div>

      <ElementPickerModal
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setSelectedScreen(null) }}
        onConfirm={(action, objectType) => {
          onPickElement(action, objectType)
        }}
      />
    </>
  )
}

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { PICKER_ELEMENTS, type PickerElement } from '@/lib/mockData'

// ── Mock file browser ─────────────────────────────────────────────────────────

const MOCK_BROWSER_H = 240

function MockBrowser({ selected, onSelect }: {
  selected: PickerElement | null
  onSelect: (el: PickerElement) => void
}) {
  return (
    <div
      className="relative rounded-md border border-border bg-background overflow-hidden"
      style={{ height: MOCK_BROWSER_H }}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-secondary border-b border-border">
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="w-2 h-2 rounded-full bg-muted" />
        <div className="flex-1 mx-2 bg-card rounded px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          mail.google.com/compose
        </div>
      </div>

      {/* Mock Gmail compose */}
      <div className="relative" style={{ height: MOCK_BROWSER_H - 32 }}>
        {/* Background compose window */}
        <div className="absolute inset-2 bg-secondary rounded border border-border">
          {/* Compose header */}
          <div className="px-3 py-2 bg-card border-b border-border text-[10px] font-mono text-muted-foreground">
            New message
          </div>
          {/* Fields */}
          <div className="px-3 py-1.5 border-b border-border/60 text-[10px] font-mono text-muted-foreground">
            To:
          </div>
          <div className="px-3 py-1.5 border-b border-border/60 text-[10px] font-mono text-muted-foreground">
            Subject:
          </div>
          <div className="px-3 py-3 text-[10px] font-mono text-muted-foreground/50 flex-1">
            Dear team, please find attached...
          </div>
          {/* Action bar */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <div className="text-[10px] font-mono text-muted-foreground bg-card px-2 py-1 rounded">
              Attach
            </div>
            <div className="text-[10px] font-mono text-foreground bg-blue-600 px-3 py-1 rounded">
              Send
            </div>
          </div>
        </div>

        {/* Bounding box overlays */}
        {PICKER_ELEMENTS.map(el => {
          const isSelected = selected?.id === el.id
          return (
            <button
              key={el.id}
              onClick={() => onSelect(el)}
              className={cn(
                'absolute border-2 rounded-sm transition-all',
                isSelected
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-blue-500/60 bg-blue-500/5 hover:border-blue-400 hover:bg-blue-400/10',
              )}
              style={{
                left:   el.bounds.x / 1.1,
                top:    el.bounds.y / 1.3 + 8,
                width:  el.bounds.w / 1.1,
                height: el.bounds.h / 1.2,
              }}
              title={el.label}
            />
          )
        })}
      </div>
    </div>
  )
}

// ── Detection drawer ──────────────────────────────────────────────────────────

function DetectionDrawer({ element }: { element: PickerElement }) {
  return (
    <div className="rounded-md border border-border bg-secondary/80 px-4 py-3 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span className="text-[11px] font-mono text-amber-300">Detected: {element.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="text-muted-foreground font-mono">action  </span>
          <span className="text-foreground font-mono">{element.detectedAction}</span>
        </div>
        <div>
          <span className="text-muted-foreground font-mono">object  </span>
          <span className="text-foreground font-mono">{element.detectedObject}</span>
        </div>
      </div>
    </div>
  )
}

// ── ElementPickerModal ────────────────────────────────────────────────────────

type ElementPickerModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (action: string, objectType: string) => void
}

export function ElementPickerModal({ open, onClose, onConfirm }: ElementPickerModalProps) {
  const [selected, setSelected] = useState<PickerElement | null>(null)

  const handleConfirm = () => {
    if (!selected) return
    onConfirm(selected.detectedAction, selected.detectedObject)
    setSelected(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setSelected(null); onClose() } }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pick an element</DialogTitle>
          <DialogDescription>
            Click any highlighted element in the screenshot to define what the rule monitors.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <MockBrowser selected={selected} onSelect={setSelected} />
          {selected && <DetectionDrawer element={selected} />}
          {!selected && (
            <p className="text-[11px] font-mono text-muted-foreground text-center py-1">
              Click a blue bounding box above to select an element
            </p>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => { setSelected(null); onClose() }}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={cn(
              'px-4 py-1.5 rounded-md text-xs font-medium transition-colors',
              selected
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-card text-muted-foreground cursor-not-allowed',
            )}
          >
            Use this element →
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { RotateCcw } from 'lucide-react'
import type { Event, SessionSharedProps } from '@/lib/session'

// ── Constants ─────────────────────────────────────────────────────────────────

const BROWSER_W  = 480
const BROWSER_H  = 290
const CHROME_H   = 32
const BODY_H     = BROWSER_H - CHROME_H  // 258
const PIN_R      = 10   // pin radius

type ScreenState = 'A' | 'B' | 'C' | 'D'

function getScreenState(event: Event): ScreenState {
  if ([6, 8].includes(event.n))  return 'B'
  if (event.n === 10)            return 'C'
  if ([12, 13].includes(event.n)) return 'D'
  return 'A'
}

const SCREEN_URL: Record<ScreenState, string> = {
  A: 'mail.google.com/mail/u/0/#drafts',
  B: 'file:///Users/shared/templates/',
  C: 'file:///Users/',
  D: 'mail.google.com/mail/u/0/#drafts',
}

// Pins: position relative to browser body (x from left, y from top of body)
const SCREEN_PINS: Record<ScreenState, number[]> = {
  A: [1, 3, 14],   // event.n values shown in this state
  B: [6, 8],
  C: [10],
  D: [12, 13],
}

const PIN_POSITIONS: Record<number, { x: number; y: number }> = {
  1:  { x: 140, y: 60  },
  3:  { x: 200, y: 95  },
  14: { x: 240, y: 140 },
  6:  { x: 280, y: 110 },
  8:  { x: 280, y: 145 },
  10: { x: 280, y: 130 },
  12: { x: 308, y: 192 },
  13: { x: 332, y: 208 },
}

const STATUS_COLOR: Record<Event['status'], string> = {
  observed: '#1D9E75',
  flagged:  '#BA7517',
  blocked:  '#A32D2D',
}

// ── Time helpers ──────────────────────────────────────────────────────────────

const START_SEC = 10 * 3600 + 14 * 60 + 35  // 10:14:35
const END_SEC   = 10 * 3600 + 15 * 60 + 47  // 10:15:47
const DURATION  = END_SEC - START_SEC         // 72s

function timeToSec(t: string): number {
  const [h, m, s] = t.split(':').map(Number)
  return h * 3600 + m * 60 + s
}

function eventFrac(e: Event): number {
  return (timeToSec(e.time) - START_SEC) / DURATION
}

// ── Mock screen content ───────────────────────────────────────────────────────

function GmailCompose({ sendViolation }: { sendViolation?: boolean }) {
  return (
    <div className="flex flex-col bg-[#1e1e21]" style={{ height: BODY_H }}>
      {/* Compose header */}
      <div className="flex items-center justify-between px-3 h-8 bg-[#26262b] border-b border-white/[0.06] shrink-0">
        <span className="text-[11px] text-foreground font-medium">New Message</span>
        <div className="flex gap-2.5 text-muted-foreground text-[12px]">
          <span className="cursor-default">⊟</span>
          <span className="cursor-default">⬜</span>
          <span className="cursor-default hover:text-foreground">✕</span>
        </div>
      </div>
      {/* To */}
      <div className="flex items-center gap-2 px-3 h-8 border-b border-white/[0.06] shrink-0">
        <span className="text-[10px] text-muted-foreground w-10 text-right shrink-0">To</span>
        <div className="flex items-center gap-1.5">
          <span className="bg-muted/50 text-foreground text-[10px] rounded-full px-2 py-0.5 font-mono">client@acme.com</span>
        </div>
      </div>
      {/* Subject */}
      <div className="flex items-center gap-2 px-3 h-8 border-b border-white/[0.06] shrink-0">
        <span className="text-[10px] text-muted-foreground w-10 text-right shrink-0">Subject</span>
        <span className="text-[11px] text-foreground">Re: Q1 Report — Please Review</span>
      </div>
      {/* Body */}
      <div className="flex-1 px-5 py-3 overflow-hidden text-[11px] text-secondary-foreground leading-relaxed space-y-1.5">
        <p>Hi Sarah,</p>
        <p>Please find attached the Q1 compliance report for your review. The key findings have been summarized in the executive section on page 3.</p>
        <p>Note that items flagged in section 2.4 require sign-off by end of week.</p>
        <p className="mt-2 text-muted-foreground">Best,<br />Automation Agent</p>
      </div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-9 border-t border-white/[0.06] bg-[#22222a] shrink-0">
        <button className={cn(
          'px-3.5 py-1 rounded text-[11px] font-medium transition-all',
          sendViolation
            ? 'bg-destructive/20 text-red-300 ring-1 ring-red-400/60 ring-offset-1 ring-offset-[#22222a]'
            : 'bg-blue-600 text-white',
        )}>
          {sendViolation ? '⚠ Send' : 'Send ›'}
        </button>
        <div className="w-px h-4 bg-muted mx-1" />
        <div className="flex gap-1 text-muted-foreground">
          {['B', 'I', 'U', '≡', '⁙', '🔗', '📎'].map(c => (
            <span key={c} className="w-5 h-5 flex items-center justify-center text-[10px] cursor-default hover:text-secondary-foreground">{c}</span>
          ))}
        </div>
        <span className="ml-auto text-muted-foreground/50 text-[10px] cursor-default">🗑</span>
      </div>
    </div>
  )
}

function FileBrowser({ variant }: { variant: 'B' | 'C' }) {
  const path = variant === 'C' ? '/Users/' : '/Users/shared/templates/'
  const files = variant === 'C'
    ? [
        { icon: '📁', name: 'working',     size: '—',      date: 'Apr 3',  hl: false },
        { icon: '📁', name: 'shared',      size: '—',      date: 'Mar 28', hl: false },
        { icon: '📁', name: 'Library',     size: '—',      date: 'Jan 10', hl: false },
        { icon: '🔒', name: '.env',        size: '1.2 KB', date: 'Jan 12', hl: true  },
        { icon: '📄', name: '.gitignore',  size: '0.4 KB', date: 'Jan 10', hl: false },
      ]
    : [
        { icon: '📄', name: 'annual_report.docx',   size: '2.1 MB', date: 'Apr 1',  hl: false },
        { icon: '📄', name: 'email_template.html',  size: '12 KB',  date: 'Mar 28', hl: true  },
        { icon: '📄', name: 'draft_v2.txt',          size: '3.4 KB', date: 'Apr 3',  hl: false },
        { icon: '📄', name: 'letterhead.docx',       size: '8.1 KB', date: 'Feb 20', hl: false },
        { icon: '📄', name: 'memo_template.txt',     size: '2.2 KB', date: 'Jan 15', hl: false },
      ]

  return (
    <div className="flex" style={{ height: BODY_H }}>
      {/* Sidebar */}
      <div className="w-28 shrink-0 bg-[#161618] border-r border-white/[0.05] flex flex-col pt-2">
        <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-wider px-3 mb-1">Favorites</p>
        {['Recents', 'Desktop', 'Documents', 'Downloads'].map(item => (
          <div key={item} className="flex items-center gap-1.5 px-3 py-1 text-[10px] text-muted-foreground cursor-default hover:bg-white/5">
            <span className="text-[9px]">📁</span> {item}
          </div>
        ))}
        <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-wider px-3 mb-1 mt-2">Locations</p>
        {['shared', 'working'].map(item => (
          <div key={item} className={cn(
            'flex items-center gap-1.5 px-3 py-1 text-[10px] cursor-default',
            (variant === 'B' && item === 'shared') ? 'bg-muted/40 text-foreground rounded-sm mx-1' : 'text-muted-foreground hover:bg-white/5',
          )}>
            <span className="text-[9px]">📁</span> {item}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col bg-[#1c1c1f] overflow-hidden">
        {/* Path bar */}
        <div className="h-7 flex items-center px-3 gap-1 border-b border-white/[0.05] bg-[#1a1a1d] shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground">{path}</span>
        </div>
        {/* Column headers */}
        <div className="flex items-center px-3 h-6 border-b border-white/[0.04] bg-[#1a1a1d] shrink-0">
          <span className="flex-1 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Name</span>
          <span className="w-14 text-right text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Size</span>
          <span className="w-16 text-right text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Modified</span>
        </div>
        {/* File rows */}
        <div className="flex-1 overflow-hidden">
          {files.map(f => (
            <div key={f.name} className={cn(
              'flex items-center px-3 h-9 text-[11px] border-b border-white/[0.03]',
              f.hl && variant === 'B' && 'bg-warning/10 border-l-2 border-l-amber-500',
              f.hl && variant === 'C' && 'bg-destructive/12 border-l-2 border-l-red-500',
              !f.hl && 'text-secondary-foreground',
            )}>
              <span className="text-[12px] mr-2">{f.icon}</span>
              <span className={cn(
                'flex-1 font-mono',
                f.hl && variant === 'B' && 'text-amber-300',
                f.hl && variant === 'C' && 'text-red-300',
              )}>{f.name}</span>
              <span className="w-14 text-right font-mono text-[10px] text-muted-foreground">{f.size}</span>
              <span className="w-16 text-right font-mono text-[10px] text-muted-foreground">{f.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Pin ───────────────────────────────────────────────────────────────────────

function Pin({ event, isActive, onClick }: {
  event: Event
  isActive: boolean
  onClick: () => void
}) {
  const pos = PIN_POSITIONS[event.n]
  if (!pos) return null

  const color = STATUS_COLOR[event.status]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="absolute flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          style={{
            width:  PIN_R * 2,
            height: PIN_R * 2,
            left:   pos.x - PIN_R,
            top:    CHROME_H + pos.y - PIN_R,
            backgroundColor: color,
            boxShadow: isActive
              ? `0 0 0 2px #fff, 0 0 0 4px ${color}, 0 2px 8px rgba(0,0,0,0.6)`
              : '0 2px 6px rgba(0,0,0,0.5)',
            zIndex: isActive ? 20 : 10,
          }}
          onClick={onClick}
        >
          <span className="text-white font-mono font-bold leading-none" style={{ fontSize: 9 }}>
            {event.n}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
        <span className="font-mono text-[10px] text-secondary-foreground mr-1.5">{event.time}</span>
        {event.action}
      </TooltipContent>
    </Tooltip>
  )
}

// ── Mock browser ──────────────────────────────────────────────────────────────

function MockBrowser({ state, visible, events, activeIndex, onActiveChange }: {
  state: ScreenState
  visible: boolean
  events: Event[]
  activeIndex: number
  onActiveChange: (idx: number) => void
}) {
  const isBlocked = state === 'C'
  const pinNums = SCREEN_PINS[state]

  return (
    <div className="relative" style={{ width: BROWSER_W, height: BROWSER_H }}>
      {/* Frame */}
      <div
        className={cn('rounded-lg overflow-hidden w-full h-full shadow-2xl transition-[box-shadow,border-color] duration-300')}
        style={{
          border: isBlocked ? '2px solid rgba(163,45,45,0.7)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isBlocked
            ? '0 0 0 1px rgba(163,45,45,0.3), 0 0 32px rgba(163,45,45,0.15), 0 24px 48px rgba(0,0,0,0.8)'
            : '0 24px 48px rgba(0,0,0,0.7)',
        }}
      >
        {/* Chrome */}
        <div className="flex items-center gap-2 px-3 bg-[#252528] border-b border-white/[0.06]" style={{ height: CHROME_H }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-3 h-5 rounded bg-[#1a1a1d] flex items-center px-2.5 gap-1.5">
            <span className="text-muted-foreground/50 text-[9px]">🔒</span>
            <span className="text-[10px] font-mono text-muted-foreground truncate">{SCREEN_URL[state]}</span>
          </div>
        </div>

        {/* Body — opacity fades on state change */}
        <div
          className="transition-opacity duration-150"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {(state === 'A') && <GmailCompose sendViolation={false} />}
          {(state === 'B') && <FileBrowser variant="B" />}
          {(state === 'C') && <FileBrowser variant="C" />}
          {(state === 'D') && <GmailCompose sendViolation />}
        </div>
      </div>

      {/* BLOCKED overlay badge */}
      {isBlocked && (
        <div className="absolute top-2 right-2 z-30">
          <Badge variant="destructive" className="text-[10px] px-2 py-0.5 shadow-lg">BLOCKED</Badge>
        </div>
      )}

      {/* Pins */}
      {pinNums.map(n => {
        const event = events.find(e => e.n === n)
        if (!event) return null
        const idx = events.indexOf(event)
        return (
          <Pin
            key={n}
            event={event}
            isActive={idx === activeIndex}
            onClick={() => onActiveChange(idx)}
          />
        )
      })}
    </div>
  )
}

// ── Scrubber ──────────────────────────────────────────────────────────────────

function Scrubber({ events, activeIndex, onActiveChange }: {
  events: Event[]
  activeIndex: number
  onActiveChange: (idx: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const onChangeRef = useRef(onActiveChange)
  useEffect(() => { onChangeRef.current = onActiveChange }, [onActiveChange])

  const fractionToIdx = useCallback((frac: number) => {
    let closest = 0, dist = Infinity
    events.forEach((e, i) => {
      const d = Math.abs(eventFrac(e) - frac)
      if (d < dist) { dist = d; closest = i }
    })
    return closest
  }, [events])

  const clientXToIdx = useCallback((clientX: number) => {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return fractionToIdx(frac)
  }, [fractionToIdx])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => onChangeRef.current(clientXToIdx(e.clientX))
    const onUp   = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, clientXToIdx])

  const thumbPct = eventFrac(events[activeIndex] ?? events[0]) * 100

  return (
    <div className="h-[52px] bg-secondary border-t border-border flex flex-col justify-center px-5 gap-1.5 shrink-0">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-1 bg-muted/70 rounded-full cursor-pointer select-none"
        onMouseDown={e => { e.preventDefault(); setDragging(true); onActiveChange(clientXToIdx(e.clientX)) }}
      >
        {/* Fill */}
        <div
          className="absolute h-full bg-primary/70 rounded-full pointer-events-none"
          style={{ width: `${thumbPct}%` }}
        />

        {/* Event dots */}
        {events.map((event, i) => (
          <button
            key={i}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full cursor-pointer hover:scale-150 transition-transform z-10"
            style={{
              width: 7, height: 7,
              left: `${eventFrac(event) * 100}%`,
              backgroundColor: STATUS_COLOR[event.status],
              boxShadow: i === activeIndex ? `0 0 0 1.5px white, 0 0 0 3px ${STATUS_COLOR[event.status]}` : undefined,
            }}
            onMouseDown={e => { e.stopPropagation() }}
            onClick={e => { e.stopPropagation(); onActiveChange(i) }}
          />
        ))}

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[1.5px] border-primary z-20 cursor-grab active:cursor-grabbing shadow-md"
          style={{ left: `${thumbPct}%` }}
          onMouseDown={e => { e.stopPropagation(); e.preventDefault(); setDragging(true) }}
        />
      </div>

      {/* Timestamps */}
      <div className="relative h-3 pointer-events-none">
        <span className="absolute left-0    text-[9px] font-mono text-muted-foreground">10:14:35</span>
        <span className="absolute left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground">10:15:11</span>
        <span className="absolute right-0   text-[9px] font-mono text-muted-foreground">10:15:47</span>
      </div>
    </div>
  )
}

// ── Action sidebar ────────────────────────────────────────────────────────────

function ActionSidebar({ events, activeIndex, onActiveChange }: {
  events: Event[]
  activeIndex: number
  onActiveChange: (idx: number) => void
}) {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = scrollRef.current
    const row       = rowRefs.current[activeIndex]
    if (!container || !row) return

    const cRect = container.getBoundingClientRect()
    const rRect = row.getBoundingClientRect()

    if (rRect.top < cRect.top) {
      container.scrollTop -= cRect.top - rRect.top + 8
    } else if (rRect.bottom > cRect.bottom) {
      container.scrollTop += rRect.bottom - cRect.bottom + 8
    }
  }, [activeIndex])

  const borderFor = (event: Event) => {
    if (event.status === 'blocked') return 'border-l-2 border-l-red-500'
    if (event.status === 'flagged') return 'border-l-2 border-l-amber-500'
    return 'border-l-2 border-l-transparent'
  }

  return (
    <div className="w-[240px] shrink-0 border-l border-border flex flex-col bg-[#09090b]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-[11px] font-mono text-muted-foreground">{events.length} actions</span>
        <span className="text-[10px] font-mono text-muted-foreground/50">click to jump</span>
      </div>

      {/* List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}
      >
        {events.map((event, i) => (
          <div
            key={event.n}
            ref={el => { rowRefs.current[i] = el }}
            className={cn(
              'flex items-center gap-2 px-3 py-2 cursor-pointer select-none transition-colors border-b border-border/40',
              borderFor(event),
              i === activeIndex ? 'bg-card' : 'hover:bg-muted/50',
            )}
            onClick={() => onActiveChange(i)}
          >
            {/* Status dot */}
            <div
              className="w-[7px] h-[7px] rounded-full shrink-0"
              style={{ backgroundColor: STATUS_COLOR[event.status] }}
            />
            {/* Event number */}
            <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0 tabular-nums">{event.n}</span>
            {/* Action */}
            <span className={cn(
              'flex-1 text-[11px] truncate leading-tight',
              i === activeIndex ? 'text-foreground' : 'text-secondary-foreground',
            )}>
              {event.action}
            </span>
            {/* Time */}
            <span className="text-[9px] font-mono text-muted-foreground/50 shrink-0">{event.time.slice(-5)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SessionTimeline ───────────────────────────────────────────────────────────

export function SessionTimeline({ events, activeIndex, onActiveChange }: SessionSharedProps) {
  const activeEvent    = events[activeIndex] ?? events[0]
  const targetState    = getScreenState(activeEvent)

  const [displayState, setDisplayState] = useState<ScreenState>(targetState)
  const [screenVisible, setScreenVisible] = useState(true)
  const prevStateRef = useRef<ScreenState>(targetState)

  useEffect(() => {
    if (targetState === prevStateRef.current) return
    setScreenVisible(false)
    const t = setTimeout(() => {
      prevStateRef.current = targetState
      setDisplayState(targetState)
      setScreenVisible(true)
    }, 120)
    return () => clearTimeout(t)
  }, [targetState])

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex" style={{ height: 420 }}>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Loop detection alert */}
          <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 py-2 flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px]">
              <span className="font-semibold">Loop detected</span>
              {' — '}agent repeated <span className="font-mono">compose_open</span> 3× between 10:14:38–10:15:12
            </span>
          </Alert>

          {/* Screenshot zone */}
          <div className="flex-1 flex items-center justify-center bg-[#0f0f0e] relative overflow-hidden">
            {/* Subtle grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.015]"
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <MockBrowser
              state={displayState}
              visible={screenVisible}
              events={events}
              activeIndex={activeIndex}
              onActiveChange={onActiveChange}
            />
          </div>

          {/* Scrubber */}
          <Scrubber
            events={events}
            activeIndex={activeIndex}
            onActiveChange={onActiveChange}
          />
        </div>

        {/* ── Sidebar ── */}
        <ActionSidebar
          events={events}
          activeIndex={activeIndex}
          onActiveChange={onActiveChange}
        />

      </div>
    </TooltipProvider>
  )
}

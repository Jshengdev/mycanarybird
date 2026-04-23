/**
 * AsciiHover — Canary Dashboard ASCII block unfurl hover effect
 *
 * Usage:
 *   <AsciiHover variant="right">content</AsciiHover>
 *   <AsciiHover variant="both" color="#0088c7">content</AsciiHover>
 *   <AsciiHover active={isHovered}>content</AsciiHover>
 */

import { useRef, useEffect, useCallback, useState, type ReactNode, type CSSProperties } from 'react'

// ─── SVG path data (Figma exports, 12×28 viewBox) ───────────────────────────

const BLOCK_PATHS: Record<string, string> = {
  dark: 'M0 28V0H12V28H0Z',
  medium: 'M0 28V26.7273H1.2V25.4545H0V24.1818H1.2V22.9091H0V21.6364H1.2V20.3636H0V19.0909H1.2V17.8182H0V16.5455H1.2V15.2727H0V14H1.2V12.7273H0V11.4545H1.2V10.1818H0V8.90909H1.2V7.63636H0V6.36364H1.2V5.09091H0V3.81818H1.2V2.54546H0V1.27273H1.2V0H2.4V1.27273H3.6V0H4.8V1.27273H6V0H7.2V1.27273H8.4V0H9.6V1.27273H10.8V0H12V28H0ZM2.4 26.7273H3.6V25.4545H2.4V26.7273ZM2.4 24.1818H3.6V22.9091H2.4V24.1818ZM4.8 26.7273H6V25.4545H4.8V26.7273ZM2.4 21.6364H3.6V20.3636H2.4V21.6364ZM4.8 24.1818H6V22.9091H4.8V24.1818ZM7.2 26.7273H8.4V25.4545H7.2V26.7273ZM2.4 19.0909H3.6V17.8182H2.4V19.0909ZM4.8 21.6364H6V20.3636H4.8V21.6364ZM7.2 24.1818H8.4V22.9091H7.2V24.1818ZM9.6 26.7273H10.8V25.4545H9.6V26.7273ZM2.4 16.5455H3.6V15.2727H2.4V16.5455ZM4.8 19.0909H6V17.8182H4.8V19.0909ZM7.2 21.6364H8.4V20.3636H7.2V21.6364ZM9.6 24.1818H10.8V22.9091H9.6V24.1818ZM2.4 14H3.6V12.7273H2.4V14ZM4.8 16.5455H6V15.2727H4.8V16.5455ZM7.2 19.0909H8.4V17.8182H7.2V19.0909ZM9.6 21.6364H10.8V20.3636H9.6V21.6364ZM2.4 11.4545H3.6V10.1818H2.4V11.4545ZM4.8 14H6V12.7273H4.8V14ZM7.2 16.5455H8.4V15.2727H7.2V16.5455ZM9.6 19.0909H10.8V17.8182H9.6V19.0909ZM2.4 8.90909H3.6V7.63636H2.4V8.90909ZM4.8 11.4545H6V10.1818H4.8V11.4545ZM7.2 14H8.4V12.7273H7.2V14ZM9.6 16.5455H10.8V15.2727H9.6V16.5455ZM2.4 6.36364H3.6V5.09091H2.4V6.36364ZM4.8 8.90909H6V7.63636H4.8V8.90909ZM7.2 11.4545H8.4V10.1818H7.2V11.4545ZM9.6 14H10.8V12.7273H9.6V14ZM2.4 3.81818H3.6V2.54546H2.4V3.81818ZM4.8 6.36364H6V5.09091H4.8V6.36364ZM7.2 8.90909H8.4V7.63636H7.2V8.90909ZM9.6 11.4545H10.8V10.1818H9.6V11.4545ZM4.8 3.81818H6V2.54546H4.8V3.81818ZM7.2 6.36364H8.4V5.09091H7.2V6.36364ZM9.6 8.90909H10.8V7.63636H9.6V8.90909ZM7.2 3.81818H8.4V2.54546H7.2V3.81818ZM9.6 6.36364H10.8V5.09091H9.6V6.36364ZM9.6 3.81818H10.8V2.54546H9.6V3.81818Z',
  light: 'M10.8 1.27273V0H12V1.27273H10.8ZM0 28V26.7273H1.2V28H0ZM0 25.4545V24.1818H1.2V25.4545H0ZM1.2 26.7273V25.4545H2.4V26.7273H1.2ZM2.4 28V26.7273H3.6V28H2.4ZM0 22.9091V21.6364H1.2V22.9091H0ZM1.2 24.1818V22.9091H2.4V24.1818H1.2ZM2.4 25.4545V24.1818H3.6V25.4545H2.4ZM3.6 26.7273V25.4545H4.8V26.7273H3.6ZM4.8 28V26.7273H6V28H4.8ZM0 20.3636V19.0909H1.2V20.3636H0ZM1.2 21.6364V20.3636H2.4V21.6364H1.2ZM2.4 22.9091V21.6364H3.6V22.9091H2.4ZM3.6 24.1818V22.9091H4.8V24.1818H3.6ZM4.8 25.4545V24.1818H6V25.4545H4.8ZM6 26.7273V25.4545H7.2V26.7273H6ZM7.2 28V26.7273H8.4V28H7.2ZM0 17.8182V16.5455H1.2V17.8182H0ZM1.2 19.0909V17.8182H2.4V19.0909H1.2ZM2.4 20.3636V19.0909H3.6V20.3636H2.4ZM3.6 21.6364V20.3636H4.8V21.6364H3.6ZM4.8 22.9091V21.6364H6V22.9091H4.8ZM6 24.1818V22.9091H7.2V24.1818H6ZM7.2 25.4545V24.1818H8.4V25.4545H7.2ZM8.4 26.7273V25.4545H9.6V26.7273H8.4ZM9.6 28V26.7273H10.8V28H9.6ZM0 15.2727V14H1.2V15.2727H0ZM1.2 16.5455V15.2727H2.4V16.5455H1.2ZM2.4 17.8182V16.5455H3.6V17.8182H2.4ZM3.6 19.0909V17.8182H4.8V19.0909H3.6ZM4.8 20.3636V19.0909H6V20.3636H4.8ZM6 21.6364V20.3636H7.2V21.6364H6ZM7.2 22.9091V21.6364H8.4V22.9091H7.2ZM8.4 24.1818V22.9091H9.6V24.1818H8.4ZM9.6 25.4545V24.1818H10.8V25.4545H9.6ZM10.8 26.7273V25.4545H12V26.7273H10.8ZM0 12.7273V11.4545H1.2V12.7273H0ZM1.2 14V12.7273H2.4V14H1.2ZM2.4 15.2727V14H3.6V15.2727H2.4ZM3.6 16.5455V15.2727H4.8V16.5455H3.6ZM4.8 17.8182V16.5455H6V17.8182H4.8ZM6 19.0909V17.8182H7.2V19.0909H6ZM7.2 20.3636V19.0909H8.4V20.3636H7.2ZM8.4 21.6364V20.3636H9.6V21.6364H8.4ZM9.6 22.9091V21.6364H10.8V22.9091H9.6ZM10.8 24.1818V22.9091H12V24.1818H10.8ZM0 10.1818V8.90909H1.2V10.1818H0ZM1.2 11.4545V10.1818H2.4V11.4545H1.2ZM2.4 12.7273V11.4545H3.6V12.7273H2.4ZM3.6 14V12.7273H4.8V14H3.6ZM4.8 15.2727V14H6V15.2727H4.8ZM6 16.5455V15.2727H7.2V16.5455H6ZM7.2 17.8182V16.5455H8.4V17.8182H7.2ZM8.4 19.0909V17.8182H9.6V19.0909H8.4ZM9.6 20.3636V19.0909H10.8V20.3636H9.6ZM10.8 21.6364V20.3636H12V21.6364H10.8ZM0 7.63636V6.36364H1.2V7.63636H0ZM1.2 8.90909V7.63636H2.4V8.90909H1.2ZM2.4 10.1818V8.90909H3.6V10.1818H2.4ZM3.6 11.4545V10.1818H4.8V11.4545H3.6ZM4.8 12.7273V11.4545H6V12.7273H4.8ZM6 14V12.7273H7.2V14H6ZM7.2 15.2727V14H8.4V15.2727H7.2ZM8.4 16.5455V15.2727H9.6V16.5455H8.4ZM9.6 17.8182V16.5455H10.8V17.8182H9.6ZM10.8 19.0909V17.8182H12V19.0909H10.8ZM0 5.09091V3.81818H1.2V5.09091H0ZM1.2 6.36364V5.09091H2.4V6.36364H1.2ZM2.4 7.63636V6.36364H3.6V7.63636H2.4ZM3.6 8.90909V7.63636H4.8V8.90909H3.6ZM4.8 10.1818V8.90909H6V10.1818H4.8ZM6 11.4545V10.1818H7.2V11.4545H6ZM7.2 12.7273V11.4545H8.4V12.7273H7.2ZM8.4 14V12.7273H9.6V14H8.4ZM9.6 15.2727V14H10.8V15.2727H9.6ZM10.8 16.5455V15.2727H12V16.5455H10.8ZM0 2.54546V1.27273H1.2V2.54546H0ZM1.2 3.81818V2.54546H2.4V3.81818H1.2ZM2.4 5.09091V3.81818H3.6V5.09091H2.4ZM3.6 6.36364V5.09091H4.8V6.36364H3.6ZM4.8 7.63636V6.36364H6V7.63636H4.8ZM6 8.90909V7.63636H7.2V8.90909H6ZM7.2 10.1818V8.90909H8.4V10.1818H7.2ZM8.4 11.4545V10.1818H9.6V11.4545H8.4ZM9.6 12.7273V11.4545H10.8V12.7273H9.6ZM10.8 14V12.7273H12V14H10.8ZM1.2 1.27273V0H2.4V1.27273H1.2ZM2.4 2.54546V1.27273H3.6V2.54546H2.4ZM3.6 3.81818V2.54546H4.8V3.81818H3.6ZM4.8 5.09091V3.81818H6V5.09091H4.8ZM6 6.36364V5.09091H7.2V6.36364H6ZM7.2 7.63636V6.36364H8.4V7.63636H7.2ZM8.4 8.90909V7.63636H9.6V8.90909H8.4ZM9.6 10.1818V8.90909H10.8V10.1818H9.6ZM10.8 11.4545V10.1818H12V11.4545H10.8ZM3.6 1.27273V0H4.8V1.27273H3.6ZM4.8 2.54546V1.27273H6V2.54546H4.8ZM6 3.81818V2.54546H7.2V3.81818H6ZM7.2 5.09091V3.81818H8.4V5.09091H7.2ZM8.4 6.36364V5.09091H9.6V6.36364H8.4ZM9.6 7.63636V6.36364H10.8V7.63636H9.6ZM10.8 8.90909V7.63636H12V8.90909H10.8ZM6 1.27273V0H7.2V1.27273H6ZM7.2 2.54546V1.27273H8.4V2.54546H7.2ZM8.4 3.81818V2.54546H9.6V3.81818H8.4ZM9.6 5.09091V3.81818H10.8V5.09091H9.6ZM10.8 6.36364V5.09091H12V6.36364H10.8ZM8.4 1.27273V0H9.6V1.27273H8.4ZM9.6 2.54546V1.27273H10.8V2.54546H9.6ZM10.8 3.81818V2.54546H12V3.81818H10.8Z',
  lighter: 'M10.6667 1.33333V0H12V1.33333H10.6667ZM0 1.33333V0H1.33333V1.33333H0ZM2.66667 1.33333V0H4V1.33333H2.66667ZM5.33333 1.33333V0H6.66667V1.33333H5.33333ZM8 1.33333V0H9.33333V1.33333H8ZM10.6667 4V2.66667H12V4H10.6667ZM0 4V2.66667H1.33333V4H0ZM2.66667 4V2.66667H4V4H2.66667ZM5.33333 4V2.66667H6.66667V4H5.33333ZM8 4V2.66667H9.33333V4H8ZM10.6667 6.66667V5.33333H12V6.66667H10.6667ZM0 6.66667V5.33333H1.33333V6.66667H0ZM2.66667 6.66667V5.33333H4V6.66667H2.66667ZM5.33333 6.66667V5.33333H6.66667V6.66667H5.33333ZM8 6.66667V5.33333H9.33333V6.66667H8ZM10.6667 9.33333V8H12V9.33333H10.6667ZM0 9.33333V8H1.33333V9.33333H0ZM2.66667 9.33333V8H4V9.33333H2.66667ZM5.33333 9.33333V8H6.66667V9.33333H5.33333ZM8 9.33333V8H9.33333V9.33333H8ZM10.6667 12V10.6667H12V12H10.6667ZM0 12V10.6667H1.33333V12H0ZM2.66667 12V10.6667H4V12H2.66667ZM5.33333 12V10.6667H6.66667V12H5.33333ZM8 12V10.6667H9.33333V12H8ZM10.6667 14.6667V13.3333H12V14.6667H10.6667ZM0 14.6667V13.3333H1.33333V14.6667H0ZM2.66667 14.6667V13.3333H4V14.6667H2.66667ZM5.33333 14.6667V13.3333H6.66667V14.6667H5.33333ZM8 14.6667V13.3333H9.33333V14.6667H8ZM10.6667 17.3333V16H12V17.3333H10.6667ZM0 17.3333V16H1.33333V17.3333H0ZM2.66667 17.3333V16H4V17.3333H2.66667ZM5.33333 17.3333V16H6.66667V17.3333H5.33333ZM8 17.3333V16H9.33333V17.3333H8ZM10.6667 20V18.6667H12V20H10.6667ZM0 20V18.6667H1.33333V20H0ZM2.66667 20V18.6667H4V20H2.66667ZM5.33333 20V18.6667H6.66667V20H5.33333ZM8 20V18.6667H9.33333V20H8ZM10.6667 22.6667V21.3333H12V22.6667H10.6667ZM0 22.6667V21.3333H1.33333V22.6667H0ZM2.66667 22.6667V21.3333H4V22.6667H2.66667ZM5.33333 22.6667V21.3333H6.66667V22.6667H5.33333ZM8 22.6667V21.3333H9.33333V22.6667H8ZM10.6667 25.3333V24H12V25.3333H10.6667ZM0 25.3333V24H1.33333V25.3333H0ZM2.66667 25.3333V24H4V25.3333H2.66667ZM5.33333 25.3333V24H6.66667V25.3333H5.33333ZM8 25.3333V24H9.33333V25.3333H8ZM10.6667 28V26.6667H12V28H10.6667ZM0 28V26.6667H1.33333V28H0ZM2.66667 28V26.6667H4V28H2.66667ZM5.33333 28V26.6667H6.66667V28H5.33333ZM8 28V26.6667H9.33333V28H8Z',
}

const SEQUENCE = ['lighter', 'light', 'medium', 'dark'] as const
const OPACITIES = [0.8, 0.6, 0.4, 0.2]
const STAGGER   = 35
const DURATION  = 50

// ─── SVG block element ──────────────────────────────────────────────────────

function AsciiBlock({ pathKey, size, opacity, color }: {
  pathKey: string; size: number; opacity: number; color: string
}) {
  const w = (12 * size / 28).toFixed(2)
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 12 28"
      style={{
        display: 'block',
        flexShrink: 0,
        opacity,
        transition: `opacity ${DURATION}ms ease`,
      }}
      aria-hidden="true"
    >
      <path d={BLOCK_PATHS[pathKey]} fill={color} />
    </svg>
  )
}

// ─── Block strip (one side) ─────────────────────────────────────────────────

function AsciiStrip({ side, size, opacities, color }: {
  side: 'left' | 'right'; size: number; opacities: number[]; color: string
}) {
  const keys = side === 'right' ? SEQUENCE : [...SEQUENCE].reverse()

  return (
    <div
      style={{
        position: 'absolute',
        top: 'var(--ascii-pad-y, 4px)',
        bottom: 'var(--ascii-pad-y, 4px)',
        [side === 'right' ? 'right' : 'left']: 'var(--ascii-pad-x, 4px)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {keys.map((key, col) => {
        const dist = side === 'right' ? (SEQUENCE.length - 1) - col : col
        return (
          <AsciiBlock
            key={key}
            pathKey={key}
            size={size}
            opacity={opacities[dist]}
            color={color}
          />
        )
      })}
    </div>
  )
}

// ─── Hook: manages animation state machine ──────────────────────────────────

function useAsciiAnimation() {
  const stateRef  = useRef<string>('out')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const queuedRef = useRef<string | null>(null)

  const [opacitiesR, setOpacitiesR] = useState([0, 0, 0, 0])
  const [opacitiesL, setOpacitiesL] = useState([0, 0, 0, 0])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const setOpacity = useCallback((dist: number, value: number) => {
    setOpacitiesR(prev => { const n = [...prev]; n[dist] = value; return n })
    setOpacitiesL(prev => { const n = [...prev]; n[dist] = value; return n })
  }, [])

  const runIn = useCallback(() => {
    stateRef.current = 'animating-in'
    queuedRef.current = null
    const total = (OPACITIES.length - 1) * STAGGER + DURATION

    OPACITIES.forEach((targetOpacity, dist) => {
      const t = setTimeout(() => setOpacity(dist, targetOpacity), dist * STAGGER)
      timersRef.current.push(t)
    })

    timersRef.current.push(setTimeout(() => {
      stateRef.current = 'in'
      if (queuedRef.current === 'out') runOut()
      queuedRef.current = null
    }, total))
  }, [setOpacity]) // eslint-disable-line react-hooks/exhaustive-deps

  const runOut = useCallback(() => {
    stateRef.current = 'animating-out'
    queuedRef.current = null
    const n = OPACITIES.length
    const total = (n - 1) * STAGGER + DURATION

    OPACITIES.forEach((_, dist) => {
      const delay = (n - 1 - dist) * STAGGER
      const t = setTimeout(() => setOpacity(dist, 0), delay)
      timersRef.current.push(t)
    })

    timersRef.current.push(setTimeout(() => {
      stateRef.current = 'out'
      if (queuedRef.current === 'in') runIn()
      queuedRef.current = null
    }, total))
  }, [setOpacity]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnter = useCallback(() => {
    if      (stateRef.current === 'out')           { clearTimers(); runIn() }
    else if (stateRef.current === 'animating-out') { queuedRef.current = 'in' }
  }, [clearTimers, runIn])

  const handleLeave = useCallback(() => {
    if      (stateRef.current === 'in')            { clearTimers(); runOut() }
    else if (stateRef.current === 'animating-in')  { queuedRef.current = 'out' }
  }, [clearTimers, runOut])

  const activate   = handleEnter
  const deactivate = handleLeave

  return { opacitiesR, opacitiesL, handleEnter, handleLeave, activate, deactivate }
}

// ─── Main component ─────────────────────────────────────────────────────────

type AsciiHoverProps = {
  children: ReactNode
  variant?: 'right' | 'left' | 'both'
  color?: string
  active?: boolean
  className?: string
  style?: CSSProperties
}

export function AsciiHover({
  children,
  variant = 'right',
  color = '#858585',
  active,
  className = '',
  style = {},
}: AsciiHoverProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [blockSize, setBlockSize] = useState(20)
  const { opacitiesR, opacitiesL, handleEnter, handleLeave, activate, deactivate } = useAsciiAnimation()

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const measure = () => {
      const cs   = getComputedStyle(el)
      const padT = parseFloat(cs.paddingTop)
      const padB = parseFloat(cs.paddingBottom)
      setBlockSize(Math.max(8, el.offsetHeight - padT - padB))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (active === undefined) return
    if (active) activate()
    else deactivate()
  }, [active, activate, deactivate])

  const showRight = variant === 'right' || variant === 'both'
  const showLeft  = variant === 'left'  || variant === 'both'

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseEnter={active === undefined ? handleEnter : undefined}
      onMouseLeave={active === undefined ? handleLeave : undefined}
    >
      {showRight && <AsciiStrip side="right" size={blockSize} opacities={opacitiesR} color={color} />}
      {showLeft  && <AsciiStrip side="left"  size={blockSize} opacities={opacitiesL} color={color} />}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

export { useAsciiAnimation, AsciiStrip, AsciiBlock }

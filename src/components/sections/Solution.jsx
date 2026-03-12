import { useEffect, useRef, useState } from 'react'
import NotifCard from '../design-system/NotifCard'
import useBayerDither from '../../hooks/useBayerDither'
import { STATIC_DITHER_OPTS } from '../../lib/constants'

const CODE_LINES = [
  '// npm install @canary/sdk',
  "import canary from '@canary/sdk'",
  "canary.connect(myAgent, { apiKey: 'ck_...' })",
]

const FULL_CODE_TEXT = CODE_LINES.join('\n')

const NOTIF_DATA = [
  { dot: 'green', agent: 'AGENT_01', action: 'opened /contracts/Q4_vendor.pdf', detail: '14:32:07 · eval: on_task · 89ms', badge: 'OBSERVED', badgeVariant: 'green' },
  { dot: 'green', agent: 'AGENT_01', action: 'input.fill on #compose_message', detail: '14:32:09 · eval: safe_content · no PII', badge: 'OBSERVED', badgeVariant: 'green' },
  { dot: 'red', agent: 'AGENT_02', action: 'attempted policy-restricted file write', detail: '14:32:17 · intervention triggered', badge: 'BLOCKED', badgeVariant: 'red' },
]

export default function Solution() {
  const canvasRef = useBayerDither(STATIC_DITHER_OPTS)
  const codeRef = useRef(null)
  const [codeText, setCodeText] = useState('')
  const [visibleNotifs, setVisibleNotifs] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = codeRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let charIndex = 0
          const interval = setInterval(() => {
            charIndex++
            setCodeText(FULL_CODE_TEXT.substring(0, charIndex))
            const typed = FULL_CODE_TEXT.substring(0, charIndex)
            const lineCount = typed.split('\n').length
            setVisibleNotifs(Math.min(lineCount, NOTIF_DATA.length))
            if (charIndex >= FULL_CODE_TEXT.length) clearInterval(interval)
          }, 35)
        }
      })
    }, { threshold: 0.3 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="solution" className="section-dark">
      <canvas ref={canvasRef} className="dither-canvas dither-canvas--70" />
      <div className="section-inner">
        <div className="solution-grid">
          <div className="z-elevated">
            <span className="section-label">{'{SOLUTION}'}</span>
            <h2 className="section-headline">One line of code.<br />Every action traced.</h2>
            <p className="section-body">
              Canary automatically observes every computer-use action, scores it against your
              requirements, and surfaces patterns across all your agents.
            </p>
            <div className="solution-code" ref={codeRef}>
              {codeText || '\u00A0'}
              {codeText.length < FULL_CODE_TEXT.length && codeText.length > 0 && (
                <span className="typing-cursor">|</span>
              )}
            </div>
          </div>
          <div className="z-elevated">
            <div className="solution-notifs">
              {NOTIF_DATA.slice(0, visibleNotifs).map((item, i) => (
                <div className="solution-notif-item" key={i}>
                  <NotifCard
                    dot={item.dot}
                    agent={item.agent}
                    action={item.action}
                    detail={item.detail}
                    badge={item.badge}
                    badgeVariant={item.badgeVariant}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

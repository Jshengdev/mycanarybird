import NotifCard from '../design-system/NotifCard'
import useBayerDither from '../../hooks/useBayerDither'
import useLiveFeedTicker from '../../hooks/useLiveFeedTicker'
import { STATIC_DITHER_OPTS } from '../../lib/constants'

const initialFeedItems = [
  { id: 'init-1', dot: 'green',  agent: 'AGENT_01', action: 'opened /contracts/Q4_vendor.pdf', detail: '14:32:07 · 89ms · task_match: true', badge: 'OBSERVED', badgeVariant: 'green' },
  { id: 'init-2', dot: 'amber',  agent: 'AGENT_02', action: 'navigated to unexpected domain', detail: '14:32:09 · outside expected path · reviewing', badge: 'FLAGGED', badgeVariant: 'amber' },
  { id: 'init-3', dot: 'green',  agent: 'AGENT_03', action: 'form.submit() on /checkout', detail: '14:32:14 · 142ms · conversion: success', badge: 'OBSERVED', badgeVariant: 'green' },
  { id: 'init-4', dot: 'red',    agent: 'AGENT_02', action: 'attempted policy-restricted file write', detail: '14:32:17 · intervention triggered · team notified', badge: 'BLOCKED', badgeVariant: 'red' },
  { id: 'init-5', dot: 'green',  agent: 'AGENT_01', action: 'task.complete: contract_review_done', detail: '14:33:02 · 7/7 evals passed · score: 98.4', badge: 'COMPLETE', badgeVariant: 'green' },
]

export default function LiveFeed() {
  const canvasRef = useBayerDither(STATIC_DITHER_OPTS)
  const items = useLiveFeedTicker(initialFeedItems)

  return (
    <section id="live" className="section-dark">
      <canvas ref={canvasRef} className="dither-canvas dither-canvas--75" />
      <div className="section-inner z-elevated">
        <div className="feed-grid">
          <div>
            <span className="section-label">[DASHBOARD]</span>
            <h2 className="section-headline">Your fleet.<br />One screen.<br />Zero blind spots.</h2>
            <p className="section-body">
              Three agents or three hundred — Canary gives you a single pane of glass
              across every deployment. Anomalies surface before they compound.
            </p>
            <p className="section-body section-body--spaced">
              Filter by agent, task, or risk level. Drill into any session in one click.
            </p>
          </div>
          <div>
            <div className="feed-header">
              <div className="feed-dot-live" />
              CANARY · LIVE FEED · 3 AGENTS RUNNING
            </div>
            <div className="feed-stream">
              {items.map((item) => (
                <div className="feed-item" key={item.id}>
                  <NotifCard
                    dot={item.dot}
                    agent={item.agent}
                    action={item.action}
                    detail={item.detail || `${item.timestamp} · canary.observed`}
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

import NotifCard from '../design-system/NotifCard'
import NotifCardMulti from '../design-system/NotifCardMulti'
import Button from '../design-system/Button'
import useBayerDither from '../../hooks/useBayerDither'
import useCountUp from '../../hooks/useCountUp'
import { CTA_DITHER_OPTS } from '../../lib/constants'

export default function Invitation() {
  const canvasRef = useBayerDither(CTA_DITHER_OPTS)
  const { ref: tamRef, display: tamDisplay } = useCountUp(183, { prefix: '$', suffix: 'B', duration: 2.5 })
  const { ref: execRef, display: execDisplay } = useCountUp(93, { suffix: '%', duration: 2 })
  const { ref: approvalRef, display: approvalDisplay } = useCountUp(14.4, { suffix: '%', duration: 2, decimals: 1 })

  return (
    <section className="invitation" id="early-access">
      <canvas ref={canvasRef} className="dither-canvas dither-canvas--80" />
      <div className="section-inner z-elevated">
        {/* Market stats */}
        <div className="invitation-market">
          <span className="section-label">(MARKET)</span>
          <div className="invitation-market-hero">
            $7.6B &rarr; <span ref={tamRef}>{tamDisplay}</span>
          </div>
          <p className="invitation-market-sub">AI agent market, 2025–2033 · 49.6% CAGR</p>

          <div className="invitation-stats">
            <div className="invitation-stat-card">
              <div className="invitation-stat-num green" ref={execRef}>{execDisplay}</div>
              <div className="invitation-stat-label">of IT executives want to deploy agentic AI</div>
            </div>
            <div className="invitation-stat-card">
              <div className="invitation-stat-num amber" ref={approvalRef}>{approvalDisplay}</div>
              <div className="invitation-stat-label">have received security approval — the trust gap is the market</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="invitation-cta">
          <h2 className="section-headline section-headline--centered">
            Help us make agents<br />trustworthy.
          </h2>

          <div className="cta-notifications">
            <NotifCardMulti>
              <NotifCard dot="indigo" agent="CANARY" action="stage: pre-seed · seeking: early access beta" badge="OPEN" badgeVariant="indigo" />
              <NotifCard dot="amber" agent="CANARY" action="target: every agent developer on the planet" badge="AMBITIOUS" badgeVariant="amber" />
              <NotifCard dot="indigo" agent="CANARY" action="vision: agents that are observed, trusted, deployed" badge="INEVITABLE" badgeVariant="indigo" />
            </NotifCardMulti>
          </div>

          <Button href="mailto:hello@mycanarybird.com" className="btn-centered">
            Request early access &rarr;
          </Button>
          <p className="cta-tagline">// the future is agentic. canary makes it trustworthy.</p>
        </div>

        {/* Footer */}
        <footer className="invitation-footer">
          <div className="footer-logo">
            <div className="nav-dot nav-dot--sm" />
            CANARY
          </div>
          <span>&copy; 2026 Canary</span>
        </footer>
      </div>
    </section>
  )
}

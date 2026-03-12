import { useRef } from 'react'
import Button from '../design-system/Button'
import useBayerDither from '../../hooks/useBayerDither'
import { HERO_DITHER_OPTS } from '../../lib/constants'
import NotifCard from '../design-system/NotifCard'

export default function Hero() {
  const sectionRef = useRef(null)
  const canvasRef = useBayerDither(HERO_DITHER_OPTS, true, sectionRef)

  return (
    <section className="hero" ref={sectionRef}>
      <canvas ref={canvasRef} className="dither-canvas dither-canvas--75" />

      <div className="hero-content">
        <div className="hero-label">
          <span>●</span> THE FUTURE OF AGENTS IS ON DESKTOP
        </div>

        <h1 className="hero-title">
          See what your<br /><em>agents actually do.</em>
        </h1>

        <p className="hero-sub">
          Current eval tools check what agents say.<br />
          Canary watches what they do — every click, file, command.
        </p>

        {/* Static demo mockup instead of Remotion player */}
        <div className="hero-demo">
          <div className="hero-demo-wrapper">
            <div className="hero-observer-badge">
              <div className="observer-dot" />
              CANARY OBSERVING
            </div>
            <div className="hero-demo-window">
              <div className="desktop-titlebar">
                <div className="titlebar-dots">
                  <span className="td td-red" />
                  <span className="td td-amber" />
                  <span className="td td-green" />
                </div>
                <div className="titlebar-label">agent_session · messaging_app</div>
                <div className="titlebar-right" />
              </div>
              <div className="hero-demo-body">
                <div className="sim-topbar">
                  <div className="sim-tab active">INBOX</div>
                  <div className="sim-tab">SENT</div>
                  <div className="sim-tab">DRAFTS</div>
                </div>
                <div className="sim-content">
                  <div className="sim-msg-row highlighted">
                    <div className="sim-avatar sim-avatar--indigo" />
                    <div className="sim-msg-info">
                      <div className="sim-msg-name">Sarah Chen</div>
                      <div className="sim-msg-preview">Re: Q4 Vendor Contract Review - updated terms...</div>
                    </div>
                    <div className="sim-msg-time">2:31 PM</div>
                  </div>
                  <div className="sim-msg-row">
                    <div className="sim-avatar sim-avatar--emerald" />
                    <div className="sim-msg-info">
                      <div className="sim-msg-name">Dev Team</div>
                      <div className="sim-msg-preview">Build #847 passed - all tests green</div>
                    </div>
                    <div className="sim-msg-time">2:28 PM</div>
                  </div>
                  <div className="sim-msg-row">
                    <div className="sim-avatar sim-avatar--amber" />
                    <div className="sim-msg-info">
                      <div className="sim-msg-name">Alex Rivera</div>
                      <div className="sim-msg-preview">Can you review the deployment checklist?</div>
                    </div>
                    <div className="sim-msg-time">2:15 PM</div>
                  </div>
                </div>
                <div className="sim-compose-bar">
                  <div className="sim-input typing">Drafting reply to Sarah about contract terms...</div>
                  <div className="sim-send">SEND</div>
                </div>
              </div>
            </div>
            <div className="hero-notif-stream">
              <NotifCard dot="green" agent="AGENT_01" action="opened /contracts/Q4_vendor.pdf" badge="OBSERVED" badgeVariant="green" />
              <NotifCard dot="green" agent="AGENT_01" action="input.fill on #compose_message" badge="OBSERVED" badgeVariant="green" />
              <NotifCard dot="red" agent="AGENT_01" action="attempted access to /credentials/keychain" badge="BLOCKED" badgeVariant="red" />
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <Button href="#early-access">Request early access &rarr;</Button>
          <Button href="#how" variant="ghost">See how it works</Button>
        </div>
      </div>
    </section>
  )
}

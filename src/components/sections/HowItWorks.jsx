import StepItem from '../design-system/StepItem'
import NotifCard from '../design-system/NotifCard'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function HowItWorks() {
  const sectionRef = useScrollReveal()

  return (
    <section className="section-light" id="how" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-center reveal">
          <span className="section-label">[HOW IT WORKS]</span>
          <h2 className="section-headline">Plug in. Watch everything.</h2>
        </div>

        <div className="steps-row-wrap reveal">
          <svg className="steps-svg" aria-hidden="true">
            <line className="steps-connector" x1="12.5%" y1="20" x2="87.5%" y2="20" />
          </svg>

          <div className="steps-row">
            <StepItem num={1} title="CONNECT SDK" desc={<>One npm install.<br />Three lines of code.</>} code="npm install @canary/sdk" />
            <StepItem num={2} title="AGENT RUNS" desc="Your agent does its work normally. No changes." />
            <StepItem num={3} title="ACTIONS OBSERVED" desc="Every click, file access, and command. Automatically." />
            <StepItem num={4} title="PATTERNS SURFACED" desc="Dashboard, alerts, and cross-agent intelligence." />
          </div>
        </div>

        <div className="how-example reveal">
          <NotifCard dot="green" agent="AGENT_01" action="form.submit() on /checkout" detail="eval: correct · 142ms · task_complete: true · safety: pass" badge="OBSERVED · 142ms" badgeVariant="green" theme="light" />
        </div>
      </div>
    </section>
  )
}

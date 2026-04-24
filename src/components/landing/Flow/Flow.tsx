'use client';

import { FlowStep } from './FlowStep';
import { FlowIntroSteps } from './FlowIntroSteps';
import { makeVideoVisual } from './visuals/VideoVisual';
import styles from './Flow.module.css';

/** Module-scope wrappers so FlowStep's `Visual` prop has stable component
 *  identity — inline arrow factories would remount the video every render. */
const InstallVisual = makeVideoVisual('/videos/integrate.mov');
const SeeVisual = makeVideoVisual('/videos/sessions.mov');
const StopVisual = makeVideoVisual('/videos/rules2.mov');
const LearnVisual = makeVideoVisual('/videos/insights2.mov');

/**
 * Flow — four-step arc of the Canary product: Install → See → Stop → Learn.
 *
 * Each FlowStep registers itself as its own canary-watch section. The mascot's
 * global section-switch logic (threshold + hysteresis + scroll-idle commit)
 * handles perch selection — Flow owns no active-index state of its own.
 */
export function Flow() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        <header className={styles.sectionHeader} data-snap>
          <div className={styles.sectionHeaderInner}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              HOW CANARY WORKS
            </span>
            <h2 className={styles.heading}>
              One session. Four moves. Every agent safer than the last.
            </h2>
            <p className={styles.subheading}>
              Canary is the trust layer that watches your agent, blocks the
              action you flagged, and writes rules for what it sees next time.
            </p>
            <FlowIntroSteps />
          </div>
        </header>

        <div className={styles.steps}>
          <FlowStep
            sectionId="flow-install"
            sectionOrder={3}
            sectionDisplayName="Flow · Install"
            number="01"
            label="Install"
            headline="Drop in the SDK. Canary starts watching."
            body="One npm install, one init call. Canary plugs into Claude Code, Browser Use, openClaw, Hermes — or any stack that can POST an event."
            stat={{
              value: '~5 min',
              caption: 'Install to first recorded session.',
            }}
            orientation="left"
            Visual={InstallVisual}
            dropKey="install"
            initialPerch="numberRow"
          />

          <FlowStep
            sectionId="flow-see"
            sectionOrder={4}
            sectionDisplayName="Flow · See"
            number="02"
            label="See"
            headline="Replay 12 hours of agent work in 30 seconds."
            body="Every click, keystroke, and screen state — captured. Other tools trace what your agent said. Canary shows what it did."
            stat={{
              value: '30s',
              caption: '12 hours of agent work, one scrubbable timeline.',
            }}
            orientation="right"
            Visual={SeeVisual}
            dropKey="see"
          />

          <FlowStep
            sectionId="flow-stop"
            sectionOrder={5}
            sectionDisplayName="Flow · Stop"
            number="03"
            label="Stop"
            headline="Write a rule in plain English. Canary blocks it before it runs."
            body={
              <>
                &ldquo;Don&rsquo;t touch admin settings.&rdquo;
                &ldquo;Don&rsquo;t email new domains.&rdquo; Canary compiles
                plain-English rules into policy and enforces them on every
                action the agent attempts.
              </>
            }
            stat={{
              value: '13/13',
              caption: 'Violations caught on the ClaimDesk benchmark.',
            }}
            orientation="left"
            Visual={StopVisual}
            dropKey="stop"
          />

          <FlowStep
            sectionId="flow-learn"
            sectionOrder={6}
            sectionDisplayName="Flow · Learn"
            number="04"
            label="Learn"
            headline="After every session, Canary writes the next rule."
            body="Canary reviews what your agent did and drafts rules that would have prevented any mistake. One click to add — and that mistake can't happen again."
            stat={{
              value: '1 click',
              caption: 'Suggested rule live before the next session.',
            }}
            orientation="right"
            Visual={LearnVisual}
            dropKey="learn"
          />
        </div>
      </div>
    </section>
  );
}

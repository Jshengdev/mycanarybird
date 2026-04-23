import { type RefObject } from 'react';
import { ReelFrame } from './ReelFrame';

export interface FrameControlProps {
  isActive: boolean;
  /** Mascot perches on the "BLOCKED" stripe — where the eye lands to
   *  understand the outcome of the rule. */
  innerPerchRef?: RefObject<HTMLDivElement>;
}

export function FrameControl({ isActive, innerPerchRef }: FrameControlProps) {
  return (
    <ReelFrame
      isActive={isActive}
      label="Control"
      headline="Write a rule in plain English. Canary blocks the action before it runs."
      body={
        <>
          &quot;Don&apos;t touch admin settings.&quot; &quot;Don&apos;t email
          new domains.&quot; Canary compiles rules like these into policy
          and enforces them on every action.
        </>
      }
      stat={{
        value: '13/13',
        caption: 'Violations caught in the ClaimDesk benchmark.',
      }}
      visual={<ControlPlaceholder innerPerchRef={innerPerchRef} />}
    />
  );
}

function ControlPlaceholder({ innerPerchRef }: { innerPerchRef?: RefObject<HTMLDivElement> }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-black)',
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: 'var(--radius-card)',
          padding: 12,
          flex: 1,
        }}
      >
        <div style={{ color: 'var(--icon-grey)', fontSize: 10, marginBottom: 8, letterSpacing: '0.08em' }}>
          rules/outreach.ts
        </div>
        <div style={{ color: 'var(--text-black)' }}>
          canary.rule(<span style={{ color: 'var(--accent-color)' }}>&quot;no-spam-pattern&quot;</span>, &#123;
          <br />
          &nbsp;&nbsp;match: /unsubscribe.*urgent/i,
          <br />
          &nbsp;&nbsp;action: &quot;block&quot;,
          <br />
          &#125;)
        </div>
      </div>
      <div
        ref={innerPerchRef}
        style={{
          padding: '10px 14px',
          background: 'rgba(184, 64, 64, 0.06)',
          border: '1px solid var(--critical)',
          borderRadius: 'var(--radius-card)',
          color: 'var(--critical)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>● BLOCKED · OUTREACH SEND</span>
        <span>14:23:18</span>
      </div>
    </div>
  );
}

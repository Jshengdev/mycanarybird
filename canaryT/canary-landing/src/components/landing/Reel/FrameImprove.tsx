import { type RefObject } from 'react';
import { ReelFrame } from './ReelFrame';

export interface FrameImproveProps {
  isActive: boolean;
  /** Mascot perches on the first suggested rule when this frame is active. */
  innerPerchRef?: RefObject<HTMLDivElement>;
}

export function FrameImprove({ isActive, innerPerchRef }: FrameImproveProps) {
  return (
    <ReelFrame
      isActive={isActive}
      label="Improve"
      headline="After every session, Canary writes rules."
      body={
        <>
          After each session, Canary reviews what your agent did and
          suggests rules that would have prevented any mistakes. You
          click add. That mistake can&apos;t happen again.
        </>
      }
      stat={{
        value: '1 click',
        caption: "Add a suggested rule and it's live before the next session.",
      }}
      visual={<ImprovePlaceholder innerPerchRef={innerPerchRef} />}
    />
  );
}

function ImprovePlaceholder({ innerPerchRef }: { innerPerchRef?: RefObject<HTMLDivElement> }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-black)',
      }}
    >
      <div style={{ color: 'var(--icon-grey)', fontSize: 10, letterSpacing: '0.08em' }}>
        SUGGESTED RULES · BASED ON 147 SESSIONS
      </div>
      <SuggestedRule
        innerRef={innerPerchRef}
        name="rate-limit-domain-sends"
        reason="Agent sent 12 emails to acme.inc in 3 minutes"
        confidence="94%"
      />
      <SuggestedRule
        name="require-human-review-for-contracts"
        reason="Agent opened 3 PDFs matching /contract\\.pdf/i"
        confidence="81%"
      />
      <SuggestedRule
        name="no-terraform-destroy-after-hours"
        reason="Destructive commands flagged 2× this week"
        confidence="76%"
      />
    </div>
  );
}

function SuggestedRule({
  name,
  reason,
  confidence,
  innerRef,
}: {
  name: string;
  reason: string;
  confidence: string;
  innerRef?: RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      style={{
        padding: 10,
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: 'var(--radius-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>+ {name}</span>
        <span style={{ color: 'var(--icon-grey)' }}>{confidence}</span>
      </div>
      <div style={{ color: 'var(--icon-grey)', fontSize: 10 }}>{reason}</div>
    </div>
  );
}

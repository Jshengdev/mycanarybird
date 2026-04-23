import { type RefObject } from 'react';
import { ReelFrame } from './ReelFrame';

export interface FrameObserveProps {
  isActive: boolean;
  /** Mascot perches on the session header when this frame is active. */
  innerPerchRef?: RefObject<HTMLDivElement>;
}

export function FrameObserve({ isActive, innerPerchRef }: FrameObserveProps) {
  return (
    <ReelFrame
      isActive={isActive}
      label="Observe"
      headline="See what your agent actually did."
      body={
        <>
          Scroll the screenshot timeline like a slideshow. Other tools
          trace what your agent said. Canary shows what it did.
        </>
      }
      stat={{
        value: '30s',
        caption: 'Review 12 hours of agent work in 30 seconds.',
      }}
      visual={<ObservePlaceholder innerPerchRef={innerPerchRef} />}
    />
  );
}

function ObservePlaceholder({ innerPerchRef }: { innerPerchRef?: RefObject<HTMLDivElement> }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-black)',
      }}
    >
      <div
        ref={innerPerchRef}
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--grey-stroke)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 600, letterSpacing: '0.08em' }}>
          SESSION · 2026-04-15 · 14:23:07
        </span>
        <span style={{ color: 'var(--safe)' }}>● RECORDING</span>
      </div>
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <LogRow t="14:23:09" a="CLICK" target="div.mail-compose" />
        <LogRow t="14:23:12" a="TYPE" target="To: contact@acme.inc" />
        <LogRow t="14:23:18" a="CLICK" target="button.send" highlight />
        <LogRow t="14:23:18" a="BLOCKED" target="canary.rule('no-spam-pattern')" critical />
      </div>
    </div>
  );
}

function LogRow({
  t,
  a,
  target,
  highlight,
  critical,
}: {
  t: string;
  a: string;
  target: string;
  highlight?: boolean;
  critical?: boolean;
}) {
  const color = critical ? 'var(--critical)' : highlight ? 'var(--text-black)' : 'var(--icon-grey)';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '70px 70px 1fr', gap: 12, color }}>
      <span>{t}</span>
      <span style={{ fontWeight: critical ? 600 : 400 }}>{a}</span>
      <span>{target}</span>
    </div>
  );
}

'use client';

import { AsciiMark } from '@/components/ui/AsciiMark/AsciiMark';
import styles from './FlowIntroSteps.module.css';

/**
 * FlowIntroSteps — a compact 4-tile preview strip that sits inside the Flow
 * section's header snap, directly under the main heading. Gives the reader a
 * whole-arc view of Canary's four moves (Install → See → Stop → Learn) before
 * they scroll into the per-step detail sections.
 *
 * Each tile is an anchor link pointing at the corresponding FlowStep's DOM id
 * (e.g. `#flow-install`). Native anchor navigation + `scroll-behavior: smooth`
 * on `html` (already set in globals.css) delivers the scroll — no JS needed.
 */
const STEPS = [
  {
    id: 'flow-install',
    number: '01',
    label: 'INSTALL',
    body: 'Hook into your stack in minutes.',
    variant: 1,
  },
  {
    id: 'flow-see',
    number: '02',
    label: 'SEE',
    body: 'Replay every agent move in 30s.',
    variant: 2,
  },
  {
    id: 'flow-stop',
    number: '03',
    label: 'STOP',
    body: 'Block violations before they run.',
    variant: 3,
  },
  {
    id: 'flow-learn',
    number: '04',
    label: 'LEARN',
    body: 'Canary proposes the next rule.',
    variant: 4,
  },
] as const;

export function FlowIntroSteps() {
  return (
    <ol className={styles.strip} aria-label="How Canary works — four steps">
      {STEPS.map((s) => (
        <li key={s.id} className={styles.tile}>
          <a href={`#${s.id}`} className={styles.tileLink}>
            <span className={styles.number} aria-hidden="true">
              {s.number}
            </span>
            <span className={styles.label}>{s.label}</span>
            <p className={styles.body}>{s.body}</p>
            <AsciiMark variant={s.variant} size={36} corner="bottom-right" />
          </a>
        </li>
      ))}
    </ol>
  );
}

export default FlowIntroSteps;

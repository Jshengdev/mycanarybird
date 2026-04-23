'use client';

import { useEffect, useRef, useState } from 'react';
import { USE_CASES } from './useCaseData';
import { UseCaseTab } from './UseCaseTab';
import { UseCaseContent } from './UseCaseContent';
import { useCanarySection, useCanaryWatch } from '@/components/canary-watch';
import styles from './UseCases.module.css';

/** Window in which hitting all 4 tabs counts as a learnable pattern. */
const TAB_CYCLE_WINDOW_MS = 6_000;

export function UseCases() {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const active = USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0];

  const { ref: sectionRef, perchRef, highlight } = useCanarySection({
    id: 'use-cases',
    order: 4,
    displayName: 'Use cases · Built for your team',
  });
  const { logEvent } = useCanaryWatch();

  // Round B: the bird perches on the active tab header. On tab click the
  // perchAnchor re-registers to the newly-active tab and the mascot moves
  // — no timed drift to the visual panel anymore.
  useEffect(() => {
    const tabEl = document.getElementById(`use-case-tab-${activeId}`);
    perchRef(tabEl);
  }, [activeId, perchRef]);

  // Tab-cycle detector: hitting every tab within TAB_CYCLE_WINDOW_MS fires
  // a LEARNED event — the "Canary spotted a repeat pattern" moment.
  const cycleRef = useRef<{ ids: Set<string>; startedAt: number; cooldownUntil: number }>({
    ids: new Set(),
    startedAt: 0,
    cooldownUntil: 0,
  });

  const handleTabClick = (ucId: string) => {
    setActiveId(ucId);
    const uc = USE_CASES.find((u) => u.id === ucId);
    logEvent(
      'OBSERVED',
      `Selected tab · ${uc?.tab ?? ucId}`
    );

    const state = cycleRef.current;
    const now = Date.now();
    if (now - state.startedAt > TAB_CYCLE_WINDOW_MS) {
      state.ids = new Set();
      state.startedAt = now;
    }
    state.ids.add(ucId);
    if (state.ids.size === USE_CASES.length && now > state.cooldownUntil) {
      const durSecs = ((now - state.startedAt) / 1000).toFixed(1);
      logEvent(
        'LEARNED',
        `Pattern · full tab cycle in ${durSecs}s · user comparing workflows`
      );
      state.ids = new Set();
      state.cooldownUntil = now + 30_000;
    }
  };

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = USE_CASES.findIndex((u) => u.id === activeId);
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % USE_CASES.length;
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + USE_CASES.length) % USE_CASES.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = USE_CASES.length - 1;
    else return;
    e.preventDefault();
    const nextId = USE_CASES[nextIdx].id;
    handleTabClick(nextId);
    const tabEl = document.getElementById(`use-case-tab-${nextId}`);
    tabEl?.focus();
  };

  return (
    <section ref={sectionRef} className={styles.section} id="use-cases" data-snap>
      <div className={styles.inner}>
        <h2
          ref={highlight('heading')}
          className={styles.heading}
        >Built for teams running</h2>

        <div className={styles.tabRow} role="tablist" onKeyDown={onTabKeyDown}>
          {USE_CASES.map((uc) => (
            <UseCaseTab
              key={uc.id}
              label={uc.tab}
              isActive={uc.id === activeId}
              onClick={() => handleTabClick(uc.id)}
              panelId={`use-case-panel-${uc.id}`}
              tabId={`use-case-tab-${uc.id}`}
            />
          ))}
        </div>

        <UseCaseContent useCase={active} />
      </div>
    </section>
  );
}

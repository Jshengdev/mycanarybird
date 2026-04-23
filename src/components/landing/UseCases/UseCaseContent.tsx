'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { UseCase } from './useCaseData';
import { UseCaseVisual } from './UseCaseVisual';
import { spring } from '@/lib/motion';
import styles from './UseCases.module.css';

export interface UseCaseContentProps {
  useCase: UseCase;
}

export function UseCaseContent({ useCase }: UseCaseContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={useCase.id}
        role="tabpanel"
        id={`use-case-panel-${useCase.id}`}
        aria-labelledby={`use-case-tab-${useCase.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={spring}
        className={styles.contentGrid}
      >
        <div className={styles.copyColumn}>
          <p className={styles.tagline}>{useCase.tagline}</p>

          <div className={styles.copyBlock}>
            <span className={styles.copyLabel}>The problem</span>
            <p className={styles.copyBody}>{useCase.problem}</p>
          </div>

          <div className={styles.copyBlock}>
            <span className={styles.copyLabel}>What Canary does</span>
            <p className={styles.copyBody}>{useCase.save}</p>
          </div>

          <div className={styles.copyBlock}>
            <span className={styles.copyLabel}>Example rules</span>
            <ul className={styles.ruleList}>
              {useCase.rules.map((r, i) => (
                <li key={i} className={`${styles.ruleRow} ${styles[`rule_${r.kind}`]}`}>
                  <span className={styles.ruleKind}>
                    {r.kind === 'block' ? 'BLOCK' : r.kind === 'flag' ? 'FLAG' : 'ALLOW'}
                  </span>
                  <span className={styles.ruleText}>{r.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.metric}>
            <span className={styles.metricValue}>{useCase.metric.value}</span>
            <span className={styles.metricCaption}>{useCase.metric.caption}</span>
          </div>
        </div>

        <div className={styles.visualColumn} aria-label={useCase.visualHint}>
          <div className={styles.visualContainer} data-uc-visual="true">
            <UseCaseVisual id={useCase.id} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

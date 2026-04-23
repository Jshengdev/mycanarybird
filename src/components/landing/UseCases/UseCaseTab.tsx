'use client';

import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import styles from './UseCases.module.css';

export interface UseCaseTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  panelId: string;
  tabId: string;
}

export function UseCaseTab({ label, isActive, onClick, panelId, tabId }: UseCaseTabProps) {
  return (
    <button
      type="button"
      id={tabId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
    >
      {isActive && (
        <motion.span
          layoutId="useCaseTabBorder"
          className={styles.tabBorder}
          transition={spring}
          aria-hidden="true"
        />
      )}
      <span className={styles.tabLabel}>{label}</span>
    </button>
  );
}

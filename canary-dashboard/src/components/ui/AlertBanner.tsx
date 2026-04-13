'use client';

import React, { useState, ReactNode } from 'react';
import { WandSparkles, X } from 'lucide-react';

export interface AlertBannerProps {
  children: ReactNode;
  onDismiss?: () => void;
}

export function AlertBanner({ children, onDismiss }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="flex items-center justify-between"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-4)',
      }}
    >
      <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
        <WandSparkles size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 500,
            color: 'var(--text-black)',
          }}
        >
          {children}
        </span>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <X size={12} style={{ color: 'var(--icon-grey)' }} />
      </button>
    </div>
  );
}

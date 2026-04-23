'use client';

import React, { useState, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface AlertBannerProps {
  children: ReactNode;
  accentColor?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  onDismiss?: () => void;
}

export function AlertBanner({ children, accentColor = 'var(--accent-color)', ctaLabel, onCtaClick, onDismiss }: AlertBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="flex items-center"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        overflow: 'hidden',
      }}
    >
      {/* Accent ASCII block on left */}
      <div
        style={{
          width: '4px',
          alignSelf: 'stretch',
          background: accentColor,
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div className="flex items-center" style={{ flex: 1, padding: 'var(--space-4)', gap: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1, color: accentColor, flexShrink: 0 }}>
          ░
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            lineHeight: '18px',
            fontWeight: 500,
            color: 'var(--text-black)',
            flex: 1,
          }}
        >
          {children}
        </span>

        {/* CTA button */}
        {ctaLabel && onCtaClick && (
          <Button variant="primary" size="sm" onClick={onCtaClick} style={{ flexShrink: 0 }}>
            {ctaLabel}
          </Button>
        )}

        {/* Close button */}
        <button
          aria-label="Dismiss alert"
          onClick={() => { setVisible(false); onDismiss?.(); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            flexShrink: 0,
            margin: 0,
            borderRadius: '0px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={12} style={{ color: 'var(--icon-grey)' }} />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastProps {
  variant: ToastVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const variantConfig: Record<ToastVariant, { color: string; block: string }> = {
  success: { color: 'var(--safe)', block: '░' },
  info: { color: 'var(--accent-color)', block: '▒' },
  warning: { color: 'var(--warning)', block: '▓' },
  error: { color: 'var(--critical)', block: '█' },
};

export function Toast({ variant, title, description, actionLabel, onAction, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (variant === 'error') return;
    if (hovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [variant, hovered, onDismiss]);

  if (!visible) return null;

  const config = variantConfig[variant];

  return (
    <div
      className="flex items-center"
      style={{
        width: '320px',
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-4)',
        gap: 'var(--space-3)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ASCII block indicator */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          lineHeight: '1',
          color: config.color,
          flexShrink: 0,
        }}
      >
        {config.block}
      </span>

      {/* Content — centered vertically via parent items-center */}
      <div className="flex flex-col" style={{ flex: 1, gap: '2px' }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 600,
            color: 'var(--text-black)',
          }}
        >
          {title}
        </span>
        {description && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 400,
              color: 'var(--icon-grey)',
            }}
          >
            {description}
          </span>
        )}
        {variant === 'info' && actionLabel && (
          <button
            onClick={onAction}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: 'var(--accent-color)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginTop: '5px',
              textAlign: 'left',
              transition: 'var(--transition-base)',
            }}
          >
            {actionLabel} →
          </button>
        )}
      </div>

      {/* Close button */}
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
          flexShrink: 0,
          alignSelf: 'flex-start',
          display: 'flex',
        }}
      >
        <X size={12} style={{ color: 'var(--icon-grey)' }} />
      </button>
    </div>
  );
}

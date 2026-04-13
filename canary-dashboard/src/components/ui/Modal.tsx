'use client';

import React, { useEffect, ReactNode } from 'react';
import { X, TriangleAlert } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'confirm' | 'form' | 'large';
  destructive?: boolean;
}

const sizeMap: Record<string, string> = {
  confirm: '400px',
  form: '480px',
  large: '600px',
};

export function Modal({ open, onClose, title, children, footer, size = 'form', destructive = false }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 10, 10, 0.45)',
          zIndex: 290,
        }}
      />
      <div
        className="flex flex-col"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: sizeMap[size],
          background: 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          zIndex: 300,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--grey-stroke)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 600,
              color: 'var(--text-black)',
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              borderRadius: '0px',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--hover-gray)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={12} style={{ color: destructive ? 'var(--critical)' : 'var(--icon-grey)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--space-6)' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center justify-end"
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--grey-stroke)',
              gap: 'var(--space-3)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

export interface ConfirmBlockProps {
  title: string;
  description?: string;
}

export function ConfirmBlock({ title, description }: ConfirmBlockProps) {
  return (
    <div className="flex" style={{ gap: 'var(--space-4)' }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: '32px',
          height: '32px',
          background: 'rgba(255, 46, 46, 0.1)',
          border: '1px solid var(--critical)',
          flexShrink: 0,
        }}
      >
        <TriangleAlert size={14} style={{ color: 'var(--critical)' }} />
      </div>
      <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
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
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--icon-grey)',
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

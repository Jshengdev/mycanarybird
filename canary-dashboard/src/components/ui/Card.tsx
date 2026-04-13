'use client';

import React, { ReactNode } from 'react';
import { AsciiHover } from '@/components/ui/AsciiHover';
import { useCardHover, CARD_GRADIENT_DEFAULT } from '@/hooks/useCardHover';

export interface CardProps {
  children: ReactNode;
  variant?: 'stat' | 'content' | 'clickable';
  onClick?: () => void;
  header?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, variant = 'content', onClick, header, action, className, style }: CardProps) {
  const isClickable = variant === 'clickable';
  const { bgStyle, transition, handleMouseMove, handleMouseLeave } = useCardHover(isClickable);

  const inner = (
    <>
      {(header || action) && (
        <>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
            {header && (
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: '20px', fontWeight: 600, color: 'var(--text-black)' }}>
                {header}
              </span>
            )}
            {action}
          </div>
          <div style={{ height: '1px', background: 'var(--grey-stroke)', marginBottom: 'var(--space-4)' }} />
        </>
      )}
      {children}
    </>
  );

  if (isClickable) {
    return (
      <AsciiHover
        variant="right"
        color="var(--icon-grey)"
        style={{
          background: bgStyle,
          borderRadius: '4px',
          border: '1px solid var(--grey-stroke)',
          cursor: 'pointer',
          transition,
          padding: 'var(--space-4)',
          overflow: 'hidden',
          '--ascii-pad-y': '6px',
          '--ascii-pad-x': '6px',
          ...style,
        } as React.CSSProperties}
      >
        <div
          className={className}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {inner}
        </div>
      </AsciiHover>
    );
  }

  return (
    <div
      style={{
        background: CARD_GRADIENT_DEFAULT,
        borderRadius: '4px',
        border: '1px solid var(--grey-stroke)',
        padding: variant === 'stat' ? 'var(--space-8)' : 'var(--space-4)',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {inner}
    </div>
  );
}

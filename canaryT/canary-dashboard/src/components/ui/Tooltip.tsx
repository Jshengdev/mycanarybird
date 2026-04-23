'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    ...(position === 'top' ? { bottom: '100%', marginBottom: '4px' } : { top: '100%', marginTop: '4px' }),
    background: 'var(--text-black)',
    color: 'var(--text-white)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 400,
    padding: '4px 8px',
    borderRadius: '0px',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
    zIndex: 200,
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && <div style={tooltipStyle}>{content}</div>}
    </div>
  );
}

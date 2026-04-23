'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface InlineActionProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

export function InlineAction({ label, onClick, href }: InlineActionProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (href) router.push(href);
    else onClick?.();
  };

  return (
    <span
      className="shimmer-link"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 500,
        textTransform: 'uppercase',
        color: 'var(--accent-color)',
        cursor: 'pointer',
        textDecoration: hovered ? 'underline' : 'none',
        transition: 'var(--transition-base)',
      }}
    >
      {label}{' '}
      <span
        style={{
          display: 'inline-block',
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform var(--transition-base)',
        }}
      >
        →
      </span>
    </span>
  );
}

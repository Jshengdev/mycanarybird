'use client';

import React from 'react';
import { PanelLeft } from 'lucide-react';

export interface SidebarOpenButtonProps {
  onClick: () => void;
}

export function SidebarOpenButton({ onClick }: SidebarOpenButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 'var(--space-4)',
        left: 'var(--space-4)',
        background: 'var(--card-bg)',
        border: '1px solid var(--grey-stroke)',
        borderRadius: '0px',
        padding: 'var(--space-2)',
        cursor: 'pointer',
        display: 'flex',
        zIndex: 20,
        margin: 0,
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card-bg)'; }}
    >
      <PanelLeft size={16} style={{ color: 'var(--icon-grey)' }} />
    </button>
  );
}

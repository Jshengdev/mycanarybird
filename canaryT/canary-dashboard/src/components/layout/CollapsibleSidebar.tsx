'use client';

import React, { useState } from 'react';
import { PanelLeft } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';

export interface CollapsibleSidebarProps {
  activeItem?: string;
  activeAgentId?: string;
}

export function useCollapsibleSidebar() {
  const [open, setOpen] = useState(true);
  return { sidebarOpen: open, toggleSidebar: () => setOpen((o) => !o), closeSidebar: () => setOpen(false), openSidebar: () => setOpen(true) };
}

export function CollapsibleSidebar({ activeItem, activeAgentId, sidebarOpen, onToggle }: CollapsibleSidebarProps & { sidebarOpen: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Sidebar — slides in/out */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 'var(--sidebar-width)',
          height: '100vh',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 250ms ease',
          zIndex: 30,
        }}
      >
        <Sidebar
          activeItem={activeItem}
          activeAgentId={activeAgentId}
          onCollapse={onToggle}
          embedded
        />
      </div>

      {/* Open button — visible when sidebar is closed */}
      <button
        aria-label="Open sidebar"
        onClick={onToggle}
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
          opacity: sidebarOpen ? 0 : 1,
          pointerEvents: sidebarOpen ? 'none' : 'auto',
          transition: 'opacity 250ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--card-bg)'; }}
      >
        <PanelLeft size={16} style={{ color: 'var(--icon-grey)' }} />
      </button>
    </>
  );
}

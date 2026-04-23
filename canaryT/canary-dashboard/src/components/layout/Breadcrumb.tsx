'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, PanelLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onOpenSidebar?: () => void;
  sidebarOpen?: boolean;
}

function BreadcrumbLink({ label, href }: { label: string; href?: string }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  return (
    <span
      onClick={() => { if (href) router.push(href); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 400,
        color: 'var(--icon-grey)',
        cursor: href ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        textDecoration: hovered && href ? 'underline' : 'none',
      }}
    >
      {label}
    </span>
  );
}

export function Breadcrumb({ items, onOpenSidebar, sidebarOpen = true }: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  return (
    <div
      className="flex items-center"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--grey-stroke)',
        padding: '12px 20px',
        gap: 'var(--space-3)',
      }}
    >
      {/* Sidebar open button — only shown when sidebar is closed */}
      {!sidebarOpen && onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          style={{
            background: 'none',
            border: 'none',
            padding: 'var(--space-1)',
            cursor: 'pointer',
            display: 'flex',
            borderRadius: '0px',
            margin: 0,
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <PanelLeft size={16} style={{ color: 'var(--icon-grey)' }} />
        </button>
      )}

      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={12} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />}
          {i < lastIndex ? (
            <BreadcrumbLink label={item.label} href={item.href} />
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 400,
                color: 'var(--text-black)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

'use client';

import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemLabel?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemLabel = 'items' }: PaginationProps) {
  const getPages = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [1];
    if (currentPage > 3) pages.push('ellipsis');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    minWidth: '28px',
    height: '28px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: active ? 'var(--hover-gray)' : 'var(--card-bg)',
    border: '1px solid var(--grey-stroke)',
    borderRadius: '0px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: active ? 700 : 400,
    color: disabled ? 'var(--grey-stroke)' : active ? 'var(--text-black)' : 'var(--icon-grey)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: '0 4px',
    transition: 'background var(--transition-fast)',
  });

  return (
    <div className="flex items-center justify-between" style={{ width: '100%', padding: '8px 0' }}>
      {totalItems !== undefined && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
          {totalItems} {itemLabel}
        </span>
      )}
      <div className="flex items-center" style={{ gap: '2px', marginLeft: 'auto' }}>
        <button
          style={btnStyle(false, currentPage === 1)}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </button>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`e-${i}`}
              style={{
                minWidth: '28px',
                height: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--icon-grey)',
              }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              style={btnStyle(p === currentPage, false)}
              onClick={() => onPageChange(p as number)}
              onMouseEnter={(e) => {
                if (p !== currentPage) {
                  e.currentTarget.style.background = 'var(--hover-gray)';
                  e.currentTarget.style.color = 'var(--text-black)';
                }
              }}
              onMouseLeave={(e) => {
                if (p !== currentPage) {
                  e.currentTarget.style.background = 'var(--card-bg)';
                  e.currentTarget.style.color = 'var(--icon-grey)';
                }
              }}
            >
              {p}
            </button>
          )
        )}
        <button
          style={btnStyle(false, currentPage === totalPages)}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
}

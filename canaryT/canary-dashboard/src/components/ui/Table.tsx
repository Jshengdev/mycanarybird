'use client';

import React, { ReactNode } from 'react';
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, ReactNode>[];
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
  onRowClick?: (row: Record<string, ReactNode>, index: number) => void;
  emptyText?: string;
  emptyAction?: ReactNode;
}

export function Table({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  emptyText = 'No data',
  emptyAction,
}: TableProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          border: '1px dashed var(--grey-stroke)',
          background: 'transparent',
          width: '100%',
          minHeight: '200px',
          gap: 'var(--space-4)',
          padding: 'var(--space-8)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 400,
            color: 'var(--icon-grey)',
          }}
        >
          {emptyText}
        </span>
        {emptyAction}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => {
              const isActive = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: '12px',
                    fontWeight: isActive ? 500 : 400,
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--text-black)' : 'var(--icon-grey)',
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--grey-stroke)',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                    width: col.width,
                    userSelect: 'none',
                  }}
                >
                  <span className="inline-flex items-center" style={{ gap: 'var(--space-1)' }}>
                    {col.label}
                    {col.sortable && (
                      <>
                        {!isActive && <ChevronsUpDown size={12} />}
                        {isActive && sortDirection === 'asc' && <ChevronUp size={12} />}
                        {isActive && sortDirection === 'desc' && <ChevronDown size={12} />}
                      </>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row, i)}
              style={{
                background: 'var(--card-bg)',
                borderBottom: '1px solid var(--grey-stroke)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--hover-gray)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card-bg)';
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 400,
                    padding: '12px',
                    color: 'var(--text-black)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

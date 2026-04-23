'use client';

import React from 'react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: 'var(--bg)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <span style={{ fontSize: '14px', color: 'var(--icon-grey)' }}>
        Something went wrong during hot reload
      </span>
      <button
        onClick={reset}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          fontWeight: 500,
          padding: '6px 24px',
          background: 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          cursor: 'pointer',
          color: 'var(--text-black)',
        }}
      >
        Retry
      </button>
    </div>
  );
}

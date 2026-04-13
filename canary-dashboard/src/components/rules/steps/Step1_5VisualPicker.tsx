'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScreenshotGrid } from '@/components/rules/steps/ScreenshotGrid';

type SourceMode = 'auto' | 'fresh';

export interface SelectedEventData {
  eventId: string;
  action: string;
  target: string;
  timestamp: string;
  sessionId: string;
}

export interface Step1_5VisualPickerProps {
  onSkipToStep2: () => void;
  onScreenshotSelect: (data: SelectedEventData) => void;
}

export function Step1_5VisualPicker({ onSkipToStep2, onScreenshotSelect }: Step1_5VisualPickerProps) {
  const [sourceMode, setSourceMode] = useState<SourceMode>('auto');
  const [arrowHovered, setArrowHovered] = useState(false);

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
      {/* Header */}
      <div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)', display: 'block' }}>
          Pick an object from a recent session
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)', display: 'block', marginTop: 'var(--space-1)' }}>
          Select a screenshot to pick a UI element as your rule target.
        </span>
      </div>

      {/* Source toggle */}
      <div className="flex" style={{ border: '1px solid var(--grey-stroke)', borderRadius: '0px', overflow: 'hidden' }}>
        <button
          onClick={() => setSourceMode('auto')}
          style={{
            flex: 1,
            padding: 'var(--space-2) var(--space-4)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            background: sourceMode === 'auto' ? 'var(--text-black)' : 'var(--card-bg)',
            color: sourceMode === 'auto' ? 'var(--text-white)' : 'var(--icon-grey)',
            border: 'none',
            borderRight: '1px solid var(--grey-stroke)',
            borderRadius: '0px',
            cursor: 'pointer',
            outline: 'none',
            margin: 0,
          }}
        >
          Auto-detect from history
        </button>
        <button
          onClick={() => setSourceMode('fresh')}
          style={{
            flex: 1,
            padding: 'var(--space-2) var(--space-4)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            background: sourceMode === 'fresh' ? 'var(--text-black)' : 'var(--card-bg)',
            color: sourceMode === 'fresh' ? 'var(--text-white)' : 'var(--icon-grey)',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            outline: 'none',
            margin: 0,
          }}
        >
          Run fresh mapping session
        </button>
      </div>

      {/* Manual skip link */}
      <span
        onClick={onSkipToStep2}
        onMouseEnter={() => setArrowHovered(true)}
        onMouseLeave={() => setArrowHovered(false)}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          textTransform: 'uppercase',
          color: 'var(--accent-color)',
          cursor: 'pointer',
          textDecoration: arrowHovered ? 'underline' : 'none',
          transition: 'var(--transition-base)',
        }}
      >
        Or define manually{' '}
        <span
          style={{
            display: 'inline-block',
            transform: arrowHovered ? 'translateX(3px)' : 'translateX(0)',
            transition: 'transform var(--transition-base)',
          }}
        >
          →
        </span>
      </span>

      {/* Content based on mode */}
      {sourceMode === 'auto' ? (
        <ScreenshotGrid onSelect={onScreenshotSelect} />
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ padding: 'var(--space-10)', gap: 'var(--space-4)' }}
        >
          <RefreshCw size={24} style={{ color: 'var(--icon-grey)' }} />
          <Button
            variant="primary"
            size="sm"
            onClick={() => console.log('Mapping session started — check back in 30s')}
          >
            Start mapping session
          </Button>
        </div>
      )}
    </div>
  );
}

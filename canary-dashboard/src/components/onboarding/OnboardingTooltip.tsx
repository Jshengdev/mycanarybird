'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

const STEPS = [
  {
    title: 'Connect your agent',
    body: 'Use the Start Session button in the sidebar to begin monitoring your agent. The Canary SDK needs to be running alongside your agent first.',
  },
  {
    title: 'Run your first session',
    body: 'Click Live in the sidebar to go to the live view. Start a session and watch traces come in as your agent runs.',
  },
  {
    title: 'Your agent profile',
    body: 'After your first session, Canary scans your codebase and populates this page with what it understands about your agent — its workflow, outcomes, and quality heuristics.',
  },
  {
    title: 'Create your first rule',
    body: 'Use screenshots from your session to draw bounding boxes and define boundaries for your agent. Canary will flag any violations.',
  },
];

// Approximate positions relative to sidebar items
const POSITIONS: { top: string; left: string }[] = [
  { top: '420px', left: '296px' },  // Start Session button
  { top: '240px', left: '296px' },  // Live nav item
  { top: '200px', left: '296px' },  // Profile nav item
  { top: '300px', left: '296px' },  // Rules nav item
];

export interface OnboardingTooltipProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingTooltip({ step, onNext, onSkip }: OnboardingTooltipProps) {
  if (step < 0 || step >= STEPS.length) return null;

  const { title, body } = STEPS[step];
  const pos = POSITIONS[step];

  return (
    <div
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: '260px',
        background: 'var(--text-black)',
        borderRadius: '4px',
        padding: 'var(--space-5)',
        zIndex: 300,
        pointerEvents: 'auto',
      }}
    >
      {/* Step indicator */}
      <span
        style={{
          position: 'absolute',
          top: 'var(--space-3)',
          right: 'var(--space-3)',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'rgba(247,247,247,0.3)',
        }}
      >
        {step + 1} / 4
      </span>

      {/* Title */}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-white)',
          display: 'block',
          marginBottom: 'var(--space-2)',
        }}
      >
        {title}
      </span>

      {/* Body */}
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          color: 'rgba(247,247,247,0.7)',
          lineHeight: 1.5,
          display: 'block',
        }}
      >
        {body}
      </span>

      {/* Footer */}
      <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-4)' }}>
        <span
          onClick={onSkip}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase',
            color: 'rgba(247,247,247,0.4)',
            cursor: 'pointer',
          }}
        >
          Skip tour
        </span>
        <Button variant="primary" size="sm" onClick={onNext}>
          {step === 3 ? 'Done' : 'Next →'}
        </Button>
      </div>
    </div>
  );
}

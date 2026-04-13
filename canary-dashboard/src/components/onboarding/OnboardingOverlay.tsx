'use client';

import React from 'react';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip';

export interface OnboardingOverlayProps {
  step: number | null;
  onNext: () => void;
  onSkip: () => void;
  children: React.ReactNode;
}

export function OnboardingOverlay({ step, onNext, onSkip, children }: OnboardingOverlayProps) {
  return (
    <>
      {children}
      {step !== null && (
        <>
          {/* Semi-transparent backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,10,10,0.3)',
              zIndex: 290,
              pointerEvents: 'none',
            }}
          />
          {/* Tooltip */}
          <OnboardingTooltip step={step} onNext={onNext} onSkip={onSkip} />
        </>
      )}
    </>
  );
}

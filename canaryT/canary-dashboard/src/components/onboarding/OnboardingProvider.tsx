'use client';

import React, { useEffect, createContext, useContext } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay';

type OnboardingContextType = ReturnType<typeof useOnboarding>;

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboardingContext() {
  return useContext(OnboardingContext);
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const onboarding = useOnboarding();

  // Auto-start if not completed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const done = localStorage.getItem('onboarding_completed');
    if (!done) {
      onboarding.startOnboarding();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSkip = () => {
    onboarding.skipOnboarding();
    localStorage.setItem('onboarding_completed', 'true');
  };

  const handleNext = () => {
    onboarding.nextStep();
    if (onboarding.step === 3) {
      localStorage.setItem('onboarding_completed', 'true');
    }
  };

  return (
    <OnboardingContext.Provider value={onboarding}>
      <OnboardingOverlay step={onboarding.step} onNext={handleNext} onSkip={handleSkip}>
        {children}
      </OnboardingOverlay>
    </OnboardingContext.Provider>
  );
}

'use client';

import { useState, useCallback } from 'react';

export function useOnboarding() {
  const [step, setStep] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const startOnboarding = useCallback(() => setStep(0), []);
  const nextStep = useCallback(() => {
    setStep((prev) => {
      if (prev === null) return null;
      if (prev >= 3) {
        setCompleted(true);
        return null;
      }
      return prev + 1;
    });
  }, []);
  const skipOnboarding = useCallback(() => {
    setCompleted(true);
    setStep(null);
  }, []);
  const resetOnboarding = useCallback(() => {
    setCompleted(false);
    setStep(0);
  }, []);

  return { step, completed, startOnboarding, nextStep, skipOnboarding, resetOnboarding };
}

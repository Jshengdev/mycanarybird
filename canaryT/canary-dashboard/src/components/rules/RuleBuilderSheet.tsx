'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Step1RuleType } from '@/components/rules/steps/Step1RuleType';
import { Step2SentenceBuilder } from '@/components/rules/steps/Step2SentenceBuilder';
import { Step3ConflictCheck } from '@/components/rules/steps/Step3ConflictCheck';
import { Step4SaveConfirmation } from '@/components/rules/steps/Step4SaveConfirmation';
import { Step5TestResults } from '@/components/rules/steps/Step5TestResults';
import type { RuleType } from '@/components/rules/steps/Step1RuleType';

const TOTAL_STEPS = 4;

const STEP_LABELS: Record<number, string> = {
  1: 'Continue',
  2: 'Continue',
  3: 'Resolve & Save',
  4: 'Test session',
  5: 'Done',
};

export interface RuleBuilderSheetProps {
  open: boolean;
  onClose: () => void;
  editingRule?: { type: RuleType; name: string } | null;
}

export function RuleBuilderSheet({ open, onClose, editingRule }: RuleBuilderSheetProps) {
  const [step, setStep] = useState(1);
  const [ruleType, setRuleType] = useState<RuleType | null>(editingRule?.type || null);

  // Reset state when sheet opens/closes or editingRule changes
  useEffect(() => {
    if (open) {
      setStep(1);
      setRuleType(editingRule?.type || null);
    }
  }, [open, editingRule]);

  if (!open) return null;

  const isEditing = !!editingRule;
  const stepDisplay = String(step);
  const actionLabel = STEP_LABELS[step] || 'Continue';

  const canContinue = step === 1 ? ruleType !== null : true;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 5) {
      onClose();
    } else {
      setStep(Math.min(step + 1, 5));
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      setStep(Math.max(step - 1, 1));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,10,10,0.45)',
          zIndex: 290,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="flex flex-col"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: step === 2 ? '720px' : '560px',
          maxHeight: '85vh',
          background: 'var(--card-bg)',
          border: '1px solid var(--grey-stroke)',
          borderRadius: '0px',
          zIndex: 300,
          animation: 'fadeIn 150ms ease-out',
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -48%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
        `}</style>

        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid var(--grey-stroke)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: 'var(--text-black)' }}>
            {isEditing ? 'Edit Rule' : '+ New Rule'}
          </span>
          <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)' }}>
              Step {stepDisplay} of {TOTAL_STEPS}
            </span>
            <button
              aria-label="Close"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-1)',
                cursor: 'pointer',
                display: 'flex',
                margin: 0,
                borderRadius: '0px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--hover-gray)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <X size={16} style={{ color: 'var(--icon-grey)' }} />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)' }}>
          {step === 1 && (
            <Step1RuleType selected={ruleType} onSelect={setRuleType} />
          )}
          {step === 2 && (
            <Step2SentenceBuilder />
          )}
          {step === 3 && (
            <Step3ConflictCheck />
          )}
          {step === 4 && (
            <Step4SaveConfirmation onRunTest={(id) => { console.log('Testing against:', id); setStep(5); }} />
          )}
          {step === 5 && (
            <Step5TestResults />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--space-5) var(--space-6)',
            borderTop: '1px solid var(--grey-stroke)',
            flexShrink: 0,
          }}
        >
          <div>
            {step > 1 && (
              <Button variant="ghost" size="sm" noAscii onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex" style={{ gap: 'var(--space-3)' }}>
            {step === 4 && (
              <Button variant="ghost" size="sm" noAscii onClick={() => setStep(5)}>
                Skip test
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!canContinue}
              onClick={handleNext}
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

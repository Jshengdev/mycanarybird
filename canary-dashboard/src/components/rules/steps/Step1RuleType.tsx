'use client';

import React, { useState } from 'react';
import { Shield, SquareCheck, ListOrdered, Clock3 } from 'lucide-react';

export type RuleType = 'boundary' | 'outcome' | 'sequence' | 'time';

const RULE_TYPES: {
  type: RuleType;
  icon: React.ElementType;
  name: string;
  desc: string;
  example: string;
}[] = [
  { type: 'boundary', icon: Shield, name: 'Boundary', desc: 'Never do X', example: "e.g. don't access files outside /working/" },
  { type: 'outcome', icon: SquareCheck, name: 'Outcome', desc: 'End state matches intent', example: 'e.g. correct recipient before sending' },
  { type: 'sequence', icon: ListOrdered, name: 'Sequence', desc: 'Do A before B', example: 'e.g. confirm before sending' },
  { type: 'time', icon: Clock3, name: 'Time-based', desc: 'Complete within time limit', example: 'e.g. under 30 seconds' },
];

export interface Step1RuleTypeProps {
  selected: RuleType | null;
  onSelect: (type: RuleType) => void;
}

export function Step1RuleType({ selected, onSelect }: Step1RuleTypeProps) {
  const [hoveredType, setHoveredType] = useState<RuleType | null>(null);

  return (
    <div>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--icon-grey)', display: 'block', marginBottom: 'var(--space-6)' }}>
        What type of rule do you want to create?
      </span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        {RULE_TYPES.map((rt) => {
          const isSelected = selected === rt.type;
          const isHovered = hoveredType === rt.type;
          const Icon = rt.icon;

          return (
            <div
              key={rt.type}
              onClick={() => onSelect(rt.type)}
              onMouseEnter={() => setHoveredType(rt.type)}
              onMouseLeave={() => setHoveredType(null)}
              className="flex flex-col"
              style={{
                gap: 'var(--space-2)',
                background: isSelected || isHovered ? 'var(--hover-gray)' : 'var(--card-bg)',
                border: isSelected ? '2px solid var(--text-black)' : '1px solid var(--grey-stroke)',
                borderRadius: '0px',
                padding: 'var(--space-5)',
                cursor: 'pointer',
                minHeight: '120px',
                transition: 'background var(--transition-fast), border var(--transition-fast)',
              }}
            >
              <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                <Icon size={16} style={{ color: 'var(--icon-grey)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-black)' }}>
                  {rt.name}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>
                {rt.desc}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--icon-grey)', fontStyle: 'italic' }}>
                {rt.example}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

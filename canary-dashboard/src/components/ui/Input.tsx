'use client';

import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  search?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, search = false, style, disabled, ...props }, ref) => {
    const hasError = !!error;

    const inputStyle: React.CSSProperties = {
      background: disabled ? 'var(--hover-gray)' : 'var(--card-bg)',
      border: '1px solid var(--grey-stroke)',
      borderRadius: '0px',
      padding: search ? '4px 6px 4px 28px' : '4px 6px',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      color: disabled ? 'var(--icon-grey)' : 'var(--text-black)',
      width: '100%',
      outline: 'none',
      // Use outline for focus/error so border width doesn't shift layout
      outlineOffset: '-2px',
      ...style,
    };

    if (hasError) {
      inputStyle.outline = '2px solid var(--critical)';
    }

    return (
      <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
        {label && (
          <label
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 500,
              color: 'var(--text-black)',
            }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {search && (
            <Search
              size={12}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--icon-grey)',
                pointerEvents: 'none',
              }}
            />
          )}
          <input
            ref={ref}
            disabled={disabled}
            style={inputStyle}
            onFocus={(e) => {
              if (!hasError) e.currentTarget.style.outline = '2px solid var(--grey-stroke)';
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              if (!hasError) e.currentTarget.style.outline = 'none';
              props.onBlur?.(e);
            }}
            {...props}
          />
        </div>
        {error && (
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 400,
              color: 'var(--critical)',
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

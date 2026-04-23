'use client';

import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  resize?: 'vertical' | 'none' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, resize = 'vertical', style, disabled, ...props }, ref) => {
    const hasError = !!error;

    const textareaStyle: React.CSSProperties = {
      background: disabled ? 'var(--hover-gray)' : 'var(--card-bg)',
      border: '1px solid var(--grey-stroke)',
      borderRadius: '0px',
      minHeight: '128px',
      padding: '6px',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      color: disabled ? 'var(--icon-grey)' : 'var(--text-black)',
      width: '100%',
      outline: 'none',
      outlineOffset: '-2px',
      resize,
      ...style,
    };

    if (hasError) {
      textareaStyle.outline = '2px solid var(--critical)';
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
        <textarea
          ref={ref}
          disabled={disabled}
          style={textareaStyle}
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

Textarea.displayName = 'Textarea';

'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import { useAsciiAnimation, AsciiStrip } from '@/components/ui/AsciiHover';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md';
  asciiVariant?: 'left' | 'right' | 'both';
  isLoading?: boolean;
  icon?: ReactNode;
  iconOnly?: boolean;
  noAscii?: boolean;
}

const variantBg: Record<string, string> = {
  primary: 'var(--accent-color)',
  secondary: 'var(--card-bg)',
  ghost: 'transparent',
  destructive: 'var(--critical)',
};

const variantText: Record<string, string> = {
  primary: 'var(--text-white)',
  secondary: 'var(--text-black)',
  ghost: 'var(--text-black)',
  destructive: 'var(--text-white)',
};

const variantBorder: Record<string, string> = {
  primary: '1px solid var(--grey-stroke)',
  secondary: '1px solid var(--grey-stroke)',
  ghost: '1px solid var(--grey-stroke)',
  destructive: '1px solid var(--grey-stroke)',
};

const hoverBgMap: Record<string, string | null> = {
  primary: null,
  secondary: 'var(--pressed-gray)',
  ghost: 'var(--pressed-gray)',
  destructive: null,
};

const asciiColorMap: Record<string, string> = {
  primary: 'var(--text-white)',
  secondary: 'var(--icon-grey)',
  ghost: 'var(--icon-grey)',
  destructive: 'var(--text-white)',
};

const sizeStyles: Record<string, { fontSize: number; fontWeight: number; paddingH: number; paddingHPlain: number; iconSize: number }> = {
  sm: { fontSize: 12, fontWeight: 500, paddingH: 24, paddingHPlain: 12, iconSize: 12 },
  md: { fontSize: 14, fontWeight: 500, paddingH: 24, paddingHPlain: 12, iconSize: 14 },
};

const PADDING_V = 6;

const btnReset: React.CSSProperties = {
  margin: 0,
  borderRadius: '2px',
  outline: 'none',
  WebkitAppearance: 'none',
  boxSizing: 'border-box',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  asciiVariant = 'right',
  isLoading = false,
  icon,
  iconOnly = false,
  noAscii = false,
  disabled = false,
  children,
  style,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [loadingActive, setLoadingActive] = React.useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [blockSize, setBlockSize] = React.useState(14);

  // ASCII animation hook — used directly instead of AsciiHover wrapper
  const { opacitiesR, opacitiesL, handleEnter, handleLeave, activate, deactivate } = useAsciiAnimation();

  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLoadingActive(false);
      return;
    }
    let on = true;
    setLoadingActive(true);
    intervalRef.current = setInterval(() => {
      on = !on;
      setLoadingActive(on);
    }, 600);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  // Loading: controlled ascii
  useEffect(() => {
    if (isLoading) {
      if (loadingActive) activate();
      else deactivate();
    }
  }, [isLoading, loadingActive, activate, deactivate]);

  // Measure block size from button height
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      // Block should be button height minus 12px (6px top + 6px bottom inset)
      setBlockSize(Math.max(4, h - 12));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const s = sizeStyles[size];
  const isDisabled = disabled || isLoading;
  const fixedHeight = PADDING_V * 2 + s.fontSize + 2; // +2 for border

  const showAscii = !iconOnly && !noAscii && !isDisabled;
  const showRight = showAscii && (asciiVariant === 'right' || asciiVariant === 'both');
  const showLeft = showAscii && (asciiVariant === 'left' || asciiVariant === 'both');

  let bg = variantBg[variant];
  if (isDisabled && !isLoading) bg = 'var(--hover-gray)';
  else if (hovered && hoverBgMap[variant]) bg = hoverBgMap[variant]!;

  const textColor = isDisabled && !isLoading ? 'var(--icon-grey)' : variantText[variant];
  const border = isDisabled && !isLoading ? '1px solid var(--grey-stroke)' : variantBorder[variant];
  const padH = iconOnly ? PADDING_V : (noAscii || isDisabled ? s.paddingHPlain : s.paddingH);

  const onEnter = () => {
    setHovered(true);
    if (showAscii && !isLoading) handleEnter();
  };
  const onLeave = () => {
    setHovered(false);
    if (showAscii && !isLoading) handleLeave();
  };

  return (
    <button
      ref={btnRef}
      {...props}
      disabled={isDisabled}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        ...btnReset,
        position: 'relative',
        overflow: 'hidden',
        background: bg,
        color: textColor,
        border,
        fontFamily: 'var(--font-sans)',
        fontSize: `${s.fontSize}px`,
        fontWeight: s.fontWeight,
        lineHeight: `${s.fontSize}px`,
        height: `${fixedHeight}px`,
        padding: `0 ${padH}px`,
        cursor: isLoading ? 'wait' : isDisabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: (showAscii && asciiVariant !== 'both') ? 'flex-start' : 'center',
        gap: 'var(--space-1)',
        transition: 'background var(--transition-fast)',
        ...style,
      }}
    >
      {/* ASCII strips rendered inside the button, behind content */}
      {showRight && (
        <AsciiStrip side="right" size={blockSize} opacities={opacitiesR} color={asciiColorMap[variant]} />
      )}
      {showLeft && (
        <AsciiStrip side="left" size={blockSize} opacities={opacitiesL} color={asciiColorMap[variant]} />
      )}

      {/* Content at z-index 1 */}
      {icon && (
        <span className="flex items-center" style={{ width: s.iconSize, height: s.iconSize, position: 'relative', zIndex: 1 }}>
          {icon}
        </span>
      )}
      {!iconOnly && children && (
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      )}
    </button>
  );
}

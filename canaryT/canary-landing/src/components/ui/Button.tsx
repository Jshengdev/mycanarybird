'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import { useAsciiAnimation, AsciiStrip } from '@/components/ui/AsciiHover';
import buttonStyles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  asciiVariant?: 'left' | 'right' | 'both';
  icon?: ReactNode;
  noAscii?: boolean;
  href?: string;
  tag?: 'button' | 'a';
}

const variantBg: Record<string, string> = {
  primary: 'var(--accent-color)',
  secondary: 'var(--card-bg)',
  ghost: 'transparent',
};

const variantText: Record<string, string> = {
  primary: 'var(--text-white)',
  secondary: 'var(--text-black)',
  ghost: 'var(--text-black)',
};

const variantBorder: Record<string, string> = {
  primary: '1px solid var(--accent-color)',
  secondary: '1px solid var(--grey-stroke)',
  ghost: '1px solid var(--grey-stroke)',
};

const hoverBgMap: Record<string, string | null> = {
  primary: null,
  secondary: 'var(--pressed-gray)',
  ghost: 'var(--pressed-gray)',
};

const asciiColorMap: Record<string, string> = {
  primary: 'var(--text-white)',
  secondary: 'var(--icon-grey)',
  ghost: 'var(--icon-grey)',
};

const sizeStyles: Record<string, { fontSize: number; fontWeight: number; paddingH: number; paddingHPlain: number }> = {
  sm: { fontSize: 12, fontWeight: 500, paddingH: 24, paddingHPlain: 12 },
  md: { fontSize: 14, fontWeight: 500, paddingH: 24, paddingHPlain: 12 },
};

const PADDING_V = 6;

export function Button({
  variant = 'secondary',
  size = 'md',
  asciiVariant = 'right',
  icon,
  noAscii = false,
  disabled = false,
  children,
  style,
  href,
  tag = 'button',
  className: callerClassName,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const btnRef = useRef<HTMLElement>(null);
  const [blockSize, setBlockSize] = React.useState(14);
  const { opacitiesR, opacitiesL, handleEnter, handleLeave } = useAsciiAnimation();

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const measure = () => {
      setBlockSize(Math.max(4, el.offsetHeight - 12));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const s = sizeStyles[size];
  const showAscii = !noAscii && !disabled;
  const showRight = showAscii && (asciiVariant === 'right' || asciiVariant === 'both');
  const showLeft = showAscii && (asciiVariant === 'left' || asciiVariant === 'both');

  let bg = variantBg[variant];
  if (hovered && hoverBgMap[variant]) bg = hoverBgMap[variant]!;

  const textColor = variantText[variant];
  const border = variantBorder[variant];
  const padH = noAscii || disabled ? s.paddingHPlain : s.paddingH;
  const fixedHeight = PADDING_V * 2 + s.fontSize + 2;

  const onEnter = () => {
    setHovered(true);
    if (showAscii) handleEnter();
  };
  const onLeave = () => {
    setHovered(false);
    if (showAscii) handleLeave();
  };

  const commonStyle: React.CSSProperties = {
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
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: (showAscii && asciiVariant !== 'both') ? 'flex-start' : 'center',
    gap: 'var(--space-1)',
    transition: 'background 100ms ease',
    borderRadius: 0,
    textDecoration: 'none',
    boxSizing: 'border-box',
    margin: 0,
    outline: 'none',
    WebkitAppearance: 'none',
    ...style,
  };

  const mergedClassName = `${buttonStyles.btn}${callerClassName ? ` ${callerClassName}` : ''}`;

  const inner = (
    <>
      {showRight && <AsciiStrip side="right" size={blockSize} opacities={opacitiesR} color={asciiColorMap[variant]} />}
      {showLeft && <AsciiStrip side="left" size={blockSize} opacities={opacitiesL} color={asciiColorMap[variant]} />}
      {icon && <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children && <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>}
    </>
  );

  if (tag === 'a') {
    return (
      <a
        ref={btnRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={mergedClassName}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={commonStyle}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.Ref<HTMLButtonElement>}
      disabled={disabled}
      className={mergedClassName}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={commonStyle}
      {...props}
    >
      {inner}
    </button>
  );
}

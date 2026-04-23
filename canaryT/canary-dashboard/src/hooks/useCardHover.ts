'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const DEFAULT_BG = 'linear-gradient(160deg, #FFFFFF 0%, #F5F5F9 100%)';

// Interpolate hex color components
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

export function useCardHover(interactive: boolean = true) {
  const [bgStyle, setBgStyle] = useState(DEFAULT_BG);
  const [transition, setTransition] = useState('');
  const animRef = useRef<number | null>(null);
  const progressRef = useRef(0); // 0 = default, 1 = fully hovered
  const activeRef = useRef(false);
  const startTime = useRef(0);

  const DURATION = 300; // ms

  const animateIn = useCallback(() => {
    if (!activeRef.current) return;
    const elapsed = Date.now() - startTime.current;
    const t = Math.min(elapsed / DURATION, 1);
    progressRef.current = t;

    // Angle shifts from 160 → 180 (gradient moves upward)
    const angle = Math.round(160 + t * 20);
    // Top color stays white → slightly tinted
    const topColor = lerpColor('#FFFFFF', '#FAFAFD', t);
    // Bottom color darkens
    const bottomColor = lerpColor('#F5F5F9', '#EDEDF2', t);

    setBgStyle(`linear-gradient(${angle}deg, ${topColor} 0%, ${bottomColor} 100%)`);

    if (t < 1) {
      animRef.current = requestAnimationFrame(animateIn);
    }
  }, []);

  const animateOut = useCallback(() => {
    if (activeRef.current) return;
    const elapsed = Date.now() - startTime.current;
    const t = Math.max(1 - elapsed / 400, 0); // 400ms out

    const angle = Math.round(160 + t * 20);
    const topColor = lerpColor('#FFFFFF', '#FAFAFD', t);
    const bottomColor = lerpColor('#F5F5F9', '#EDEDF2', t);

    setBgStyle(`linear-gradient(${angle}deg, ${topColor} 0%, ${bottomColor} 100%)`);

    if (t > 0) {
      animRef.current = requestAnimationFrame(animateOut);
    } else {
      setBgStyle(DEFAULT_BG);
    }
  }, []);

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseMove = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (!activeRef.current) {
      activeRef.current = true;
      startTime.current = Date.now();
      setTransition('');
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(animateIn);
    }
  }, [interactive, animateIn]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;
    activeRef.current = false;
    startTime.current = Date.now();
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animateOut);
  }, [interactive, animateOut]);

  return { bgStyle, transition, handleMouseMove, handleMouseLeave };
}

export const CARD_GRADIENT_DEFAULT = DEFAULT_BG;

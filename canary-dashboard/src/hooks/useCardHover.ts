'use client';

import { useState, useCallback } from 'react';

const DEFAULT_BG = 'linear-gradient(160deg, #FDFDFD 0%, #F7F7FA 100%)';

export function useCardHover(interactive: boolean = true) {
  const [bgStyle, setBgStyle] = useState(DEFAULT_BG);
  const [transition, setTransition] = useState('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgStyle(`radial-gradient(circle at ${x}% ${y}%, #EDEDF5 0%, #F7F7FA 55%, #F5F5F8 100%)`);
    setTransition('');
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;
    setTransition('background 400ms ease');
    setBgStyle(DEFAULT_BG);
    setTimeout(() => setTransition(''), 400);
  }, [interactive]);

  return { bgStyle, transition, handleMouseMove, handleMouseLeave };
}

export const CARD_GRADIENT_DEFAULT = DEFAULT_BG;

'use client';

/**
 * GSAP + ScrollTrigger registration.
 *
 * Import this module only inside the Reel component tree.
 * Framer Motion and GSAP must never coexist in the same
 * component tree (taste-skill §8) — this module serves as
 * the structural boundary.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let _registered = false;

if (typeof window !== 'undefined' && !_registered) {
  gsap.registerPlugin(ScrollTrigger);
  _registered = true;
}

export { gsap, ScrollTrigger };

'use client';

/**
 * VideoVisual — drop-in FlowStep Visual that plays a screen-recording
 * on loop. Replaces the handcrafted InstallVisual/SeeVisual/etc. with
 * a real demo clip.
 *
 * `makeVideoVisual(src)` returns a named, stable component so swapping
 * `Visual={...}` on FlowStep doesn't remount the video on every parent
 * render (inline arrow factories would restart playback).
 *
 * Reduced-motion: autoplay is suppressed. The video still renders, just
 * paused on the first frame.
 */

import type { ComponentType } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { FlowVisualProps } from '../FlowStep';
import styles from './VideoVisual.module.css';

interface VideoVisualProps extends FlowVisualProps {
  src: string;
}

function VideoVisual({ src, perchRef }: VideoVisualProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduce = useReducedMotion() === true;

  useEffect(() => {
    if (!videoRef.current) return;
    if (reduce) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // autoplay can be blocked by mobile data savers — safe to ignore.
      });
    }
  }, [reduce]);

  // Defensive unmount cleanup — pause the video, drop its src, and call
  // `load()` so the decoder releases the buffered frames. Without this,
  // Safari + Chrome can hold on to several MB of GPU-side video memory
  // per dismounted <video>. For a 4-video landing page, this matters
  // more under HMR than in prod, but we pay it either way.
  useEffect(() => {
    return () => {
      const el = videoRef.current;
      if (!el) return;
      try {
        el.pause();
        el.removeAttribute('src');
        while (el.firstChild) el.removeChild(el.firstChild);
        el.load();
      } catch {
        // Element may already be detached; nothing to do.
      }
    };
  }, []);

  /**
   * Bird perches on the video frame. Memoised so React doesn't tear the ref
   * down + re-attach on every render — each re-attach fires perchRef(null)
   * then perchRef(el), which re-registers the canary-watch section and
   * spins into an infinite update loop.
   */
  const setVideoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      perchRef(el);
    },
    [perchRef]
  );

  const mp4Src = src.replace(/\.mov$/, '.mp4');

  return (
    <video
      ref={setVideoRef}
      className={styles.video}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      preload="metadata"
      aria-hidden="true"
    >
      <source src={mp4Src} type="video/mp4" />
      <source src={src} type="video/quicktime" />
    </video>
  );
}

export function makeVideoVisual(src: string): ComponentType<FlowVisualProps> {
  function BoundVideoVisual(props: FlowVisualProps) {
    return <VideoVisual src={src} {...props} />;
  }
  BoundVideoVisual.displayName = `VideoVisual(${src})`;
  return BoundVideoVisual;
}

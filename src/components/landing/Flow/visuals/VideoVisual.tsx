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
import { useEffect, useRef } from 'react';
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

  /** Bird perches on the video frame. */
  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    perchRef(el);
  };

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

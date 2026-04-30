'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Eliminates the visible loop snap by stacking two video elements offset by
 * half the duration and crossfading whichever is NOT near its loop boundary.
 */
export default function SeamlessVideo({ src, poster, className, style }: Props) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [showB, setShowB] = useState(false);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const a = videoARef.current;
    if (!a) return;
    const onMeta = () => setDuration(a.duration || 0);
    a.addEventListener('loadedmetadata', onMeta);
    return () => a.removeEventListener('loadedmetadata', onMeta);
  }, [src]);

  useEffect(() => {
    const b = videoBRef.current;
    if (!b || !duration) return;
    b.currentTime = duration / 2;
  }, [duration]);

  useEffect(() => {
    if (!duration) return;
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    const FADE_WINDOW = 0.4;

    const tick = () => {
      const aTime = a.currentTime;
      const bTime = b.currentTime;
      const aNearBoundary = aTime < FADE_WINDOW || aTime > duration - FADE_WINDOW;
      const bNearBoundary = bTime < FADE_WINDOW || bTime > duration - FADE_WINDOW;
      if (aNearBoundary && !bNearBoundary) setShowB(true);
      else if (bNearBoundary && !aNearBoundary) setShowB(false);
    };

    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [duration]);

  const baseClass = className ?? 'absolute inset-0 w-full h-full object-cover';

  return (
    <>
      <video
        ref={videoARef}
        className={baseClass}
        src={src}
        poster={poster}
        autoPlay loop muted playsInline
        style={{ ...style, opacity: showB ? 0 : 1, transition: 'opacity 400ms ease-in-out' }}
      />
      <video
        ref={videoBRef}
        className={baseClass}
        src={src}
        autoPlay loop muted playsInline
        style={{ ...style, opacity: showB ? 1 : 0, transition: 'opacity 400ms ease-in-out' }}
      />
    </>
  );
}

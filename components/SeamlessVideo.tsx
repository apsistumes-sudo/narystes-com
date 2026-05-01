'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  startOffset?: number;
};

// How far before each end/start to flip direction (RAF timing buffer)
const TURN_AHEAD = 0.1;

/**
 * Ping-pong video loop: plays forward to near-end, then manually drives
 * currentTime backward to near-start, then forward again. No restart,
 * no crossfade — motion is always continuous.
 */
export default function SeamlessVideo({ src, poster, className, style, startOffset = 0 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dirRef = useRef(1);            // 1 = forward, -1 = reverse
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    dirRef.current = 1;
    lastTsRef.current = null;
    setIsReady(false);

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      v.currentTime = startOffset;
      v.play().catch(() => {});
    };

    const onMeta    = () => start();
    const onPlaying = () => setIsReady(true);
    // Safety net: if native playback reaches end before RAF catches it
    const onEnded   = () => { dirRef.current = -1; };

    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('ended', onEnded);
    if (v.readyState >= 1) start();

    const tick = (ts: number) => {
      if (!v.duration) { rafRef.current = requestAnimationFrame(tick); return; }

      if (lastTsRef.current === null) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (dirRef.current === 1) {
        if (v.currentTime >= v.duration - TURN_AHEAD) {
          dirRef.current = -1;
          v.pause();
        }
      } else {
        const t = v.currentTime - delta;
        if (t <= startOffset + TURN_AHEAD) {
          dirRef.current = 1;
          v.currentTime = startOffset;
          v.play().catch(() => {});
        } else {
          v.currentTime = t;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('ended', onEnded);
    };
  }, [src, startOffset]);

  return (
    <video
      ref={videoRef}
      className={className ?? 'absolute inset-0 w-full h-full object-cover'}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      style={{ ...style, opacity: isReady ? 1 : 0, transition: 'opacity 500ms ease-in-out' }}
    />
  );
}

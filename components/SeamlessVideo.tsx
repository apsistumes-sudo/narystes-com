'use client';
import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  startOffset?: number; // kept for API compatibility, unused with pre-rendered ping-pong
  nativeLoop?: boolean; // skip timeupdate workaround — use for xfade-seamless files
};

/**
 * Pre-rendered ping-pong video: forward + reverse baked into a single file.
 * `loop` handles desktop. `timeupdate` + `ended` override the iOS Safari loop
 * gap by jumping to 0 just before the natural end — zero per-frame cost.
 */
export default function SeamlessVideo({ src, poster, className, style, nativeLoop = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (nativeLoop) return; // file handles seamless loop natively — no JS needed
    const v = videoRef.current;
    if (!v) return;

    const restart = () => { v.currentTime = 0; v.play().catch(() => {}); };

    // Jump 0.1s before natural end — bypasses the iOS Safari loop gap
    const onTimeUpdate = () => {
      if (v.duration && v.currentTime >= v.duration - 0.1) restart();
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('ended', restart);
    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('ended', restart);
    };
  }, [src, nativeLoop]);

  return (
    <video
      ref={videoRef}
      className={className ?? 'absolute inset-0 w-full h-full object-cover'}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={style}
    />
  );
}

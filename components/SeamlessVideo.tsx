'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
};

// Seconds before end of active video to start the crossfade.
const FADE_S = 0.6;

/**
 * Smooth infinite video loop: two video elements alternate.
 * When the active video is FADE_S seconds from its end, the idle
 * video is rewound to 0, played, and faded in while the active
 * video fades out. No loop attribute — no browser-level hard cut.
 */
export default function SeamlessVideo({ src, poster, className, style }: Props) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [showB, setShowB] = useState(false);
  // Mirror of showB accessible inside the RAF closure without stale closure issues.
  const showBRef = useRef(false);

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    let rafId: number;
    let swapping = false;

    const swap = (activeIsA: boolean) => {
      if (swapping) return;
      swapping = true;

      const incoming = activeIsA ? b : a;
      const outgoing = activeIsA ? a : b;

      // Rewind the idle video and start it.
      incoming.currentTime = 0;
      incoming.play().catch(() => {});

      // Flip the opacity state.
      const next = !showBRef.current;
      showBRef.current = next;
      setShowB(next);

      // After the crossfade + a small buffer, park the outgoing video.
      setTimeout(() => {
        outgoing.pause();
        outgoing.currentTime = 0;
        swapping = false;
      }, FADE_S * 1000 + 150);
    };

    const tick = () => {
      const activeIsA = !showBRef.current;
      const active = activeIsA ? a : b;
      if (!swapping && active.duration > 0 && active.currentTime >= active.duration - FADE_S) {
        swap(activeIsA);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [src]);

  const base = className ?? 'absolute inset-0 w-full h-full object-cover';
  const transition = `opacity ${FADE_S * 1000}ms ease-in-out`;

  return (
    <>
      <video
        ref={videoARef}
        className={base}
        src={src}
        poster={poster}
        autoPlay muted playsInline
        style={{ ...style, opacity: showB ? 0 : 1, transition }}
      />
      <video
        ref={videoBRef}
        className={base}
        src={src}
        muted playsInline
        style={{ ...style, opacity: showB ? 1 : 0, transition }}
      />
    </>
  );
}

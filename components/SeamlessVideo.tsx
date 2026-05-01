'use client';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  startOffset?: number; // kept for API compatibility, unused with pre-rendered ping-pong
};

/**
 * Pre-rendered ping-pong video: forward + reverse baked into a single file.
 * The browser loops it with zero JS overhead — start and end frames are
 * identical, so the loop point is invisible.
 */
export default function SeamlessVideo({ src, poster, className, style }: Props) {
  return (
    <video
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

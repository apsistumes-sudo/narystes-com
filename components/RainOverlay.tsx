'use client';
import dynamic from 'next/dynamic';

const RainEffect = dynamic(() => import('@/lib/rain/RainEffect'), { ssr: false });

export default function RainOverlay({ active }: { active: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-opacity duration-700"
      style={{ zIndex: 10, opacity: active ? 1 : 0 }}
    >
      <RainEffect
        type="rain"
        backgroundImageUrl="/web_hero_poster.jpg"
      />
    </div>
  );
}

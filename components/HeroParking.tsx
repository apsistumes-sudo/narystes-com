'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import RainOverlay from './RainOverlay';
import LightningText from './LightningText';
import { ASSET_VERSION } from '@/lib/asset-version';

const v = ASSET_VERSION;

// Desktop: 16:9 video, cars side by side
const CARS_DESKTOP = [
  { id: 'divo',      href: '/produktas/divo',      left: '5%',  top: '38%', width: '28%', height: '42%' },
  { id: 'urus',      href: '/produktas/urus',      left: '36%', top: '32%', width: '28%', height: '42%' },
  { id: 'aventador', href: '/produktas/aventador', left: '67%', top: '38%', width: '28%', height: '42%' },
];

// Mobile: 9:16 video, cars closer to camera in new v2 source
const CARS_MOBILE = [
  { id: 'divo',      href: '/produktas/divo',      left: '0%',  top: '52%', width: '36%', height: '36%' },
  { id: 'urus',      href: '/produktas/urus',      left: '34%', top: '40%', width: '32%', height: '40%' },
  { id: 'aventador', href: '/produktas/aventador', left: '64%', top: '52%', width: '36%', height: '36%' },
];

export default function HeroParking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [carsStopped, setCarsStopped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Trigger relative to actual video duration so encoding differences don't cause drift.
    // Mobile uses a shorter lead because the 2.4x approach ends very close to the video's end.
    const FLASH_LEAD_MS = isMobile ? 600 : 800;

    let triggered = false;

    const onTime = () => {
      if (triggered) return;
      if (!el.duration || isNaN(el.duration)) return;
      const remaining = (el.duration - el.currentTime) * 1000;
      if (remaining <= FLASH_LEAD_MS) {
        triggered = true;
        setCarsStopped(true);
      }
    };

    const onEnded = () => {
      if (!triggered) {
        triggered = true;
        setCarsStopped(true);
      }
    };

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [isMobile]);

  const cars      = isMobile ? CARS_MOBILE : CARS_DESKTOP;
  const videoSrc  = isMobile ? `/web_hero_mobile.mp4?v=${v}`        : `/web_hero.mp4?v=${v}`;
  const posterSrc = isMobile ? `/web_hero_mobile_poster.jpg?v=${v}` : `/web_hero_poster.jpg?v=${v}`;

  // Reset when source switches (desktop ↔ mobile)
  useEffect(() => { setVideoPlaying(false); }, [videoSrc]);

  return (
    <section className="relative w-screen h-[100dvh] overflow-hidden bg-black select-none">
      <video
        ref={videoRef}
        key={videoSrc}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${carsStopped || !videoPlaying ? 'opacity-0' : 'opacity-100'}`}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        onPlaying={() => setVideoPlaying(true)}
      />

      {carsStopped && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <RainOverlay active={carsStopped} posterUrl={posterSrc} />

      {cars.map(car => (
        <Link
          key={car.id}
          href={car.href}
          aria-label={`Pasirinkti: ${car.id}`}
          className={`absolute block group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${carsStopped ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
          style={{ left: car.left, top: car.top, width: car.width, height: car.height, zIndex: 20 }}
        >
          <span className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/40 active:ring-white/60 rounded-lg transition-all duration-200 group-hover:scale-[1.02]" />
        </Link>
      ))}

      <LightningText active={carsStopped} text="Rinkitės narystę" mobile={isMobile} />
    </section>
  );
}

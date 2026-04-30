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

// Mobile: 9:16 video, cars in lower portion of the vertical frame
const CARS_MOBILE = [
  { id: 'divo',      href: '/produktas/divo',      left: '2%',  top: '60%', width: '30%', height: '22%' },
  { id: 'urus',      href: '/produktas/urus',      left: '32%', top: '54%', width: '36%', height: '28%' },
  { id: 'aventador', href: '/produktas/aventador', left: '68%', top: '60%', width: '30%', height: '22%' },
];

export default function HeroParking() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [carsStopped, setCarsStopped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Cars stop moving at ~1.67s (3s approach / 1.8x speed).
    // Fire at 1.6s so the flash overlaps the final stopping motion.
    const STOP_TIME = 1.6;

    const onTime  = () => { if (el.currentTime >= STOP_TIME && !carsStopped) setCarsStopped(true); };
    const onEnded = () => setCarsStopped(true);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [carsStopped]);

  const cars      = isMobile ? CARS_MOBILE : CARS_DESKTOP;
  const videoSrc  = isMobile ? `/web_hero_mobile.mp4?v=${v}`        : `/web_hero.mp4?v=${v}`;
  const posterSrc = isMobile ? `/web_hero_mobile_poster.jpg?v=${v}` : `/web_hero_poster.jpg?v=${v}`;

  return (
    <section className="relative w-screen h-[100dvh] overflow-hidden bg-black select-none">
      <video
        ref={videoRef}
        key={videoSrc}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${carsStopped ? 'opacity-0' : 'opacity-100'}`}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
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

      <RainOverlay active={carsStopped} />

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

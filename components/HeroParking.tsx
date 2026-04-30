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

// Plate overlay positions — tweak top/left after calibrating on real video.
// width = container width; the image inside is cropped to just the plate rectangle.
// The PNG images are square (2048×2048) with a ~3.5:1 plate centered inside with white margins.
// Crop ratios below remove the white margins: ~32% top/bottom, ~7% left/right.
const PLATE_CROP = { top: '32%', bottom: '32%', left: '7%', right: '7%' };

const PLATES_DESKTOP = [
  { id: 'divo',      left: '7%',  top: '71%', width: '24%' },
  { id: 'urus',      left: '38%', top: '65%', width: '24%' },
  { id: 'aventador', left: '69%', top: '71%', width: '24%' },
];

const PLATES_MOBILE = [
  { id: 'divo',      left: '2%',  top: '75%', width: '30%' },
  { id: 'urus',      left: '32%', top: '70%', width: '36%' },
  { id: 'aventador', left: '68%', top: '75%', width: '30%' },
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

    // Fire 80ms before the video ends so the flash overlaps the final frame
    const FLASH_LEAD_MS = 80;

    const onTime  = () => {
      if (carsStopped) return;
      const remaining = (el.duration - el.currentTime) * 1000;
      if (remaining <= FLASH_LEAD_MS) setCarsStopped(true);
    };
    const onEnded = () => setCarsStopped(true);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
    };
  }, [carsStopped]);

  const cars   = isMobile ? CARS_MOBILE   : CARS_DESKTOP;
  const plates = isMobile ? PLATES_MOBILE : PLATES_DESKTOP;
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

      {/* Crisp license plate overlays — fade in with the static frame */}
      {plates.map(plate => (
        <div
          key={plate.id}
          className={`absolute pointer-events-none transition-opacity duration-500 ${carsStopped ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: plate.left,
            top: plate.top,
            width: plate.width,
            // Crop container sized to the visible plate rectangle inside the square PNG
            overflow: 'hidden',
            aspectRatio: '1 / 1',
            zIndex: 22,
            // Negative margin crops: shift image so the plate rectangle fills the container
            // Adjust PLATE_CROP values if white edges are visible
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/plates/plate-${plate.id}.png?v=${v}`}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{
              position: 'absolute',
              top:    `-${PLATE_CROP.top}`,
              bottom: `-${PLATE_CROP.bottom}`,
              left:   `-${PLATE_CROP.left}`,
              right:  `-${PLATE_CROP.right}`,
              width:  `calc(100% + ${PLATE_CROP.left} + ${PLATE_CROP.right})`,
              height: `calc(100% + ${PLATE_CROP.top}  + ${PLATE_CROP.bottom})`,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.85))',
            }}
          />
        </div>
      ))}

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

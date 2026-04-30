'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import RainOverlay from '@/components/RainOverlay';
import LightningText from '@/components/LightningText';

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  description: string;
  features: readonly string[];
  ctaLabel: string;
  ctaUrl: string;
  position: 'left' | 'center' | 'right';
};

const CROP_DESKTOP = {
  left:   { size: '300%', position: '8% 70%'  },
  center: { size: '280%', position: '50% 70%' },
  right:  { size: '300%', position: '92% 70%' },
};

const CROP_MOBILE = {
  left:   { size: '180%', position: '15% 70%' },
  center: { size: '170%', position: '50% 70%' },
  right:  { size: '180%', position: '85% 70%' },
};

export default function ProductPageClient({ product }: { product: Product }) {
  const [animatedIn, setAnimatedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const crop = isMobile ? CROP_MOBILE[product.position] : CROP_DESKTOP[product.position];
  const posterSrc = isMobile ? '/web_hero_mobile_poster.jpg' : '/web_hero_poster.jpg';

  const textOnLeft = !isMobile && product.position === 'right';

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
      {/* Hero poster cropped via background-image to show only the selected car */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${posterSrc})`,
          backgroundSize: crop.size,
          backgroundPosition: crop.position,
          opacity: animatedIn ? 1 : 0,
          transform: animatedIn ? 'scale(1)' : 'scale(0.97)',
          zIndex: 0,
        }}
      />

      {/* Gradient on text side for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 60%)'
            : textOnLeft
              ? 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)'
              : 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)',
          zIndex: 5,
        }}
      />

      <RainOverlay posterUrl={posterSrc} />

      {/* Product info panel */}
      <div
        className={`
          absolute z-20 transition-all duration-700 ease-out
          ${animatedIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          ${isMobile
            ? 'bottom-0 left-0 right-0 p-6 pb-12'
            : textOnLeft
              ? 'top-1/2 left-12 -translate-y-1/2 max-w-md p-8'
              : 'top-1/2 right-12 -translate-y-1/2 max-w-md p-8'}
        `}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">
          {product.subtitle}
        </div>
        <h1
          className={`font-bold text-white tracking-tight mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}
          style={{ fontFamily: 'var(--font-space)' }}
        >
          {product.name}
        </h1>
        <div className="text-2xl text-white/90 font-light mb-6">{product.price}</div>
        <p className="text-white/80 leading-relaxed mb-6">{product.description}</p>
        <ul className="space-y-2 mb-8">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-white/80">
              <span className="text-white/50 mt-1">→</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <a
          href={product.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all"
        >
          {product.ctaLabel}
        </a>
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 z-30 text-white/80 hover:text-white text-sm flex items-center gap-2 transition-colors bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        ← Atgal
      </Link>

      <LightningText active={animatedIn} text="" mobile={isMobile} />
    </main>
  );
}

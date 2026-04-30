'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import RainOverlay from '@/components/RainOverlay';
import LightningText from '@/components/LightningText';
import { ASSET_VERSION } from '@/lib/asset-version';

const v = ASSET_VERSION;

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

  const initialOffset = {
    left:   'translate(-30%, 0) scale(0.85)',
    center: 'translate(0, 0) scale(0.85)',
    right:  'translate(30%, 0) scale(0.85)',
  }[product.position];

  const finalTransform = isMobile
    ? 'translate(0, -10%) scale(1.0)'
    : 'translate(-25%, 0) scale(1.1)';

  return (
    <main className="relative w-screen min-h-[100dvh] overflow-hidden bg-black">
      {/* Parking lot background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/parking_clean.jpg?v=${v})`, zIndex: 0 }}
      />

      <RainOverlay posterUrl={`/parking_clean.jpg?v=${v}`} />

      {/* Selected car — slides in from its landing-page position */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          transform: animatedIn ? finalTransform : initialOffset,
          opacity: animatedIn ? 1 : 0,
          zIndex: 5,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/cars/${product.id}.png?v=${v}`}
          alt={product.name}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Product info panel */}
      <div
        className={`
          absolute z-10 transition-all duration-700 ease-out
          ${animatedIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          ${isMobile
            ? 'bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent'
            : 'top-1/2 right-12 -translate-y-1/2 max-w-md p-8'}
        `}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3">
          {product.subtitle}
        </div>
        <h1
          className={`font-bold text-white tracking-tight mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}
          style={{ fontFamily: 'var(--font-space)' }}
        >
          {product.name}
        </h1>
        <div className="text-2xl text-white/90 font-light mb-6">{product.price}</div>
        <p className="text-white/70 leading-relaxed mb-6">{product.description}</p>
        <ul className="space-y-2 mb-8">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-white/80">
              <span className="text-white/40 mt-1">→</span>
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

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
      >
        ← Atgal
      </Link>

      {/* Periodic lightning — no text on product pages */}
      <LightningText active={animatedIn} text="" mobile={isMobile} />
    </main>
  );
}

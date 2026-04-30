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

  const textOnLeft = !isMobile && product.position === 'right';

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
      {/* Clean parking lot background (blurred where cars were) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: 'url(/parking_clean.jpg)',
          opacity: animatedIn ? 1 : 0,
          zIndex: 0,
        }}
      />

      {/* Selected car as transparent PNG, animated to center stage */}
      <div
        className={`
          absolute inset-0 flex items-end justify-center
          transition-all duration-1000 ease-out
          ${animatedIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
        `}
        style={{ zIndex: 5 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/cars/${product.id}.png`}
          alt={product.name}
          className="object-contain"
          style={{
            width: isMobile ? '95%' : '60%',
            maxHeight: isMobile ? '60%' : '85%',
            marginLeft: isMobile ? 0 : (textOnLeft ? 'auto' : 0),
            marginRight: isMobile ? 0 : (textOnLeft ? '5%' : 'auto'),
            marginBottom: isMobile ? '35%' : '0',
          }}
          draggable={false}
        />
      </div>

      {/* Subtle dark gradient on text side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 55%)'
            : textOnLeft
              ? 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 55%)'
              : 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 55%)',
          zIndex: 10,
        }}
      />

      <RainOverlay />

      {/* Product info */}
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

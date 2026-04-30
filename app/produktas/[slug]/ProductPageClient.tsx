'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ASSET_VERSION } from '@/lib/asset-version';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const v = ASSET_VERSION;

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden"
      style={{
        backgroundImage: `url(/parking_clean.jpg?v=${v})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Stronger dark gradient — covers more of the parking artifacts */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.3) 55%, transparent 75%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 55%)',
          zIndex: 1,
        }}
      />

      {/* Ground shadow — positioned in absolute screen coords, where the car wheels will be */}
      <div
        className="absolute pointer-events-none"
        style={{
          ...(isMobile
            ? {
                bottom: '32vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70vw',
                height: '4vh',
              }
            : {
                bottom: '12vh',
                left: '20vw',
                width: '35vw',
                height: '5vh',
              }),
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, transparent 75%)',
          filter: 'blur(12px)',
          zIndex: 2,
        }}
      />

      {/* The car PNG — sized so the FULL car (including wheels) fits in viewport */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/cars/${product.id}.png?v=${v}`}
        alt={product.name}
        className="absolute pointer-events-none select-none"
        style={{
          ...(isMobile
            ? {
                top: '15vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'auto',
                height: '40vh',
                maxWidth: '90vw',
              }
            : {
                top: '15vh',
                left: '5vw',
                width: 'auto',
                height: '60vh',
                maxWidth: '50vw',
              }),
          objectFit: 'contain',
          zIndex: 3,
        }}
        draggable={false}
      />

      {/* Product info text */}
      <div
        className={`
          absolute z-10
          ${isMobile
            ? 'bottom-0 left-0 right-0 p-6 pb-12'
            : 'top-1/2 right-12 -translate-y-1/2 max-w-md p-8'}
        `}
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">
          {product.subtitle}
        </div>
        <h1 className={`font-bold text-white tracking-tight mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
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
        className="absolute top-6 left-6 z-20 text-white/80 hover:text-white text-sm flex items-center gap-2 transition-colors bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        ← Atgal
      </Link>
    </main>
  );
}

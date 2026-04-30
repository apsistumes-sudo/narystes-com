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
      {/* Dark gradient on right side (or bottom on mobile) for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, transparent 55%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 60%)',
          zIndex: 1,
        }}
      />

      {/* Car with ground shadow */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          ...(isMobile
            ? {
                bottom: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '95vw',
                height: '50vh',
              }
            : {
                bottom: '5vh',
                left: '5vw',
                width: '55vw',
                height: '80vh',
              }),
          zIndex: 2,
        }}
      >
        {/* Ground shadow — elliptical blur underneath */}
        <div
          className="absolute"
          style={{
            bottom: '2%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: '8%',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 40%, transparent 75%)',
            filter: 'blur(8px)',
          }}
        />

        {/* The car itself */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/cars/${product.id}.png?v=${v}`}
          alt={product.name}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'contain' }}
          draggable={false}
        />
      </div>

      {/* Product info — right side on desktop, bottom on mobile */}
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

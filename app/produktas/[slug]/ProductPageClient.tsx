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
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
      {/* Full-bleed car photo as background */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(/cars/${product.id}.jpg?v=${v})`,
          backgroundPosition: isMobile ? 'center 40%' : 'right center',
          zIndex: 0,
        }}
      />

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.2) 55%, transparent 75%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.1) 60%, transparent 75%)',
          zIndex: 1,
        }}
      />

      {/* Product info — left side on desktop, bottom on mobile */}
      <div
        className={`
          absolute z-10
          ${isMobile
            ? 'bottom-0 left-0 right-0 p-6 pb-12'
            : 'top-1/2 left-12 -translate-y-1/2 max-w-md p-8'}
        `}
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
          {product.subtitle}
        </div>
        <h1 className={`font-bold text-white tracking-tight mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
          {product.name}
        </h1>
        <div className="text-2xl text-white/90 font-light mb-6">{product.price}</div>
        <p className="text-white/85 leading-relaxed mb-6">{product.description}</p>
        <ul className="space-y-2 mb-8">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-white/90">
              <span className="text-white/60 mt-1">→</span>
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
        className="absolute top-6 left-6 z-20 text-white/90 hover:text-white text-sm flex items-center gap-2 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        ← Atgal
      </Link>
    </main>
  );
}

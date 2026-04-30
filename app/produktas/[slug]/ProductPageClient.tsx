'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ASSET_VERSION } from '@/lib/asset-version';
import SeamlessVideo from '@/components/SeamlessVideo';

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
  const [desktopVideoExists, setDesktopVideoExists] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const desktopScale = product.id === 'divo' ? 1 : 0.85;

  const v = ASSET_VERSION;
  const desktopVideoSrc = `/products/${product.id}.mp4?v=${v}`;
  const mobileVideoSrc  = `/products/${product.id}_mobile.mp4?v=${v}`;
  const posterSrc       = `/products/${product.id}_poster.jpg?v=${v}`;

  // Probe whether the 16:9 desktop video exists; fall back to poster if not.
  useEffect(() => {
    if (isMobile) return;
    fetch(desktopVideoSrc, { method: 'HEAD' })
      .then(r => setDesktopVideoExists(r.ok))
      .catch(() => setDesktopVideoExists(false));
  }, [isMobile, desktopVideoSrc]);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
      {/* MOBILE: vertical 9:16 video, seamlessly looped */}
      {isMobile && (
        <SeamlessVideo
          src={mobileVideoSrc}
          poster={posterSrc}
          style={{ zIndex: 0 }}
        />
      )}

      {/* DESKTOP + 16:9 video exists: plays full bleed, seamlessly looped */}
      {!isMobile && desktopVideoExists && (
        <SeamlessVideo
          src={desktopVideoSrc}
          poster={posterSrc}
          style={{
            zIndex: 0,
            transform: `scale(${desktopScale})`,
            transformOrigin: 'center center',
          }}
        />
      )}

      {/* DESKTOP fallback: static poster until 16:9 videos are generated */}
      {!isMobile && !desktopVideoExists && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.2) 55%, transparent 75%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.05) 60%, transparent 75%)',
          zIndex: 2,
        }}
      />

      {/* Product info */}
      <div
        className={`
          absolute z-10
          ${isMobile
            ? 'bottom-0 left-0 right-0 p-6 pb-12'
            : 'top-1/2 right-12 -translate-y-1/2 max-w-md p-8'}
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

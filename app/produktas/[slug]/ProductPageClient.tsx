'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ASSET_VERSION } from '@/lib/asset-version';
import SeamlessVideo from '@/components/SeamlessVideo';

type ProductSection = {
  heading: string;
  intro?: string;
  numberedList?: readonly string[];
  bulletList?: readonly string[];
  outro?: string;
};

type YoutubeVideo = {
  url: string;
  videoId: string;
  title?: string;
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  tagline: string;
  sections: readonly ProductSection[];
  youtubeVideos?: readonly YoutubeVideo[];
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
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

  const v = ASSET_VERSION;
  const desktopVideoSrc = `/products/${product.id}.mp4?v=${v}`;
  const mobileVideoSrc  = `/products/${product.id}_mobile.mp4?v=${v}`;
  const posterSrc       = `/products/${product.id}_poster.jpg?v=${v}`;

  useEffect(() => {
    if (isMobile) return;
    fetch(desktopVideoSrc, { method: 'HEAD' })
      .then(r => setDesktopVideoExists(r.ok))
      .catch(() => setDesktopVideoExists(false));
  }, [isMobile, desktopVideoSrc]);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
      {isMobile && (
        <SeamlessVideo
          src={mobileVideoSrc}
          poster={posterSrc}
          style={{ zIndex: 0 }}
        />
      )}

      {!isMobile && desktopVideoExists && (
        <SeamlessVideo
          src={desktopVideoSrc}
          poster={posterSrc}
          style={{ zIndex: 0 }}
        />
      )}

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

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isMobile
            ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, transparent 80%)'
            : 'linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 70%, transparent 85%)',
          zIndex: 2,
        }}
      />

      {/* Product info */}
      <div
        className={`
          absolute z-10 overflow-y-auto
          ${isMobile
            ? 'bottom-0 left-0 right-0 max-h-[70dvh] p-6 pb-12'
            : 'top-0 right-0 h-full w-[min(560px,45vw)] px-10 py-16 flex flex-col justify-center'}
        `}
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
          {product.subtitle}
        </div>
        <h1 className={`font-bold text-white tracking-tight mb-3 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
          {product.name}
        </h1>
        <div className="text-2xl text-white/90 font-light mb-2">{product.price}</div>
        <p className="text-white/70 text-sm mb-8 leading-relaxed">{product.tagline}</p>

        {product.sections.map((section, idx) => (
          <div key={idx} className="mb-7">
            <h2 className="text-white font-semibold text-lg mb-3">{section.heading}</h2>
            {section.intro && (
              <p className="text-white/80 leading-relaxed mb-3">{section.intro}</p>
            )}
            {section.numberedList && (
              <ol className="space-y-2 mb-3">
                {section.numberedList.map((item, i) => (
                  <li key={i} className="flex gap-3 text-white/85 leading-relaxed">
                    <span className="text-white/50 font-mono shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            )}
            {section.bulletList && (
              <ul className="space-y-2 mb-3">
                {section.bulletList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/85 leading-relaxed">
                    <span className="text-white/50 mt-1 shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {section.outro && (
              <p className="text-white/80 leading-relaxed">{section.outro}</p>
            )}
          </div>
        ))}

        {product.youtubeVideos && product.youtubeVideos.length > 0 && (
          <div className="mb-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.youtubeVideos.map((video, i) => (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
                >
                  <div className="relative aspect-video bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                      alt={video.title || 'YouTube video'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 ml-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p
                      className="text-white/90 text-sm leading-snug"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {video.title || 'Žiūrėti YouTube'}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href={product.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-white text-black font-semibold px-7 py-4 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all"
          >
            {product.ctaLabel}
          </a>
          <a
            href={product.secondaryCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-4 rounded-full backdrop-blur-sm border border-white/20 active:scale-[0.97] transition-all"
          >
            {product.secondaryCtaLabel}
          </a>
        </div>
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

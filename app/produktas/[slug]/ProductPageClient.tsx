'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
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
  heroHeadline?: string;
  susisiektiUrl: string;
  sections: readonly ProductSection[];
  youtubeVideos?: readonly YoutubeVideo[];
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  position: 'left' | 'center' | 'right';
};

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionBlock({ section }: { section: ProductSection }) {
  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-lg lg:text-2xl mb-3">{section.heading}</h2>
      {section.intro && (
        <p className="text-white/80 leading-relaxed mb-3">{section.intro}</p>
      )}
      {section.numberedList && (
        <ol className="space-y-2 mb-3">
          {section.numberedList.map((item, i) => (
            <li key={i} className="flex gap-3 text-white/85 leading-relaxed lg:text-lg">
              <span className="text-white/50 font-mono shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}
      {section.bulletList && (
        <ul className="space-y-2 mb-3">
          {section.bulletList.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-white/85 leading-relaxed lg:text-lg">
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
  );
}

// Desktop: vertical list — 160×90 thumbnail on the left, title text on the right.
// All 4 items fit within a normal viewport height without scrolling.
function YoutubeListDesktop({ videos }: { videos: readonly YoutubeVideo[] }) {
  return (
    <div className="flex flex-col gap-4">
      {videos.map((video, i) => (
        <a
          key={i}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-xl p-2 hover:bg-white/8 transition-colors"
        >
          {/* 160×90 thumbnail */}
          <div
            className="relative flex-shrink-0 w-40 rounded-lg overflow-hidden bg-black"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title || 'YouTube video'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-3.5 h-3.5 ml-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          {/* Title */}
          <p
            className="text-white/90 text-sm leading-snug"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {video.title || 'Žiūrėti YouTube'}
          </p>
        </a>
      ))}
    </div>
  );
}

// Mobile/tablet: always 2×2 grid, never stacks to single column.
function YoutubeGridMobile({ videos }: { videos: readonly YoutubeVideo[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {videos.map((video, i) => (
        <a
          key={i}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
        >
          <div className="relative aspect-video bg-black">
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title || 'YouTube video'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-3 h-3 ml-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="p-2">
            <p
              className="text-white/90 text-xs leading-snug"
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
  );
}

const backLink = (
  <Link
    href="/"
    className="fixed top-6 left-6 z-50 text-white/90 hover:text-white text-sm flex items-center gap-2 transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
  >
    ← Atgal
  </Link>
);

// ── Main component ──────────────────────────────────────────────────────────

export default function ProductPageClient({ product }: { product: Product }) {
  const [isMobile, setIsMobile] = useState(false);
  const [desktopVideoExists, setDesktopVideoExists] = useState(false);

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const v = ASSET_VERSION;
  const desktopVideoSrc = `/products/${product.id}.mp4?v=${v}`;
  const posterSrc       = `/products/${product.id}_poster.jpg?v=${v}`;

  useEffect(() => {
    if (isMobile) return;
    fetch(desktopVideoSrc, { method: 'HEAD' })
      .then(r => setDesktopVideoExists(r.ok))
      .catch(() => setDesktopVideoExists(false));
  }, [isMobile, desktopVideoSrc]);

  const hasVideos = (product.youtubeVideos?.length ?? 0) > 0;

  // ── MOBILE (<768px) ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {backLink}
        <main className="w-screen bg-black">
          <div className="relative h-52 overflow-hidden">
            <img
              src={posterSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9) 100%)',
                zIndex: 2,
              }}
            />
          </div>

          <div className="px-6 pt-6 pb-2">
            <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
              {product.subtitle}
            </div>
            <h1 className="font-bold text-white tracking-tight text-3xl mb-3">
              {product.name}
            </h1>
            <div className="text-2xl text-white/90 font-light mb-2">{product.price}</div>
            <p className="text-white/70 text-sm mb-7 leading-relaxed">{product.tagline}</p>
            {product.sections.map((section, idx) => (
              <SectionBlock key={idx} section={section} />
            ))}
          </div>

          {hasVideos && product.youtubeVideos && (
            <div className="px-6 pb-4">
              <h2 className="text-white font-semibold text-lg mb-1">Pamatyk mus veikiant</h2>
              <p className="text-white/60 text-sm mb-3">Keletas mūsų pasirodymų ir interviu YouTube:</p>
              <YoutubeGridMobile videos={product.youtubeVideos} />
            </div>
          )}

          <div className="px-6 pb-12 flex flex-col gap-3">
            <a
              href={product.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-white text-black font-semibold px-7 py-4 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all"
            >
              {product.ctaLabel}
            </a>
            <a
              href={product.secondaryCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-4 rounded-full backdrop-blur-sm border border-white/20 active:scale-[0.97] transition-all"
            >
              {product.secondaryCtaLabel}
            </a>
          </div>
        </main>
      </>
    );
  }

  // ── DESKTOP (≥768px) ────────────────────────────────────────────────────────
  // Full-bleed car video. Centered max-w-7xl container. Balanced 50/50 columns.
  // LEFT: vertical YouTube list. RIGHT: membership info + CTAs.
  return (
    <>
      {backLink}
      <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
        {/* Car video — full bleed */}
        {desktopVideoExists ? (
          <SeamlessVideo src={desktopVideoSrc} poster={posterSrc} style={{ zIndex: 0 }} />
        ) : (
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

        {/* Gradient: darker over column areas, lighter in the car-video center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 25%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.72) 75%, rgba(0,0,0,0.88) 100%)',
            zIndex: 2,
          }}
        />

        {/* Centered two-column overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full max-w-[1280px] mx-auto px-10 flex items-center gap-14">

            {/* LEFT — "Pamatyk mus veikiant" + vertical video list */}
            <div className="flex-1 flex flex-col max-h-[84dvh] overflow-y-auto py-14">
              {hasVideos && product.youtubeVideos ? (
                <>
                  <h2 className="text-white font-bold text-2xl lg:text-3xl mb-2">Pamatyk mus veikiant</h2>
                  <p className="text-white/55 text-sm lg:text-base mb-6">
                    Keletas mūsų pasirodymų ir interviu YouTube:
                  </p>
                  <YoutubeListDesktop videos={product.youtubeVideos} />
                </>
              ) : (
                <div />
              )}
            </div>

            {/* RIGHT — membership info + CTA */}
            <div className="flex-1 flex flex-col max-h-[84dvh] overflow-y-auto py-14">
              {product.heroHeadline && (
                <h1 className="font-bold text-white leading-snug text-2xl lg:text-3xl mb-6">
                  {product.heroHeadline}
                </h1>
              )}

              {product.sections.map((section, idx) => (
                <SectionBlock key={idx} section={section} />
              ))}

              <a
                href={product.susisiektiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow block w-fit text-center bg-white text-black font-bold text-xl px-12 py-4 rounded-full hover:scale-105 hover:bg-white/95 active:scale-[0.97] transition-all duration-200 mt-8"
              >
                Susisiekti
              </a>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

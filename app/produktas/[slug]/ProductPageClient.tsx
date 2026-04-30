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

function SectionBlock({ section }: { section: ProductSection }) {
  return (
    <div className="mb-7">
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
  );
}

function YoutubeGrid({ videos, compact }: { videos: readonly YoutubeVideo[]; compact?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {videos.map((video, i) => (
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
              <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <svg className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} ml-0.5 text-white`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={compact ? 'p-1.5' : 'p-2'}>
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

function CtaButtons({ product }: { product: Product }) {
  return (
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

  const hasVideos = (product.youtubeVideos?.length ?? 0) > 0;

  // Sections with actual list content go in the text panel.
  // Sections with only heading+intro (no list) become the YouTube panel header.
  const listSections = product.sections.filter(
    s => s.bulletList?.length || s.numberedList?.length
  );
  const introSection = product.sections.find(
    s => !s.bulletList?.length && !s.numberedList?.length
  );

  // ── MOBILE ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {backLink}
        <main className="w-screen bg-black">
          {/* Compact hero */}
          <div className="relative h-52 overflow-hidden">
            <SeamlessVideo src={mobileVideoSrc} poster={posterSrc} style={{ zIndex: 0 }} />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9) 100%)',
                zIndex: 2,
              }}
            />
          </div>

          {/* Text content */}
          <div className="px-6 pt-6 pb-4">
            <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
              {product.subtitle}
            </div>
            <h1 className="font-bold text-white tracking-tight text-3xl mb-3">
              {product.name}
            </h1>
            <div className="text-2xl text-white/90 font-light mb-2">{product.price}</div>
            <p className="text-white/70 text-sm mb-8 leading-relaxed">{product.tagline}</p>

            {/* All list sections */}
            {listSections.map((section, idx) => (
              <SectionBlock key={idx} section={section} />
            ))}

            {/* Intro section text (e.g. "Pamatyk mus veikiant") */}
            {hasVideos && introSection && (
              <SectionBlock section={introSection} />
            )}

            <CtaButtons product={product} />
          </div>

          {/* YouTube 2×2 grid — always grid-cols-2, never stacks */}
          {hasVideos && product.youtubeVideos && (
            <div className="px-6 pt-4 pb-12">
              <YoutubeGrid videos={product.youtubeVideos} compact />
            </div>
          )}
        </main>
      </>
    );
  }

  // ── DESKTOP + YOUTUBE: split layout ───────────────────────────────────────
  if (hasVideos) {
    return (
      <>
        {backLink}
        <main className="flex h-[100dvh] bg-black overflow-hidden">
          {/* LEFT: hero video + YouTube grid */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Hero takes remaining vertical space */}
            <div className="relative flex-1 min-h-0">
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
              {/* Bottom fade into YouTube panel */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.85) 100%)',
                  zIndex: 2,
                }}
              />
            </div>

            {/* YouTube section header + 2×2 grid */}
            <div className="flex-shrink-0 px-6 pb-6 bg-black">
              {introSection && (
                <div className="pt-4 pb-3">
                  <h2 className="text-white font-semibold text-base mb-1">{introSection.heading}</h2>
                  {introSection.intro && (
                    <p className="text-white/60 text-sm">{introSection.intro}</p>
                  )}
                </div>
              )}
              {product.youtubeVideos && (
                <YoutubeGrid videos={product.youtubeVideos} />
              )}
            </div>
          </div>

          {/* RIGHT: text content + CTAs */}
          <div className="w-[min(520px,42vw)] flex-shrink-0 overflow-y-auto bg-black px-10 py-16 flex flex-col justify-center border-l border-white/5">
            <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
              {product.subtitle}
            </div>
            <h1 className="font-bold text-white tracking-tight text-5xl mb-3">
              {product.name}
            </h1>
            <div className="text-2xl text-white/90 font-light mb-2">{product.price}</div>
            <p className="text-white/70 text-sm mb-8 leading-relaxed">{product.tagline}</p>

            {listSections.map((section, idx) => (
              <SectionBlock key={idx} section={section} />
            ))}

            <CtaButtons product={product} />
          </div>
        </main>
      </>
    );
  }

  // ── DESKTOP, NO YOUTUBE: original full-bleed layout ───────────────────────
  return (
    <>
      {backLink}
      <main className="relative w-screen h-[100dvh] overflow-hidden bg-black">
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

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 70%, transparent 85%)',
            zIndex: 2,
          }}
        />

        <div className="absolute z-10 top-0 right-0 h-full w-[min(560px,45vw)] px-10 py-16 flex flex-col justify-center overflow-y-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
            {product.subtitle}
          </div>
          <h1 className="font-bold text-white tracking-tight text-5xl mb-3">
            {product.name}
          </h1>
          <div className="text-2xl text-white/90 font-light mb-2">{product.price}</div>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">{product.tagline}</p>

          {product.sections.map((section, idx) => (
            <SectionBlock key={idx} section={section} />
          ))}

          <CtaButtons product={product} />
        </div>
      </main>
    </>
  );
}

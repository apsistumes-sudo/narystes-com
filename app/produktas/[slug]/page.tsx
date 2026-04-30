import Link from 'next/link';
import { notFound } from 'next/navigation';

const PRODUCTS: Record<string, { name: string; tagline: string }> = {
  divo:      { name: 'Bugatti Divo',          tagline: 'Crypto_lietuva — komunita ir analizė' },
  urus:      { name: 'Lamborghini Urus',       tagline: 'skenuok.lt — pagrindinis produktas' },
  aventador: { name: 'Lamborghini Aventador',  tagline: 'Indikatorius — prekybos signalai' },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS[slug];
  if (!p) return {};
  return { title: `${p.name} — Narystes.com` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS[slug];
  if (!p) notFound();

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col">
      <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors w-fit">
        ← Atgal
      </Link>
      <div className="mt-16 max-w-xl">
        <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
          Narystes.com
        </p>
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-space)' }}>
          {p.name}
        </h1>
        <p className="text-xl text-white/70">{p.tagline}</p>
        <p className="mt-12 text-white/40 text-sm">Produkto puslapis ruošiamas.</p>
      </div>
    </main>
  );
}

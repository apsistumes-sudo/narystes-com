import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

const PRODUCTS = {
  divo: {
    id: 'divo',
    name: 'Crypto_Lietuva',
    subtitle: 'Bendruomenės narystė',
    price: '19€/mėn',
    description: 'Lietuvos didžiausia kripto bendruomenė. Naujienos, analizė, diskusijos su tūkstančiais aktyvių narių.',
    features: [
      'Privatūs Telegram ir Discord kanalai',
      'Kasdieninė rinkos analizė lietuviškai',
      'Tiesioginė bendruomenės pagalba',
      'Ekskluzyvūs renginiai ir webinarai',
    ],
    ctaLabel: 'Tapti nariu',
    ctaUrl: 'https://example.com/checkout/crypto-lietuva',
    position: 'left' as const,
  },
  urus: {
    id: 'urus',
    name: 'skenuok.lt',
    subtitle: 'Premium narystė',
    price: '49€/mėn',
    description: 'Pilnas paketas — viskas, ko reikia rimtam kripto investuotojui vienoje vietoje.',
    features: [
      'Visi Crypto_Lietuva ir Indikatorius privalumai',
      'Asmeninis portfolio tracker',
      'Realaus laiko įspėjimai apie progas',
      'Mėnesinis 1-on-1 konsultacijos',
    ],
    ctaLabel: 'Pradėti dabar',
    ctaUrl: 'https://example.com/checkout/skenuok',
    position: 'center' as const,
  },
  aventador: {
    id: 'aventador',
    name: 'Indikatorius',
    subtitle: 'Prekybos signalai',
    price: '29€/mėn',
    description: 'Profesionalūs prekybos signalai ir techninė analizė. Tiems, kurie nori veikti, ne stebėti.',
    features: [
      'Prekybos signalai per Telegram',
      'Techninės analizės grafikai',
      'Įėjimo / išėjimo taškų rekomendacijos',
      'Savaitės rinkos apžvalgos',
    ],
    ctaLabel: 'Gauti signalus',
    ctaUrl: 'https://example.com/checkout/indikatorius',
    position: 'right' as const,
  },
} as const;

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS[slug as keyof typeof PRODUCTS];
  if (!p) return {};
  return { title: `${p.name} — Narystes.com` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS[slug as keyof typeof PRODUCTS];
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}

import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

type ProductSection = {
  heading: string;
  intro?: string;
  numberedList?: string[];
  bulletList?: string[];
  outro?: string;
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  tagline: string;
  sections: ProductSection[];
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  position: 'left' | 'center' | 'right';
};

const PRODUCTS: Record<string, Product> = {
  divo: {
    id: 'divo',
    name: 'Crypto_Lietuva',
    subtitle: 'Bendruomenės narystė',
    price: '19€/mėn',
    tagline: 'Lietuvos didžiausia kripto bendruomenė.',
    sections: [
      {
        heading: 'Apie narystę',
        intro: 'Naujienos, analizė, diskusijos su tūkstančiais aktyvių narių.',
        bulletList: [
          'Privatūs Telegram ir Discord kanalai',
          'Kasdieninė rinkos analizė lietuviškai',
          'Tiesioginė bendruomenės pagalba',
          'Ekskluzyvūs renginiai ir webinarai',
        ],
      },
    ],
    ctaLabel: 'Tapti nariu',
    ctaUrl: 'https://example.com/checkout/crypto-lietuva',
    secondaryCtaLabel: 'Užduok klausimą',
    secondaryCtaUrl: 'https://www.instagram.com/crypto_letova',
    position: 'left',
  },
  urus: {
    id: 'urus',
    name: 'skenuok.lt',
    subtitle: 'Premium narystė',
    price: '49€/mėn',
    tagline: 'Profesionalus kripto pozicijų skaneris.',
    sections: [
      {
        heading: 'Kaip veikia produktas?',
        intro: 'Mūsų skaneris remiasi trimis pagrindais:',
        numberedList: [
          '3,5 metų indikatoriaus duomenimis — milžiniška sukaupta duomenų bazė.',
          'Daugiau nei 1 mln. išanalizuotų pozicijų — visa ši logika perkelta į skanerį, kurį testavome 9 mėnesius.',
          'Crypto Lietuva komandos patirtimi — 6 metai darbo rinkose.',
        ],
      },
      {
        heading: 'Kaip tai veikia praktikoje?',
        intro: 'Įkėlus grafiką, skaneris:',
        bulletList: [
          'Įvertina pozicijos potencialą.',
          'Patikrina indikatoriaus duomenų bazėje, kaip elgėsi panašios pozicijos tame pačiame lygyje — su panašiu volume ir kitais rodikliais.',
          'Pereina per visą mūsų sukauptą analizę.',
        ],
      },
    ],
    ctaLabel: 'Įsigyti',
    ctaUrl: 'https://www.launchpass.com/skenuoklt/skenuok-lt',
    secondaryCtaLabel: 'Užduok klausimą',
    secondaryCtaUrl: 'https://www.instagram.com/skenuok.lt',
    position: 'center',
  },
  aventador: {
    id: 'aventador',
    name: 'Indikatorius',
    subtitle: 'Prekybos signalai',
    price: '29€/mėn',
    tagline: 'Profesionalūs prekybos signalai ir techninė analizė.',
    sections: [
      {
        heading: 'Apie narystę',
        intro: 'Tiems, kurie nori veikti, ne stebėti.',
        bulletList: [
          'Prekybos signalai per Telegram',
          'Techninės analizės grafikai',
          'Įėjimo / išėjimo taškų rekomendacijos',
          'Savaitės rinkos apžvalgos',
        ],
      },
    ],
    ctaLabel: 'Gauti signalus',
    ctaUrl: 'https://example.com/checkout/indikatorius',
    secondaryCtaLabel: 'Užduok klausimą',
    secondaryCtaUrl: 'https://www.instagram.com/crypto_letova',
    position: 'right',
  },
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
  const product = PRODUCTS[slug];
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}

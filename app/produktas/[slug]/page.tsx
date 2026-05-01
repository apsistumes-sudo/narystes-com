import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';

type ProductSection = {
  heading: string;
  intro?: string;
  numberedList?: string[];
  bulletList?: string[];
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
  sections: ProductSection[];
  youtubeVideos?: YoutubeVideo[];
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  position: 'left' | 'center' | 'right';
};

// Same 4 videos shown on every tier page
const SOCIAL_PROOF_VIDEOS: YoutubeVideo[] = [
  { url: 'https://www.youtube.com/watch?v=mHfSKWPMo_A&t=526s', videoId: 'mHfSKWPMo_A' },
  { url: 'https://www.youtube.com/watch?v=P9DpzPvLo4o&t=356s', videoId: 'P9DpzPvLo4o' },
  { url: 'https://www.youtube.com/watch?v=-toE8D34FDk&t=705s', videoId: '-toE8D34FDk' },
  { url: 'https://www.youtube.com/watch?v=nejYlXEB4xk&t=131s', videoId: 'nejYlXEB4xk' },
];

const PRODUCTS: Record<string, Product> = {
  divo: {
    id: 'divo',
    name: 'Crypto_Lietuva',
    subtitle: 'Bendruomenės narystė',
    price: '19€/mėn',
    tagline: 'Lietuvos didžiausia kripto bendruomenė.',
    heroHeadline: 'Didžiausia bendruomenė, virš 100 tūkstančių sekėjų per visas platformas sudėjus',
    susisiektiUrl: 'https://instagram.com/crypto_lietuva',
    sections: [
      {
        heading: 'Kodėl mumis pasitiki?',
        bulletList: [
          'Dirbame viešai 6 metus.',
          'Daugiau nei 1000 teigiamų atsiliepimų Instagramo highlights.',
          'Dalyvaujame kiekvienoje didelėje crypto konferencijoje — plečiame žinias.',
          'Komandą sudaro 8 žmonės.',
        ],
      },
    ],
    youtubeVideos: SOCIAL_PROOF_VIDEOS,
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
    susisiektiUrl: 'https://www.launchpass.com/skenuoklt/skenuok-lt',
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
    youtubeVideos: SOCIAL_PROOF_VIDEOS,
    ctaLabel: 'Įsigyti',
    ctaUrl: 'https://www.launchpass.com/skenuoklt/skenuok-lt',
    secondaryCtaLabel: 'Užduok klausimą',
    secondaryCtaUrl: 'https://www.instagram.com/skenuok.lt',
    position: 'center',
  },
  aventador: {
    id: 'aventador',
    name: 'Indikatorius',
    subtitle: 'Prekybos indikatorius',
    price: '29€/mėn',
    tagline: 'Profesionalus indikatorius pozicijų atpažinimui.',
    susisiektiUrl: 'https://instagram.com/indikatorius_com',
    sections: [
      {
        heading: 'Kas yra Indikatorius?',
        bulletList: [
          'Sukurtas pagal Crypto Lietuvos darbo logiką, kad atpažintų pozicijas.',
          'Labai lengva naudotis — be sudėtingų nustatymų.',
          'Pilnai veikia jau 3,5 metų.',
          'Su kiekviena nauja analize tobulėja.',
        ],
      },
    ],
    youtubeVideos: SOCIAL_PROOF_VIDEOS,
    ctaLabel: 'Įsigyti',
    ctaUrl: 'https://example.com/checkout/indikatorius',
    secondaryCtaLabel: 'Užduok klausimą',
    secondaryCtaUrl: 'https://www.instagram.com/crypto_letova',
    position: 'right',
  },
};

async function fetchYoutubeTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return 'YouTube video';
    const data = await res.json();
    return data.title || 'YouTube video';
  } catch {
    return 'YouTube video';
  }
}

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS[slug];
  if (!p) return {};
  return { title: `${p.name} — Narystes` };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS[slug];
  if (!product) notFound();

  let videosWithTitles = product.youtubeVideos;
  if (product.youtubeVideos && product.youtubeVideos.length > 0) {
    videosWithTitles = await Promise.all(
      product.youtubeVideos.map(async v => ({
        ...v,
        title: v.title || await fetchYoutubeTitle(v.videoId),
      }))
    );
  }

  return <ProductPageClient product={{ ...product, youtubeVideos: videosWithTitles }} />;
}

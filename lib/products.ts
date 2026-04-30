export interface Product {
  slug: string;
  name: string;
  alphaWebm: string;
  posterSrc: string;
  description: string;
  features: string[];
  ctaUrl: string;
  ctaLabel: string;
  position: "left" | "center" | "right";
}

export const products: Product[] = [
  {
    slug: "lambo",
    name: "Lamborghini Urus",
    alphaWebm: "/lambo_alpha.webm",
    posterSrc: "/posters/lambo.webp",
    description:
      "Aprašymas. Čia bus 2–4 paragrafai apie ką tai yra ir kodėl verta.",
    features: ["Savybė 1", "Savybė 2", "Savybė 3", "Savybė 4"],
    ctaUrl: "https://example.com",
    ctaLabel: "Įsigyti",
    position: "left",
  },
  {
    slug: "produktas-2",
    name: "Produktas 2",
    alphaWebm: "/produktas2_alpha.webm",
    posterSrc: "/posters/produktas-2.webp",
    description:
      "Aprašymas. Čia bus 2–4 paragrafai apie ką tai yra ir kodėl verta.",
    features: ["Savybė 1", "Savybė 2", "Savybė 3", "Savybė 4"],
    ctaUrl: "https://example.com",
    ctaLabel: "Įsigyti",
    position: "center",
  },
  {
    slug: "produktas-3",
    name: "Produktas 3",
    alphaWebm: "/produktas3_alpha.webm",
    posterSrc: "/posters/produktas-3.webp",
    description:
      "Aprašymas. Čia bus 2–4 paragrafai apie ką tai yra ir kodėl verta.",
    features: ["Savybė 1", "Savybė 2", "Savybė 3", "Savybė 4"],
    ctaUrl: "https://example.com",
    ctaLabel: "Įsigyti",
    position: "right",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

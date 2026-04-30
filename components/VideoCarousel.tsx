"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useCallback } from "react";
import type { Product } from "@/lib/products";

export default function VideoCarousel({ products }: { products: Product[] }) {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
  });

  return (
    <div className="relative w-full">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 px-6">
          {products.map((product) => (
            <div key={product.slug} className="flex-none w-[85vw] max-w-sm">
              <Link href={`/produktas/${product.slug}`} className="block group">
                <div
                  className="relative rounded-2xl overflow-hidden bg-white/5"
                  style={{ aspectRatio: "9/16" }}
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={product.posterSrc}
                    className="w-full h-full object-contain"
                  >
                    <source src={product.alphaWebm} type="video/webm" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p
                      className="text-xs font-medium tracking-widest uppercase mb-1"
                      style={{ color: "var(--accent)" }}
                    >
                      Peržiūrėti
                    </p>
                    <h2
                      className="text-xl font-semibold"
                      style={{
                        fontFamily: "var(--font-space)",
                        color: "var(--text)",
                      }}
                    >
                      {product.name}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";

export function KitsPartsCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section className="w-full bg-[#dedede] py-[60px] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-5">
        <div className="flex items-center justify-between gap-5 mb-2.5 flex-col text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-[32px] text-black m-0">{title}</h2>
            <p className="text-sm sm:text-base text-[#666] mt-0 mb-4 sm:mb-0 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollByAmount(-1)}
              className="h-10 w-10 rounded-full bg-white border border-[#e5e5e5] text-black flex items-center justify-center transition-colors hover:bg-[#f5f5f5] hover:border-[#d4d4d4]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollByAmount(1)}
              className="h-10 w-10 rounded-full bg-white border border-[#e5e5e5] text-black flex items-center justify-center transition-colors hover:bg-[#f5f5f5] hover:border-[#d4d4d4]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="kpc-track flex gap-5 overflow-x-auto scroll-smooth mb-8 pt-2.5"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => {
            const image = product.images[0];
            const prices = product.variants.map((v) => parseFloat(v.price));
            const minPrice = Math.min(...prices);
            const showsFrom = new Set(prices).size > 1;

            return (
              <Link
                key={product.handle}
                href={`/products/${product.handle}`}
                className="kpc-card flex-none flex flex-col"
              >
                <div className="bg-white rounded-xl p-5 text-center transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
                  <div className="relative w-full pb-[75%] overflow-hidden rounded-lg bg-white">
                    {image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="text-sm font-medium text-black mb-2 leading-snug line-clamp-2 min-h-[2.8em]">
                    {product.title}
                  </h3>
                  <p className="text-base font-bold text-black">
                    {showsFrom && <span className="font-normal text-sm">from </span>}
                    {formatMoney(minPrice)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center px-2.5">
          <Link
            href={viewAllHref}
            className="inline-block rounded-lg bg-black text-white px-6 py-3 text-sm font-medium transition-opacity hover:opacity-85"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .kpc-track::-webkit-scrollbar {
          display: none;
        }
        .kpc-card {
          flex-basis: calc((100% - 4 * 20px) / 5);
        }
        @media screen and (max-width: 989px) {
          .kpc-card {
            flex-basis: calc((100% - 2 * 20px) / 3);
          }
        }
        @media screen and (max-width: 749px) {
          .kpc-card {
            flex-basis: 85%;
          }
        }
      `}</style>
    </section>
  );
}

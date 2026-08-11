import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const prices = product.variants.map((v) => parseFloat(v.price));
  const minPrice = Math.min(...prices);
  const showsFrom = new Set(prices).size > 1;

  const cheapestVariant = product.variants.reduce((a, b) =>
    parseFloat(a.price) <= parseFloat(b.price) ? a : b
  );
  const compareAt = cheapestVariant.compareAtPrice
    ? parseFloat(cheapestVariant.compareAtPrice)
    : null;
  const savePercent =
    compareAt && compareAt > minPrice
      ? Math.round(((compareAt - minPrice) / compareAt) * 100)
      : null;

  return (
    <Link href={`/products/${product.handle}`} className="group flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-solid border border-border">
        {savePercent !== null && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-red-600 text-white text-xs font-semibold px-3 py-1">
            Save {savePercent}%
          </span>
        )}
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium leading-tight">{product.title}</h3>
        <p className="text-sm text-muted">
          {compareAt && savePercent !== null ? (
            <>
              <span className="line-through mr-2">{formatMoney(compareAt)}</span>
              <span className="text-foreground">{formatMoney(minPrice)}</span>
            </>
          ) : (
            <>
              {showsFrom ? "From " : ""}
              {formatMoney(minPrice)}
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

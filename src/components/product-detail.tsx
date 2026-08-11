"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/lib/cart-context";

function variantMatches(variant: ProductVariant, selected: string[]) {
  const opts = [variant.option1, variant.option2, variant.option3];
  return selected.every((val, i) => !val || opts[i] === val);
}

export function ProductDetail({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [selected, setSelected] = useState<string[]>(() =>
    product.options.map((o) => o.values[0] ?? "")
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () =>
      product.variants.find((v) => variantMatches(v, selected)) ??
      product.variants[0],
    [product.variants, selected]
  );

  const images = product.images.length > 0 ? product.images : [];

  function handleAddToCart() {
    if (!variant) return;
    addLine(
      {
        variantId: variant.id,
        productHandle: product.handle,
        productTitle: product.title,
        variantTitle: variant.title,
        price: variant.price,
        image: images[activeImage]?.src ?? images[0]?.src ?? null,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="page-width py-14 grid gap-10 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-surface-solid border border-border">
          {images[activeImage] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[activeImage].src}
              alt={images[activeImage].alt}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 shrink-0 rounded border overflow-hidden ${
                  i === activeImage ? "border-foreground" : "border-border"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 max-w-md">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{product.title}</h1>
          <p className="mt-2 text-xl font-medium">
            {variant ? formatMoney(variant.price) : ""}
          </p>
        </div>

        {product.options.map((option, i) => (
          <div key={option.name} className="flex flex-col gap-2">
            <span className="text-sm font-medium">{option.name}</span>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => {
                      const next = [...prev];
                      next[i] = value;
                      return next;
                    })
                  }
                  className={`rounded border px-3 py-2 text-sm transition-colors ${
                    selected[i] === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground/90 hover:border-foreground/60"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded">
            <button
              type="button"
              className="px-3 py-2 text-sm"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3 text-sm">{quantity}</span>
            <button
              type="button"
              className="px-3 py-2 text-sm"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 rounded bg-foreground text-background py-3 text-sm font-semibold uppercase tracking-wide transition-opacity hover:opacity-90"
          >
            {justAdded ? "Added ✓" : "Add to Cart"}
          </button>
        </div>

        {product.descriptionHtml && (
          <div
            className="text-sm leading-relaxed text-foreground/90 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}

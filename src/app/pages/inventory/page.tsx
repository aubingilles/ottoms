import type { Metadata } from "next";
import { getProduct } from "@/lib/data";
import { HeroSpecBanner } from "@/components/hero-spec-banner";
import { BuildSlotCard } from "@/components/build-slot-card";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = { title: "Karts | Tottoms" };

const PRO_KART_HANDLES = [
  "signature-ruby-belt-drive-pro-kart",
  "ghost-v2-belt-drive-pro-kart",
  "tottoms-redline-pro-kart",
  "tottoms-signature-48v-pro-kart",
  "tottoms-yellow-pro-kart",
  "tottoms-joker-v2-pro-kart",
  "tottoms-ghost-pro-kart",
];

export default function InventoryPage() {
  const demoUnit = getProduct("100v-xl-gt-one-kart");
  const buildSlot1 = getProduct("xl-gt-one-build-slot-1");
  const buildSlot2 = getProduct("xl-gt-one-build-slot-2");
  const proKartProducts = PRO_KART_HANDLES.map(getProduct).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  return (
    <>
      <HeroSpecBanner
        bgImage="https://tottoms.com/cdn/shop/files/XL-Kart_0009_DSC02333.png?v=1781809872&width=2400"
        topOfPage
        title={{
          type: "image",
          src: "https://tottoms.com/cdn/shop/files/GT_one.png?v=1782168235&width=1200",
          alt: "XL GT-ONE",
          width: 3365,
          height: 703,
        }}
        subtitle="Our Biggest & Most Powerful Kart Ever."
      />

      <section className="page-width py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {demoUnit && (
            <div className="flex flex-col">
              <ProductCard product={demoUnit} />
            </div>
          )}
          {buildSlot1 && (
            <BuildSlotCard
              product={buildSlot1}
              slotNumber="01"
              buildWindow="Jul-Aug 2026"
              bgImage="https://tottoms.com/cdn/shop/files/Build_Slot_v3.jpg?v=1782330297&width=1200"
            />
          )}
          {buildSlot2 && (
            <BuildSlotCard
              product={buildSlot2}
              slotNumber="02"
              buildWindow="Aug-Sep 2026"
              bgImage="https://tottoms.com/cdn/shop/files/Build_Slot_v3.jpg?v=1782330297&width=1200"
            />
          )}
        </div>
      </section>

      <HeroSpecBanner
        bgImage="https://tottoms.com/cdn/shop/files/Tan_Build.jpg?v=1767559162&width=2400"
        title={{
          type: "image",
          src: "https://tottoms.com/cdn/shop/files/PRO_Kart_Logo.png?v=1781979240&width=1200",
          alt: "PRO Kart",
          width: 8481,
          height: 1056,
        }}
        subtitle="Big Power. Compact Package."
      />

      <section className="page-width py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {proKartProducts.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      <HeroSpecBanner
        bgImage="https://tottoms.com/cdn/shop/files/street_kart_v5_1e1e1e.jpg?v=1767683967&width=2400"
        title={{
          type: "image",
          src: "https://tottoms.com/cdn/shop/files/street_kart_logo.png?v=1781979240&width=1200",
          alt: "STREET KART",
          width: 8581,
          height: 1286,
        }}
        subtitle="V2 Coming Soon"
      />

      <section className="page-width py-16 text-center">
        <p className="text-sm text-muted">Updated street karts to be released soon!</p>
      </section>
    </>
  );
}

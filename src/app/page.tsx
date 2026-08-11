import Link from "next/link";
import { getCollectionProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { HeroSpecBanner } from "@/components/hero-spec-banner";

export default function HomePage() {
  const kitsProducts = getCollectionProducts("kits");

  return (
    <>
      <HeroSpecBanner
        bgImage="https://tottoms.com/cdn/shop/files/Main_Hero_Image.jpg?v=1781801643&width=2000"
        height="100vh"
        topOfPage
        title={{ type: "text", value: "Size Matters." }}
        subtitle="Power Does Too."
        badgeImage={{
          src: "https://tottoms.com/cdn/shop/files/GT_one.png?v=1782168235&width=600",
          alt: "GT ONE",
        }}
        specs={[
          { value: "100V", label: "Voltage" },
          { value: "12KW+", label: "Power Output" },
        ]}
        buttons={[
          { label: "Shop Karts", href: "/pages/inventory", variant: "solid" },
          { label: "Shop Kits", href: "/collections/kits", variant: "outline" },
        ]}
      />

      {/* USA badge bar */}
      <section className="bg-[#262626] py-6">
        <div className="page-width flex items-center justify-center gap-3 text-white text-sm md:text-base font-semibold">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12l2.5 2.5L16 9" />
          </svg>
          Engineered &amp; Assembled in the USA
        </div>
      </section>

      {/* Featured products */}
      <section className="page-width py-16 md:py-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">Kits &amp; Parts</h2>
          <Link href="/collections/kits" className="text-sm text-muted hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {kitsProducts.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-surface-solid py-16 md:py-20">
        <div className="page-width max-w-2xl text-center flex flex-col items-center gap-4">
          <blockquote className="text-xl md:text-2xl leading-snug font-medium">
            &ldquo;In the 5 years I&rsquo;ve been riding, there isn&rsquo;t anything that
            compares to the Tottoms brushless kits. They are DIALED.&rdquo;
          </blockquote>
          <cite className="not-italic text-sm text-muted">
            — @SyncPreston (PRO Team Rider)
          </cite>
        </div>
      </section>
    </>
  );
}

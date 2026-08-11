import { getProduct } from "@/lib/data";
import { HeroSpecBanner } from "@/components/hero-spec-banner";
import { KitsPartsCarousel } from "@/components/kits-parts-carousel";
import { ExpandableHeroVideo } from "@/components/expandable-hero-video";

const KITS_PARTS_HANDLES = [
  "xl-100v-gt-one-upgrade-kit-crazy-cart-xl-upgrade",
  "tottoms-belt-drive-pro-kit",
  "budgetbrushlesskit",
  "adjustable-cushioned-seat-upgrade",
  "tottoms-7070-motor-mount-for-oem-stock-fork",
  "tottoms-sealed-headset",
  "72t-belt-drive-rim-200x50",
  "120mm-brake-disc-replacement",
  "zoom-hydraulic-crazy-cart-brake",
  "pro-fork-single-pin-adjustment-motor-mount",
  "tottoms-brake-mount-for-pro-fork",
  "520mm-reinforced-belt-replacement",
  "brushless-kit-phase-wires",
  "hall-sensor-cable-replacement",
  "vesc-throttle-cable-adapter-for-flipsky-controllers",
  "vesc-75v100-crazy-cart-mounting-plate",
  "cst-200x50-tire-3x-bundle",
  "stock-24v-battery-standard-size",
  "stock-250w-crazy-cart-motor-standard-size",
];

export default function HomePage() {
  const kitsPartsProducts = KITS_PARTS_HANDLES.map(getProduct).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

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

      <KitsPartsCarousel
        title="KITS & PARTS"
        subtitle="We've Got the Parts to Keep You Sideways."
        products={kitsPartsProducts}
        viewAllHref="/collections"
        viewAllLabel="View Parts"
      />

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

      <ExpandableHeroVideo videoSrc="https://cdn.shopify.com/videos/c/o/v/5ad49ba5da774be2b90dc873d87b6fc1.mp4" />
    </>
  );
}

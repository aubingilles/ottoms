import Link from "next/link";

type Spec = { value: string; label: string };
type CtaButton = { label: string; href: string; variant: "solid" | "outline" };

type HeroSpecBannerProps = {
  bgImage: string;
  height?: string;
  title:
    | { type: "text"; value: string }
    | { type: "image"; src: string; alt: string; width: number; height: number };
  subtitle: string;
  badgeImage?: { src: string; alt: string };
  specs?: Spec[];
  buttons?: CtaButton[];
  /** Set when this is the first section on the page, so it bleeds up under the fixed transparent header instead of sitting below it. */
  topOfPage?: boolean;
};

export function HeroSpecBanner({
  bgImage,
  height = "350px",
  title,
  subtitle,
  badgeImage,
  specs,
  buttons,
  topOfPage = false,
}: HeroSpecBannerProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${topOfPage ? "-mt-20" : ""}`}
      style={{ height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.67) 0%, rgba(0,0,0,0) 45%), linear-gradient(to bottom, rgba(0,0,0,0.47) 0%, rgba(0,0,0,0) 30%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-center page-width">
        <div className="max-w-3xl">
          {title.type === "text" ? (
            <h1
              className="text-white uppercase font-bold leading-[0.92] text-[40px] md:text-[64px] lg:text-[80px]"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              {title.value}
            </h1>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={title.src}
              alt={title.alt}
              className="h-10 md:h-14 w-auto object-contain"
              style={{
                filter: "drop-shadow(0 2px 24px rgba(0,0,0,0.35))",
              }}
            />
          )}
          <p className="mt-2 text-white uppercase font-semibold tracking-widest text-base md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>

      {(badgeImage || specs || buttons) && (
        <div className="absolute z-10 left-5 md:left-16 bottom-8 flex flex-col gap-4 max-w-xl">
          {badgeImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={badgeImage.src}
              alt={badgeImage.alt}
              className="h-8 w-auto object-contain"
            />
          )}
          {specs && (
            <>
              <div className="h-px w-full bg-white/60" />
              <div className="flex items-stretch gap-6">
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex flex-col gap-1 ${i > 0 ? "pl-6 border-l border-white" : ""}`}
                  >
                    <span className="text-2xl md:text-[33px] font-extrabold text-white leading-none">
                      {spec.value}
                    </span>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-white/70">
                      {spec.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          {buttons && (
            <div className="flex flex-wrap items-center gap-3.5 mt-1">
              {buttons.map((btn) => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className={`inline-flex items-center justify-center rounded px-7 py-4 text-sm font-bold uppercase tracking-wide border-2 border-white ${
                    btn.variant === "solid" ? "bg-white text-black" : "bg-transparent text-white"
                  }`}
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

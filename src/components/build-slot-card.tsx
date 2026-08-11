import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";

export function BuildSlotCard({
  product,
  slotNumber,
  buildWindow,
  bgImage,
}: {
  product: Product;
  slotNumber: string;
  buildWindow: string;
  bgImage: string;
}) {
  const price = product.variants[0]?.price ?? "0";

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="relative z-10 flex flex-col gap-4 p-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-red-500">
          Pre-Sale
        </span>
        <h3 className="text-2xl font-bold uppercase">
          Build Slot <span className="text-red-500">{slotNumber}</span>
        </h3>
        <p className="text-xs uppercase tracking-wide text-muted -mt-2">Custom XL GT-ONE</p>

        <ul className="flex flex-col gap-2 text-sm text-foreground/90">
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4.5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 2.5v4M16 2.5v4" />
            </svg>
            Est. Build Window: {buildWindow}
          </li>
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 6l4 4M20.5 3.5a2.1 2.1 0 0 0-3 0l-2 2 3 3 2-2a2.1 2.1 0 0 0 0-3z" />
              <path d="M15.5 8.5L7 17v3h3l8.5-8.5" />
            </svg>
            Custom Color Options
          </li>
        </ul>

        <div className="h-px w-full bg-border mt-2" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-semibold">{formatMoney(price)}</span>
          <Link
            href={`/products/${product.handle}`}
            className="rounded border border-red-500 text-red-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-red-500 hover:text-white transition-colors"
          >
            Reserve Build Slot
          </Link>
        </div>
      </div>
    </div>
  );
}

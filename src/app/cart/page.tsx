"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="page-width py-20 text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link
          href="/collections/kits"
          className="rounded bg-foreground text-background px-6 py-3 text-sm font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-width py-14 grid gap-10 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <div className="flex flex-col divide-y divide-border">
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-4 py-5">
              {line.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.image}
                  alt={line.productTitle}
                  className="h-24 w-24 rounded object-cover border border-border"
                />
              )}
              <div className="flex-1 flex flex-col gap-1">
                <p className="font-medium">{line.productTitle}</p>
                {line.variantTitle && line.variantTitle !== "Default Title" && (
                  <p className="text-sm text-muted">{line.variantTitle}</p>
                )}
                <p className="text-sm text-muted">{formatMoney(line.price)} each</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-muted underline"
                    onClick={() => removeLine(line.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-medium">
                {formatMoney(parseFloat(line.price) * line.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border p-6 h-fit">
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">{formatMoney(subtotal)}</span>
        </div>
        <p className="text-xs text-muted">
          Shipping and taxes calculated after we review your order.
        </p>
        <Link
          href="/checkout"
          className="w-full text-center rounded bg-foreground text-background py-3 text-sm font-semibold"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

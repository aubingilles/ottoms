"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/money";

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = lines.length === 0;

  async function handleCheckout() {
    if (isEmpty) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong starting checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong starting checkout."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="page-width py-14 grid gap-10 md:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        {isEmpty ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">
              Your cart is empty — add something before checking out.
            </p>
            <Link
              href="/collections/kits"
              className="rounded bg-foreground text-background py-3.5 text-sm font-semibold uppercase tracking-wide text-center"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted">
              You&rsquo;ll enter your contact details, shipping address and payment on
              Stripe&rsquo;s secure checkout page.
            </p>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={submitting}
              className="rounded bg-foreground text-background py-3.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
            >
              {submitting ? "Redirecting…" : `Pay ${formatMoney(subtotal)}`}
            </button>
            <p className="text-xs text-muted">
              Payments are processed securely by Stripe. We never see or store your
              card details.
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border p-6 h-fit">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Order Summary
        </h2>
        {isEmpty && <p className="text-sm text-muted">No items yet.</p>}
        <div className="flex flex-col gap-3 divide-y divide-border">
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-3 pt-3 first:pt-0">
              {line.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.image}
                  alt={line.productTitle}
                  className="h-14 w-14 rounded object-cover border border-border"
                />
              )}
              <div className="flex-1 text-sm">
                <p className="font-medium leading-tight">{line.productTitle}</p>
                <p className="text-muted">Qty {line.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {formatMoney(parseFloat(line.price) * line.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm border-t border-border pt-3">
          <span>Subtotal</span>
          <span className="font-semibold">{formatMoney(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

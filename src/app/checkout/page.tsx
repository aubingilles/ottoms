"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/money";

function encodeForm(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const orderSummary = lines
    .map(
      (l) =>
        `${l.quantity}x ${l.productTitle}${
          l.variantTitle && l.variantTitle !== "Default Title" ? ` (${l.variantTitle})` : ""
        } — ${formatMoney(parseFloat(l.price) * l.quantity)}`
    )
    .join("\n");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEmpty) return;
    setSubmitting(true);
    setError(null);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm({
          "form-name": "order",
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: [form.address1, form.address2, form.city, form.state, form.zip, form.country]
            .filter(Boolean)
            .join(", "),
          order_summary: orderSummary,
          order_total: formatMoney(subtotal),
        }),
      });
      clearCart();
      router.push("/thank-you");
    } catch {
      setError("Something went wrong submitting your order. Please try again.");
      setSubmitting(false);
    }
  }

  const isEmpty = lines.length === 0;

  return (
    <div className="page-width py-14 grid gap-10 md:grid-cols-[2fr_1fr]">
      <form
        name="order"
        data-netlify="true"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <input type="hidden" name="form-name" value="order" />
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Contact
          </h2>
          <input
            required
            type="text"
            name="name"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
            />
            <input
              required
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Shipping Address
          </h2>
          <input
            required
            type="text"
            placeholder="Address"
            value={form.address1}
            onChange={(e) => update("address1", e.target.value)}
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={form.address2}
            onChange={(e) => update("address2", e.target.value)}
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              required
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
            />
            <input
              required
              type="text"
              placeholder="State"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
            />
            <input
              required
              type="text"
              placeholder="ZIP"
              value={form.zip}
              onChange={(e) => update("zip", e.target.value)}
              className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
            />
          </div>
          <input
            required
            type="text"
            placeholder="Country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
        </div>

        {/* Hidden fields so Netlify's form schema includes the order details */}
        <input type="hidden" name="address" value="" readOnly />
        <textarea name="order_summary" value={orderSummary} readOnly hidden />
        <input type="hidden" name="order_total" value={formatMoney(subtotal)} readOnly />

        {error && <p className="text-sm text-red-400">{error}</p>}

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
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-foreground text-background py-3.5 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Place Order"}
          </button>
        )}
        <p className="text-xs text-muted">
          This sends your order request to our team — we don&rsquo;t charge your card
          on this page. We&rsquo;ll follow up by email to confirm payment and shipping.
        </p>
      </form>

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

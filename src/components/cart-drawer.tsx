"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/money";

export function CartDrawer() {
  const { lines, isDrawerOpen, closeDrawer, updateQuantity, removeLine, subtotal } =
    useCart();

  return (
    <div
      className={`fixed inset-0 z-50 ${isDrawerOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isDrawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-surface-solid border-l border-border flex flex-col transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Your Cart ({lines.reduce((n, l) => n + l.quantity, 0)})
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {lines.length === 0 && (
            <p className="text-sm text-muted">Your cart is empty.</p>
          )}
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-3">
              {line.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.image}
                  alt={line.productTitle}
                  width={72}
                  height={72}
                  className="h-18 w-18 rounded object-cover border border-border"
                />
              )}
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-sm font-medium leading-tight">{line.productTitle}</p>
                {line.variantTitle && line.variantTitle !== "Default Title" && (
                  <p className="text-xs text-muted">{line.variantTitle}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center border border-border rounded">
                    <button
                      type="button"
                      className="px-2 py-0.5 text-sm"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      className="px-2 py-0.5 text-sm"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-muted underline"
                    onClick={() => removeLine(line.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium">
                {formatMoney(parseFloat(line.price) * line.quantity)}
              </p>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div className="px-5 py-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatMoney(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="w-full text-center rounded bg-foreground text-background py-3 text-sm font-semibold"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

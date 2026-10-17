"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

// Stripe redirects back to /order-confirmed?session_id=... after a
// successful payment; empty the cart then.
export function ClearCartOnPayment() {
  const { clearCart } = useCart();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("session_id")) {
      clearCart();
    }
  }, [clearCart]);

  return null;
}

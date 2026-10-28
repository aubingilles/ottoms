import Stripe from "stripe";
import productsJson from "../../src/data/products.json";
import type { Product, ProductVariant } from "../../src/lib/types";
import { SHIPPING_COUNTRIES } from "../lib/shipping-countries";

const products = productsJson as Record<string, Product>;

// Look up variants by id so prices always come from our catalog, never from
// the browser.
const variantsById = new Map<number, { product: Product; variant: ProductVariant }>();
for (const product of Object.values(products)) {
  for (const variant of product.variants) {
    variantsById.set(variant.id, { product, variant });
  }
}

const MAX_QUANTITY = 99;

type RequestLine = { variantId: number; quantity: number };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return json({ error: "Payments are not configured" }, 500);
  }

  let lines: RequestLine[];
  try {
    ({ lines } = await req.json());
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return json({ error: "Your cart is empty" }, 400);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const line of lines) {
    const match = variantsById.get(Number(line?.variantId));
    const quantity = Number(line?.quantity);
    if (!match || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return json({ error: "Your cart contains an invalid item" }, 400);
    }
    const { product, variant } = match;
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(parseFloat(variant.price) * 100),
        product_data: {
          name:
            variant.title && variant.title !== "Default Title"
              ? `${product.title} (${variant.title})`
              : product.title,
          images: product.images.slice(0, 1).map((image) => image.src),
          metadata: { variantId: String(variant.id), sku: variant.sku ?? "" },
        },
      },
    });
  }

  const origin = new URL(req.url).origin;
  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      success_url: `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });
    return json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return json({ error: "Could not start checkout. Please try again." }, 502);
  }
}

export default handler;

export const config = { path: "/api/checkout" };

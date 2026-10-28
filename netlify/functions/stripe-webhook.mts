import Stripe from "stripe";

// Stripe calls this after a checkout is paid. We email the order to the shop
// owner and an order confirmation to the customer, both sent through Resend.

const SITE_NAME = "Tottoms";

type OrderDetails = {
  orderRef: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  addressLines: string[];
  items: { description: string; quantity: number; amount: number }[];
  total: number;
  currency: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

async function loadOrder(stripe: Stripe, session: Stripe.Checkout.Session): Promise<OrderDetails> {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  const currency = session.currency ?? "usd";

  return {
    // The last 8 characters of the session id, so the owner and customer can
    // refer to the same order.
    orderRef: session.id.slice(-8).toUpperCase(),
    customerName: shipping?.name ?? session.customer_details?.name ?? "Customer",
    customerEmail: session.customer_details?.email ?? null,
    customerPhone: session.customer_details?.phone ?? null,
    addressLines: address
      ? [
          address.line1,
          address.line2,
          [address.city, address.state, address.postal_code].filter(Boolean).join(", "),
          address.country,
        ].filter((line): line is string => Boolean(line))
      : [],
    items: lineItems.data.map((item) => ({
      description: item.description ?? "Item",
      quantity: item.quantity ?? 1,
      amount: item.amount_total,
    })),
    total: session.amount_total ?? 0,
    currency,
  };
}

function itemsTable(order: OrderDetails) {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 12px 4px 0">${item.quantity} × ${escapeHtml(item.description)}</td>` +
        `<td style="padding:4px 0;text-align:right">${formatAmount(item.amount, order.currency)}</td></tr>`
    )
    .join("");
  return (
    `<table style="border-collapse:collapse;font-size:14px">${rows}` +
    `<tr><td style="padding:8px 12px 0 0;font-weight:bold">Total</td>` +
    `<td style="padding:8px 0 0;text-align:right;font-weight:bold">${formatAmount(order.total, order.currency)}</td></tr>` +
    `</table>`
  );
}

function addressBlock(order: OrderDetails) {
  return [order.customerName, ...order.addressLines].map(escapeHtml).join("<br>");
}

function ownerEmailHtml(order: OrderDetails) {
  return `<div style="font-family:Arial,sans-serif;color:#111">
  <h2>New order #${order.orderRef}</h2>
  ${itemsTable(order)}
  <h3>Ship to</h3>
  <p>${addressBlock(order)}</p>
  <h3>Customer</h3>
  <p>${escapeHtml(order.customerName)}<br>
  ${escapeHtml(order.customerEmail ?? "No email")}<br>
  ${escapeHtml(order.customerPhone ?? "No phone")}</p>
  <p style="color:#666;font-size:12px">Full payment details are in your Stripe dashboard.</p>
</div>`;
}

function customerEmailHtml(order: OrderDetails) {
  return `<div style="font-family:Arial,sans-serif;color:#111">
  <h2>Thanks for your order, ${escapeHtml(order.customerName)}!</h2>
  <p>We've received your payment and are getting your order #${order.orderRef} ready.
  We'll email you again with shipping details once it's on its way.</p>
  ${itemsTable(order)}
  <h3>Shipping to</h3>
  <p>${addressBlock(order)}</p>
  <p>Questions? Just reply to this email.</p>
  <p>— The ${SITE_NAME} team</p>
</div>`;
}

async function sendEmail(
  apiKey: string,
  idempotencyKey: string,
  email: { from: string; to: string; subject: string; html: string; replyTo?: string }
) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Stripe retries webhooks; this stops a retry from sending twice.
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      reply_to: email.replyTo,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}

async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  const fromEmail = process.env.ORDER_EMAIL_FROM;
  if (!secretKey || !webhookSecret || !resendKey || !ownerEmail || !fromEmail) {
    console.error("Order emails are not configured: missing environment variables");
    return new Response("Not configured", { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      req.headers.get("stripe-signature") ?? "",
      webhookSecret
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // checkout.session.completed fires before payment clears for delayed
  // methods (bank debits); those send async_payment_succeeded once paid.
  const isPaid =
    (event.type === "checkout.session.completed" &&
      event.data.object.payment_status === "paid") ||
    event.type === "checkout.session.async_payment_succeeded";
  if (!isPaid) return new Response("Ignored", { status: 200 });

  const session = event.data.object as Stripe.Checkout.Session;
  try {
    const order = await loadOrder(stripe, session);

    await sendEmail(resendKey, `${session.id}-owner`, {
      from: fromEmail,
      to: ownerEmail,
      subject: `New order #${order.orderRef} — ${formatAmount(order.total, order.currency)}`,
      html: ownerEmailHtml(order),
      replyTo: order.customerEmail ?? undefined,
    });

    if (order.customerEmail) {
      await sendEmail(resendKey, `${session.id}-customer`, {
        from: fromEmail,
        to: order.customerEmail,
        subject: `Your ${SITE_NAME} order #${order.orderRef}`,
        html: customerEmailHtml(order),
        replyTo: ownerEmail,
      });
    }
  } catch (error) {
    // A non-2xx response makes Stripe retry the webhook later.
    console.error("Failed to send order emails:", error);
    return new Response("Failed to send emails", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

export default handler;

export const config = { path: "/api/stripe-webhook" };

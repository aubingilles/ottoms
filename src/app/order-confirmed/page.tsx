import Link from "next/link";
import { ClearCartOnPayment } from "@/components/clear-cart-on-payment";

export default function OrderConfirmedPage() {
  return (
    <div className="page-width py-24 text-center flex flex-col items-center gap-4">
      <ClearCartOnPayment />
      <h1 className="text-3xl font-semibold">Thank you for your order</h1>
      <p className="text-sm text-muted max-w-md">
        Your payment went through. We&rsquo;ll send a confirmation to your email and
        follow up with shipping details soon.
      </p>
      <Link
        href="/"
        className="mt-4 rounded bg-foreground text-background px-6 py-3 text-sm font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="page-width py-24 text-center flex flex-col items-center gap-4">
      <h1 className="text-3xl font-semibold">Thank you for your order</h1>
      <p className="text-sm text-muted max-w-md">
        We&rsquo;ve received your order request and will reach out by email shortly
        to confirm details and payment.
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

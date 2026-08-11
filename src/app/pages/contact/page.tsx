import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact | Tottoms" };

export default function ContactPage() {
  return (
    <div className="page-width py-16 md:py-20 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold">Contact Us</h1>
      <p className="mt-3 text-muted max-w-md">
        We&rsquo;d love to hear from you. Our team is here to help.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <form
          name="contact"
          data-netlify="true"
          method="POST"
          action="/thank-you"
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            className="rounded border border-border bg-transparent px-3 py-2.5 text-sm placeholder:text-muted"
          />
          <button
            type="submit"
            className="self-start rounded bg-foreground text-background px-6 py-3 text-sm font-semibold"
          >
            Send message
          </button>
        </form>

        <ul className="flex flex-col gap-6">
          <li className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-muted">Email</p>
            <a href="mailto:support@tottoms.com" className="text-sm hover:underline">
              support@tottoms.com
            </a>
          </li>
          <li className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-muted">Phone</p>
            <a href="tel:+17274944652" className="text-sm hover:underline">
              +1 727-494-4652
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

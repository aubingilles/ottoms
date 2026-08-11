import Link from "next/link";
import { FOOTER_POLICY_LINKS, NAV_LINKS, SOCIAL_LINKS } from "@/lib/data";
import { PaymentIcons } from "@/components/payment-icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="page-width py-14 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tottoms-logo.png" alt="Tottoms" className="h-6 w-auto" />
          <p className="text-sm text-muted max-w-xs">
            Electric drift kart upgrade kits and performance parts, designed and
            assembled in the USA.
          </p>
          <ul className="flex items-center gap-4 mt-2">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Shop</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Policies</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {FOOTER_POLICY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            Stay Up To Date
          </h3>
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            action="/thank-you"
            className="flex gap-2"
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              className="min-w-0 flex-1 rounded border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted"
            />
            <button
              type="submit"
              className="rounded bg-foreground text-background px-4 py-2 text-sm font-semibold shrink-0"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="page-width py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} Tottoms. All rights reserved.</span>
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
}

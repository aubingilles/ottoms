const ICONS: { label: string; content: React.ReactNode }[] = [
  {
    label: "Visa",
    content: (
      <>
        <rect width="38" height="24" rx="4" fill="#1A1F71" />
        <text x="19" y="16.5" textAnchor="middle" fontSize="10" fontWeight="700" fontStyle="italic" fill="#fff">
          VISA
        </text>
      </>
    ),
  },
  {
    label: "Mastercard",
    content: (
      <>
        <rect width="38" height="24" rx="4" fill="#16171B" />
        <circle cx="16" cy="12" r="6.5" fill="#EB001B" />
        <circle cx="24" cy="12" r="6.5" fill="#F79E1B" fillOpacity="0.9" />
      </>
    ),
  },
  {
    label: "American Express",
    content: (
      <>
        <rect width="38" height="24" rx="4" fill="#2E77BC" />
        <text x="19" y="15" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">
          AMEX
        </text>
      </>
    ),
  },
  {
    label: "PayPal",
    content: (
      <>
        <rect width="38" height="24" rx="4" fill="#111827" />
        <text x="19" y="15.5" textAnchor="middle" fontSize="8" fontWeight="700" fontStyle="italic" fill="#00A1E5">
          Pay
          <tspan fill="#7BC5F9">Pal</tspan>
        </text>
      </>
    ),
  },
  {
    label: "Apple Pay",
    content: (
      <>
        <rect width="38" height="24" rx="4" fill="#000" />
        <text x="19" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#fff">
          Pay
        </text>
      </>
    ),
  },
  {
    label: "Google Pay",
    content: (
      <>
        <rect width="38" height="24" rx="4" fill="#fff" />
        <text x="19" y="15.5" textAnchor="middle" fontSize="7" fontWeight="600" fill="#5F6368">
          G Pay
        </text>
      </>
    ),
  },
];

export function PaymentIcons() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
      {ICONS.map((icon) => (
        <li key={icon.label} title={icon.label}>
          <svg
            width="38"
            height="24"
            viewBox="0 0 38 24"
            role="img"
            aria-label={icon.label}
            className="rounded border border-border/60"
          >
            {icon.content}
          </svg>
        </li>
      ))}
    </ul>
  );
}

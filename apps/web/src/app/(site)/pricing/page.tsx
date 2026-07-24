import type { Metadata } from "next";

import { PricingCard } from "@/components/www/pricing-card";

export const metadata: Metadata = {
  title: "Pricing — Cykani",
  description: "Simple, transparent pricing for stealth browser automation.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For prototyping and personal projects.",
    features: ["3 concurrent sessions", "100 fingerprint signals", "Community support", "Shared infrastructure"],
    cta: "View on GitHub",
    href: "https://github.com/cykani/cykani-cy",
  },
  {
    name: "Pro",
    price: "$19",
    period: "mo",
    description: "For teams shipping production automation.",
    features: [
      "25 concurrent sessions",
      "100+ fingerprint signals",
      "GeoIP rotation",
      "HAR export",
      "Priority support",
      "Dedicated infrastructure",
    ],
    cta: "Buy Now",
    href: "https://cykani.lemonsqueezy.com/checkout/buy/pro-monthly",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "mo",
    description: "For orgs with compliance and scale requirements.",
    features: [
      "Unlimited sessions",
      "Custom fingerprint configs",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated support",
      "On-prem deployment",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@cykani.com",
  },
];

export default function PricingPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="font-bold text-4xl text-foreground tracking-tight">Pricing</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Start free, scale when ready. No surprises.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <PricingCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

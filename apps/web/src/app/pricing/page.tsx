import Image from "next/image";
import Link from "next/link";

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
    cta: "Start Free",
    href: "/default/dashboard/default",
  },
  {
    name: "Pro",
    price: "$49",
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
    cta: "Get Started",
    href: "/default/dashboard/default",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
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
    href: "#",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo_black.png" alt="Cykani" width={24} height={24} className="h-6 w-auto" />
          <span className="text-foreground">Cykani</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6 text-sm">
          <a href="/docs" className="text-muted-foreground transition-colors hover:text-foreground">
            Docs
          </a>
          <a href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </a>
          <Link
            href="/default/dashboard/default"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-16">
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
      </main>
    </div>
  );
}

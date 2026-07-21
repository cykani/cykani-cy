import Link from "next/link";

import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

export function PricingCard({ name, price, period, description, features, cta, href, highlighted }: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-6 transition-colors",
        highlighted ? "border-foreground/20 bg-foreground/[0.03]" : "border-border/40 bg-card hover:border-border/80",
      )}
    >
      <h3 className="font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-bold text-3xl text-foreground">{price}</span>
        {period && <span className="text-sm text-muted-foreground">/{period}</span>}
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={cn(
          "mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition-colors",
          highlighted
            ? "bg-foreground text-background hover:opacity-90"
            : "border border-border/60 bg-background text-foreground hover:bg-accent",
        )}
      >
        {cta}
      </Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

import { APP_CONFIG } from "@/config/app-config";

const links = [
  {
    title: "Product",
    items: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/docs" },
      { name: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    items: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <Image src="/logo_black.png" alt="Cykani" width={24} height={24} className="h-6 w-auto" />
              {APP_CONFIG.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Stealth browser automation with anti-fingerprint capabilities.
            </p>
          </div>
          {links.map((group) => (
            <div key={group.title}>
              <h3 className="font-medium text-sm text-foreground">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground">{APP_CONFIG.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

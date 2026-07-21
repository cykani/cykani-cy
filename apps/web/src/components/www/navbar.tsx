"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { IconMenu2, IconX } from "@tabler/icons-react";

import { MobileNav, MobileNavHeader, MobileNavMenu, NavBody, Navbar, NavItems } from "@/components/ui/resizable-navbar";
import { APP_CONFIG } from "@/config/app-config";

const navLinks = [
  { name: "Features", link: "/#features" },
  { name: "Blog", link: "/blog" },
  { name: "Pricing", link: "/pricing" },
  { name: "Docs", link: "/docs" },
];

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative z-50 w-full">
      <Navbar>
        <NavBody className="mx-auto max-w-6xl border border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/logo_black.png" alt="Cykani" width={24} height={24} className="h-6 w-auto" />
            <span className="text-foreground">{APP_CONFIG.name}</span>
          </Link>
          <NavItems items={navLinks} />
          <div className="flex items-center gap-3">
            <Link
              href="/default/dashboard/default"
              className="rounded-lg border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Dashboard
            </Link>
            <Link
              href="/default/dashboard/default"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Image src="/logo_black.png" alt="Cykani" width={24} height={24} className="h-6 w-auto" />
              {APP_CONFIG.name}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <IconX /> : <IconMenu2 />}</button>
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-foreground hover:text-muted-foreground"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/default/dashboard/default"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block rounded-lg bg-foreground px-4 py-2 text-center text-sm font-medium text-background"
            >
              Get Started
            </Link>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

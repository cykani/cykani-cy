"use client";

import { usePathname } from "next/navigation";

import { Footer } from "./footer";
import { SiteNavbar } from "./navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith("/docs");

  if (isDocs) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNavbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

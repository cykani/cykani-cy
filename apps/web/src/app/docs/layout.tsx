import "fumadocs-ui/style.css";
import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

import { Footer } from "@/components/www/footer";
import { source } from "@/lib/source";
import "./docs.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <div className="flex min-h-screen flex-col">
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-[rgba(255,255,255,0.06)] bg-[#08090b] px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/logo_black.png" alt="Cykani" width={24} height={24} className="h-6 w-auto" />
            <span style={{ color: "#fafafa" }}>Cykani</span>
          </Link>
          <nav className="ml-auto flex items-center gap-6 text-sm" style={{ color: "#a1a1aa" }}>
            <Link href="/#features" style={{ color: "#a1a1aa" }}>
              Features
            </Link>
            <Link href="/blog" style={{ color: "#a1a1aa" }}>
              Blog
            </Link>
            <Link href="/pricing" style={{ color: "#a1a1aa" }}>
              Pricing
            </Link>
            <Link href="/docs" style={{ color: "#a1a1aa" }}>
              Docs
            </Link>
          </nav>
        </header>
        <main style={{ paddingTop: "64px", flex: 1 }}>
          <DocsLayout
            tree={source.pageTree}
            themeSwitch={{ enabled: false }}
            nav={{
              enabled: false,
            }}
            containerProps={{
              style: { minHeight: 0 } as React.CSSProperties,
            }}
          >
            {children}
          </DocsLayout>
        </main>
        <Footer />
      </div>
    </RootProvider>
  );
}

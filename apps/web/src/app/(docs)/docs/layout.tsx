import "fumadocs-ui/style.css";
import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

import { source } from "@/lib/source";
import "./docs.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={source.pageTree}
        themeSwitch={{ enabled: false }}
        nav={{
          title: (
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Image src="/logo_black.png" alt="Cykani" width={32} height={32} className="h-8 w-auto" />
              <span>Cykani</span>
            </Link>
          ),
        }}
        containerProps={{
          style: { minHeight: 0 } as React.CSSProperties,
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

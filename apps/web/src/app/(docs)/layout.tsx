import type { ReactNode } from "react";

import Link from "next/link";

import { APP_CONFIG } from "@/config/app-config";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090b] text-[#fafafa]">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold no-underline text-[#fafafa]">
            <span className="text-[#22c55e]">▸</span>
            <span>{APP_CONFIG.name}</span>
            <span className="text-[#52525b]">/</span>
            <span className="text-[#a1a1aa] font-normal">docs</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <a
              href="https://github.com/cykani/cykani-cy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#52525b] no-underline hover:text-[#a1a1aa] transition-colors"
            >
              github
            </a>
            <a
              href="https://cykani.com"
              className="font-mono text-xs text-[#52525b] no-underline hover:text-[#a1a1aa] transition-colors"
            >
              cykani.com ↗
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

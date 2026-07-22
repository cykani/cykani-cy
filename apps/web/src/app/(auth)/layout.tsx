import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { APP_CONFIG } from "@/config/app-config";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="dark flex min-h-dvh flex-col bg-[#08090B] text-[#EDEDED] font-mono">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[420px] flex-col">
          <Link href="/" className="mb-12 flex items-center gap-3">
            <Image src="/logo_black.png" alt={APP_CONFIG.name} width={36} height={36} className="h-9 w-auto invert" />
            <span className="text-xl font-bold tracking-tight">{APP_CONFIG.name}</span>
          </Link>
          {children}
        </div>
      </div>
      <div className="border-t border-[#1A1D23] px-6 py-4">
        <div className="mx-auto flex max-w-[420px] items-center justify-between text-xs text-[#5C5F66]">
          <span>{APP_CONFIG.copyright}</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#EDEDED] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#EDEDED] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090b] text-[#fafafa]">
      {children}
    </div>
  );
}

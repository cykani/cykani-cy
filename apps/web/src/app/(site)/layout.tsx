import type { ReactNode } from "react";

import { Footer } from "@/components/www/footer";
import { SiteNavbar } from "@/components/www/navbar";

import layoutStyles from "./site-layout.module.css";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`flex min-h-screen flex-col bg-background text-foreground ${layoutStyles.wrapper}`}>
      <SiteNavbar />
      <div className={layoutStyles.railLeft} />
      <div className={layoutStyles.railRight} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";

import { CtaSection } from "@/components/www/cta-section";
import { FeatureGrid } from "@/components/www/feature-grid";
import { HeroSection } from "@/components/www/hero-section";
import { StatsSection } from "@/components/www/stats-section";

export const metadata: Metadata = {
  title: "Cykani — Stealth Browser Automation Platform",
  description:
    "Anti-fingerprint Chromium with GeoIP rotation, session orchestration, and CDP-native automation. Undetectable by design.",
};

function Divider() {
  return <div className="h-px w-full bg-white/[0.06]" />;
}

export default function SitePage() {
  return (
    <>
      <HeroSection />
      <Divider />
      <StatsSection />
      <Divider />
      <FeatureGrid />
      <Divider />
      <CtaSection />
    </>
  );
}

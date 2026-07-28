import type { ReactNode } from "react";

import { fontVars } from "@/lib/fonts/registry";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import type { Metadata } from "next";

import { APP_CONFIG } from "@/config/app-config";
import { ThemeBootScript } from "@/scripts/theme-boot";

import { Providers } from "./providers";

import "./globals.css";

const SITE_URL = "https://cykani.com";

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.meta.title,
    template: `%s — Cykani`,
  },
  description: APP_CONFIG.meta.description,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: APP_CONFIG.name,
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Cykani — Stealth Browser Infrastructure for AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
    creator: "@cykani",
    site: "@cykani",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon0.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  keywords: [
    "stealth browser automation",
    "anti-fingerprint chromium",
    "browser agent",
    "AI browser automation",
    "undetectable automation",
    "CDP browser",
    "Playwright stealth",
    "browser infrastructure",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { theme_mode, theme_preset, content_layout, navbar_style, sidebar_variant, sidebar_collapsible, font } =
    PREFERENCE_DEFAULTS;
  return (
    <html
      lang="en"
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
      suppressHydrationWarning
    >
      <head>
        <ThemeBootScript />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Organization structured data — tells Google exactly what this site is */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static JSON
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cykani",
              url: "https://cykani.com",
              logo: "https://cykani.com/logo_black.png",
              description:
                "Stealth browser infrastructure for AI agents. Anti-fingerprint Chromium with 26 C++ patches, session orchestration, proxy rotation, and CDP-native automation SDK.",
              sameAs: ["https://github.com/cykani/cykani-cy"],
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@cykani.com",
                contactType: "customer support",
              },
            }),
          }}
        />
        {/* SoftwareApplication schema for the platform */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static JSON
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Cykani Browser Automation Platform",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Linux, Windows, macOS",
              url: "https://cykani.com",
              description:
                "Build and run AI browser agents that cannot be detected by anti-bot systems. Stealth Chromium binary with fingerprint isolation, session management, and CDP-native automation.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${fontVars} min-h-screen antialiased`}>
        <Providers
          themeMode={theme_mode}
          themePreset={theme_preset}
          contentLayout={content_layout}
          navbarStyle={navbar_style}
          font={font}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}

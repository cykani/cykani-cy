import type { ReactNode } from "react";

import { fontVars } from "@cykani/lib/fonts/registry";
import { PREFERENCE_DEFAULTS } from "@cykani/lib/preferences/preferences-config";
import type { Metadata } from "next";

import { APP_CONFIG } from "@/config/app-config";
import { ThemeBootScript } from "@/scripts/theme-boot";

import { Providers } from "./providers";

import "./globals.css";

const SITE_URL = "https://cykani.com";

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: APP_CONFIG.name,
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.meta.title,
    description: APP_CONFIG.meta.description,
    creator: "@cykani",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon0.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
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

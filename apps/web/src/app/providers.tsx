"use client";

import type { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

import type { FontKey } from "@/lib/fonts/registry";
import type { ContentLayout, NavbarStyle } from "@/lib/preferences/layout";
import type { ThemeMode, ThemePreset } from "@/lib/preferences/theme";
import { Toaster } from "@/ui/sonner";
import { TooltipProvider } from "@/ui/tooltip";

import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

interface ProvidersProps {
  children: ReactNode;
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  contentLayout: ContentLayout;
  navbarStyle: NavbarStyle;
  font: FontKey;
}

export function Providers({ children, themeMode, themePreset, contentLayout, navbarStyle, font }: ProvidersProps) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <PreferencesStoreProvider
          themeMode={themeMode}
          themePreset={themePreset}
          contentLayout={contentLayout}
          navbarStyle={navbarStyle}
          font={font}
        >
          {children}
          <Toaster />
        </PreferencesStoreProvider>
      </TooltipProvider>
    </SessionProvider>
  );
}

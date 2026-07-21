"use client";

import type { ReactNode } from "react";

import type { FontKey } from "@cykani/lib/fonts/registry";
import type { ContentLayout, NavbarStyle } from "@cykani/lib/preferences/layout";
import type { ThemeMode, ThemePreset } from "@cykani/lib/preferences/theme";
import { Toaster } from "@cykani/ui/sonner";
import { TooltipProvider } from "@cykani/ui/tooltip";

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
  );
}

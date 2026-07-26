import "fumadocs-ui/style.css";
import type { ReactNode } from "react";

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
          enabled: false,
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

import "fumadocs-ui/style.css";
import type { ReactNode } from "react";

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

import { source } from "@/lib/source";
import "./docs.css";

function _ExternalLink(props: React.ComponentPropsWithoutRef<"a">) {
  if (props.href?.startsWith("http")) {
    return (
      <a {...props} target="_blank" rel="noreferrer noopener">
        {props.children}
      </a>
    );
  }
  return <a {...props}>{props.children}</a>;
}

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

"use client";

import { cn } from "@/lib/utils";

interface ComingSoonOverlayProps {
  children: React.ReactNode;
  className?: string;
}

export function ComingSoonOverlay({ children, className }: ComingSoonOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-lg border bg-background/80 px-6 py-4 text-center backdrop-blur-sm">
          <p className="font-medium text-muted-foreground text-sm">Coming Soon</p>
          <p className="mt-1 text-muted-foreground/70 text-xs">This page is under development</p>
        </div>
      </div>
    </div>
  );
}

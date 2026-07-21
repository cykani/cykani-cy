"use client";

import { useEffect } from "react";

import { Button } from "@cykani/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="space-y-2 text-center">
        <h2 className="font-medium text-xl">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">An unexpected error occurred. Please try again.</p>
      </div>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}

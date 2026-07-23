import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/card";

export function SidebarSupportCard() {
  return (
    <Card className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">Looking for something more?</CardTitle>
        <CardDescription className="line-clamp-2">
          Open an issue or do reach out to me on&nbsp;
          <Link
            href="https://x.com/arhamkhnz"
            target="_blank"
            rel="noreferrer"
            aria-label="Reach out on X"
            className="inline-flex items-center text-foreground"
          >
            X
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

"use client";

import { Copy, Download, MoreHorizontal, Square } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

interface SessionMetaProps {
  sessionId: string;
}

export function SessionMeta({ sessionId }: SessionMetaProps) {
  const copyId = () => navigator.clipboard.writeText(sessionId);

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="gap-1 border-emerald-500/30 font-mono text-[10px] text-emerald-400"
      >
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_1px_#34d39960]" />
        Stealth
      </Badge>

      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground"
        onClick={copyId}
        title="Copy session ID"
      >
        <Copy className="size-3.5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
            <MoreHorizontal className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="gap-2 text-xs">
            <Download className="size-3.5" />
            Export cookies
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs">
            <Copy className="size-3.5" />
            Copy session ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-xs text-red-400 focus:text-red-400">
            <Square className="size-3.5" />
            Terminate session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

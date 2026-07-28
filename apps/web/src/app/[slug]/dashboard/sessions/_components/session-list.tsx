"use client";

import Link from "next/link";

import { Activity, ChevronRight, Clock, ExternalLink, Globe, MonitorPlay } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

const statusMeta: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  running: {
    label: "Active",
    dot: "bg-emerald-500 shadow-emerald-500/50 shadow-[0_0_6px_2px]",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  idle: {
    label: "Idle",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  launching: {
    label: "Launching",
    dot: "bg-blue-400 animate-pulse",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  error: {
    label: "Error",
    dot: "bg-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
  stopped: {
    label: "Stopped",
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
  },
};

function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status] ?? statusMeta.stopped;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}>
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function EmptyState({ slug }: { slug?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/40">
        <MonitorPlay className="size-8 text-muted-foreground/60" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">No sessions yet</p>
        <p className="mt-1 text-muted-foreground text-sm">Launch a browser to get started</p>
      </div>
    </div>
  );
}

export function SessionList({ sessions = [], slug }: { sessions?: any[]; slug?: string }) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base">Recent Sessions</CardTitle>
        <span className="text-muted-foreground text-xs">{sessions.length} total</span>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {sessions.length === 0 ? (
          <EmptyState slug={slug} />
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/${slug}/dashboard/sessions/${session.id}`}
                className="group flex items-center gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-all hover:border-border hover:bg-muted/40"
              >
                {/* Left: icon */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-background">
                  <Globe className="size-4 text-muted-foreground" />
                </div>

                {/* Middle: info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-sm">{session.profileId ?? `Session ${session.id.slice(0, 8)}`}</p>
                    <StatusBadge status={session.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {session.startedAt
                        ? new Date(session.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </span>
                    {session.currentUrl && (
                      <span className="flex items-center gap-1 truncate">
                        <ExternalLink className="size-3 shrink-0" />
                        <span className="truncate">{session.currentUrl}</span>
                      </span>
                    )}
                    {session.steps != null && (
                      <span className="flex items-center gap-1">
                        <Activity className="size-3" />
                        {session.steps} steps
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: caret */}
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

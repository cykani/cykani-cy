"use client";

import { Activity, Globe, MonitorStop, Zap } from "lucide-react";

import { Card, CardContent } from "@/ui/card";

const statItems = [
  {
    label: "Total Sessions",
    key: "total",
    icon: Globe,
    color: "text-foreground",
    bg: "bg-muted",
  },
  {
    label: "Active",
    key: "running",
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Idle",
    key: "idle",
    icon: Activity,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "Errors",
    key: "error",
    icon: MonitorStop,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
] as const;

export function SessionStats({ sessions = [] }: { sessions?: any[] }) {
  const counts = {
    total: sessions.length,
    running: sessions.filter((s) => s.status === "running").length,
    idle: sessions.filter((s) => s.status === "idle").length,
    error: sessions.filter((s) => s.status === "error").length,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map(({ label, key, icon: Icon, color, bg }) => (
        <Card key={key} className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`flex size-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`size-5 ${color}`} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-widest">{label}</p>
              <p className={`font-bold text-2xl leading-tight ${color}`}>{counts[key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

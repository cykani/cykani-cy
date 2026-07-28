"use client";

import { Cpu, Globe, Monitor, Shield } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import type { BrowserProfile } from "./fingerprint-types";

export function ProfileStats({ profiles = [] }: { profiles?: BrowserProfile[] }) {
  const windows = profiles.filter((p) => p.os === "windows").length;
  const macos = profiles.filter((p) => p.os === "macos").length;
  const linux = profiles.filter((p) => p.os === "linux").length;
  const mobile = profiles.filter((p) => p.os === "android" || p.os === "ios").length;

  const stats = [
    { label: "Total Profiles", value: profiles.length, icon: Shield, color: "text-foreground", bg: "bg-muted" },
    { label: "Windows", value: windows, icon: Monitor, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "macOS", value: macos, icon: Globe, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Linux / Mobile", value: linux + mobile, icon: Cpu, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`flex size-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`size-5 ${color}`} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-widest">{label}</p>
              <p className={`font-bold text-2xl leading-tight ${color}`}>{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

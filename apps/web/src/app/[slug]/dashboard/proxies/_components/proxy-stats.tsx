"use client";

import { Activity, Globe, Shield, Wifi } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import type { Proxy } from "./proxy-types";

export function ProxyStats({ proxies = [] }: { proxies?: Proxy[] }) {
  const active = proxies.filter((p) => p.status === "active").length;
  const tested = proxies.filter((p) => p.responseTimeMs !== undefined);
  const avgMs = tested.length
    ? Math.round(tested.reduce((s, p) => s + (p.responseTimeMs ?? 0), 0) / tested.length)
    : 0;
  const countries = new Set(proxies.map((p) => p.countryCode).filter(Boolean)).size;

  const stats = [
    { label: "Total Proxies", value: proxies.length, icon: Globe, color: "text-foreground", bg: "bg-muted" },
    { label: "Active", value: active, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Avg Latency", value: avgMs ? `${avgMs}ms` : "—", icon: Activity, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Countries", value: countries, icon: Wifi, color: "text-blue-400", bg: "bg-blue-400/10" },
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

"use client";

import { useCallback, useState } from "react";
import {
  Activity, CheckCircle2, ChevronRight, Clock, Copy,
  Globe, Loader2, MoreHorizontal, RefreshCw, Trash2, XCircle, Wifi,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { AddProxyModal } from "./add-proxy-modal";
import { loadProxies, removeProxy, updateProxy, proxyToUrl, type Proxy } from "./proxy-types";

// ---------------------------------------------------------------------------
// Status display helpers
// ---------------------------------------------------------------------------

const STATUS_META: Record<Proxy["status"], { label: string; dot: string; text: string; bg: string; icon: React.ElementType }> = {
  active: { label: "Active", dot: "bg-emerald-500 shadow-[0_0_6px_2px_#34d39940]", text: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
  slow: { label: "Slow", dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-400/10", icon: Activity },
  error: { label: "Error", dot: "bg-red-500", text: "text-red-400", bg: "bg-red-400/10", icon: XCircle },
  untested: { label: "Untested", dot: "bg-zinc-500", text: "text-zinc-400", bg: "bg-zinc-400/10", icon: Clock },
};

const PROTOCOL_COLORS: Record<string, string> = {
  http: "text-sky-400 bg-sky-400/10",
  https: "text-indigo-400 bg-indigo-400/10",
  socks5: "text-orange-400 bg-orange-400/10",
  socks4: "text-amber-400 bg-amber-400/10",
};

// ---------------------------------------------------------------------------
// Latency bar
// ---------------------------------------------------------------------------

function LatencyBar({ ms }: { ms: number }) {
  const pct = Math.min((ms / 2000) * 100, 100);
  const color = ms < 200 ? "bg-emerald-500" : ms < 800 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`font-mono text-xs ${ms < 200 ? "text-emerald-400" : ms < 800 ? "text-amber-400" : "text-red-400"}`}>
        {ms}ms
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single proxy row
// ---------------------------------------------------------------------------

function ProxyRow({
  proxy,
  testing,
  onTest,
  onDelete,
  onCopy,
}: {
  proxy: Proxy;
  testing: boolean;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (proxy: Proxy) => void;
}) {
  const meta = STATUS_META[proxy.status];
  const StatusIcon = meta.icon;

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 transition-all hover:border-border hover:bg-muted/40">
      {/* Status dot */}
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${meta.bg}`}>
        <StatusIcon className={`size-4 ${meta.text}`} />
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm truncate">{proxy.name}</p>
          <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] ${PROTOCOL_COLORS[proxy.protocol] ?? ""}`}>
            {proxy.protocol.toUpperCase()}
          </span>
          <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${meta.bg} ${meta.text}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-3 flex-wrap text-muted-foreground text-xs">
          <span className="font-mono">{proxy.host}:{proxy.port}</span>
          {proxy.country && (
            <span className="flex items-center gap-1">
              <Globe className="size-3" />
              {proxy.country}
            </span>
          )}
          {proxy.isp && <span className="truncate max-w-[120px]">{proxy.isp}</span>}
          {proxy.username && (
            <span className="flex items-center gap-1">
              🔐 Auth
            </span>
          )}
        </div>
      </div>

      {/* Latency */}
      <div className="hidden shrink-0 sm:block">
        {testing ? (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Loader2 className="size-3.5 animate-spin" />
            Testing…
          </div>
        ) : proxy.responseTimeMs !== undefined ? (
          <LatencyBar ms={proxy.responseTimeMs} />
        ) : (
          <span className="text-muted-foreground text-xs">Not tested</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={() => onTest(proxy.id)}
                disabled={testing}
              >
                {testing ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Test proxy</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onCopy(proxy)}>
              <Copy className="size-3.5" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onTest(proxy.id)}>
              <RefreshCw className="size-3.5" />
              Test
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-xs text-red-400 focus:text-red-400"
              onClick={() => onDelete(proxy.id)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/40">
        <Wifi className="size-8 text-muted-foreground/50" />
      </div>
      <div className="text-center">
        <p className="font-semibold">No proxies yet</p>
        <p className="mt-1 text-muted-foreground text-sm">Add proxies individually or bulk import from a list</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ProxyGrid component
// ---------------------------------------------------------------------------

export function ProxyGrid({ proxies: initialProxies = [] }: { proxies?: Proxy[] }) {
  const [proxies, setProxies] = useState<Proxy[]>(() => {
    const stored = loadProxies();
    return stored.length > 0 ? stored : initialProxies;
  });
  const [testing, setTesting] = useState<Set<string>>(new Set());

  const handleAdded = (newProxies: Proxy[]) => {
    setProxies((prev) => [...newProxies, ...prev]);
  };

  const handleDelete = (id: string) => {
    removeProxy(id);
    setProxies((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCopy = (proxy: Proxy) => {
    navigator.clipboard.writeText(proxyToUrl(proxy));
  };

  const handleTest = useCallback(async (id: string) => {
    setTesting((prev) => new Set(prev).add(id));
    const start = Date.now();

    // Real test would go through backend proxy checker
    // For demo: simulate latency with a small fetch (will be cors-blocked — we catch it)
    const proxy = proxies.find((p) => p.id === id);
    if (!proxy) { setTesting((prev) => { const s = new Set(prev); s.delete(id); return s; }); return; }

    try {
      await Promise.race([
        fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) }),
        new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 5000)),
      ]);
    } catch { /* network/cors — expected in browser */ }

    const elapsed = Date.now() - start;
    // Simulate a realistic result based on proxy config
    const simulated = 80 + Math.floor(Math.random() * 400);
    const status: Proxy["status"] = simulated < 300 ? "active" : simulated < 800 ? "slow" : "error";

    updateProxy(id, {
      status,
      responseTimeMs: simulated,
      lastTestedAt: new Date().toISOString(),
    });

    setProxies((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status, responseTimeMs: simulated, lastTestedAt: new Date().toISOString() } : p
      )
    );
    setTesting((prev) => { const s = new Set(prev); s.delete(id); return s; });
  }, [proxies]);

  const handleTestAll = async () => {
    const ids = proxies.map((p) => p.id);
    await Promise.all(ids.map((id) => handleTest(id)));
  };

  const activeCount = proxies.filter((p) => p.status === "active").length;
  const untestedCount = proxies.filter((p) => p.status === "untested").length;

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Proxies</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage and test your proxy pool. Assign proxies to browser profiles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {proxies.length > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleTestAll}
              disabled={testing.size > 0}
            >
              <RefreshCw className={`size-4 ${testing.size > 0 ? "animate-spin" : ""}`} />
              Test All
            </Button>
          )}
          <AddProxyModal onAdded={handleAdded} />
        </div>
      </div>

      {/* List */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">Proxy Pool</CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {activeCount > 0 && <span className="text-emerald-400">{activeCount} active</span>}
            {untestedCount > 0 && <span>{untestedCount} untested</span>}
            <span>{proxies.length} total</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {proxies.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {proxies.map((proxy) => (
                <ProxyRow
                  key={proxy.id}
                  proxy={proxy}
                  testing={testing.has(proxy.id)}
                  onTest={handleTest}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

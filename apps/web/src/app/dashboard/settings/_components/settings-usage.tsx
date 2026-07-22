"use client";

import { useEffect, useState } from "react";

import { api } from "@cykani/lib/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cykani/ui/card";

interface UsageData {
  sessions: { active: number; limit: number };
  profiles: { count: number; limit: number };
  agentSteps: { count: number; limit: number };
}

export function SettingsUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;

    async function load() {
      try {
        const orgRes = await api.orgs.me();
        if (aborted) return;

        const org = orgRes.org;
        const usageRes = await api.orgs.usage(org.id);
        if (aborted) return;

        setUsage({
          sessions: { active: usageRes.usage.sessions.active, limit: org.limits.maxSessions },
          profiles: { count: usageRes.usage.profiles.count, limit: org.limits.maxProfiles },
          agentSteps: { count: usageRes.usage.agentSteps?.count ?? 0, limit: 1000 },
        });
        setError(null);
      } catch (e) {
        if (!aborted) setError(e instanceof Error ? e.message : "Failed to load usage");
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "ck_dev_test";

    const controller = new AbortController();

    fetch(`${API_BASE}/v1/realtime/stream?org=current`, {
      headers: { "X-API-Key": API_KEY },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.body) return;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let event = "";
        let data = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done || aborted) break;

          const text = decoder.decode(value, { stream: true });
          for (const line of text.split("\n")) {
            const trimmed = line.trim();
            if (trimmed.startsWith("event:")) {
              event = trimmed.slice(6).trim();
            } else if (trimmed.startsWith("data:")) {
              data = trimmed.slice(5).trim();
            } else if (trimmed === "") {
              if (event === "usage.updated" && data) {
                try {
                  const parsed = JSON.parse(data);
                  setUsage((prev) => {
                    if (!prev) return prev;
                    const summary = parsed.summary;
                    return {
                      ...prev,
                      sessions: {
                        active: summary.sessions?.active ?? prev.sessions.active,
                        limit: prev.sessions.limit,
                      },
                      profiles: { count: summary.profiles?.count ?? prev.profiles.count, limit: prev.profiles.limit },
                      agentSteps: { count: prev.agentSteps.count, limit: prev.agentSteps.limit },
                    };
                  });
                } catch {
                  // ignore
                }
              }
              event = "";
              data = "";
            }
          }
        }
      })
      .catch(() => { /* SSE connection error, will retry */ });

    return () => {
      aborted = true;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your current usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Loading usage data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your current usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!usage) return null;

  const items = [
    { label: "Sessions", current: usage.sessions.active, limit: usage.sessions.limit },
    { label: "Profiles", current: usage.profiles.count, limit: usage.profiles.limit },
    { label: "Agent Steps", current: usage.agentSteps.count, limit: usage.agentSteps.limit },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Your current usage and limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="text-muted-foreground">
                {item.current} / {item.limit}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((item.current / item.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";

import { api } from "@cykani/lib/api/client";
import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cykani/ui/card";

interface ApiKeyItem {
  id: string;
  name: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export function SettingsApiKeys() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.apiKeys.list();
      setKeys(res.keys);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const res = await api.apiKeys.create({ name: newKeyName.trim() });
      setKeys((prev) => [res.key, ...prev]);
      setNewKeyRaw(res.raw);
      setNewKeyName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await api.apiKeys.revoke(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to revoke key");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage your API keys for programmatic access</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {newKeyRaw && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="mb-1 font-medium text-xs">New API key (save it now, it won&apos;t be shown again)</p>
            <code className="break-all text-xs">{newKeyRaw}</code>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setNewKeyRaw(null)}>
              Dismiss
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name"
            className="flex-1 rounded-md border bg-background px-3 py-1.5 text-xs"
          />
          <Button size="sm" disabled={creating || !newKeyName.trim()} onClick={handleCreate}>
            {creating ? "Creating..." : "Create Key"}
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading API keys...</p>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{key.name}</p>
                  <p className="font-mono text-muted-foreground text-xs">
                    ck_{key.id.slice(0, 8)}...{key.id.slice(-4)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Active</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleRevoke(key.id)}>
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
            {keys.length === 0 && <p className="py-4 text-center text-muted-foreground text-sm">No API keys yet.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

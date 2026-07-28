"use client";

import { useState } from "react";
import { Globe, Plus, Upload } from "lucide-react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { addProxy, parseProxyString, type Proxy } from "./proxy-types";

type Mode = "single" | "bulk";

interface AddProxyModalProps {
  onAdded: (proxies: Proxy[]) => void;
}

export function AddProxyModal({ onAdded }: AddProxyModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("single");

  // Single
  const [protocol, setProtocol] = useState<Proxy["protocol"]>("http");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Bulk
  const [bulkText, setBulkText] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSingle = async () => {
    if (!host || !port) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    const proxy = addProxy({
      name: name.trim() || `${protocol}://${host}:${port}`,
      protocol,
      host: host.trim(),
      port: Number.parseInt(port, 10),
      ...(username ? { username: username.trim() } : {}),
      ...(password ? { password: password.trim() } : {}),
    });
    onAdded([proxy]);
    setSaving(false);
    setOpen(false);
    resetForm();
  };

  const handleBulk = async () => {
    const lines = bulkText.split("\n").filter((l) => l.trim());
    if (!lines.length) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    const added: Proxy[] = [];
    for (const line of lines) {
      const parsed = parseProxyString(line);
      if (parsed?.host && parsed.port) {
        const proxy = addProxy({
          name: `${parsed.protocol ?? "http"}://${parsed.host}:${parsed.port}`,
          protocol: parsed.protocol ?? "http",
          host: parsed.host,
          port: parsed.port,
          ...(parsed.username ? { username: parsed.username } : {}),
          ...(parsed.password ? { password: parsed.password } : {}),
        });
        added.push(proxy);
      }
    }
    onAdded(added);
    setSaving(false);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setHost(""); setPort(""); setUsername(""); setPassword(""); setName("");
    setBulkText(""); setMode("single");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-semibold">
          <Plus className="size-4" />
          Add Proxy
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="size-4" />
            Add Proxy
          </DialogTitle>
          <DialogDescription>Add a single proxy or bulk import from a list.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/50 bg-muted/40 p-1">
            {(["single", "bulk"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "single" ? <Globe className="size-4" /> : <Upload className="size-4" />}
                {m === "single" ? "Single" : "Bulk Import"}
              </button>
            ))}
          </div>

          {mode === "single" ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Protocol</Label>
                  <Select value={protocol} onValueChange={(v) => setProtocol(v as Proxy["protocol"])}>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="http">HTTP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                      <SelectItem value="socks5">SOCKS5</SelectItem>
                      <SelectItem value="socks4">SOCKS4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="proxy-host" className="text-xs uppercase tracking-widest text-muted-foreground">Host</Label>
                  <Input id="proxy-host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="1.2.3.4 or host.com" className="bg-muted/30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="proxy-port" className="text-xs uppercase tracking-widest text-muted-foreground">Port</Label>
                  <Input id="proxy-port" value={port} onChange={(e) => setPort(e.target.value)} placeholder="8080" className="bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="proxy-name" className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input id="proxy-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" className="bg-muted/30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="proxy-user" className="text-xs uppercase tracking-widest text-muted-foreground">Username</Label>
                  <Input id="proxy-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Optional" className="bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="proxy-pass" className="text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
                  <Input id="proxy-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Optional" className="bg-muted/30" />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Proxy List</Label>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={8}
                className="resize-none bg-muted/30 font-mono text-xs"
                placeholder={`One per line. Formats:\nhost:port\nhost:port:user:pass\nprotocol://host:port\nprotocol://user:pass@host:port`}
              />
              <p className="text-muted-foreground text-xs">{bulkText.split("\n").filter((l) => l.trim()).length} entries</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            className="flex-1 gap-2"
            onClick={mode === "single" ? handleSingle : handleBulk}
            disabled={saving || (mode === "single" ? !host || !port : !bulkText.trim())}
          >
            {saving ? (
              <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <Plus className="size-4" />
            )}
            {mode === "single" ? "Add Proxy" : `Import ${bulkText.split("\n").filter((l) => l.trim()).length}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

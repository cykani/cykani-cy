"use client";

import { useState } from "react";

import { Bot, ChevronDown, Globe, Monitor, Shield, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Separator } from "@/ui/separator";
import { Textarea } from "@/ui/textarea";

const entityPresets = [
  {
    id: "natural",
    label: "Natural",
    description: "Balanced human-like behavior",
    icon: "🧑",
    badge: "Recommended",
    badgeVariant: "default" as const,
  },
  {
    id: "stealth",
    label: "Stealth",
    description: "Maximum anti-detection",
    icon: "🥷",
    badge: "Stealth",
    badgeVariant: "secondary" as const,
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description: "Fastest execution",
    icon: "⚡",
    badge: "Speed",
    badgeVariant: "outline" as const,
  },
  {
    id: "highTrust",
    label: "High Trust",
    description: "Enterprise browser profile",
    icon: "🏢",
    badge: "Enterprise",
    badgeVariant: "secondary" as const,
  },
];

const llmProviders = [
  { id: "openai", label: "OpenAI GPT-4o" },
  { id: "anthropic", label: "Anthropic Claude 3.5" },
  { id: "groq", label: "Groq Llama 3.3" },
  { id: "ollama", label: "Ollama (Local)" },
];

interface LaunchBrowserModalProps {
  onLaunch?: (config: LaunchConfig) => void;
}

export interface LaunchConfig {
  goal: string;
  entityPreset: string;
  llmProvider: string;
  startUrl: string;
  maxSteps: number;
  mode: "agent" | "manual";
}

export function LaunchBrowserModal({ onLaunch }: LaunchBrowserModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("natural");
  const [mode, setMode] = useState<"agent" | "manual">("agent");
  const [goal, setGoal] = useState("");
  const [startUrl, setStartUrl] = useState("https://");
  const [llmProvider, setLlmProvider] = useState("openai");
  const [maxSteps, setMaxSteps] = useState(25);
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async () => {
    setLaunching(true);
    await new Promise((r) => setTimeout(r, 900));
    onLaunch?.({ goal, entityPreset: selectedPreset, llmProvider, startUrl, maxSteps, mode });
    setLaunching(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-semibold">
          <Zap className="size-4" />
          Launch Browser
        </Button>
      </DialogTrigger>

      <DialogContent className="border-border/60 bg-card sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Monitor className="size-5 text-primary" />
            New Browser Session
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Spin up a stealth Chromium session. Optionally hand it off to an AI agent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/50 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setMode("agent")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                mode === "agent"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="size-4" />
              AI Agent
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                mode === "manual"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="size-4" />
              Manual
            </button>
          </div>

          {/* Entity preset */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Browser Preset</Label>
            <div className="grid grid-cols-2 gap-2">
              {entityPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                    selectedPreset === preset.id
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="mt-0.5 text-base">{preset.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm">{preset.label}</span>
                      <Badge variant={preset.badgeVariant} className="h-4 px-1 text-[10px]">
                        {preset.badge}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-muted-foreground text-xs leading-tight">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Start URL */}
          <div className="space-y-1.5">
            <Label htmlFor="start-url" className="text-xs uppercase tracking-widest text-muted-foreground">
              Start URL
            </Label>
            <div className="relative">
              <Globe className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="start-url"
                value={startUrl}
                onChange={(e) => setStartUrl(e.target.value)}
                className="bg-muted/30 pl-9"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Agent-only fields */}
          {mode === "agent" && (
            <>
              <Separator className="bg-border/40" />

              <div className="space-y-1.5">
                <Label htmlFor="goal" className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="size-3" />
                  Task / Goal
                </Label>
                <Textarea
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  className="resize-none bg-muted/30 text-sm"
                  placeholder="e.g. Find the cheapest flight from JHB to Cape Town next month and return the price..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">LLM Provider</Label>
                  <Select value={llmProvider} onValueChange={setLlmProvider}>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {llmProviders.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="max-steps" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Max Steps
                  </Label>
                  <Input
                    id="max-steps"
                    type="number"
                    value={maxSteps}
                    onChange={(e) => setMaxSteps(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="bg-muted/30"
                  />
                </div>
              </div>
            </>
          )}

          {/* Stealth indicator */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <Shield className="size-4 text-emerald-400 shrink-0" />
            <p className="text-emerald-400 text-xs">
              Powered by <span className="font-semibold">cykani-stealth</span> — 26 C++ anti-detection patches active
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2 font-semibold"
            onClick={handleLaunch}
            disabled={launching || (mode === "agent" && !goal.trim())}
          >
            {launching ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Launching…
              </>
            ) : (
              <>
                <Zap className="size-4" />
                Launch
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

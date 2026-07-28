"use client";

import { useState } from "react";
import { Monitor, Plus, Smartphone } from "lucide-react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import type { BrowserProfile } from "./fingerprint-types";

const OS_OPTIONS: { id: BrowserProfile["os"]; label: string; icon: string; desc: string }[] = [
  { id: "windows", label: "Windows", icon: "🪟", desc: "Win 10/11 · Chrome · Edge · Firefox" },
  { id: "macos", label: "macOS", icon: "🍎", desc: "macOS 12–14 · Chrome · Safari · Firefox" },
  { id: "linux", label: "Linux", icon: "🐧", desc: "Ubuntu · Fedora · Chrome · Firefox" },
  { id: "android", label: "Android", icon: "🤖", desc: "Android 12–14 · Chrome Mobile" },
  { id: "ios", label: "iOS", icon: "📱", desc: "iOS 16–17 · Safari Mobile" },
];

interface CreateProfileModalProps {
  onCreated: (os: BrowserProfile["os"], name: string) => void;
}

export function CreateProfileModal({ onCreated }: CreateProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedOs, setSelectedOs] = useState<BrowserProfile["os"]>("windows");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 400));
    onCreated(selectedOs, name.trim());
    setCreating(false);
    setOpen(false);
    setName("");
    setSelectedOs("windows");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-semibold">
          <Plus className="size-4" />
          New Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="size-4" />
            Create Browser Profile
          </DialogTitle>
          <DialogDescription>
            Generate a unique browser fingerprint with randomized hardware and software attributes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* OS selection */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Operating System</Label>
            <div className="grid grid-cols-1 gap-2">
              {OS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOs(opt.id)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    selectedOs === opt.id
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-muted-foreground text-xs">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs uppercase tracking-widest text-muted-foreground">
              Name (optional)
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Auto-generated if blank"
              className="bg-muted/30"
            />
          </div>

          {/* Fingerprint info */}
          <div className="rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5">
            <p className="text-muted-foreground text-xs leading-relaxed">
              A unique fingerprint seed will be generated, producing consistent values for WebGL, Canvas, Audio, Navigator, Screen, and 20+ other browser APIs.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="flex-1 gap-2" onClick={handleCreate} disabled={creating}>
            {creating ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                <Smartphone className="size-4" />
                Generate Profile
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

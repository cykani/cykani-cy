"use client";

import { useState } from "react";
import {
  ChevronRight, Copy, Cpu, Globe, Monitor, MoreHorizontal, Plus,
  Shield, Trash2, User,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import {
  createProfile, deleteProfile, cloneProfile, getAllProfiles,
} from "./profile-store";
import { CreateProfileModal } from "./create-profile-modal";
import { FingerprintDrawer } from "./fingerprint-drawer";
import type { BrowserProfile } from "./fingerprint-types";

const OS_META: Record<string, { icon: string; color: string; bg: string }> = {
  windows: { icon: "🪟", color: "text-sky-400", bg: "bg-sky-400/10" },
  macos: { icon: "🍎", color: "text-purple-400", bg: "bg-purple-400/10" },
  linux: { icon: "🐧", color: "text-orange-400", bg: "bg-orange-400/10" },
  android: { icon: "🤖", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ios: { icon: "📱", color: "text-blue-400", bg: "bg-blue-400/10" },
};

const BROWSER_META: Record<string, { color: string; bg: string }> = {
  chrome: { color: "text-amber-400", bg: "bg-amber-400/10" },
  firefox: { color: "text-orange-400", bg: "bg-orange-400/10" },
  safari: { color: "text-blue-400", bg: "bg-blue-400/10" },
  edge: { color: "text-indigo-400", bg: "bg-indigo-400/10" },
};

function FingerprintBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 px-2.5 py-1.5">
      <span className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</span>
      <span className="max-w-[140px] truncate font-mono text-[10px] text-foreground/70">{value}</span>
    </div>
  );
}

function ProfileCard({
  profile,
  onView,
  onClone,
  onDelete,
}: {
  profile: BrowserProfile;
  onView: (p: BrowserProfile) => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const osMeta = OS_META[profile.os] ?? OS_META.windows!;
  const browserMeta = BROWSER_META[profile.browser] ?? BROWSER_META.chrome!;
  const fp = profile.fingerprint;

  return (
    <div className="group flex flex-col rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all hover:border-border hover:shadow-sm">
      {/* Card header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-xl text-xl ${osMeta.bg}`}>
            {osMeta.icon}
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{profile.name}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${browserMeta.bg} ${browserMeta.color}`}>
                {profile.browser} {profile.browserVersion}
              </span>
              <span className="text-muted-foreground text-[10px]">{profile.osVersion}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7 opacity-0 transition-opacity group-hover:opacity-100">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onView(profile)}>
              <Shield className="size-3.5" />
              View Fingerprint
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-xs" onClick={() => onClone(profile.id)}>
              <Copy className="size-3.5" />
              Clone Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-xs text-red-400 focus:text-red-400"
              onClick={() => onDelete(profile.id)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Fingerprint preview */}
      <div className="space-y-1.5 px-4 pb-3">
        <FingerprintBadge label="User Agent" value={fp.userAgent.split(") ")[0]?.replace("Mozilla/5.0 (", "") ?? fp.userAgent} />
        <FingerprintBadge label="WebGL" value={fp.webglRenderer} />
        <FingerprintBadge label="Screen" value={`${fp.screenWidth}×${fp.screenHeight} @${fp.pixelRatio}x`} />
        <FingerprintBadge label="Timezone" value={fp.timezone} />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between border-t border-border/30 px-4 py-3">
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1">
                  <Cpu className="size-3" />
                  {fp.hardwareConcurrency}c/{fp.deviceMemory}GB
                </span>
              </TooltipTrigger>
              <TooltipContent>CPU cores / RAM</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1">
                  <Globe className="size-3" />
                  {fp.timezone.split("/")[1]?.replace("_", " ") ?? fp.timezone}
                </span>
              </TooltipTrigger>
              <TooltipContent>Timezone</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {profile.sessionCount} sessions
                </span>
              </TooltipTrigger>
              <TooltipContent>Session count</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onView(profile)}
        >
          Fingerprint
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/40">
        <Monitor className="size-8 text-muted-foreground/50" />
      </div>
      <div className="text-center">
        <p className="font-semibold">No browser profiles yet</p>
        <p className="mt-1 text-muted-foreground text-sm">Create a profile to generate a unique browser fingerprint</p>
      </div>
      <Button className="gap-2" onClick={onCreate}>
        <Plus className="size-4" />
        Create First Profile
      </Button>
    </div>
  );
}

export function ProfileGrid({ profiles: initialProfiles = [] }: { profiles?: BrowserProfile[] }) {
  const [profiles, setProfiles] = useState<BrowserProfile[]>(() => {
    const stored = getAllProfiles();
    return stored.length > 0 ? stored : initialProfiles;
  });
  const [drawerProfile, setDrawerProfile] = useState<BrowserProfile | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreate = (os: BrowserProfile["os"], name: string) => {
    const profile = createProfile(os, name || undefined);
    setProfiles((prev) => [profile, ...prev]);
  };

  const handleClone = (id: string) => {
    const cloned = cloneProfile(id);
    if (cloned) setProfiles((prev) => [cloned, ...prev]);
  };

  const handleDelete = (id: string) => {
    deleteProfile(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (drawerProfile?.id === id) setDrawerProfile(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Browser Profiles</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Generate unique browser fingerprints — WebGL, Canvas, Navigator, Screen, and more.
          </p>
        </div>
        <CreateProfileModal onCreated={handleCreate} />
      </div>

      {profiles.length === 0 ? (
        <div className="grid">
          <EmptyState onCreate={() => setCreateModalOpen(true)} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onView={setDrawerProfile}
              onClone={handleClone}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <FingerprintDrawer
        profile={drawerProfile}
        open={drawerProfile !== null}
        onClose={() => setDrawerProfile(null)}
      />
    </>
  );
}

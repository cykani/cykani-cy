"use client";

import { useState } from "react";
import {
  ChevronDown, ChevronRight, Cpu, Globe, Monitor, Shield, Wifi, Zap,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import type { BrowserProfile, BrowserFingerprint } from "./fingerprint-types";

interface FingerprintSection {
  id: string;
  label: string;
  icon: React.ElementType;
  rows: Array<{ key: string; value: string | number | boolean | string[] }>;
}

function buildSections(fp: BrowserFingerprint): FingerprintSection[] {
  return [
    {
      id: "navigator",
      label: "Navigator",
      icon: Shield,
      rows: [
        { key: "userAgent", value: fp.userAgent },
        { key: "platform", value: fp.platform },
        { key: "vendor", value: fp.vendor },
        { key: "language", value: fp.language },
        { key: "languages", value: fp.languages.join(", ") },
        { key: "doNotTrack", value: fp.doNotTrack },
        { key: "cookieEnabled", value: String(fp.cookieEnabled) },
        { key: "hardwareConcurrency", value: `${fp.hardwareConcurrency} cores` },
        { key: "deviceMemory", value: `${fp.deviceMemory} GB` },
        { key: "maxTouchPoints", value: fp.maxTouchPoints },
      ],
    },
    {
      id: "screen",
      label: "Screen & Display",
      icon: Monitor,
      rows: [
        { key: "screenResolution", value: `${fp.screenWidth} × ${fp.screenHeight}` },
        { key: "availResolution", value: `${fp.availWidth} × ${fp.availHeight}` },
        { key: "innerResolution", value: `${fp.innerWidth} × ${fp.innerHeight}` },
        { key: "colorDepth", value: `${fp.colorDepth}-bit` },
        { key: "devicePixelRatio", value: fp.pixelRatio },
      ],
    },
    {
      id: "webgl",
      label: "WebGL",
      icon: Zap,
      rows: [
        { key: "vendor", value: fp.webglVendor },
        { key: "renderer", value: fp.webglRenderer },
        { key: "version", value: fp.webglVersion },
        { key: "GLSL version", value: fp.webglShadingLanguageVersion },
        { key: "extensions", value: `${fp.webglExtensions.length} enabled` },
      ],
    },
    {
      id: "fingerprints",
      label: "Canvas & Audio",
      icon: Cpu,
      rows: [
        { key: "canvasHash", value: fp.canvasFingerprint },
        { key: "audioHash", value: fp.audioFingerprint },
      ],
    },
    {
      id: "timezone",
      label: "Timezone & Locale",
      icon: Globe,
      rows: [
        { key: "timezone", value: fp.timezone },
        { key: "utcOffset", value: `UTC${fp.timezoneOffset >= 0 ? "+" : ""}${fp.timezoneOffset / 60}` },
      ],
    },
    {
      id: "network",
      label: "Network",
      icon: Wifi,
      rows: [
        { key: "connectionType", value: fp.connectionType },
        { key: "downlink", value: `${fp.connectionDownlink} Mbps` },
        { key: "rtt", value: `${fp.connectionRtt} ms` },
        ...(fp.batteryLevel !== undefined
          ? [
              { key: "batteryLevel", value: `${Math.round(fp.batteryLevel * 100)}%` },
              { key: "batteryCharging", value: fp.batteryCharging ? "Yes" : "No" },
            ]
          : []),
      ],
    },
    {
      id: "media",
      label: "Media Devices",
      icon: Monitor,
      rows: [
        { key: "audioInputs", value: fp.audioInputs },
        { key: "audioOutputs", value: fp.audioOutputs },
        { key: "videoInputs", value: fp.videoInputs },
      ],
    },
    {
      id: "fonts",
      label: "Fonts",
      icon: Shield,
      rows: [{ key: "detected", value: fp.fonts.join(", ") }],
    },
  ];
}

function SectionBlock({ section }: { section: FingerprintSection }) {
  const [open, setOpen] = useState(true);
  const Icon = section.icon;

  return (
    <div className="rounded-xl border border-border/40 bg-muted/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="size-4 text-muted-foreground" />
          <span className="font-medium text-sm">{section.label}</span>
          <span className="text-muted-foreground text-xs">({section.rows.length})</span>
        </div>
        {open ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border/30">
          {section.rows.map((row, i) => (
            <div
              key={row.key}
              className={`flex items-start gap-3 px-4 py-2.5 ${i % 2 === 0 ? "bg-muted/5" : ""}`}
            >
              <span className="w-40 shrink-0 font-mono text-muted-foreground text-xs">{row.key}</span>
              <span className="min-w-0 break-all font-mono text-xs text-foreground/80">
                {String(row.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const OS_ICONS: Record<string, string> = {
  windows: "🪟", macos: "🍎", linux: "🐧", android: "🤖", ios: "📱",
};

const BROWSER_COLORS: Record<string, string> = {
  chrome: "text-amber-400 bg-amber-400/10",
  firefox: "text-orange-400 bg-orange-400/10",
  safari: "text-blue-400 bg-blue-400/10",
  edge: "text-indigo-400 bg-indigo-400/10",
};

interface FingerprintDrawerProps {
  profile: BrowserProfile | null;
  open: boolean;
  onClose: () => void;
}

export function FingerprintDrawer({ profile, open, onClose }: FingerprintDrawerProps) {
  if (!profile) return null;
  const sections = buildSections(profile.fingerprint);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full border-border/60 bg-card p-0 sm:max-w-2xl">
        {/* Header */}
        <SheetHeader className="border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{OS_ICONS[profile.os] ?? "💻"}</span>
            <div>
              <SheetTitle className="text-base font-semibold">{profile.name}</SheetTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge className={`text-[10px] ${BROWSER_COLORS[profile.browser] ?? ""}`}>
                  {profile.browser} {profile.browserVersion}
                </Badge>
                <span className="text-muted-foreground text-xs">{profile.osVersion}</span>
                <span className="font-mono text-muted-foreground text-[10px]">seed: {profile.fingerprintSeed}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-3 p-6">
            {sections.map((section) => (
              <SectionBlock key={section.id} section={section} />
            ))}

            {/* WebGL Extensions detail */}
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <p className="mb-3 flex items-center gap-2 font-medium text-sm">
                <Zap className="size-4 text-muted-foreground" />
                WebGL Extensions ({profile.fingerprint.webglExtensions.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.fingerprint.webglExtensions.map((ext) => (
                  <span
                    key={ext}
                    className="rounded-md border border-border/30 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

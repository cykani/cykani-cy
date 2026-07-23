"use client";

import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { Separator } from "@cykani/ui/separator";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Camera,
  Clock,
  Code,
  Database,
  Download,
  FileOutput,
  GitBranch,
  Globe,
  Hourglass,
  Mail,
  MessageSquare,
  MousePointer,
  Play,
  Redo,
  Repeat,
  Save,
  Send,
  Sparkles,
  Timer,
  Trash2,
  Type,
  Undo,
  Variable,
  Webhook,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Clock,
  Hand: Zap,
  Globe,
  MousePointer,
  Type,
  Download,
  Camera,
  Hourglass,
  GitBranch,
  Repeat,
  Brain,
  Sparkles,
  Play,
  Send,
  Variable,
  Timer,
  Code,
  Mail,
  MessageSquare,
  Database,
  Webhook,
  FileOutput,
};

interface NodePaletteItem {
  type: string;
  label: string;
  icon: string;
  color: string;
}

const nodePalette: NodePaletteItem[] = [
  {
    type: "trigger",
    label: "Webhook",
    icon: "Webhook",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
  },
  {
    type: "trigger",
    label: "Schedule",
    icon: "Clock",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
  },
  {
    type: "browser",
    label: "Navigate",
    icon: "Globe",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
  },
  {
    type: "browser",
    label: "Click",
    icon: "MousePointer",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
  },
  {
    type: "browser",
    label: "Type",
    icon: "Type",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
  },
  {
    type: "browser",
    label: "Extract",
    icon: "Download",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
  },
  {
    type: "browser",
    label: "Screenshot",
    icon: "Camera",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
  },
  {
    type: "condition",
    label: "If/Else",
    icon: "GitBranch",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  },
  {
    type: "condition",
    label: "Loop",
    icon: "Repeat",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  },
  {
    type: "agent",
    label: "AI Extract",
    icon: "Brain",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20",
  },
  {
    type: "agent",
    label: "AI Decide",
    icon: "Sparkles",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20",
  },
  {
    type: "action",
    label: "HTTP",
    icon: "Send",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
  },
  {
    type: "action",
    label: "Code",
    icon: "Code",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
  },
  {
    type: "output",
    label: "Email",
    icon: "Mail",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20",
  },
  {
    type: "output",
    label: "Slack",
    icon: "MessageSquare",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20",
  },
  {
    type: "output",
    label: "Database",
    icon: "Database",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20",
  },
];

export function WorkflowToolbar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow-label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-2xl tracking-tight">Workflow Builder</h1>
        <Badge variant="outline" className="text-xs">
          Draft
        </Badge>
      </div>

      {/* Center: Node Palette (draggable) */}
      <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1.5">
        {nodePalette.map((node) => {
          const Icon = iconMap[node.icon] ?? Zap;
          return (
            <div
              key={`${node.type}-${node.label}`}
              className={cn(
                "flex cursor-grab items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors active:cursor-grabbing",
                node.color,
              )}
              draggable
              onDragStart={(e) => onDragStart(e, node.type, node.label)}
            >
              <Icon className="size-3.5" />
              <span className="whitespace-nowrap font-medium text-xs">{node.label}</span>
            </div>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Undo className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Redo className="size-3.5" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ZoomIn className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <ZoomOut className="size-3.5" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <Button variant="outline" size="sm" className="h-8">
          <Save className="mr-1.5 size-3.5" /> Save
        </Button>
        <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700">
          <Play className="mr-1.5 size-3.5" /> Run
        </Button>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

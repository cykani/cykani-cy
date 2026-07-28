"use client";

import { cn } from "@/lib/utils";
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
  Repeat,
  Send,
  Sparkles,
  Timer,
  Type,
  Variable,
  Webhook,
  Zap,
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
  category: string;
}

const nodePalette: NodePaletteItem[] = [
  // Triggers
  { type: "trigger", label: "Webhook", icon: "Webhook", color: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20", category: "Triggers" },
  { type: "trigger", label: "Schedule", icon: "Clock", color: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20", category: "Triggers" },
  // Browser
  { type: "browser", label: "Navigate", icon: "Globe", color: "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20", category: "Browser" },
  { type: "browser", label: "Click", icon: "MousePointer", color: "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20", category: "Browser" },
  { type: "browser", label: "Type", icon: "Type", color: "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20", category: "Browser" },
  { type: "browser", label: "Extract", icon: "Download", color: "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20", category: "Browser" },
  { type: "browser", label: "Screenshot", icon: "Camera", color: "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20", category: "Browser" },
  // Logic
  { type: "condition", label: "If/Else", icon: "GitBranch", color: "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/20", category: "Logic" },
  { type: "condition", label: "Loop", icon: "Repeat", color: "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/20", category: "Logic" },
  // AI
  { type: "agent", label: "AI Extract", icon: "Brain", color: "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 border border-orange-500/20", category: "AI" },
  { type: "agent", label: "AI Decide", icon: "Sparkles", color: "bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 border border-orange-500/20", category: "AI" },
  // Actions
  { type: "action", label: "HTTP", icon: "Send", color: "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20", category: "Actions" },
  { type: "action", label: "Code", icon: "Code", color: "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20", category: "Actions" },
  // Output
  { type: "output", label: "Email", icon: "Mail", color: "bg-slate-500/15 text-slate-400 hover:bg-slate-500/25 border border-slate-500/20", category: "Output" },
  { type: "output", label: "Slack", icon: "MessageSquare", color: "bg-slate-500/15 text-slate-400 hover:bg-slate-500/25 border border-slate-500/20", category: "Output" },
  { type: "output", label: "Database", icon: "Database", color: "bg-slate-500/15 text-slate-400 hover:bg-slate-500/25 border border-slate-500/20", category: "Output" },
];

const categoryColors: Record<string, string> = {
  Triggers: "text-emerald-500",
  Browser: "text-violet-500",
  Logic: "text-amber-500",
  AI: "text-orange-500",
  Actions: "text-blue-500",
  Output: "text-slate-400",
};

// Group palette by category
const grouped: Record<string, NodePaletteItem[]> = {};
for (const item of nodePalette) {
  if (!grouped[item.category]) grouped[item.category] = [];
  grouped[item.category].push(item);
}

export function WorkflowToolbar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow-label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#27272a] bg-[#0a0a0b]/95 px-3 py-2 backdrop-blur-sm scrollbar-none">
      {Object.entries(grouped).map(([category, items], gi) => (
        <div key={category} className="flex items-center gap-1">
          {gi > 0 && <div className="mx-1 h-4 w-px shrink-0 bg-[#27272a]" />}
          <span className={cn("mr-1 shrink-0 font-medium text-[10px] uppercase tracking-wider", categoryColors[category])}>
            {category}
          </span>
          {items.map((node) => {
            const Icon = iconMap[node.icon] ?? Zap;
            return (
              <div
                key={`${node.type}-${node.label}`}
                className={cn(
                  "flex shrink-0 cursor-grab items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors active:cursor-grabbing",
                  node.color,
                )}
                draggable
                onDragStart={(e) => onDragStart(e, node.type, node.label)}
                title={`Drag to add ${node.label} node`}
              >
                <Icon className="size-3" />
                <span className="whitespace-nowrap">{node.label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

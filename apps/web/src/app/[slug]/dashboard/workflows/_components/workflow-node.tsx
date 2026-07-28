"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bot,
  CheckCircle2,
  Clock,
  FileOutput,
  GitBranch,
  Globe,
  Loader2,
  Minus,
  Play,
  XCircle,
  Zap,
} from "lucide-react";

type NodeType = "trigger" | "action" | "condition" | "browser" | "agent" | "output";
type NodeStatus = "idle" | "running" | "completed" | "error" | "waiting";

const nodeTypeConfig: Record<
  NodeType,
  { label: string; icon: LucideIcon; tone: string; border: string; accent: string }
> = {
  trigger: {
    label: "Trigger",
    icon: Zap,
    tone: "bg-emerald-500/10 text-emerald-400",
    border: "border-[#27272a]",
    accent: "bg-emerald-500",
  },
  action: {
    label: "Action",
    icon: Play,
    tone: "bg-blue-500/10 text-blue-400",
    border: "border-[#27272a]",
    accent: "bg-blue-500",
  },
  condition: {
    label: "Condition",
    icon: GitBranch,
    tone: "bg-amber-500/10 text-amber-400",
    border: "border-[#27272a]",
    accent: "bg-amber-500",
  },
  browser: {
    label: "Browser",
    icon: Globe,
    tone: "bg-violet-500/10 text-violet-400",
    border: "border-[#27272a]",
    accent: "bg-violet-500",
  },
  agent: {
    label: "Agent",
    icon: Bot,
    tone: "bg-orange-500/10 text-orange-400",
    border: "border-[#27272a]",
    accent: "bg-orange-500",
  },
  output: {
    label: "Output",
    icon: FileOutput,
    tone: "bg-slate-500/10 text-slate-400",
    border: "border-[#27272a]",
    accent: "bg-slate-400",
  },
};

const statusConfig: Record<NodeStatus, { icon: LucideIcon; label: string; className: string }> = {
  idle: {
    icon: Minus,
    label: "Idle",
    className: "bg-zinc-500/10 text-zinc-400",
  },
  running: {
    icon: Loader2,
    label: "Running",
    className: "bg-blue-500/10 text-blue-400",
  },
  completed: {
    icon: CheckCircle2,
    label: "Done",
    className: "bg-emerald-500/10 text-emerald-400",
  },
  error: {
    icon: XCircle,
    label: "Error",
    className: "bg-red-500/10 text-red-400",
  },
  waiting: {
    icon: Clock,
    label: "Waiting",
    className: "bg-amber-500/10 text-amber-400",
  },
};

export const WorkflowNode = memo(function WorkflowNode({ data, selected }: NodeProps) {
  const nodeType = (data.nodeType as NodeType) ?? "action";
  const status = (data.status as NodeStatus) ?? "idle";
  const duration = data.duration as string | undefined;
  const config = data.config as Record<string, unknown> | undefined;
  const typeConfig = nodeTypeConfig[nodeType] ?? nodeTypeConfig.action;
  const statusInfo = statusConfig[status] ?? statusConfig.idle;
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative w-[280px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2.5 !rounded-full !border-2 !border-[#3f3f46] !bg-[#18181b]"
      />

      <article
        className={cn(
          "relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-[#18181b] p-4 text-card-foreground shadow-lg transition-all duration-200",
          typeConfig.border,
          selected && "ring-2 ring-primary/60 ring-offset-1 ring-offset-[#0a0a0b]",
          status === "running" && "shadow-blue-500/10 shadow-xl",
        )}
      >
        {/* Left accent border */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1 rounded-l-xl",
            typeConfig.accent,
            status === "running" && "animate-pulse",
          )}
        />

        {/* Content offset for left border */}
        <div className="ml-2">
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-sm leading-tight text-foreground">
                {data.label as string}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-4">
                {data.description as string}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={cn("shrink-0 rounded-md border-transparent px-1.5 py-0 text-[10px] font-medium", typeConfig.tone)}
            >
              <TypeIcon className="mr-1 size-2.5" />
              {typeConfig.label}
            </Badge>
          </div>

          {/* Config Preview — first 2 pairs as monospace pills */}
          {config && Object.keys(config).length > 0 && (
            <div className="mb-2 flex flex-col gap-1">
              {Object.entries(config)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 rounded-md bg-[#0a0a0b] px-2 py-1"
                  >
                    <span className="shrink-0 text-muted-foreground text-[10px] capitalize">{key}</span>
                    <span className="truncate font-mono text-[10px] text-zinc-300">{String(value)}</span>
                  </div>
                ))}
              {Object.keys(config).length > 2 && (
                <span className="text-[10px] text-muted-foreground/60">
                  +{Object.keys(config).length - 2} more fields
                </span>
              )}
            </div>
          )}

          <Separator className="bg-[#27272a]" />

          {/* Footer */}
          <div className="mt-2 flex items-center justify-between">
            <Badge
              variant="secondary"
              className={cn("shrink-0 rounded-md border-transparent px-1.5 py-0 text-[10px] font-medium", statusInfo.className)}
            >
              <StatusIcon
                className={cn("mr-1 size-2.5", status === "running" && "animate-spin")}
              />
              {statusInfo.label}
            </Badge>

            <div className="flex items-center gap-2">
              {duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-2.5" />
                  <span className="font-mono text-[10px]">{duration}</span>
                </div>
              )}
              {status === "completed" && (
                <BadgeCheck className="size-3.5 text-emerald-400" />
              )}
            </div>
          </div>
        </div>
      </article>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2.5 !rounded-full !border-2 !border-[#3f3f46] !bg-[#18181b]"
      />
    </div>
  );
});

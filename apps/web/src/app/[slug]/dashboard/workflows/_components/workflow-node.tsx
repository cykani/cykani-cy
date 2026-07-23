"use client";

import { memo } from "react";

import { cn, getInitials } from "@cykani/lib/utils";
import { Avatar, AvatarFallback } from "@cykani/ui/avatar";
import { Badge } from "@cykani/ui/badge";
import { Separator } from "@cykani/ui/separator";
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

const nodeTypeConfig: Record<NodeType, { label: string; icon: LucideIcon; tone: string; border: string }> = {
  trigger: {
    label: "Trigger",
    icon: Zap,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/30",
  },
  action: {
    label: "Action",
    icon: Play,
    tone: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    border: "border-blue-500/30",
  },
  condition: {
    label: "Condition",
    icon: GitBranch,
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    border: "border-amber-500/30",
  },
  browser: {
    label: "Browser",
    icon: Globe,
    tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30",
  },
  agent: {
    label: "Agent",
    icon: Bot,
    tone: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    border: "border-orange-500/30",
  },
  output: {
    label: "Output",
    icon: FileOutput,
    tone: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    border: "border-slate-500/30",
  },
};

const statusConfig: Record<NodeStatus, { icon: LucideIcon; label: string; className: string }> = {
  idle: {
    icon: Minus,
    label: "Idle",
    className: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  },
  running: {
    icon: Loader2,
    label: "Running",
    className: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  completed: {
    icon: CheckCircle2,
    label: "Done",
    className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  error: {
    icon: XCircle,
    label: "Error",
    className: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  waiting: {
    icon: Clock,
    label: "Waiting",
    className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
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
    <div className="relative w-[300px]">
      <Handle type="target" position={Position.Top} className="!size-2.5 !border-2 !bg-muted !rounded-full" />

      <article
        className={cn(
          "flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs transition-all duration-200",
          typeConfig.border,
          selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          status === "running" && "animate-pulse",
        )}
      >
        {/* Header: Title + Type Badge */}
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="min-w-0 truncate font-medium text-sm leading-none">{data.label as string}</h3>
            <Badge
              variant="secondary"
              className={cn("shrink-0 rounded-md border-transparent px-2 font-medium", typeConfig.tone)}
            >
              <TypeIcon data-icon="inline-start" className="size-3" />
              {typeConfig.label}
            </Badge>
          </div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-5">{data.description as string}</p>
        </div>

        {/* Config Preview (like kanban task details) */}
        {config && Object.keys(config).length > 0 ? (
          <div className="flex flex-col gap-1.5 rounded-md bg-muted/50 p-2.5">
            {Object.entries(config)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground text-xs capitalize">{key}</span>
                  <span className="max-w-[140px] truncate font-mono text-muted-foreground text-xs">
                    {String(value)}
                  </span>
                </div>
              ))}
            {Object.keys(config).length > 3 && (
              <span className="text-muted-foreground/60 text-xs">+{Object.keys(config).length - 3} more</span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar className="size-5 after:rounded-sm [&_[data-slot=avatar-fallback]]:bg-zinc-100 [&_[data-slot=avatar-fallback]]:text-zinc-700 dark:[&_[data-slot=avatar-fallback]]:bg-zinc-500/15 dark:[&_[data-slot=avatar-fallback]]:text-zinc-300">
                <AvatarFallback className="rounded-sm text-[10px]">{getInitials(typeConfig.label)}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">{typeConfig.label} node</span>
            </div>
          </div>
        )}

        <Separator />

        {/* Footer: Status + Duration (like kanban footer) */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn("shrink-0 rounded-md border-transparent px-2 font-medium", statusInfo.className)}
          >
            <StatusIcon data-icon="inline-start" className={cn("size-3", status === "running" && "animate-spin")} />
            {statusInfo.label}
          </Badge>

          {duration && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              <span className="text-xs">{duration}</span>
            </div>
          )}

          {status === "completed" && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <BadgeCheck className="size-3.5" />
              <span className="font-medium text-xs">Done</span>
            </div>
          )}
        </div>
      </article>

      <Handle type="source" position={Position.Bottom} className="!size-2.5 !border-2 !bg-muted !rounded-full" />
    </div>
  );
});

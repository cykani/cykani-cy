"use client";

import { useState } from "react";
import { CheckCircle2, History, LayoutTemplate, Plus, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import type { Workflow } from "./types";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

const executionHistory = [
  { id: "1", workflow: "Product Scraper", status: "completed", duration: "12.3s", timestamp: "2 min ago" },
  { id: "2", workflow: "Lead Enrichment", status: "completed", duration: "8.7s", timestamp: "5 min ago" },
  { id: "3", workflow: "Price Monitor", status: "error", duration: "3.1s", timestamp: "1 hr ago" },
  { id: "4", workflow: "Job Application Bot", status: "completed", duration: "47.2s", timestamp: "1 hr ago" },
  { id: "5", workflow: "Research Agent", status: "completed", duration: "4m 18s", timestamp: "2 hr ago" },
];

const executionStatusColors: Record<string, string> = {
  completed: "text-emerald-400",
  error: "text-red-400",
  running: "text-blue-400",
};

interface WorkflowSidebarProps {
  workflows: Workflow[];
  selectedId: string;
  onSelectWorkflow: (id: string) => void;
  onNewWorkflow: () => void;
  onOpenTemplates: () => void;
}

export function WorkflowSidebar({
  workflows,
  selectedId,
  onSelectWorkflow,
  onNewWorkflow,
  onOpenTemplates,
}: WorkflowSidebarProps) {
  return (
    <div className="flex h-full w-[260px] shrink-0 flex-col border-r border-[#27272a] bg-[#09090b]">
      {/* Top actions */}
      <div className="flex items-center gap-2 border-b border-[#27272a] p-3">
        <Button
          size="sm"
          variant="outline"
          className="h-7 flex-1 border-[#27272a] bg-[#18181b] text-xs hover:bg-[#27272a]"
          onClick={onNewWorkflow}
        >
          <Plus className="mr-1 size-3" />
          New
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 flex-1 border-[#27272a] bg-[#18181b] text-xs hover:bg-[#27272a]"
          onClick={onOpenTemplates}
        >
          <LayoutTemplate className="mr-1 size-3" />
          Templates
        </Button>
      </div>

      {/* Workflow list */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Workflows
        </p>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1.5 pb-2">
          {workflows.map((workflow) => {
            const isSelected = selectedId === workflow.id;
            return (
              <div
                key={workflow.id}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 transition-all duration-150",
                  isSelected
                    ? "border-primary/60 bg-primary/5"
                    : "border-[#27272a] bg-[#18181b] hover:bg-[#1c1c1e] hover:border-[#3f3f46]",
                )}
                onClick={() => onSelectWorkflow(workflow.id)}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">{workflow.name}</span>
                  <Badge
                    className={cn("shrink-0 px-1.5 py-0 text-[9px]", statusColors[workflow.status])}
                    variant="outline"
                  >
                    {workflow.status}
                  </Badge>
                </div>
                <p className="mb-1.5 line-clamp-1 text-muted-foreground text-[11px]">
                  {workflow.description}
                </p>
                <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                  <span>{workflow.nodes?.length ?? 0} nodes</span>
                  <span>{workflow.lastRun}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator className="bg-[#27272a]" />

      {/* Execution history */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center gap-1.5">
          <History className="size-3 text-muted-foreground" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Recent Runs
          </p>
        </div>
      </div>

      <ScrollArea className="max-h-[180px] px-2 pb-3">
        <div className="space-y-1">
          {executionHistory.map((exec) => (
            <div
              key={exec.id}
              className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-[#18181b]"
            >
              <div className="flex min-w-0 items-center gap-2">
                {exec.status === "error" ? (
                  <XCircle className="size-3 shrink-0 text-red-400" />
                ) : (
                  <CheckCircle2 className={cn("size-3 shrink-0", executionStatusColors[exec.status])} />
                )}
                <span className="truncate text-[11px]">{exec.workflow}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-muted-foreground">
                <span>{exec.duration}</span>
                <span className="text-[#3f3f46]">·</span>
                <span>{exec.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

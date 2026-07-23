"use client";

import { useState } from "react";

import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { ScrollArea } from "@cykani/ui/scroll-area";
import { Separator } from "@cykani/ui/separator";
import { CheckCircle2, History, Pause, Play, PlayIcon, Plus, XCircle } from "lucide-react";

import { sampleWorkflows } from "./data";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  draft: "bg-slate-500/20 text-slate-600 dark:text-slate-400",
  paused: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  error: "bg-red-500/20 text-red-600 dark:text-red-400",
};

const statusIcons: Record<string, typeof Play> = {
  active: Play,
  draft: PlayIcon,
  paused: Pause,
  error: XCircle,
};

const executionHistory = [
  { id: "1", workflow: "Product Scraper", status: "completed", duration: "12.3s", timestamp: "2 min ago" },
  { id: "2", workflow: "Lead Enrichment", status: "completed", duration: "8.7s", timestamp: "5 min ago" },
  { id: "3", workflow: "Price Monitor", status: "error", duration: "3.1s", timestamp: "1 hr ago" },
  { id: "4", workflow: "Product Scraper", status: "completed", duration: "11.8s", timestamp: "1 hr ago" },
  { id: "5", workflow: "Lead Enrichment", status: "completed", duration: "9.2s", timestamp: "2 hr ago" },
];

const executionStatusColors: Record<string, string> = {
  completed: "text-emerald-500",
  error: "text-red-500",
  running: "text-blue-500",
};

export function WorkflowSidebar() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>("1");

  return (
    <div className="flex h-full w-72 flex-col gap-4">
      {/* Workflow List */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Workflows</h3>
        <Button size="sm" variant="outline" className="h-7">
          <Plus className="mr-1 size-3" /> New
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {sampleWorkflows.map((workflow) => {
            const _StatusIcon = statusIcons[workflow.status] ?? Play;
            const isSelected = selectedWorkflow === workflow.id;

            return (
              <div
                key={workflow.id}
                className={cn(
                  "cursor-pointer rounded-xl border p-3 transition-all duration-200",
                  isSelected ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:bg-accent/50 hover:shadow-xs",
                )}
                onClick={() => setSelectedWorkflow(workflow.id)}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="truncate font-medium text-sm">{workflow.name}</span>
                  <Badge className={cn("px-1.5 py-0 text-[10px]", statusColors[workflow.status])} variant="outline">
                    {workflow.status}
                  </Badge>
                </div>
                <p className="mb-2 line-clamp-1 text-muted-foreground text-xs">{workflow.description}</p>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>{workflow.nodes?.length ?? 0} nodes</span>
                  <span>{workflow.lastRun}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* Execution History */}
      <div className="flex items-center gap-2">
        <History className="size-3.5 text-muted-foreground" />
        <span className="font-semibold text-muted-foreground text-xs">Recent Executions</span>
      </div>

      <ScrollArea className="max-h-[200px] flex-1">
        <div className="space-y-1.5">
          {executionHistory.map((exec) => (
            <div
              key={exec.id}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/50"
            >
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2 className={cn("size-3 shrink-0", executionStatusColors[exec.status])} />
                <span className="truncate text-xs">{exec.workflow}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{exec.duration}</span>
                <span className="text-[10px] text-muted-foreground">{exec.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

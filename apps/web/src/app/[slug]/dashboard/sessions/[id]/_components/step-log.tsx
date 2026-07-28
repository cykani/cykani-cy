"use client";

import { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  MousePointer,
  Navigation,
  Search,
  Type,
} from "lucide-react";

import { ScrollArea } from "@/ui/scroll-area";

type StepStatus = "success" | "error" | "pending";
type StepType = "navigate" | "click" | "type" | "extract" | "think" | "wait" | "other";

interface StepEntry {
  id: string;
  index: number;
  type: StepType;
  description: string;
  detail?: string;
  status: StepStatus;
  elapsedMs?: number;
  timestamp: Date;
}

const stepIcon: Record<StepType, React.ElementType> = {
  navigate: Navigation,
  click: MousePointer,
  type: Type,
  extract: Search,
  think: Clock,
  wait: Clock,
  other: ChevronDown,
};

const stepStatusIcon: Record<StepStatus, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  pending: Clock,
};

const stepStatusColor: Record<StepStatus, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  pending: "text-amber-400",
};

// Mock entries for demo — real implementation reads from WS event stream
const mockSteps: StepEntry[] = [
  {
    id: "1",
    index: 1,
    type: "navigate",
    description: "Navigate to URL",
    detail: "https://kayak.com",
    status: "success",
    elapsedMs: 1240,
    timestamp: new Date(Date.now() - 60_000),
  },
  {
    id: "2",
    index: 2,
    type: "click",
    description: "Click search field",
    detail: "role=textbox, label='From'",
    status: "success",
    elapsedMs: 380,
    timestamp: new Date(Date.now() - 58_000),
  },
  {
    id: "3",
    index: 3,
    type: "type",
    description: "Type departure city",
    detail: "Johannesburg",
    status: "success",
    elapsedMs: 920,
    timestamp: new Date(Date.now() - 57_000),
  },
  {
    id: "4",
    index: 4,
    type: "think",
    description: "Waiting for autocomplete",
    status: "pending",
    elapsedMs: undefined,
    timestamp: new Date(Date.now() - 200),
  },
];

function StepItem({ step }: { step: StepEntry }) {
  const TypeIcon = stepIcon[step.type] ?? ChevronDown;
  const StatusIcon = stepStatusIcon[step.status];

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      {/* Step icon */}
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/30">
        <TypeIcon className="size-3 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium leading-tight">{step.description}</p>
          <StatusIcon className={`size-3.5 shrink-0 ${stepStatusColor[step.status]}`} />
        </div>
        {step.detail && (
          <p className="mt-0.5 truncate font-mono text-muted-foreground text-xs">{step.detail}</p>
        )}
        <div className="mt-1 flex items-center gap-2 text-muted-foreground/60 text-[10px]">
          <span>#{step.index}</span>
          {step.elapsedMs != null && <span>{step.elapsedMs}ms</span>}
          <span>{step.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
}

export function StepLog({ sessionId }: { sessionId: string }) {
  const [steps, setSteps] = useState<StepEntry[]>(mockSteps);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new steps
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [steps.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <span className="text-muted-foreground text-xs uppercase tracking-widest">Step Log</span>
        <span className="font-mono text-muted-foreground/60 text-[10px]">{steps.length} steps</span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="divide-y divide-border/40">
          {steps.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-xs">No steps yet</p>
          ) : (
            steps.map((step) => <StepItem key={step.id} step={step} />)
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}

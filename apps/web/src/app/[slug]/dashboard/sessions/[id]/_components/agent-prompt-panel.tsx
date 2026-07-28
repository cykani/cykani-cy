"use client";

import { useState } from "react";

import { ArrowUp, Bot, Loader2, Sparkles, StopCircle } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";

const quickActions = [
  "Take a screenshot",
  "Extract page data",
  "Fill and submit form",
  "Scroll to bottom",
  "Click the main CTA",
];

interface AgentPromptPanelProps {
  sessionId: string;
}

type AgentState = "idle" | "thinking" | "running";

export function AgentPromptPanel({ sessionId }: AgentPromptPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [currentThought, setCurrentThought] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || agentState !== "idle") return;
    const task = prompt.trim();
    setPrompt("");
    setAgentState("thinking");
    setCurrentThought("Analysing the current page state…");

    // Simulated thinking → running transition (real WS integration goes here)
    await new Promise((r) => setTimeout(r, 1200));
    setAgentState("running");
    setCurrentThought(`Executing: "${task}"`);
  };

  const handleStop = () => {
    setAgentState("idle");
    setCurrentThought(null);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-3 border-b border-border/60 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-muted-foreground" />
            <span className="font-medium text-sm">Agent</span>
          </div>
          {agentState !== "idle" && (
            <Badge
              variant="outline"
              className={`gap-1 text-[10px] ${
                agentState === "thinking"
                  ? "border-amber-500/30 text-amber-400"
                  : "border-emerald-500/30 text-emerald-400"
              }`}
            >
              {agentState === "thinking" ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              )}
              {agentState === "thinking" ? "Thinking" : "Running"}
            </Badge>
          )}
        </div>

        {/* Thought stream */}
        {currentThought && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <p className="flex items-start gap-1.5 text-amber-400/90 text-xs leading-relaxed">
              <Sparkles className="mt-0.5 size-3 shrink-0" />
              {currentThought}
            </p>
          </div>
        )}

        {/* Prompt input */}
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Give the agent an instruction…"
            rows={3}
            className="resize-none bg-muted/30 pr-10 text-sm placeholder:text-muted-foreground/50"
            disabled={agentState !== "idle"}
          />
          <div className="absolute right-2 bottom-2">
            {agentState !== "idle" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-7"
                    onClick={handleStop}
                  >
                    <StopCircle className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Stop agent</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                size="icon"
                className="size-7"
                onClick={handleSubmit}
                disabled={!prompt.trim()}
              >
                <ArrowUp className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick actions */}
        {agentState === "idle" && (
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => setPrompt(action)}
                className="rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-muted-foreground text-xs transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

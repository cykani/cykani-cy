"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ScrollArea } from "@/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Separator } from "@/ui/separator";
import { Switch } from "@/ui/switch";
import { Textarea } from "@/ui/textarea";
import type { Node } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  FileOutput,
  GitBranch,
  Globe,
  Play,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import { nodeTemplates } from "./data";
import type { NodeTemplate } from "./types";

const typeIconMap: Record<string, LucideIcon> = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  browser: Globe,
  agent: Bot,
  output: FileOutput,
};

const typeColorMap: Record<string, string> = {
  trigger: "text-emerald-400 bg-emerald-500/10",
  action: "text-blue-400 bg-blue-500/10",
  condition: "text-amber-400 bg-amber-500/10",
  browser: "text-violet-400 bg-violet-500/10",
  agent: "text-orange-400 bg-orange-500/10",
  output: "text-slate-400 bg-slate-500/10",
};

interface NodeConfigPanelProps {
  open: boolean;
  node: Node | null;
  onClose: () => void;
  onApply: (nodeId: string, data: Record<string, unknown>) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeConfigPanel({
  open,
  node,
  onClose,
  onApply,
  onDelete,
}: NodeConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>({});
  const [localLabel, setLocalLabel] = useState("");
  const [localDescription, setLocalDescription] = useState("");

  // Sync state when node changes
  useEffect(() => {
    if (node) {
      setLocalConfig((node.data.config as Record<string, unknown>) ?? {});
      setLocalLabel((node.data.label as string) ?? "");
      setLocalDescription((node.data.description as string) ?? "");
    }
  }, [node]);

  if (!open || !node) return null;

  const nodeType = (node.data.nodeType as string) ?? "action";
  const TypeIcon = typeIconMap[nodeType] ?? Zap;
  const colorClass = typeColorMap[nodeType] ?? typeColorMap.action;

  // Find matching template for config fields
  const template: NodeTemplate | undefined = nodeTemplates.find(
    (t) =>
      t.type === nodeType &&
      t.label.toLowerCase() === (node.data.label as string)?.toLowerCase(),
  ) ?? nodeTemplates.find((t) => t.type === nodeType);

  const configFields = template?.configFields ?? [];

  const handleApply = () => {
    onApply(node.id, {
      label: localLabel,
      description: localDescription,
      config: localConfig,
    });
  };

  const handleFieldChange = (key: string, value: unknown) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={cn(
        "flex h-full w-[320px] shrink-0 flex-col border-l border-[#27272a] bg-[#0f0f10] transition-all duration-200",
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#27272a] p-4">
        <div className="flex items-center gap-2">
          <div className={cn("flex size-7 items-center justify-center rounded-lg", colorClass)}>
            <TypeIcon className="size-3.5" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{localLabel || "Node Config"}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{nodeType} node</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-7 hover:bg-[#27272a]"
          onClick={onClose}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="space-y-5 p-4">
          {/* Basic info */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Label
              </Label>
              <Input
                value={localLabel}
                onChange={(e) => setLocalLabel(e.target.value)}
                className="border-[#27272a] bg-[#18181b] text-sm focus-visible:border-[#3f3f46]"
                placeholder="Node label"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </Label>
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                className="min-h-[60px] resize-none border-[#27272a] bg-[#18181b] text-sm focus-visible:border-[#3f3f46]"
                placeholder="Node description"
              />
            </div>
          </div>

          {configFields.length > 0 && (
            <>
              <Separator className="bg-[#27272a]" />
              <div className="space-y-4">
                <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
                  Configuration
                </p>
                {configFields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{field.label}</Label>
                    {field.type === "text" && (
                      <Input
                        value={(localConfig[field.key] as string) ?? ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="border-[#27272a] bg-[#18181b] text-sm focus-visible:border-[#3f3f46]"
                      />
                    )}
                    {field.type === "number" && (
                      <Input
                        type="number"
                        value={(localConfig[field.key] as number) ?? field.defaultValue ?? ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, Number(e.target.value))
                        }
                        placeholder={field.placeholder}
                        className="border-[#27272a] bg-[#18181b] text-sm focus-visible:border-[#3f3f46]"
                      />
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        value={(localConfig[field.key] as string) ?? ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="min-h-[80px] resize-none border-[#27272a] bg-[#18181b] text-sm focus-visible:border-[#3f3f46]"
                      />
                    )}
                    {field.type === "select" && field.options && (
                      <Select
                        value={
                          (localConfig[field.key] as string) ??
                          (field.defaultValue as string) ??
                          ""
                        }
                        onValueChange={(val) => handleFieldChange(field.key, val)}
                      >
                        <SelectTrigger className="w-full border-[#27272a] bg-[#18181b] text-sm focus-visible:border-[#3f3f46]">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent className="border-[#27272a] bg-[#18181b]">
                          {field.options.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-sm">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {field.type === "toggle" && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={
                            (localConfig[field.key] as boolean) ??
                            (field.defaultValue as boolean) ??
                            false
                          }
                          onCheckedChange={(val) => handleFieldChange(field.key, val)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {(localConfig[field.key] as boolean) ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Variable interpolation hint */}
          <Separator className="bg-[#27272a]" />
          <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-3">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Variable Interpolation
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use{" "}
              <code className="rounded bg-[#27272a] px-1 py-0.5 font-mono text-[10px] text-zinc-300">
                {"{{stepN.output}}"}
              </code>{" "}
              to reference previous step outputs in any field.
            </p>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-[#27272a] p-4">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
          onClick={handleApply}
        >
          Apply Changes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={() => onDelete(node.id)}
        >
          <Trash2 className="mr-1.5 size-3.5" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}

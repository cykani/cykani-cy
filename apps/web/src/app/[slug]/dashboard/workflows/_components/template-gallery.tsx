"use client";

import { useState } from "react";
import {
  Briefcase, CalendarCheck, CheckCircle2, ChevronRight,
  Clock, FileText, Layers, LayoutTemplate, Search, Sparkles, X, Zap,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { workflowTemplates, type WorkflowTemplate } from "./data";

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Search,
  FileText,
  CalendarCheck,
  Layers,
  Zap,
  Sparkles,
};

const CATEGORY_FILTERS = [
  { id: "all", label: "All Templates" },
  { id: "jobs", label: "Job Applications" },
  { id: "research", label: "Research" },
  { id: "forms", label: "Data Entry" },
  { id: "booking", label: "Booking" },
  { id: "scraping", label: "Scraping" },
] as const;

function TemplateCard({
  template,
  onUse,
  selected,
  onSelect,
}: {
  template: WorkflowTemplate;
  onUse: (t: WorkflowTemplate) => void;
  selected: boolean;
  onSelect: (t: WorkflowTemplate) => void;
}) {
  const Icon = ICON_MAP[template.icon] ?? Zap;

  return (
    <div
      onClick={() => onSelect(template)}
      className={`group cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
        selected
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
          : "border-[#27272a] bg-[#18181b] hover:border-[#3f3f46] hover:bg-[#1c1c1e]"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${template.categoryColor}`}>
          <Icon className="size-4" />
        </div>
        <Badge className={`text-[10px] border ${template.categoryColor}`} variant="outline">
          {template.categoryLabel}
        </Badge>
      </div>

      {/* Name + description */}
      <h3 className="mb-1 font-semibold text-sm leading-tight">{template.name}</h3>
      <p className="mb-3 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
        {template.description}
      </p>

      {/* Stats row */}
      <div className="mb-3 flex items-center gap-3 text-muted-foreground text-[10px]">
        <span className="flex items-center gap-1">
          <Layers className="size-3" />
          {template.nodes.length} nodes
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {template.estimatedTime}
        </span>
      </div>

      {/* Use cases */}
      <div className="space-y-1">
        {template.useCases.slice(0, 2).map((uc) => (
          <div key={uc} className="flex items-center gap-1.5">
            <CheckCircle2 className="size-2.5 shrink-0 text-emerald-400/60" />
            <span className="truncate text-[10px] text-muted-foreground/70">{uc}</span>
          </div>
        ))}
      </div>

      {/* Use button — visible on hover/select */}
      <div className={`mt-3 transition-opacity ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <Button
          size="sm"
          className="h-7 w-full gap-1.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onUse(template);
          }}
        >
          Use Template
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function DetailPanel({ template, onUse }: { template: WorkflowTemplate; onUse: (t: WorkflowTemplate) => void }) {
  const Icon = ICON_MAP[template.icon] ?? Zap;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl border text-lg ${template.categoryColor}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <h2 className="font-bold text-base leading-tight">{template.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            <Badge className={`text-[10px] border ${template.categoryColor}`} variant="outline">
              {template.categoryLabel}
            </Badge>
            <span className="text-muted-foreground text-xs">{template.estimatedTime}</span>
          </div>
        </div>
      </div>

      <Separator className="bg-[#27272a]" />

      <ScrollArea className="flex-1">
        <div className="space-y-5 p-5">
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed">{template.description}</p>

          {/* Use cases */}
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Use Cases
            </p>
            <div className="space-y-2">
              {template.useCases.map((uc) => (
                <div key={uc} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                  <span className="text-sm">{uc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node flow preview */}
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Workflow Steps ({template.nodes.length})
            </p>
            <div className="space-y-1.5">
              {template.nodes.map((node, i) => {
                const typeColors: Record<string, string> = {
                  trigger: "text-emerald-400 bg-emerald-400/10",
                  browser: "text-violet-400 bg-violet-400/10",
                  agent: "text-orange-400 bg-orange-400/10",
                  condition: "text-amber-400 bg-amber-400/10",
                  action: "text-blue-400 bg-blue-400/10",
                  output: "text-slate-400 bg-slate-400/10",
                };
                const color = typeColors[node.type] ?? typeColors.action;
                return (
                  <div key={node.id} className="flex items-start gap-3 rounded-lg border border-[#27272a] bg-[#0a0a0b] px-3 py-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#27272a] font-mono text-[10px] text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${color}`}>
                          {node.type}
                        </span>
                        <span className="truncate font-medium text-xs">{node.label}</span>
                      </div>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{node.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-[#27272a] p-4">
        <Button className="w-full gap-2 font-semibold" onClick={() => onUse(template)}>
          <Zap className="size-4" />
          Use This Template
        </Button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Creates a new workflow with all nodes pre-configured
        </p>
      </div>
    </div>
  );
}

interface TemplateGalleryProps {
  open: boolean;
  onClose: () => void;
  onUseTemplate: (template: WorkflowTemplate) => void;
}

export function TemplateGallery({ open, onClose, onUseTemplate }: TemplateGalleryProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate>(workflowTemplates[0]!);

  const filtered = workflowTemplates.filter((t) => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.useCases.some((uc) => uc.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUse = (template: WorkflowTemplate) => {
    onUseTemplate(template);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex h-[85vh] max-w-5xl flex-col gap-0 border-[#27272a] bg-[#0a0a0b] p-0">
        <DialogHeader className="flex-row items-center justify-between border-b border-[#27272a] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <LayoutTemplate className="size-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Workflow Templates</DialogTitle>
              <p className="text-muted-foreground text-xs">Pre-built automation for high-value use cases</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left: filters + grid */}
          <div className="flex w-[55%] shrink-0 flex-col border-r border-[#27272a]">
            {/* Search + filter */}
            <div className="border-b border-[#27272a] p-4 space-y-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates…"
                  className="border-[#27272a] bg-[#18181b] pl-9 text-sm focus-visible:border-[#3f3f46]"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      categoryFilter === f.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-[#27272a] bg-[#18181b] text-muted-foreground hover:bg-[#27272a] hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 gap-3 p-4">
                {filtered.length === 0 ? (
                  <p className="col-span-2 py-12 text-center text-muted-foreground text-sm">
                    No templates match your search
                  </p>
                ) : (
                  filtered.map((t) => (
                    <TemplateCard
                      key={t.id}
                      template={t}
                      selected={selectedTemplate.id === t.id}
                      onSelect={setSelectedTemplate}
                      onUse={handleUse}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right: detail panel */}
          <div className="min-w-0 flex-1 bg-[#0f0f10]">
            <DetailPanel template={selectedTemplate} onUse={handleUse} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

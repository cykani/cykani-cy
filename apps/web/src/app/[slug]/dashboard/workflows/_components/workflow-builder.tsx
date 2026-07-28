"use client";

import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import type { Node } from "@xyflow/react";
import { Play, Save } from "lucide-react";
import { toast } from "sonner";

import { sampleNodes, sampleEdges, sampleWorkflows } from "./data";
import type { Workflow } from "./types";
import type { WorkflowTemplate } from "./data";
import { WorkflowCanvas } from "./workflow-canvas";
import { NodeConfigPanel } from "./node-config-panel";
import { WorkflowSidebar } from "./workflow-sidebar";
import { TemplateGallery } from "./template-gallery";

const statusBadgeColor: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

function buildCanvasNodes(wf: Workflow): Node[] {
  const nodes = wf.nodes.length > 0 ? wf.nodes : sampleNodes;
  return nodes.map((n, i) => ({
    id: n.id,
    type: "workflowNode",
    position: { x: 250 + (i % 3) * 360, y: Math.floor(i / 3) * 260 + 60 },
    data: {
      nodeType: n.type,
      label: n.label,
      description: n.description,
      config: n.config,
      status: n.status,
      duration: n.duration,
    },
    selected: false,
  }));
}

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [workflowName, setWorkflowName] = useState<string>("Product Scraper");
  const [isRunning, setIsRunning] = useState(false);

  // Canvas state
  const [canvasNodes, setCanvasNodes] = useState<Node[]>(() =>
    buildCanvasNodes(sampleWorkflows[0]),
  );
  const [canvasEdges, setCanvasEdges] = useState(
    sampleEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: "smoothstep",
      animated: e.type === "yes",
      style: { strokeWidth: 1.5, stroke: "#3f3f46" },
      labelStyle: { fill: "#fafafa", fontSize: 11, fontWeight: 500 },
      labelBgStyle: { fill: "#18181b", fillOpacity: 0.9 },
      labelBgPadding: [4, 8] as [number, number],
      labelBgBorderRadius: 4,
    })),
  );

  // Config panel
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const activeWorkflow = workflows.find((w) => w.id === selectedId);

  // Switch workflow
  const handleSelectWorkflow = useCallback(
    (id: string) => {
      setSelectedId(id);
      const wf = workflows.find((w) => w.id === id);
      if (!wf) return;
      setWorkflowName(wf.name);
      setCanvasNodes(buildCanvasNodes(wf));
      const edges = wf.edges.length > 0 ? wf.edges : id === "1" ? sampleEdges : [];
      setCanvasEdges(
        edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          type: "smoothstep",
          animated: e.type === "yes",
          style: { strokeWidth: 1.5, stroke: "#3f3f46" },
          labelStyle: { fill: "#fafafa", fontSize: 11, fontWeight: 500 },
          labelBgStyle: { fill: "#18181b", fillOpacity: 0.9 },
          labelBgPadding: [4, 8] as [number, number],
          labelBgBorderRadius: 4,
        })),
      );
      setSelectedNode(null);
      setConfigOpen(false);
    },
    [workflows],
  );

  // New workflow
  const handleNewWorkflow = useCallback(() => {
    const id = `wf-${Date.now()}`;
    const newWf: Workflow = {
      id,
      name: "Untitled Workflow",
      description: "A new workflow",
      status: "draft",
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      lastRun: "Never",
      runCount: 0,
    };
    setWorkflows((prev) => [newWf, ...prev]);
    setSelectedId(id);
    setWorkflowName("Untitled Workflow");
    setCanvasNodes([]);
    setCanvasEdges([]);
    setSelectedNode(null);
    setConfigOpen(false);
  }, []);

  // Node select → open config panel
  const handleNodeSelect = useCallback((node: Node) => {
    setSelectedNode(node);
    setConfigOpen(true);
  }, []);

  // Apply config changes
  const handleApplyConfig = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setCanvasNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n,
        ),
      );
      setSelectedNode((prev) =>
        prev && prev.id === nodeId
          ? { ...prev, data: { ...prev.data, ...newData } }
          : prev,
      );
    },
    [],
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setCanvasNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setCanvasEdges((prev) =>
        prev.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      setSelectedNode(null);
      setConfigOpen(false);
    },
    [],
  );

  // Run simulation
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);

    // Set all to idle first
    setCanvasNodes((prev) =>
      prev.map((n) => ({ ...n, data: { ...n.data, status: "idle" } })),
    );

    // Simulate running each node
    const nodeIds = canvasNodes.map((n) => n.id);
    for (const id of nodeIds) {
      setCanvasNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, status: "running" } } : n,
        ),
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCanvasNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, status: "completed" } } : n,
        ),
      );
    }
    setIsRunning(false);
    toast.success("Workflow completed successfully");
  }, [isRunning, canvasNodes]);

  // Save
  const handleSave = useCallback(() => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === selectedId
          ? { ...w, name: workflowName, updatedAt: new Date().toISOString().slice(0, 10) }
          : w,
      ),
    );
    toast.success("Workflow saved");
  }, [selectedId, workflowName]);

  // Use template — creates a new workflow from template
  const handleUseTemplate = useCallback((template: WorkflowTemplate) => {
    const id = `wf-${Date.now()}`;
    const edgeStyle = { strokeWidth: 1.5, stroke: "#3f3f46" };
    const newWf: Workflow = {
      id,
      name: template.name,
      description: template.description,
      status: "draft",
      nodes: template.nodes,
      edges: template.edges,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      lastRun: "Never",
      runCount: 0,
    };
    setWorkflows((prev) => [newWf, ...prev]);
    setSelectedId(id);
    setWorkflowName(template.name);
    setCanvasNodes(
      template.nodes.map((n, i) => ({
        id: n.id,
        type: "workflowNode",
        position: { x: 220 + (i % 3) * 360, y: Math.floor(i / 3) * 260 + 80 },
        data: {
          nodeType: n.type,
          label: n.label,
          description: n.description,
          config: n.config ?? {},
          status: "idle",
          duration: n.duration,
        },
        selected: false,
      })),
    );
    setCanvasEdges(
      template.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: "smoothstep",
        animated: e.type === "yes",
        style: e.type === "yes" ? { strokeWidth: 1.5, stroke: "#6366f1" } : edgeStyle,
        labelStyle: { fill: "#fafafa", fontSize: 11, fontWeight: 500 },
        labelBgStyle: { fill: "#18181b", fillOpacity: 0.9 },
        labelBgPadding: [4, 8] as [number, number],
        labelBgBorderRadius: 4,
      })),
    );
    setSelectedNode(null);
    setConfigOpen(false);
    toast.success(`Template "${template.name}" loaded`);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#09090b]">
      {/* Top Bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#27272a] px-4">
        <div className="flex items-center gap-3">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="h-8 w-52 border-transparent bg-transparent px-2 font-semibold text-sm focus-visible:border-[#3f3f46] focus-visible:bg-[#18181b]"
          />
          {activeWorkflow && (
            <Badge
              variant="outline"
              className={cn("text-[10px]", statusBadgeColor[activeWorkflow.status])}
            >
              {activeWorkflow.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-[#27272a] bg-[#18181b] text-sm hover:bg-[#27272a]"
            onClick={handleSave}
          >
            <Save className="mr-1.5 size-3.5" />
            Save
          </Button>
          <Button
            size="sm"
            className="h-8 bg-emerald-600 text-sm hover:bg-emerald-700"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play className="mr-1.5 size-3.5" />
            {isRunning ? "Running…" : "Run"}
          </Button>
        </div>
      </div>

      {/* Body: sidebar | canvas | config panel */}
      <div className="flex min-h-0 flex-1">
        {/* Left Sidebar */}
        <WorkflowSidebar
          workflows={workflows}
          selectedId={selectedId}
          onSelectWorkflow={handleSelectWorkflow}
          onNewWorkflow={handleNewWorkflow}
          onOpenTemplates={() => setGalleryOpen(true)}
        />

        {/* Canvas */}
        <div className="relative min-w-0 flex-1">
          <WorkflowCanvas
            nodes={canvasNodes}
            edges={canvasEdges}
            onNodesChange={setCanvasNodes}
            onEdgesChange={setCanvasEdges}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Config Panel */}
        <NodeConfigPanel
          open={configOpen}
          node={selectedNode}
          onClose={() => setConfigOpen(false)}
          onApply={handleApplyConfig}
          onDelete={handleDeleteNode}
        />
      </div>

      {/* Template Gallery */}
      <TemplateGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}

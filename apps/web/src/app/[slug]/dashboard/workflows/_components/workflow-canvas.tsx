"use client";

import { useCallback, useMemo, useRef } from "react";

import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  type NodeMouseHandler,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { WorkflowNode } from "./workflow-node";
import { WorkflowToolbar } from "./workflow-toolbar";

const edgeStyle = {
  strokeWidth: 1.5,
  stroke: "#3f3f46",
};

const animatedEdgeStyle = {
  strokeWidth: 1.5,
  stroke: "#6366f1",
};

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onNodeSelect: (node: Node) => void;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), []);

  const onConnect = useCallback(
    (params: Connection) =>
      onEdgesChange(
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: false,
            style: edgeStyle,
            labelStyle: { fill: "#fafafa", fontSize: 11, fontWeight: 500 },
            labelBgStyle: { fill: "#18181b", fillOpacity: 0.9 },
            labelBgPadding: [4, 8] as [number, number],
            labelBgBorderRadius: 4,
          },
          edges,
        ),
      ),
    [edges, onEdgesChange],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/reactflow-label");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: "workflowNode",
        position,
        data: {
          nodeType: type,
          label: label || type,
          description: `New ${label || type} node`,
          config: {},
          status: "idle",
        },
      };

      onNodesChange([...nodes, newNode]);
    },
    [screenToFlowPosition, nodes, onNodesChange],
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeSelect(node);
    },
    [onNodeSelect],
  );

  // Sync node selection state
  const handleNodesChange = useCallback(
    (changes: import("@xyflow/react").NodeChange[]) => {
      let updated = [...nodes];
      for (const change of changes) {
        if (change.type === "position" && change.position) {
          updated = updated.map((n) =>
            n.id === change.id ? { ...n, position: change.position! } : n,
          );
        } else if (change.type === "select") {
          updated = updated.map((n) =>
            n.id === change.id ? { ...n, selected: change.selected } : n,
          );
        } else if (change.type === "remove") {
          updated = updated.filter((n) => n.id !== change.id);
        }
      }
      onNodesChange(updated);
    },
    [nodes, onNodesChange],
  );

  const handleEdgesChange = useCallback(
    (changes: import("@xyflow/react").EdgeChange[]) => {
      let updated = [...edges];
      for (const change of changes) {
        if (change.type === "remove") {
          updated = updated.filter((e) => e.id !== change.id);
        }
      }
      onEdgesChange(updated);
    },
    [edges, onEdgesChange],
  );

  // Build edges with proper styling
  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        style: e.animated ? animatedEdgeStyle : edgeStyle,
        labelStyle: e.labelStyle ?? { fill: "#fafafa", fontSize: 11, fontWeight: 500 },
        labelBgStyle: e.labelBgStyle ?? { fill: "#18181b", fillOpacity: 0.9 },
        labelBgPadding: e.labelBgPadding ?? ([4, 8] as [number, number]),
        labelBgBorderRadius: e.labelBgBorderRadius ?? 4,
      })),
    [edges],
  );

  return (
    <div ref={reactFlowWrapper} className="relative h-full w-full bg-[#0a0a0b]">
      {/* Floating node palette toolbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="pointer-events-auto">
          <WorkflowToolbar />
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        className="bg-[#0a0a0b]"
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: edgeStyle,
        }}
        connectionLineStyle={edgeStyle}
        snapToGrid
        snapGrid={[16, 16]}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#27272a"
        />
        <Controls
          showInteractive={false}
          className="!rounded-lg !border !border-[#27272a] !bg-[#18181b] !shadow-xs"
        />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!rounded-lg !border !border-[#27272a] !bg-[#18181b] !shadow-xs"
          maskColor="rgba(9,9,11,0.8)"
          nodeColor="#3f3f46"
        />
      </ReactFlow>
    </div>
  );
}

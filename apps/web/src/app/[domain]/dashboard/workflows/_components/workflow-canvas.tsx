"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { sampleEdges, sampleNodes } from "./data";
import { WorkflowNode } from "./workflow-node";

const edgeStyle = {
  strokeWidth: 2,
  stroke: "hsl(var(--muted-foreground))",
};

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>(
    sampleNodes.map((n, i) => ({
      id: n.id,
      type: "workflowNode",
      position: { x: 250 + (i % 3) * 350, y: Math.floor(i / 3) * 250 + 50 },
      data: {
        nodeType: n.type,
        label: n.label,
        description: n.description,
        config: n.config,
        status: n.status,
        duration: n.duration,
      },
      selected: false,
    })),
  );

  const [edges, setEdges] = useState<Edge[]>(
    sampleEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: "smoothstep",
      animated: e.type === "yes",
      style: edgeStyle,
      labelStyle: { fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 },
      labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
      labelBgPadding: [4, 8] as [number, number],
      labelBgBorderRadius: 4,
    })),
  );

  const nodeTypes = useMemo(() => ({ workflowNode: WorkflowNode }), []);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: false,
            style: edgeStyle,
            labelStyle: { fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 500 },
            labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.9 },
            labelBgPadding: [4, 8] as [number, number],
            labelBgBorderRadius: 4,
          },
          eds,
        ),
      ),
    [],
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
        id: `${Date.now()}`,
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

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition],
  );

  return (
    <div ref={reactFlowWrapper} className="h-[700px] w-full rounded-xl border bg-background shadow-xs">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-background"
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: edgeStyle,
        }}
        connectionLineStyle={edgeStyle}
        snapToGrid
        snapGrid={[16, 16]}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="!opacity-30" />
        <Controls showInteractive={false} className="!rounded-lg !border !shadow-xs" />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!rounded-lg !border !shadow-xs"
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
    </div>
  );
}

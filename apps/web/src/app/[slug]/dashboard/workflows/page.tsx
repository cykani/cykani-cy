"use client";

import { ReactFlowProvider } from "@xyflow/react";

import { WorkflowBuilder } from "./_components/workflow-builder";

export default function WorkflowsPage() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
}

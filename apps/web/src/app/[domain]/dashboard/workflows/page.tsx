"use client";

import { ReactFlowProvider } from "@xyflow/react";

import { ComingSoonOverlay } from "../_components/coming-soon-overlay";
import { WorkflowCanvas } from "./_components/workflow-canvas";
import { WorkflowSidebar } from "./_components/workflow-sidebar";
import { WorkflowToolbar } from "./_components/workflow-toolbar";

export default function WorkflowsPage() {
  return (
    <ComingSoonOverlay>
      <ReactFlowProvider>
        <div className="@container/main flex h-[calc(100vh-8rem)] flex-col gap-4 md:gap-6">
          <WorkflowToolbar />
          <div className="flex min-h-0 flex-1 gap-4">
            <WorkflowSidebar />
            <div className="min-w-0 flex-1">
              <WorkflowCanvas />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </ComingSoonOverlay>
  );
}

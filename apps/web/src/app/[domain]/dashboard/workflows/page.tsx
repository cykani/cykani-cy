"use client";

import { ReactFlowProvider } from "@xyflow/react";

import { WorkflowCanvas } from "./_components/workflow-canvas";
import { WorkflowSidebar } from "./_components/workflow-sidebar";
import { WorkflowToolbar } from "./_components/workflow-toolbar";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default function WorkflowsPage() {
  return (
    <ComingSoonOverlay>
      <ReactFlowProvider>
        <div className="@container/main flex flex-col gap-4 md:gap-6 h-[calc(100vh-8rem)]">
          <WorkflowToolbar />
          <div className="flex gap-4 flex-1 min-h-0">
            <WorkflowSidebar />
            <div className="flex-1 min-w-0">
              <WorkflowCanvas />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </ComingSoonOverlay>
  );
}

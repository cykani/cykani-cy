export type NodeType = "trigger" | "action" | "condition" | "browser" | "agent" | "output";
export type NodeStatus = "idle" | "running" | "completed" | "error" | "waiting";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  config: Record<string, unknown>;
  status: NodeStatus;
  duration?: string;
  error?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: "default" | "yes" | "no";
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: "draft" | "active" | "paused" | "error";
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  runCount?: number;
}

export interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: "triggers" | "actions" | "logic" | "browser" | "ai" | "output";
  configFields: Array<{
    key: string;
    label: string;
    type: "text" | "select" | "textarea" | "number" | "toggle";
    placeholder?: string;
    options?: string[];
    defaultValue?: unknown;
  }>;
}

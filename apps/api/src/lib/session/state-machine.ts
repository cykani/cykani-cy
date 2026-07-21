export const SessionStatus = {
  IDLE: "idle",
  LAUNCHING: "launching",
  RUNNING: "running",
  STOPPING: "stopping",
  STOPPED: "stopped",
  ERROR: "error",
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

const VALID_TRANSITIONS: Record<SessionStatus, SessionStatus[]> = {
  idle: ["launching", "error"],
  launching: ["running", "error"],
  running: ["stopping", "error"],
  stopping: ["stopped", "error"],
  stopped: ["launching", "idle"],
  error: ["idle", "launching"],
};

export function canTransition(from: SessionStatus, to: SessionStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transition(from: SessionStatus, to: SessionStatus): SessionStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid session transition: ${from} → ${to}`);
  }
  return to;
}

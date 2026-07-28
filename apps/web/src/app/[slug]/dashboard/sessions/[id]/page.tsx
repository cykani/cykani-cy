import { AgentPromptPanel } from "./_components/agent-prompt-panel";
import { SessionMeta } from "./_components/session-meta";
import { StepLog } from "./_components/step-log";
import { VNCViewer } from "./_components/vnc-viewer";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id, slug } = await params;

  return (
    <div className="@container/main flex h-[calc(100vh-theme(spacing.24))] flex-col gap-0 overflow-hidden rounded-xl border border-border/60">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 bg-card/80 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="size-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_2px_#34d39980]" />
          <span className="font-mono text-muted-foreground text-xs">
            session / <span className="text-foreground">{id.slice(0, 12)}</span>
          </span>
        </div>
        <SessionMeta sessionId={id} />
      </div>

      {/* Main 3-column layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* VNC viewport — main canvas */}
        <div className="flex min-w-0 flex-1 flex-col">
          <VNCViewer sessionId={id} />
        </div>

        {/* Right panel */}
        <div className="flex w-80 shrink-0 flex-col border-l border-border/60 bg-card/60">
          {/* Agent prompt input */}
          <AgentPromptPanel sessionId={id} />

          {/* Step log feed */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <StepLog sessionId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { SessionActions } from "./_components/session-actions";
import { SessionInfo } from "./_components/session-info";
import { VNCViewer } from "./_components/vnc-viewer";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Session {id}</h1>
          <p className="text-muted-foreground">Browser session details and VNC viewer</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VNCViewer sessionId={id} />
        </div>
        <div className="space-y-4">
          <SessionInfo sessionId={id} />
          <SessionActions sessionId={id} />
        </div>
      </div>
    </div>
  );
}

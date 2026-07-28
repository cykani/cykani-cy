import { api } from "@/lib/api/client";

import { LaunchBrowserModal } from "./_components/launch-browser-modal";
import { SessionList } from "./_components/session-list";
import { SessionStats } from "./_components/session-stats";

export default async function SessionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let sessions: any[] = [];
  try {
    const data = await api.sessions.list({ limit: 20 });
    sessions = data.sessions;
  } catch {
    // Use empty array if API unavailable
  }

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Browser Sessions</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Launch stealth Chromium sessions and observe them live.
          </p>
        </div>
        <LaunchBrowserModal />
      </div>

      <SessionStats sessions={sessions} />
      <SessionList sessions={sessions} slug={slug} />
    </div>
  );
}

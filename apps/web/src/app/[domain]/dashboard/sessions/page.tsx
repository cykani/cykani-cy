import { api } from "@cykani/lib/api/client";

import { SessionList } from "./_components/session-list";
import { SessionStats } from "./_components/session-stats";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default async function SessionsPage() {
  let sessions: any[] = [];
  try {
    const data = await api.sessions.list({ limit: 20 });
    sessions = data.sessions;
  } catch {
    // Use empty array if API unavailable
  }

  return (
    <ComingSoonOverlay>
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <SessionStats sessions={sessions} />
        <SessionList sessions={sessions} />
      </div>
    </ComingSoonOverlay>
  );
}

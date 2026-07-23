import { api } from "@/lib/api/client";

import { ComingSoonOverlay } from "../_components/coming-soon-overlay";
import { AgentList } from "./_components/agent-list";
import { AgentStats } from "./_components/agent-stats";

export default async function AgentsPage() {
  let agents: any[] = [];
  try {
    const data = await api.agents.list({ limit: 20 });
    agents = data.agents;
  } catch {
    // Use empty array if API unavailable
  }

  return (
    <ComingSoonOverlay>
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <AgentStats agents={agents} />
        <AgentList agents={agents} />
      </div>
    </ComingSoonOverlay>
  );
}

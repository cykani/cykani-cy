import { api } from "@cykani/lib/api/client";

import { ProxyGrid } from "./_components/proxy-grid";
import { ProxyStats } from "./_components/proxy-stats";
import { ComingSoonOverlay } from "../_components/coming-soon-overlay";

export default async function ProxiesPage() {
  let proxies: any[] = [];
  try {
    const data = await api.proxies.list({ limit: 20 });
    proxies = data.proxies;
  } catch {
    // Use empty array if API unavailable
  }

  return (
    <ComingSoonOverlay>
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <ProxyStats proxies={proxies} />
        <ProxyGrid proxies={proxies} />
      </div>
    </ComingSoonOverlay>
  );
}

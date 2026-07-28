import { ProxyGrid } from "./_components/proxy-grid";
import { ProxyStats } from "./_components/proxy-stats";

export default async function ProxiesPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <ProxyStats proxies={[]} />
      <ProxyGrid proxies={[]} />
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

export function ProxyStats({ proxies = [] }: { proxies?: any[] }) {
  const active = proxies.filter((p) => p.status === "active").length;
  const avgResponse =
    proxies.filter((p) => p.responseTimeMs).reduce((sum, p) => sum + (p.responseTimeMs ?? 0), 0) /
    (proxies.filter((p) => p.responseTimeMs).length || 1);
  const countries = new Set(proxies.map((p) => p.country).filter(Boolean)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Proxies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{proxies.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(avgResponse)}ms</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{countries}</div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-500",
  inactive: "bg-gray-500/20 text-gray-500",
  error: "bg-red-500/20 text-red-500",
};

const protocolColors: Record<string, string> = {
  http: "bg-blue-500/20 text-blue-500",
  https: "bg-purple-500/20 text-purple-500",
  socks5: "bg-orange-500/20 text-orange-500",
};

export function ProxyGrid({ proxies = [] }: { proxies?: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proxies</CardTitle>
      </CardHeader>
      <CardContent>
        {proxies.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">No proxies yet.</p>
        ) : (
          <div className="space-y-4">
            {proxies.map((proxy) => (
              <div key={proxy.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[proxy.status] ?? "bg-gray-500/20 text-gray-500"}>{proxy.status}</Badge>
                  <div>
                    <p className="font-medium">{proxy.name}</p>
                    <p className="font-mono text-muted-foreground text-sm">{proxy.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={protocolColors[proxy.protocol] ?? ""} variant="outline">
                    {proxy.protocol}
                  </Badge>
                  {proxy.country && <span className="text-muted-foreground text-xs">{proxy.country}</span>}
                  {proxy.responseTimeMs && (
                    <span className="text-muted-foreground text-xs">{proxy.responseTimeMs}ms</span>
                  )}
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

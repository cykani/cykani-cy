import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-500",
  running: "bg-blue-500/20 text-blue-500",
  idle: "bg-gray-500/20 text-gray-500",
  failed: "bg-red-500/20 text-red-500",
};

interface Agent {
  id: string;
  status: string;
  task?: { goal?: string };
  steps?: Array<unknown>;
}

export function AgentList({ agents = [] }: { agents?: Agent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Agents</CardTitle>
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">No agents yet.</p>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[agent.status] ?? "bg-gray-500/20 text-gray-500"}>{agent.status}</Badge>
                  <div>
                    <p className="font-medium">{agent.task?.goal ?? "Unnamed agent"}</p>
                    <p className="text-muted-foreground text-sm">{agent.steps?.length ?? 0} steps</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

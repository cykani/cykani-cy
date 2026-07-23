import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

interface Agent {
  id: string;
  status: string;
}

export function AgentStats({ agents = [] }: { agents?: Agent[] }) {
  const running = agents.filter((a) => a.status === "running").length;
  const completed = agents.filter((a) => a.status === "completed").length;
  const failed = agents.filter((a) => a.status === "failed").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{agents.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Running</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-blue-500">{running}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-green-500">{completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-red-500">{failed}</div>
        </CardContent>
      </Card>
    </div>
  );
}

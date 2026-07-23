import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export function SessionStats({ sessions = [] }: { sessions?: any[] }) {
  const running = sessions.filter((s) => s.status === "running").length;
  const idle = sessions.filter((s) => s.status === "idle").length;
  const error = sessions.filter((s) => s.status === "error").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{sessions.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Running</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-green-500">{running}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Idle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-yellow-500">{idle}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl text-red-500">{error}</div>
        </CardContent>
      </Card>
    </div>
  );
}

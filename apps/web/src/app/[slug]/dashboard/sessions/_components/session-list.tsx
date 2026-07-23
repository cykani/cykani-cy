import Link from "next/link";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

const statusColors: Record<string, string> = {
  running: "bg-green-500/20 text-green-500",
  idle: "bg-yellow-500/20 text-yellow-500",
  error: "bg-red-500/20 text-red-500",
  stopped: "bg-gray-500/20 text-gray-500",
  launching: "bg-blue-500/20 text-blue-500",
};

export function SessionList({ sessions = [] }: { sessions?: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">No sessions yet. Create one to get started.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[session.status] ?? "bg-gray-500/20 text-gray-500"}>
                    {session.status}
                  </Badge>
                  <div>
                    <p className="font-medium">{session.profileId}</p>
                    <p className="text-muted-foreground text-sm">
                      {session.startedAt
                        ? `Started ${new Date(session.startedAt).toLocaleTimeString()}`
                        : "Not started"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/sessions/${session.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

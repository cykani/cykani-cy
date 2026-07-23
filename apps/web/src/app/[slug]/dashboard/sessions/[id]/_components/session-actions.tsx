import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export function SessionActions({ sessionId }: { sessionId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          Take Screenshot
        </Button>
        <Button variant="outline" className="w-full justify-start">
          Export Cookies
        </Button>
        <Button variant="outline" className="w-full justify-start">
          View Recording
        </Button>
      </CardContent>
    </Card>
  );
}

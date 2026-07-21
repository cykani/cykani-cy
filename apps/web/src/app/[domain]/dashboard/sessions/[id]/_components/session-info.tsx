import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

export function SessionInfo({ sessionId }: { sessionId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Session Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium">Running</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profile</span>
          <span className="font-medium">Windows Stealth</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">12:34</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CDP Port</span>
          <span className="font-mono text-xs">9222</span>
        </div>
      </CardContent>
    </Card>
  );
}

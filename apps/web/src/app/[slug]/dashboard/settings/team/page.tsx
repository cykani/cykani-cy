import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";

export default function TeamSettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl">Team</h1>
        <p className="text-muted-foreground">Manage your team members and invitations</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Invite and manage team members</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Team management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

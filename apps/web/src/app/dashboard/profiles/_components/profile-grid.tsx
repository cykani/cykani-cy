import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

const platformColors: Record<string, string> = {
  windows: "bg-blue-500/20 text-blue-500",
  macos: "bg-purple-500/20 text-purple-500",
  linux: "bg-orange-500/20 text-orange-500",
  android: "bg-green-500/20 text-green-500",
};

export function ProfileGrid({ profiles = [] }: { profiles?: any[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {profiles.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="py-8 text-center text-muted-foreground">
            No profiles yet. Create one to get started.
          </CardContent>
        </Card>
      ) : (
        profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{profile.name}</CardTitle>
                <Badge className={platformColors[profile.platform] ?? "bg-gray-500/20 text-gray-500"}>
                  {profile.platform}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Seed: {profile.fingerprintSeed}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Clone
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

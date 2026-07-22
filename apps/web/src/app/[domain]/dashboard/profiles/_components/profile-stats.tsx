import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";

export function ProfileStats({ profiles = [] }: { profiles?: any[] }) {
  const windows = profiles.filter((p) => p.platform === "windows").length;
  const macos = profiles.filter((p) => p.platform === "macos").length;
  const linux = profiles.filter((p) => p.platform === "linux").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{profiles.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Windows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{windows}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">macOS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{macos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Linux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{linux}</div>
        </CardContent>
      </Card>
    </div>
  );
}

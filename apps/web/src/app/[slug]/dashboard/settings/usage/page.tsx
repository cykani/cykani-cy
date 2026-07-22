import { SettingsUsage } from "../../settings/_components/settings-usage";

export default function UsageSettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl">Usage</h1>
        <p className="text-muted-foreground">Monitor your current usage and limits</p>
      </div>
      <SettingsUsage />
    </div>
  );
}

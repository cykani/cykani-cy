import { SettingsApiKeys } from "../../settings/_components/settings-api-keys";

export default function ApiKeysSettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys for programmatic access</p>
      </div>
      <SettingsApiKeys />
    </div>
  );
}

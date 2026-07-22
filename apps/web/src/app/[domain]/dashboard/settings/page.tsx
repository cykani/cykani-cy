import { SettingsApiKeys } from "./_components/settings-api-keys";
import { SettingsAppearance } from "./_components/settings-appearance";
import { SettingsEmail } from "./_components/settings-email";
import { SettingsPlan } from "./_components/settings-plan";
import { SettingsUsage } from "./_components/settings-usage";

export default function SettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage your account and API keys</p>
      </div>
      <SettingsAppearance />
      <SettingsApiKeys />
      <SettingsUsage />
      <SettingsEmail />
      <SettingsPlan />
    </div>
  );
}

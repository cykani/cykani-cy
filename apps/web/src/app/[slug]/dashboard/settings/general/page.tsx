import { SettingsProfile } from "./_components/settings-profile";

export default function GeneralSettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl">General</h1>
        <p className="text-muted-foreground">Manage your profile and account settings</p>
      </div>
      <SettingsProfile />
    </div>
  );
}

import { SettingsAppearance } from "../../settings/_components/settings-appearance";

export default function AppearanceSettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl">Appearance</h1>
        <p className="text-muted-foreground">Customize your dashboard look and feel</p>
      </div>
      <SettingsAppearance />
    </div>
  );
}

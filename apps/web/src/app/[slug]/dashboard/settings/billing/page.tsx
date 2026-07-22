import { SettingsPlan } from "../../settings/_components/settings-plan";

export default function BillingSettingsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment methods</p>
      </div>
      <SettingsPlan />
    </div>
  );
}

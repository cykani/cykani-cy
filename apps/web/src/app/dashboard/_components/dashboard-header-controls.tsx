"use client";

import { AccountSwitcher } from "@cykani/ui/layout/sidebar/account-switcher";
import { ThemeSwitcher } from "@cykani/ui/layout/sidebar/theme-switcher";

import { users } from "@/data/users";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function DashboardHeaderControls() {
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  return (
    <>
      <ThemeSwitcher themeMode={themeMode} setThemeMode={setThemeMode} />
      <AccountSwitcher users={users} />
    </>
  );
}

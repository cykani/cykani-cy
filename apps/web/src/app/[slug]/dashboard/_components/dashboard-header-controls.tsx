"use client";

import { useSession, signOut } from "next-auth/react";

import { AccountSwitcher } from "@cykani/ui/layout/sidebar/account-switcher";
import { ThemeSwitcher } from "@cykani/ui/layout/sidebar/theme-switcher";

import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

interface DashboardHeaderControlsProps {
  slug: string;
}

export function DashboardHeaderControls({ slug }: DashboardHeaderControlsProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

  return (
    <>
      <ThemeSwitcher themeMode={themeMode} setThemeMode={setThemeMode} />
      <AccountSwitcher
        slug={slug}
        user={{
          name: user?.name || "User",
          email: user?.email || "",
          image: user?.image || "",
        }}
        onSignOut={() => signOut({ callbackUrl: "/sign-in" })}
      />
    </>
  );
}

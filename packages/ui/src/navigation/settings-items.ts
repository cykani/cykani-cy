import { BarChart3, CreditCard, KeyRound, Palette, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SettingsNavItem {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
}

export const settingsNavItems: SettingsNavItem[] = [
  { id: "general", title: "General", url: "/dashboard/settings/general", icon: User },
  { id: "appearance", title: "Appearance", url: "/dashboard/settings/appearance", icon: Palette },
  { id: "api-keys", title: "API Keys", url: "/dashboard/settings/api-keys", icon: KeyRound },
  { id: "team", title: "Team", url: "/dashboard/settings/team", icon: Users },
  { id: "billing", title: "Billing", url: "/dashboard/settings/billing", icon: CreditCard },
  { id: "usage", title: "Usage", url: "/dashboard/settings/usage", icon: BarChart3 },
];

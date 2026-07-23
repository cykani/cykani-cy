"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { sidebarItems } from "@/ui/navigation/sidebar-items";
import { settingsNavItems } from "@/ui/navigation/settings-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavSettings } from "./nav-settings";
import { NavUser } from "./nav-user";
import { SidebarSupportCard } from "./sidebar-support-card";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  slug: string;
}

export function AppSidebar({ slug, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const isSettings = pathname.startsWith(`/${slug}/dashboard/settings`);
  const { data: session } = useSession();
  const user = session?.user;

  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href={`/${slug}/dashboard`} className="flex items-center gap-2">
                <Image src="/logo_black.png" alt="Cykani" width={32} height={32} className="h-8 w-auto shrink-0" />
                <span className="font-semibold text-base">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isSettings ? (
          <NavSettings items={settingsNavItems} slug={slug} />
        ) : (
          <NavMain items={sidebarItems} slug={slug} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSupportCard />
        <NavUser
          user={{
            name: user?.name || "User",
            email: user?.email || "",
            image: user?.image || "",
          }}
          slug={slug}
          onSignOut={() => signOut({ callbackUrl: "/sign-in" })}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

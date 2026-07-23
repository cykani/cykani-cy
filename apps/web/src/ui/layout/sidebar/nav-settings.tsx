"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import type { SettingsNavItem } from "@/ui/navigation/settings-items";

interface NavSettingsProps {
  items: readonly SettingsNavItem[];
  slug: string;
}

export function NavSettings({ items, slug }: NavSettingsProps) {
  const path = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link prefetch={false} href={`/${slug}/dashboard`} className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroupLabel className="mt-4">Settings</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const href = item.url.startsWith(`/${slug}/`) ? item.url : `/${slug}${item.url}`;
          const isActive = path === href;

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                <Link prefetch={false} href={href}>
                  <Icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

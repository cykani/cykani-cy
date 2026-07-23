"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight, MailIcon, PlusCircleIcon } from "lucide-react";

import { Button } from "@cykani/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@cykani/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@cykani/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@cykani/ui/sidebar";
import { cn } from "@cykani/lib/utils";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainParentItem {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

interface NavMainProps {
  readonly items: readonly NavGroup[];
  readonly slug: string;
}

interface NavItemProps {
  readonly item: NavMainItem;
  readonly isItemActive: (item: NavMainItem) => boolean;
  readonly isSubItemActive: (url: string) => boolean;
  readonly isSubmenuOpen: (item: NavMainParentItem) => boolean;
  readonly prefix: (url: string) => string;
}

interface NavLinkItemProps {
  readonly item: NavMainLinkItem;
  readonly isActive: boolean;
  readonly showIconFallback: boolean;
  readonly prefixedUrl: string;
}

interface NavLinkIconProps {
  readonly item: NavMainLinkItem;
  readonly showFallback: boolean;
}

interface NavDropdownItemProps {
  readonly item: NavMainParentItem;
  readonly isActive: boolean;
  readonly isSubItemActive: (url: string) => boolean;
  readonly prefix: (url: string) => string;
}

interface NavCollapsibleItemProps {
  readonly item: NavMainParentItem;
  readonly isActive: boolean;
  readonly defaultOpen: boolean;
  readonly isSubItemActive: (url: string) => boolean;
  readonly prefix: (url: string) => string;
}

function CollapsedIconFallback({ title }: { title: string }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center rounded-xs font-medium text-[10px] outline">
      {title.slice(0, 1)}
    </span>
  );
}

function hasSubItems(item: NavMainItem): item is NavMainParentItem {
  return "subItems" in item && Boolean((item as NavMainParentItem).subItems?.length);
}

export function NavMain({ items, slug }: NavMainProps) {
  const path = usePathname();

  const prefix = (url: string) => {
    if (url.startsWith(`/${slug}/`) || url.startsWith("/auth/") || url.startsWith("/api/")) return url;
    return `/${slug}${url}`;
  };

  const isItemActive = (item: NavMainItem) => {
    if (hasSubItems(item)) {
      return item.subItems.some((sub) => path.startsWith(prefix(sub.url)));
    }

    return path === prefix(item.url) || path.startsWith(prefix(item.url) + "/");
  };

  const isSubItemActive = (url: string) => {
    return path === prefix(url);
  };

  const isSubmenuOpen = (item: NavMainParentItem) => {
    return item.subItems.some((sub) => path.startsWith(prefix(sub.url)));
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <PlusCircleIcon />
                <span>Quick Create</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
                asChild
              >
                <Link href="./mail" prefetch={false}>
                  <MailIcon />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && (
            <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
              {group.label}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isItemActive={isItemActive}
                  isSubItemActive={isSubItemActive}
                  isSubmenuOpen={isSubmenuOpen}
                  prefix={prefix}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

function NavItem({ item, isItemActive, isSubItemActive, isSubmenuOpen, prefix }: NavItemProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsedDesktop = state === "collapsed" && !isMobile;

  if (!hasSubItems(item)) {
    return <NavLinkItem item={item} isActive={isItemActive(item)} showIconFallback={isCollapsedDesktop} prefixedUrl={prefix(item.url)} />;
  }

  if (isCollapsedDesktop) {
    return <NavDropdownItem item={item} isActive={isItemActive(item)} isSubItemActive={isSubItemActive} prefix={prefix} />;
  }

  return (
    <NavCollapsibleItem
      item={item}
      isActive={isItemActive(item)}
      defaultOpen={isSubmenuOpen(item)}
      isSubItemActive={isSubItemActive}
      prefix={prefix}
    />
  );
}

function NavLinkItem({ item, isActive, showIconFallback, prefixedUrl }: NavLinkItemProps) {
  const disabled = item.disabled;

  if (disabled) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled>
        <NavLinkIcon item={item} showFallback={showIconFallback} />
        <span>{item.title}</span>
      </SidebarMenuButton>
      <NavItemBadge badge={item.badge} />
    </SidebarMenuItem>
  );
}

return (
  <SidebarMenuItem>
    <SidebarMenuButton tooltip={item.title} isActive={isActive} asChild>
      <Link prefetch={false} href={prefixedUrl}>
        <NavLinkIcon item={item} showFallback={showIconFallback} />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
    <NavItemBadge badge={item.badge} />
  </SidebarMenuItem>
);
}

function NavLinkIcon({ item, showFallback }: NavLinkIconProps) {
  const Icon = item.icon;

  if (Icon) {
    return <Icon />;
  }

  if (showFallback) {
    return <CollapsedIconFallback title={item.title} />;
  }

  return null;
}

function NavDropdownItem({ item, isActive, isSubItemActive, prefix }: NavDropdownItemProps) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled>
          {Icon ? <Icon /> : <CollapsedIconFallback title={item.title} />}
          <span>{item.title}</span>
        </SidebarMenuButton>
        <NavItemBadge badge={item.badge} />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            {Icon ? <Icon /> : <CollapsedIconFallback title={item.title} />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-48">
          <DropdownMenuGroup>
            {item.subItems.map((subItem) => {
              const SubIcon = subItem.icon;

              return (
                <DropdownMenuItem key={subItem.id} asChild disabled={subItem.disabled}>
                  {subItem.disabled ? (
                    <span className="flex items-center gap-2">
                      {SubIcon && <SubIcon />}
                      <span>{subItem.title}</span>
                    </span>
                  ) : (
                    <Link
                      prefetch={false}
                      href={prefix(subItem.url)}
                      target={subItem.newTab ? "_blank" : undefined}
                      rel={subItem.newTab ? "noreferrer" : undefined}
                      aria-current={isSubItemActive(subItem.url) ? "page" : undefined}
                      className="flex items-center gap-2"
                    >
                      {SubIcon && <SubIcon />}
                      <span>{subItem.title}</span>
                    </Link>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function NavCollapsibleItem({ item, isActive, defaultOpen, isSubItemActive, prefix }: NavCollapsibleItemProps) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={item.title} isActive={isActive} disabled>
          {Icon && <Icon />}
          <span>{item.title}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </SidebarMenuButton>
        <NavItemBadge badge={item.badge} />
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            {Icon && <Icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <NavItemBadge badge={item.badge} />

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => {
              const SubIcon = subItem.icon;

              return (
                <SidebarMenuSubItem key={subItem.id}>
                  <SidebarMenuSubButton
                    asChild
                    aria-disabled={subItem.disabled}
                    isActive={isSubItemActive(subItem.url)}
                  >
                    {subItem.disabled ? (
                      <span className="flex items-center gap-2">
                        {SubIcon && <SubIcon />}
                        <span>{subItem.title}</span>
                      </span>
                    ) : (
                      <Link
                        prefetch={false}
                        href={prefix(subItem.url)}
                        target={subItem.newTab ? "_blank" : undefined}
                        rel={subItem.newTab ? "noreferrer" : undefined}
                      >
                        {SubIcon && <SubIcon />}
                        <span>{subItem.title}</span>
                      </Link>
                    )}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavItemBadge({ badge }: { badge?: NavBadge }) {
  if (!badge) {
    return null;
  }

  return (
    <SidebarMenuBadge
      className={cn(
        "rounded-sm border capitalize",
        badge === "new" &&
          "border-green-600 text-green-600 peer-hover/menu-button:text-green-600 peer-data-active/menu-button:text-green-600",
        badge === "soon" && "border-muted-foreground text-muted-foreground",
      )}
    >
      {badge}
    </SidebarMenuBadge>
  );
}

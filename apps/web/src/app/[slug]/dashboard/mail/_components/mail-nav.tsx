"use client";

import { Check, EllipsisVertical, PenLine } from "lucide-react";

import { Button } from "@cykani/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cykani/ui/dropdown-menu";
import { ScrollArea } from "@cykani/ui/scroll-area";
import { Separator } from "@cykani/ui/separator";
import { cn, getInitials } from "@cykani/lib/utils";

import type { MailNavItem } from "./data";
import { mailNavigation } from "./data";

export type MailFolder = "inbox" | "purchases" | "invoices" | "priority" | "drafts" | "sent" | "archive" | "trash";

interface MailNavProps {
  selectedFolder: MailFolder;
  onSelectFolder: (folder: MailFolder) => void;
}

const accounts = [
  { id: 1, label: "Cykani", email: "user@cykani.com" },
];

export function MailNav({ selectedFolder, onSelectFolder }: MailNavProps) {
  return (
    <div className="flex h-full flex-col gap-3 bg-sidebar p-2 text-sidebar-foreground">
      {/* Account header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex size-7 shrink-0 items-center justify-center rounded-xs bg-primary text-primary-foreground text-xs">
            {getInitials("Cykani").slice(0, 1)}
            <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5 items-center justify-center rounded-full bg-green-600 ring-[1.25px] ring-sidebar">
              <Check className="size-2" />
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="size-6">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Accounts</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup value={String(accounts[0].id)}>
                {accounts.map((account) => (
                  <DropdownMenuRadioItem key={account.id} value={String(account.id)}>
                    <div className="flex min-w-0 flex-col">
                      <span>{account.label}</span>
                      <span className="truncate text-muted-foreground text-xs">{account.email}</span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-1">
        <div className="truncate text-sidebar-foreground text-sm font-medium leading-none">Cykani</div>
        <div className="truncate text-sidebar-foreground/60 text-xs leading-none">user@cykani.com</div>
      </div>

      <Button size="sm" variant="outline" className="w-full">
        <PenLine data-icon="inline-start" />
        <span>New email</span>
      </Button>

      <Separator />

      {/* Navigation items */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            {mailNavigation.navMain.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isSelected={selectedFolder === item.id}
                onSelect={() => onSelectFolder(item.id as MailFolder)}
              />
            ))}
          </div>

          <Separator className="my-1" />

          <div className="text-sidebar-foreground/50 px-3 text-xs font-medium">Folders</div>
          <div className="flex flex-col gap-0.5">
            {mailNavigation.folders.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isSelected={selectedFolder === item.id}
                onSelect={() => onSelectFolder(item.id as MailFolder)}
              />
            ))}
          </div>

          <Separator className="my-1" />

          <div className="flex flex-col gap-0.5">
            {mailNavigation.navFooter.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isSelected={selectedFolder === item.id}
                onSelect={() => onSelectFolder(item.id as MailFolder)}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function NavItem({
  item,
  isSelected,
  onSelect,
}: {
  item: MailNavItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isSelected && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="flex-1 text-left">{item.title}</span>
      {item.label && (
        <span className="text-sidebar-foreground/50 text-xs">{item.label}</span>
      )}
    </button>
  );
}

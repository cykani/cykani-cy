"use client";

import { Ellipsis, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/input-group";
import { Separator } from "@/ui/separator";
import { SidebarTrigger } from "@/ui/sidebar";

import type { Mail } from "./data";
import type { MailFolder } from "./mail-nav";
import { MailList } from "./mail-list";

interface MailInboxProps {
  mails: Mail[];
  selectedFolder: MailFolder;
  onSelectMail?: (mail: Mail) => void;
}

export function MailInbox({ mails, selectedFolder, onSelectMail }: MailInboxProps) {
  const pinnedMails = mails.filter((mail) => mail.isPinned);
  const unpinnedMails = mails.filter((mail) => !mail.isPinned);

  const folderTitle =
    selectedFolder === "inbox"
      ? "Inbox"
      : selectedFolder === "purchases"
        ? "Purchases"
        : selectedFolder === "invoices"
          ? "Invoices"
          : selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 pt-3">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center mx-2"
          />
          <h1 className="text-xl font-medium leading-none">{folderTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <SlidersHorizontal />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <RotateCcw />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis />
          </Button>
        </div>
      </div>

      <div className="px-2">
        <Separator />
      </div>

      <div className="px-2">
        <InputGroup className="h-7 w-full rounded-md">
          <InputGroupInput className="h-7" placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <MailList
          groups={[
            {
              id: "pinned",
              title: "Pinned",
              items: pinnedMails,
            },
            {
              id: "inbox",
              title: folderTitle,
              items: unpinnedMails,
            },
          ]}
          onSelectMail={onSelectMail}
        />
      </div>
    </div>
  );
}

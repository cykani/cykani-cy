"use client";

import * as React from "react";

import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@cykani/ui/drawer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@cykani/ui/resizable";
import { useSidebar } from "@cykani/ui/sidebar";

import type { Mail } from "./data";
import { mails } from "./data";
import { MailInbox } from "./mail-inbox";
import {
  DEFAULT_MAIL_LAYOUT,
  MAIL_DETAIL_PANEL_ID,
  MAIL_LIST_PANEL_ID,
  MAIL_NAV_PANEL_ID,
} from "./mail-layout-config";
import { MailNav, type MailFolder } from "./mail-nav";
import { MailView } from "./mail-view";
import { useMail } from "./use-mail";

interface MailProps {
  defaultLayout: number[] | undefined;
  slug: string;
}

export function MailComponent({ defaultLayout = [...DEFAULT_MAIL_LAYOUT], slug }: MailProps) {
  const { isMobile } = useSidebar();
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = React.useState<MailFolder>("inbox");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
        Loading mail...
      </div>
    );
  }

  const filteredMails = mails.filter((mail) => {
    if (selectedFolder === "inbox") return mail.folder === "inbox";
    if (selectedFolder === "purchases") return mail.type === "purchase";
    if (selectedFolder === "invoices") return mail.type === "invoice";
    return mail.folder === selectedFolder;
  });

  if (isMobile) {
    return (
      <MailMobileLayout
        mails={filteredMails}
        selectedFolder={selectedFolder}
        slug={slug}
        onSelectFolder={setSelectedFolder}
      />
    );
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full"
      style={{ overflow: "hidden" }}
    >
      <ResizablePanel
        id={MAIL_NAV_PANEL_ID}
        defaultSize={`${defaultLayout[0]}%`}
        minSize="10%"
        maxSize="25%"
        className="min-h-0"
      >
        <MailNav selectedFolder={selectedFolder} onSelectFolder={setSelectedFolder} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        id={MAIL_LIST_PANEL_ID}
        defaultSize={`${defaultLayout[1]}%`}
        minSize="25%"
        className="min-h-0"
      >
        <MailDesktopList mails={filteredMails} selectedFolder={selectedFolder} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        id={MAIL_DETAIL_PANEL_ID}
        defaultSize={`${defaultLayout[2]}%`}
        minSize="25%"
        className="min-h-0"
      >
        <DesktopMailView slug={slug} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MailMobileLayout({
  mails: filteredMails,
  selectedFolder,
  slug,
  onSelectFolder,
}: {
  mails: Mail[];
  selectedFolder: MailFolder;
  slug: string;
  onSelectFolder: (f: MailFolder) => void;
}) {
  const [mail] = useMail();
  const [isMailOpen, setIsMailOpen] = React.useState(false);
  const selectedMail = filteredMails.find((item) => item.id === mail.selected) || null;

  return (
    <div className="flex h-full flex-col">
      <MailNav selectedFolder={selectedFolder} onSelectFolder={onSelectFolder} />
      <div className="min-h-0 flex-1">
        <MailInbox
          mails={filteredMails}
          selectedFolder={selectedFolder}
          onSelectMail={() => setIsMailOpen(true)}
        />
      </div>

      <Drawer open={isMailOpen} onOpenChange={setIsMailOpen}>
        <DrawerContent>
          <DrawerTitle className="sr-only">Mail message</DrawerTitle>
          <DrawerDescription className="sr-only">Read the selected email message</DrawerDescription>
          <MailView mail={selectedMail} slug={slug} onClose={() => setIsMailOpen(false)} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function MailDesktopList({
  mails: filteredMails,
  selectedFolder,
}: {
  mails: Mail[];
  selectedFolder: MailFolder;
}) {
  return (
    <MailInbox mails={filteredMails} selectedFolder={selectedFolder} />
  );
}

function DesktopMailView({ slug }: { slug: string }) {
  const [mail] = useMail();
  const selectedMail = mails.find((item) => item.id === mail.selected) || null;

  return <MailView mail={selectedMail} slug={slug} />;
}

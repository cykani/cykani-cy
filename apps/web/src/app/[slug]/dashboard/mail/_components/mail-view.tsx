"use client";

import { format } from "date-fns/format";
import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  EllipsisVertical,
  ExternalLink,
  Forward,
  MailOpen,
  Paperclip,
  Pin,
  Reply,
  ReplyAll,
  Send,
  Smile,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { SimpleIcon } from "@cykani/ui/components/simple-icon";
import { Avatar, AvatarFallback } from "@cykani/ui/avatar";
import { Button } from "@cykani/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@cykani/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cykani/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@cykani/ui/input-group";
import { Separator } from "@cykani/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@cykani/ui/tooltip";
import { cn } from "@cykani/lib/utils";

import type { Mail } from "./data";
import { useMail } from "./use-mail";

interface MailDisplayProps {
  mail: Mail | null;
  slug: string;
  onClose?: () => void;
}

export function MailView({ mail, slug, onClose }: MailDisplayProps) {
  const [, setMail] = useMail();

  function handleClose() {
    setMail({ selected: null });
    onClose?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-2 py-3">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close message" onClick={handleClose}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close message</TooltipContent>
          </Tooltip>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
          />
          <div className="flex items-center gap-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Previous message">
                  <ChevronLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous message</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Next message">
                  <ChevronRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {mail?.type === "purchase" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Download binary">
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download binary</TooltipContent>
            </Tooltip>
          )}
          {mail?.type === "invoice" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="View invoice">
                  <CreditCard />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View invoice</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Pin thread">
                <Pin />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pin thread</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Archive">
                <Archive />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Reply">
                <Reply />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More actions">
                    <EllipsisVertical />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ReplyAll />
                    Reply all
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward />
                    Forward
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailOpen />
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag />
                    Add label
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>More actions</TooltipContent>
          </Tooltip>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Move to trash">
                <Trash2 className="text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        {mail ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-medium">{mail.subject}</span>
                {mail.type === "purchase" && (
                  <span className="rounded-full bg-green-600/15 px-2 py-0.5 text-[10px] font-medium text-green-600">
                    Purchase
                  </span>
                )}
                {mail.type === "invoice" && (
                  <span className="rounded-full bg-blue-600/15 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                    Invoice
                  </span>
                )}
              </div>

              <div className="text-xs leading-none text-muted-foreground">
                {format(new Date(mail.receivedAt), "EEE, d MMM yyyy, h:mm a")}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Avatar className="after:rounded-sm size-9">
                <AvatarFallback className="rounded-sm bg-background">{mail.from.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex h-full flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs">{mail.from.name}</div>
                  <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-3 data-[orientation=vertical]:self-center"
                  />
                  <div className="text-xs text-muted-foreground">{mail.from.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">
                    To:{" "}
                    <span className="text-foreground">
                      {mail.to.map((recipient) => recipient.name).join(", ")}
                    </span>
                  </div>

                  {mail.cc?.length ? (
                    <div className="text-xs text-muted-foreground">
                      Cc:{" "}
                      <span className="text-foreground">
                        {mail.cc.map((recipient) => recipient.name).join(", ")}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {mail.orderId && (
              <div className="flex items-center gap-4 rounded-lg border bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">Order: {mail.orderId}</span>
                {mail.type === "invoice" && (
                  <a
                    href={`/${slug}/dashboard/invoice`}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="size-3" />
                    View invoice
                  </a>
                )}
                {mail.type === "purchase" && (
                  <span className="ml-auto rounded-full bg-green-600/10 px-2 py-0.5 text-green-600">
                    Active
                  </span>
                )}
              </div>
            )}

            <Separator />

            {mail.attachments?.length ? (
              <>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "group p-0 font-normal text-muted-foreground",
                        "hover:bg-transparent hover:text-muted-foreground dark:hover:bg-transparent",
                        "data-[state=open]:bg-transparent data-[state=open]:text-muted-foreground",
                      )}
                    >
                      {mail.type === "purchase" ? "Downloads" : "Attachments"} ({mail.attachments.length})
                      <ChevronDown className="group-data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="flex flex-wrap gap-2">
                      {mail.attachments.map((attachment) => (
                        <Button
                          key={attachment.id}
                          size="xs"
                          variant="secondary"
                          asChild
                          className={cn(mail.type === "purchase" && "border-green-600/30 text-green-600")}
                        >
                          {attachment.downloadUrl ? (
                            <a
                              href={attachment.downloadUrl}
                              download
                              className="flex items-center gap-2"
                            >
                              <SimpleIcon icon={attachment.icon} className="size-3 fill-current" />
                              <span className="font-normal">{attachment.name}</span>
                              <span className="font-normal text-muted-foreground">{attachment.size}</span>
                              {mail.type === "purchase" && <Download className="size-3" />}
                            </a>
                          ) : (
                            <span className="flex items-center gap-2">
                              <SimpleIcon icon={attachment.icon} className="size-3 fill-current" />
                              <span className="font-normal">{attachment.name}</span>
                              <span className="font-normal text-muted-foreground">{attachment.size}</span>
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-2" />
              </>
            ) : null}

            <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-sm">
              {mail.body}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Separator />
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Reply />
                </InputGroupAddon>
                <InputGroupInput
                  className="text-xs"
                  placeholder={`Reply ${mail.from.name}...`}
                />
                <InputGroupAddon className="gap-1" align="inline-end">
                  <InputGroupButton variant="ghost">
                    <Smile />
                  </InputGroupButton>
                  <InputGroupButton variant="ghost">
                    <Paperclip />
                  </InputGroupButton>
                  <InputGroupButton variant="ghost">
                    <Send />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            No email selected
          </div>
        )}
      </div>
    </div>
  );
}

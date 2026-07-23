"use client";

import { differenceInDays } from "date-fns/differenceInDays";
import { format } from "date-fns/format";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { Avatar, AvatarFallback } from "@/ui/avatar";
import { ScrollArea } from "@/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { Mail } from "./data";
import { useMail } from "./use-mail";

type MailGroup = {
  id: string;
  title: string;
  items: Mail[];
};

interface MailListProps {
  groups: MailGroup[];
  onSelectMail?: (mail: Mail) => void;
}

export function MailList({ groups, onSelectMail }: MailListProps) {
  const [mail, setMail] = useMail();

  return (
    <ScrollArea className="**:data-[slot=scroll-area-viewport]:scroll-fade min-h-0 flex-1">
      <div className="flex flex-col gap-1.5 pt-0">
        {groups.map((group) => (
          <section key={group.id} className="flex flex-col gap-1.5">
            <div className="text-muted-foreground mx-3 text-xs">
              {group.title} ({group.items.length})
            </div>

            <div className="flex flex-col">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={cn(
                    "group relative w-full border-transparent border-y p-3 text-left transition-colors",
                    "hover:bg-muted/60",
                    mail.selected === item.id &&
                      "border-border bg-muted/70 before:absolute before:-inset-y-px before:left-0 before:w-0.5 before:bg-primary",
                  )}
                  onClick={(event) => {
                    event.currentTarget.blur();

                    setMail({
                      ...mail,
                      selected: item.id,
                    });
                    onSelectMail?.(item);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="after:rounded-sm size-9">
                      <AvatarFallback className="rounded-sm bg-background">
                        {item.from.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "flex items-center gap-2 truncate text-sm",
                              !item.isRead ? "font-medium" : "font-normal",
                            )}
                          >
                            {item.from.name}
                            {!item.isRead && <span className="size-2 shrink-0 rounded-full bg-blue-600" />}
                          </div>
                          <div
                            className={cn(
                              "truncate text-xs",
                              item.isRead ? "font-normal text-muted-foreground" : "font-medium text-foreground",
                            )}
                          >
                            {item.type === "purchase" && "📦 "}
                            {item.type === "invoice" && "🧾 "}
                            {item.subject}
                          </div>
                        </div>

                        <div
                          className={cn(
                            "shrink-0 text-xs text-muted-foreground",
                            mail.selected === item.id && "text-foreground",
                          )}
                        >
                          {formatMailDate(item.receivedAt)}
                        </div>
                      </div>

                      <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ScrollArea>
  );
}

function formatMailDate(date: string) {
  const mailDate = new Date(date);

  if (differenceInDays(new Date(), mailDate) <= 3) {
    return formatDistanceToNow(mailDate, { addSuffix: true });
  }

  return format(mailDate, "d MMM yyyy");
}

"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { cn } from "@/lib/utils";

import type { ProfileRow } from "./schema";

const healthStripSlots = Array.from({ length: 18 }, (_, index) => ({
  id: `strip-${index + 1}`,
  threshold: index + 1,
}));

function getHealthScore(health: ProfileRow["health"]) {
  switch (health) {
    case "Healthy":
      return 18;
    case "Warning":
      return 11;
    case "Critical":
      return 7;
    case "Offline":
      return 4;
    default:
      return 0;
  }
}

const statusColor: Record<string, string> = {
  Running: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900/40",
  Idle: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/40",
  Provisioning: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/40",
};

export const profilesColumns: ColumnDef<ProfileRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all profiles"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.profile}`}
      />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-sm tracking-tight">{row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "profile",
    header: "Profile",
    cell: ({ row }) => <div className="font-medium text-sm">{row.original.profile}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("rounded-full px-2.5", statusColor[row.original.status] ?? "")}>
        {row.original.status}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => <div className="text-sm">{row.original.region}</div>,
  },
  {
    accessorKey: "health",
    header: "Health",
    cell: ({ row }) => (
      <div className="flex items-end gap-0.5" title={row.original.health}>
        <span className="sr-only">{row.original.health}</span>
        {healthStripSlots.map((slot) => (
          <div
            key={`${row.original.id}-${slot.id}`}
            className={cn(
              "h-5 w-1 rounded-full",
              slot.threshold <= getHealthScore(row.original.health) ? "bg-green-500/85" : "bg-green-500/15",
            )}
          />
        ))}
      </div>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    cell: ({ row }) => <div className="font-medium text-sm tabular-nums">{row.original.uptime}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Edit</div>,
    cell: () => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-muted-foreground hover:bg-transparent focus-visible:bg-transparent"
        >
          <Pencil />
          <span className="sr-only">Edit profile</span>
        </Button>
      </div>
    ),
    enableHiding: false,
  },
];

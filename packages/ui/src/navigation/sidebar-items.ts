import {
  Bot,
  Globe,
  FileText,
  Mail,
  Monitor,
  Shield,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 0,
    label: "Mail",
    items: [
      {
        id: "mail",
        title: "Inbox",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "invoice",
        title: "Invoices",
        url: "/dashboard/invoice",
        icon: FileText,
      },
    ],
  },
  {
    id: 1,
    label: "Platform",
    items: [
      {
        id: "sessions",
        title: "Sessions",
        url: "/dashboard/sessions",
        icon: Monitor,
        badge: "soon",
        disabled: true,
      },
      {
        id: "profiles",
        title: "Profiles",
        url: "/dashboard/profiles",
        icon: Shield,
        badge: "soon",
        disabled: true,
      },
      {
        id: "proxies",
        title: "Proxies",
        url: "/dashboard/proxies",
        icon: Globe,
        badge: "soon",
        disabled: true,
      },
      {
        id: "agents",
        title: "Agents",
        url: "/dashboard/agents",
        icon: Bot,
        badge: "soon",
        disabled: true,
      },
      {
        id: "workflows",
        title: "Workflows",
        url: "/dashboard/workflows",
        icon: Workflow,
        badge: "soon",
        disabled: true,
      },
    ],
  },
];

import {
  Archive,
  CircleHelp,
  CreditCard,
  Download,
  File,
  Inbox,
  Keyboard,
  type LucideIcon,
  Send,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { siFigma, siGoogledocs, siGooglephotos } from "simple-icons";

export type Recipient = {
  name: string;
  email: string;
};

export type Attachment = {
  id: string;
  name: string;
  size: string;
  icon: typeof siFigma;
  downloadUrl?: string;
};

export type Mail = {
  id: string;
  from: Recipient;
  to: Recipient[];
  cc?: Recipient[];
  subject: string;
  body: string;
  receivedAt: string;
  folder: "inbox" | "drafts" | "sent" | "archive" | "trash" | "purchases";
  isRead: boolean;
  isPinned: boolean;
  isPriority: boolean;
  labels: string[];
  attachments?: Attachment[];
  messageCount?: number;
  type?: "purchase" | "invoice" | "download" | "general";
  invoiceUrl?: string;
  orderId?: string;
};

export type MailNavItem = {
  id: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  isActive: boolean;
};

type MailNavigation = {
  navMain: MailNavItem[];
  folders: MailNavItem[];
  navFooter: MailNavItem[];
};

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function hoursAgo(hours: number) {
  return minutesAgo(hours * 60);
}

function daysAgo(days: number) {
  return hoursAgo(days * 24);
}

export const mails: Mail[] = [
  {
    id: "ls-order-001",
    from: { name: "Lemon Squeezy", email: "orders@lemonsqueezy.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Your Cykani Pro purchase — receipt & download",
    body: "Thank you for purchasing Cykani Pro!\n\nYour order #LS-2024-0042 is confirmed.\n\nYou can download your binary below. This download link will expire in 7 days.\n\nFor support, reply to this email or visit https://cykani.com/support.\n\n— The Cykani Team",
    receivedAt: hoursAgo(3),
    folder: "inbox",
    isRead: false,
    isPinned: true,
    isPriority: true,
    labels: ["purchase", "important"],
    type: "purchase",
    orderId: "LS-2024-0042",
    invoiceUrl: "#",
    attachments: [
      {
        id: "cykani-pro-win",
        name: "cykani-pro-win-x64.exe",
        size: "28 MB",
        icon: siFigma,
        downloadUrl: "#",
      },
      {
        id: "cykani-pro-linux",
        name: "cykani-pro-linux-x64.tar.gz",
        size: "32 MB",
        icon: siFigma,
        downloadUrl: "#",
      },
      {
        id: "cykani-pro-mac",
        name: "cykani-pro-mac-arm64.dmg",
        size: "30 MB",
        icon: siFigma,
        downloadUrl: "#",
      },
    ],
  },
  {
    id: "ls-invoice-001",
    from: { name: "Lemon Squeezy", email: "invoices@lemonsqueezy.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Invoice #INV-2024-0042 for Cykani Pro",
    body: "Invoice for your recent purchase.\n\nOrder: LS-2024-0042\nPlan: Cykani Pro (Monthly)\nAmount: $29.00\nDate: July 22, 2024\n\nView your invoice online or download as PDF.\n\n— Lemon Squeezy",
    receivedAt: hoursAgo(3),
    folder: "inbox",
    isRead: false,
    isPinned: true,
    isPriority: false,
    labels: ["invoice"],
    type: "invoice",
    invoiceUrl: "#",
    orderId: "LS-2024-0042",
    attachments: [
      {
        id: "invoice-pdf-0042",
        name: "INV-2024-0042.pdf",
        size: "120 KB",
        icon: siGoogledocs,
        downloadUrl: "#",
      },
    ],
  },
  {
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    from: { name: "William Smith", email: "williamsmith@example.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    cc: [{ name: "Team", email: "team@cykani.com" }],
    subject: "Meeting Tomorrow",
    body: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    receivedAt: minutesAgo(24),
    folder: "inbox",
    isRead: true,
    isPinned: true,
    isPriority: true,
    labels: ["meeting", "work", "important"],
    type: "general",
    attachments: [
      { id: "studio-admin-fig", name: "studio-admin.fig", size: "21 MB", icon: siFigma },
      { id: "features-docx", name: "features.docx", size: "3.7 MB", icon: siGoogledocs },
      { id: "preview-png", name: "preview.png", size: "2.3 MB", icon: siGooglephotos },
    ],
  },
  {
    id: "ls-order-002",
    from: { name: "Lemon Squeezy", email: "orders@lemonsqueezy.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Your Cykani Starter purchase — receipt & download",
    body: "Thank you for purchasing Cykani Starter!\n\nYour order #LS-2024-0038 is confirmed.\n\nDownload your binary below (expires in 7 days).\n\n— The Cykani Team",
    receivedAt: daysAgo(3),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["purchase"],
    type: "purchase",
    orderId: "LS-2024-0038",
    attachments: [
      {
        id: "cykani-starter-win",
        name: "cykani-starter-win-x64.exe",
        size: "22 MB",
        icon: siFigma,
        downloadUrl: "#",
      },
    ],
  },
  {
    id: "110e8400-e29b-11d4-a716-446655440000",
    from: { name: "Alice Smith", email: "alicesmith@example.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Re: Project Update",
    body: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting.\n\nBest regards, Alice",
    receivedAt: hoursAgo(2),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["work", "important"],
    type: "general",
    attachments: [
      { id: "project-notes-docx", name: "project-notes.docx", size: "1.8 MB", icon: siGoogledocs },
    ],
    messageCount: 3,
  },
  {
    id: "ls-invoice-002",
    from: { name: "Lemon Squeezy", email: "invoices@lemonsqueezy.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Invoice #INV-2024-0038 for Cykani Starter",
    body: "Invoice for your recent purchase.\n\nOrder: LS-2024-0038\nPlan: Cykani Starter (Monthly)\nAmount: $19.00\nDate: July 19, 2024\n\n— Lemon Squeezy",
    receivedAt: daysAgo(3),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["invoice"],
    type: "invoice",
    invoiceUrl: "#",
    orderId: "LS-2024-0038",
    attachments: [
      {
        id: "invoice-pdf-0038",
        name: "INV-2024-0038.pdf",
        size: "110 KB",
        icon: siGoogledocs,
        downloadUrl: "#",
      },
    ],
  },
  {
    id: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    from: { name: "Bob Johnson", email: "bobjohnson@example.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Weekend Plans",
    body: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains.\n\nIf you're interested, let me know!\n\nBest, Bob",
    receivedAt: daysAgo(1),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["personal"],
    type: "general",
  },
  {
    id: "61c35085-72d7-42b4-8d62-738f700d4b92",
    from: { name: "Emily Davis", email: "emilydavis@example.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Re: Question about Budget",
    body: "I have a question about the budget for the upcoming project.\n\nI've reviewed the budget report and identified a few areas where we might be able to optimize.\n\nThanks, Emily",
    receivedAt: daysAgo(2),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: true,
    labels: ["work", "budget"],
    type: "general",
    attachments: [
      { id: "budget-analysis-docx", name: "budget-analysis.docx", size: "2.1 MB", icon: siGoogledocs },
    ],
    messageCount: 2,
  },
  {
    id: "8f7b5db9-d935-4e42-8e05-1f1d0a3dfb97",
    from: { name: "Michael Wilson", email: "michaelwilson@example.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Important Announcement",
    body: "I have an important announcement to make during our team meeting.\n\nRegards, Michael",
    receivedAt: daysAgo(3),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: true,
    labels: ["meeting", "work", "important"],
    type: "general",
  },
  {
    id: "1f0f2c02-e299-40de-9b1d-86ef9e42126b",
    from: { name: "Sarah Brown", email: "sarahbrown@example.com" },
    to: [{ name: "You", email: "user@cykani.com" }],
    subject: "Re: Feedback on Proposal",
    body: "Thank you for your feedback on the proposal. It looks great!\n\nI've attached the revised proposal for your review.\n\nBest regards, Sarah",
    receivedAt: daysAgo(5),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["work"],
    type: "general",
    attachments: [
      { id: "proposal-layout-fig", name: "proposal-layout.fig", size: "14 MB", icon: siFigma },
    ],
  },
];

export const mailNavigation: MailNavigation = {
  navMain: [
    {
      id: "inbox",
      title: "Inbox",
      label: "18",
      icon: Inbox,
      isActive: true,
    },
    {
      id: "priority",
      title: "Priority",
      label: "3",
      icon: Star,
      isActive: false,
    },
    {
      id: "purchases",
      title: "Purchases",
      label: "2",
      icon: ShoppingCart,
      isActive: false,
    },
    {
      id: "invoices",
      title: "Invoices",
      label: "2",
      icon: CreditCard,
      isActive: false,
    },
  ],
  folders: [
    {
      id: "drafts",
      title: "Drafts",
      icon: File,
      isActive: false,
    },
    {
      id: "sent",
      title: "Sent",
      icon: Send,
      isActive: false,
    },
    {
      id: "archive",
      title: "Archive",
      icon: Archive,
      isActive: false,
    },
    {
      id: "trash",
      title: "Trash",
      icon: Trash2,
      isActive: false,
    },
  ],
  navFooter: [
    {
      id: "help-feedback",
      title: "Help & feedback",
      icon: CircleHelp,
      isActive: false,
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard shortcuts",
      icon: Keyboard,
      isActive: false,
    },
  ],
};

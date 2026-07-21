declare module "radix-ui" {
  export const Avatar: any;
  export const Slot: any;
  export const Checkbox: any;
  export const Collapsible: any;
  export const Dialog: any;
  export const DropdownMenu: any;
  export const Label: any;
  export const Popover: any;
  export const Select: any;
  export const Separator: any;
  export const ToggleGroup: any;
  export const Tooltip: any;
  export const Progress: any;
  export const ScrollArea: any;
  export const Tabs: any;
  export const Toggle: any;
}

declare module "next/link" {
  import { ComponentType, ReactNode } from "react";
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean | null;
    children: ReactNode;
    [key: string]: unknown;
  }
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    refresh: () => void;
    back: () => void;
    prefetch: (url: string) => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string>;
  export function redirect(url: string): never;
}

declare module "next/font/google" {
  export const Inter: any;
  export const Geist: any;
  export const Geist_Mono: any;
  export const DM_Sans: any;
  export const Figtree: any;
  export const JetBrains_Mono: any;
  export const Lora: any;
  export const Merriweather: any;
  export const Noto_Sans: any;
  export const Noto_Serif: any;
  export const Nunito_Sans: any;
  export const Outfit: any;
  export const Playfair_Display: any;
  export const Public_Sans: any;
  export const Raleway: any;
  export const Roboto: any;
  export const Roboto_Slab: any;
}

declare module "geist/font/pixel" {
  export const GeistPixelSquare: any;
}

declare module "simple-icons" {
  export interface SimpleIcon {
    title: string;
    hex: string;
    path: string;
    slug?: string;
  }
  export const siGithub: SimpleIcon;
  export const siX: SimpleIcon;
  export const siDiscord: SimpleIcon;
  export const siLinkedin: SimpleIcon;
  export const siYoutube: SimpleIcon;
  export const siTwitch: SimpleIcon;
  export const siGoogle: SimpleIcon;
  export const siFacebook: SimpleIcon;
  export const siInstagram: SimpleIcon;
  export const siWhatsapp: SimpleIcon;
  export const siEbay: SimpleIcon;
  export const siMeta: SimpleIcon;
  export const siShopify: SimpleIcon;
  export const siTiktok: SimpleIcon;
  export const siClaude: SimpleIcon;
  export const siLinear: SimpleIcon;
  export const siResend: SimpleIcon;
  export const siBarclays: SimpleIcon;
  export const siBitcoin: SimpleIcon;
  export const siEthereum: SimpleIcon;
  export const siHsbc: SimpleIcon;
  export const siRevolut: SimpleIcon;
  export const siNextdotjs: SimpleIcon;
  export const siNodedotjs: SimpleIcon;
  export const siReact: SimpleIcon;
  export const siRemix: SimpleIcon;
  export const siFigma: SimpleIcon;
  export const siGoogledocs: SimpleIcon;
  export const siGooglephotos: SimpleIcon;
}

declare module "@fullcalendar/react" {
  import { ComponentType } from "react";
  export interface CalendarOptions {
    plugins?: unknown[];
    initialView?: string;
    headerToolbar?: Record<string, string | boolean>;
    events?: unknown[];
    eventContent?: unknown;
    dateClick?: (info: any) => void;
    eventClick?: (info: any) => void;
    views?: Record<string, any>;
    [key: string]: any;
  }
  export interface DayCellInfo {
    date: Date;
    dayEl: HTMLElement;
    view: any;
    isNarrow: boolean;
    isMultiMonthDay: boolean;
    isMultiMonthWeek: boolean;
    isMultiMonthMonth: boolean;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    isPast: boolean;
    isFuture: boolean;
    isToday: boolean;
    el: HTMLElement;
  }
  export function useCalendarController(): any;
  const FullCalendar: ComponentType<CalendarOptions>;
  export default FullCalendar;
  export type { CalendarOptions, DayCellInfo };
}

declare module "@fullcalendar/react/skeleton.css" {
  const content: string;
  export default content;
}

declare module "@shadcn/react/message-scroller" {
  import { ComponentType, ReactNode } from "react";
  interface ProviderProps { children: ReactNode; [key: string]: unknown; }
  interface RootProps { children: ReactNode; className?: string; [key: string]: unknown; }
  interface ViewportProps { children: ReactNode; className?: string; [key: string]: unknown; }
  interface ContentProps { children: ReactNode; className?: string; [key: string]: unknown; }
  interface ItemProps { children: ReactNode; scrollAnchor?: boolean; className?: string; [key: string]: unknown; }
  interface ButtonProps { children?: ReactNode; direction?: "start" | "end"; render?: ReactNode; [key: string]: unknown; }
  export const MessageScroller: {
    Provider: ComponentType<ProviderProps>;
    Root: ComponentType<RootProps>;
    Viewport: ComponentType<ViewportProps>;
    Content: ComponentType<ContentProps>;
    Item: ComponentType<ItemProps>;
    Button: ComponentType<ButtonProps>;
  };
  export function useMessageScroller(): any;
  export function useMessageScrollerScrollable(): any;
  export function useMessageScrollerVisibility(): any;
}

declare module "date-fns" {
  export function format(date: Date | string | number, formatStr: string, options?: Record<string, unknown>): string;
  export function formatDistance(date: Date | string | number, baseDate: Date | string | number, options?: Record<string, unknown>): string;
  export function subDays(date: Date | string | number, amount: number): Date;
  export function startOfDay(date: Date | string | number): Date;
  export function endOfDay(date: Date | string | number): Date;
  export function isWithinInterval(date: Date | string | number, interval: { start: Date; end: Date }): boolean;
  export function eachDayOfInterval(interval: { start: Date; end: Date }): Date[];
  export function addDays(date: Date | string | number, amount: number): Date;
  export function subMonths(date: Date | string | number, amount: number): Date;
  export function addMonths(date: Date | string | number, amount: number): Date;
  export function startOfMonth(date: Date | string | number): Date;
  export function endOfMonth(date: Date | string | number): Date;
  export function isSameDay(dateLeft: Date | string | number, dateRight: Date | string | number): boolean;
  export function isSameMonth(dateLeft: Date | string | number, dateRight: Date | string | number): boolean;
  export function getDay(date: Date | string | number): number;
  export function getDate(date: Date | string | number): number;
  export function getMonth(date: Date | string | number): number;
  export function getYear(date: Date | string | number): number;
  export function setMonth(date: Date | string | number, month: number): Date;
  export function setYear(date: Date | string | number, year: number): Date;
  export function parseISO(argument: string): Date;
  export function isValid(date: unknown): boolean;
  export function addHours(date: Date | string | number, amount: number): Date;
  export function subHours(date: Date | string | number, amount: number): Date;
  export function addMinutes(date: Date | string | number, amount: number): Date;
  export function subMinutes(date: Date | string | number, amount: number): Date;
  export function differenceInCalendarDays(dateLeft: Date | string | number, dateRight: Date | string | number): number;
  export function differenceInCalendarMonths(dateLeft: Date | string | number, dateRight: Date | string | number): number;
  export function startOfToday(): Date;
  export function endOfToday(): Date;
  export function isToday(date: Date | string | number): boolean;
  export function isYesterday(date: Date | string | number): boolean;
  export function parse(dateString: string, formatString: string, referenceDate?: Date | number): Date;
  export function setDate(date: Date | string | number, dayOfMonth: number): Date;
  export function setHours(date: Date | string | number, hours: number): Date;
  export function setMinutes(date: Date | string | number, minutes: number): Date;
  export function set(date: Date | string | number, values: { hours?: number; minutes?: number; seconds?: number; milliseconds?: number }): Date;
  export function startOfWeek(date: Date | string | number, options?: { weekStartsOn?: number }): Date;
  export function endOfWeek(date: Date | string | number, options?: { weekStartsOn?: number }): Date;
  export function eachWeekOfInterval(interval: { start: Date; end: Date }, options?: { weekStartsOn?: number }): Date[];
  export function getWeek(date: Date | string | number, options?: { weekStartsOn?: number; firstWeekContainsDate?: number }): number;
  export function formatDistanceToNow(date: Date | string | number, options?: { addSuffix?: boolean }): string;
}

declare module "@/server/server-actions" {
  export async function getPreference(key: string, validValues: readonly string[], defaultValue: any): Promise<any>;
  export async function getValueFromCookie(name: string): Promise<string | null>;
  export async function setValueToCookie(name: string, value: string): Promise<void>;
}

declare module "@/hooks/use-mobile" {
  export function useIsMobile(): boolean;
}

declare module "@/components/ui/button" {
  export { Button } from "@cykani/ui/button";
}

declare module "@/components/ui/input" {
  export { Input } from "@cykani/ui/input";
}

declare module "@/components/ui/separator" {
  export { Separator } from "@cykani/ui/separator";
}

declare module "@/components/ui/sheet" {
  export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@cykani/ui/sheet";
}

declare module "@/components/ui/skeleton" {
  export { Skeleton } from "@cykani/ui/skeleton";
}

declare module "@/components/ui/tooltip" {
  export { Tooltip, TooltipContent, TooltipTrigger } from "@cykani/ui/tooltip";
}

declare module "@/components/ui/toggle" {
  export { ToggleGroup, ToggleGroupItem } from "@cykani/ui/toggle-group";
}

declare module "@/components/ui/dialog" {
  export const Dialog: any;
  export const DialogContent: any;
  export const DialogDescription: any;
  export const DialogHeader: any;
  export const DialogTitle: any;
}

declare module "@/components/ui/input-group" {
  export const InputGroup: any;
  export const InputGroupAddon: any;
}

declare module "@/components/ui/textarea" {
  export const Textarea: any;
}

declare module "@/components/ui/toggle" {
  export const ToggleGroup: any;
  export const ToggleGroupItem: any;
  export const toggleVariants: any;
}

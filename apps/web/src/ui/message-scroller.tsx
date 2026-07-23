"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ArrowDownIcon } from "lucide-react"

interface ScrollerContextValue {
  isAtEnd: React.MutableRefObject<boolean>
  scrollToBottom: () => void
  scrollableRef: React.RefObject<HTMLDivElement | null>
}

const ScrollerContext = React.createContext<ScrollerContextValue | null>(null)

function useScrollerContext() {
  const ctx = React.useContext(ScrollerContext)
  if (!ctx) throw new Error("MessageScroller components must be used within MessageScrollerProvider")
  return ctx
}

function MessageScrollerProvider({
  children,
  autoScroll = true,
}: {
  children: React.ReactNode
  autoScroll?: boolean
}) {
  const isAtEnd = React.useRef(true)
  const scrollableRef = React.useRef<HTMLDivElement | null>(null)

  const scrollToBottom = React.useCallback(() => {
    const el = scrollableRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  React.useEffect(() => {
    if (!autoScroll) return
    const el = scrollableRef.current
    if (!el) return
    const observer = new MutationObserver(() => {
      if (isAtEnd.current) scrollToBottom()
    })
    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [autoScroll, scrollToBottom])

  return (
    <ScrollerContext.Provider value={{ isAtEnd, scrollToBottom, scrollableRef }}>
      {children}
    </ScrollerContext.Provider>
  )
}

function MessageScroller({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function MessageScrollerViewport({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollableRef, isAtEnd } = useScrollerContext()

  const handleScroll = React.useCallback(() => {
    const el = scrollableRef.current
    if (!el) return
    isAtEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 50
  }, [scrollableRef, isAtEnd])

  return (
    <div
      ref={scrollableRef}
      onScroll={handleScroll}
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 scroll-fade-b overflow-y-auto overscroll-contain contain-content",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function MessageScrollerContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col gap-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function MessageScrollerItem({
  className,
  messageId,
  scrollAnchor,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  messageId?: string
  scrollAnchor?: boolean
}) {
  return (
    <div
      data-slot="message-scroller-item"
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  direction?: "start" | "end"
  variant?: "secondary" | "default" | "destructive" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
}) {
  const { scrollToBottom } = useScrollerContext()
  const [visible, setVisible] = React.useState(false)
  const { scrollableRef, isAtEnd } = useScrollerContext()

  React.useEffect(() => {
    const el = scrollableRef.current
    if (!el) return
    const handler = () => setVisible(!isAtEnd.current)
    el.addEventListener("scroll", handler, { passive: true })
    return () => el.removeEventListener("scroll", handler)
  }, [scrollableRef, isAtEnd])

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "absolute bottom-4 right-4 transition-[translate,scale,opacity] duration-200",
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0 pointer-events-none",
        className
      )}
      onClick={scrollToBottom}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className="sr-only">Scroll to end</span>
        </>
      )}
    </Button>
  )
}

function useMessageScroller() {
  return useScrollerContext()
}

function useMessageScrollerScrollable() {
  const { scrollableRef } = useScrollerContext()
  return scrollableRef
}

function useMessageScrollerVisibility() {
  const { isAtEnd } = useScrollerContext()
  return { isAtEnd: isAtEnd.current }
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}

import * as React from "react"

import { cn } from "@/lib/utils"

type StatusDotVariant = "success" | "warning" | "error" | "muted"

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusDotVariant
}

const statusColors: Record<StatusDotVariant, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  muted: "bg-muted-foreground",
}

function StatusDot({ variant = "muted", className, ...props }: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        statusColors[variant],
        className
      )}
      {...props}
    />
  )
}

export { StatusDot }

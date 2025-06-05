"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

function Tooltip({ children, ...props }: TooltipPrimitive.TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={0} {...props}>
      {children}
    </TooltipPrimitive.Root>
  );
}

function TooltipTrigger({
  children,
  ...props
}: TooltipPrimitive.TooltipTriggerProps) {
  return (
    <TooltipPrimitive.Trigger asChild {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

function TooltipContent({
  className,
  sideOffset = 8,
  ...props
}: TooltipPrimitive.TooltipContentProps & { className?: string }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };

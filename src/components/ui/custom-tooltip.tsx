import * as React from "react"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function CustomTooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  // eslint-disable-next-line react-x/no-context-provider
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

function CustomTooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function CustomTooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

interface CustomTooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  backgroundColor?: string
  textColor?: string
  showArrow?: boolean
}

function CustomTooltipContent({
  className,
  sideOffset = 0,
  children,
  backgroundColor = "bg-accent",
  textColor = "text-accent-foreground",
  showArrow = true,
  ...props
}: CustomTooltipContentProps) {
  // Extract the color from backgroundColor for the arrow
  const getArrowColors = (bgColor: string) => {
    // Handle different background color formats
    if (bgColor.startsWith("bg-")) {
      const colorName = bgColor.replace("bg-", "")
      return {
        bg: `bg-${colorName}`,
        fill: `fill-${colorName}`,
      }
    }
    // Fallback to the provided color
    return {
      bg: bgColor,
      fill: bgColor.replace("bg-", "fill-"),
    }
  }

  const arrowColors = getArrowColors(backgroundColor)

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          backgroundColor,
          textColor,
          className,
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow
            className={cn(
              "fill-accent z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
              arrowColors.bg,
              arrowColors.fill === "fill-destructive" ? "fill-destructive" : arrowColors.fill,
            )}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { CustomTooltip, CustomTooltipTrigger, CustomTooltipContent, CustomTooltipProvider }

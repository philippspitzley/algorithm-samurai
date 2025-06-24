import React from "react"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface Props extends React.ComponentProps<typeof Button> {
  tooltip: string
  toolTipClassName?: string
  toolTipColor?: string
}

function ButtonWithTooltip({
  tooltip,
  toolTipClassName,
  toolTipColor,
  children,
  ...buttonProps
}: Props) {
  const toolTipColorClass = toolTipColor
    ? `bg-[var(--color-ctp-${toolTipColor})] fill-[var(--color-ctp-${toolTipColor})]`
    : ""
  const toolTipStyles = cn(toolTipClassName, toolTipColorClass)
  console.log(toolTipStyles)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent className={toolTipStyles}>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default ButtonWithTooltip

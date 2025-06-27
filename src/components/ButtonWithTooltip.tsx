import React from "react"

import { Button } from "./ui/button"
import {
  CustomTooltip,
  CustomTooltipContent,
  CustomTooltipProvider,
  CustomTooltipTrigger,
} from "./ui/custom-tooltip"

interface Props extends React.ComponentProps<typeof Button> {
  tooltip: string
  toolTipClassName?: string
  toolTipBackgroundColor?: string
  toolTipTextColor?: string
}

function ButtonWithTooltip({
  tooltip,
  toolTipClassName,
  toolTipBackgroundColor,
  toolTipTextColor,
  children,
  ...buttonProps
}: Props) {
  return (
    <CustomTooltipProvider>
      <CustomTooltip>
        <CustomTooltipTrigger asChild>
          <Button {...buttonProps}>{children}</Button>
        </CustomTooltipTrigger>
        <CustomTooltipContent
          className={toolTipClassName}
          backgroundColor={toolTipBackgroundColor}
          textColor={toolTipTextColor}
        >
          <p>{tooltip}</p>
        </CustomTooltipContent>
      </CustomTooltip>
    </CustomTooltipProvider>
  )
}

export default ButtonWithTooltip

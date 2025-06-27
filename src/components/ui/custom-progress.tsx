import * as React from "react"

import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number
  indicatorColor?: string
  completionColor?: string
  animated?: boolean
  animationDuration?: number
  animationDelay?: number
}

const Progress = ({
  ref,
  className,
  value,
  indicatorColor,
  completionColor,
  animated = false,
  animationDuration = 2000,
  animationDelay = 1000,
  ...props
}: ProgressProps & {
  ref?: React.RefObject<React.ElementRef<typeof ProgressPrimitive.Root> | null>
}) => {
  const [animatedValue, setAnimatedValue] = React.useState(animated ? 0 : value || 0)
  const [isFlashing, setIsFlashing] = React.useState(false)

  React.useEffect(() => {
    if (animated && value !== undefined) {
      // Start animation after delay
      const timer = setTimeout(() => {
        setAnimatedValue(value)

        // If reaching 100%, trigger flash animation after the progress animation completes
        if (value === 100) {
          const flashTimer = setTimeout(() => {
            setIsFlashing(true)
            // Stop flashing after a short duration
            setTimeout(() => setIsFlashing(false), 600)
          }, animationDuration)

          return () => clearTimeout(flashTimer)
        }
      }, animationDelay)

      return () => clearTimeout(timer)
    } else if (!animated) {
      setAnimatedValue(value || 0)
      // If not animated but value is 100, still show flash
      if (value === 100) {
        setIsFlashing(true)
        setTimeout(() => setIsFlashing(false), 600)
      }
    }
  }, [value, animated, animationDelay, animationDuration])

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1",
          animated ? "transition-all ease-out" : "transition-all",
          indicatorColor || "bg-primary",
          animatedValue === 100 && completionColor,
          isFlashing && "animate-pulse",
        )}
        style={{
          transform: `translateX(-${100 - animatedValue}%)`,
          transitionDuration: animated ? `${animationDuration}ms` : undefined,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

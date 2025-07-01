import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface Props {
  title?: string
  message?: string
  children?: React.ReactNode
  className?: string
  titleStyles?: string
  descriptionStyles?: string
  iconSize?: string
}

function AlertDestructive({ title, message, titleStyles, descriptionStyles, className }: Props) {
  return (
    <Alert variant="destructive" className={cn("border-destructive/60 text-left", className)}>
      <AlertTitle className={titleStyles}>{title ? title : "Error"}</AlertTitle>
      <AlertDescription className={descriptionStyles}>{message} </AlertDescription>
    </Alert>
  )
}

export default AlertDestructive

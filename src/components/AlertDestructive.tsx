import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Props {
  title?: string
  message?: string
  children?: React.ReactNode
}

function AlertDestructive({ title, message }: Props) {
  return (
    <Alert variant="destructive" className="border-destructive/60 text-left">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title ? title : "Error"}</AlertTitle>
      <AlertDescription>{message} </AlertDescription>
    </Alert>
  )
}

export default AlertDestructive

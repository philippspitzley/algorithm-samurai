import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import ButtonWithTooltip from "../ButtonWithTooltip"

interface Props {
  name?: string
  item?: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  size?: "icon" | "default"
  title?: string
  variant?: "destructive" | "default"
  disabled?: boolean
  asChild?: boolean
  tooltip: string
}

export default function DeleteButton({
  children,
  onClick: onDelete,
  className,
  size,
  item = "item",
  title,
  tooltip,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ButtonWithTooltip
          className={className}
          size={size}
          tooltip={tooltip}
          toolTipColor="destructive"
          toolTipClassName="text-white"
          title={title && tooltip}
          variant="destructive"
        >
          {children}
        </ButtonWithTooltip>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-ctp-red/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This action cannot be undone. This will permanently delete this ${item} and remove your
            data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import { SquarePen, X } from "lucide-react"

import { useAuth } from "@/context/auth/useAuth"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"

interface Props {
  className?: string
  onEdit?: () => void
  onDelete?: () => void
  isEditing?: boolean
}

function AdminEditButtons({ className, onEdit, onDelete, isEditing }: Props) {
  const { user } = useAuth()
  const styles = cn("flex gap-2", className)

  if (!user || !user.is_superuser) return null

  return (
    <div className={styles}>
      <Button
        onClick={onEdit}
        variant="secondary"
        size="icon"
        className={isEditing ? "animate-pulse" : ""}
      >
        <span className="sr-only">Edit</span>
        <SquarePen />
      </Button>
      <Button onClick={onDelete} variant="destructive" size="icon">
        <span className="sr-only">Delete</span>
        <X />
      </Button>
    </div>
  )
}

export default AdminEditButtons

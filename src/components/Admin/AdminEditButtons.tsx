import { SquarePen, X } from "lucide-react"

import { APISchemas } from "@/api/types"
import { cn } from "@/lib/utils"

import ButtonWithTooltip from "../ButtonWithTooltip"
import UpdateChapterForm from "../Chapter/UpdateChapterForm"
import DeleteButton from "./DeleteButton"

interface Props {
  className?: string
  chapter: APISchemas["ChapterPublic"]
  onEdit?: () => void
  onUpdate: (body: APISchemas["ChapterUpdate"]) => void
  onDelete?: () => void
  isEditing?: boolean
}

function AdminEditButtons({ className, chapter, onEdit, onUpdate, onDelete, isEditing }: Props) {
  const styles = cn("flex gap-2", className)

  return (
    <div className={styles}>
      <ButtonWithTooltip
        onClick={onEdit}
        variant="outline"
        size="icon"
        tooltip="Edit Markdown"
        className={isEditing ? "animate-pulse" : ""}
      >
        <SquarePen />
      </ButtonWithTooltip>

      <UpdateChapterForm
        key={`chapter-form-${chapter.id}`}
        defaultValues={chapter}
        onSubmit={onUpdate}
      />

      <DeleteButton
        onClick={onDelete}
        className="bg-ctp-red/80 hover:bg-ctp-red"
        size="icon"
        tooltip="Delete Chapter"
        item="chapter"
      >
        <>
          <X />
        </>
      </DeleteButton>
    </div>
  )
}

export default AdminEditButtons

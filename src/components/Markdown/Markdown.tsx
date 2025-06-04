import { useAuth } from "@/context/auth/useAuth"

import MarkdownForm from "./MarkdownForm"
import MarkdownRender from "./MarkdownRender"

interface Props {
  markdown: string | undefined | null
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  onEdit: (body: object) => void
}

function Markdown({ markdown, onEdit, isEditing, setIsEditing }: Props) {
  const { user } = useAuth()

  if (!markdown) return

  if (user?.is_superuser && markdown && isEditing) {
    return (
      <MarkdownForm
        defaultValue={markdown}
        onEdit={onEdit}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    )
  }

  return <MarkdownRender markdown={markdown} />
}

export default Markdown

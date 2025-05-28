import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { getData } from "@/api/fetch"
import { updateChapter } from "@/api/routes"
import { getUrl } from "@/api/url-constants"
import AdminEditButtons from "@/components/Admin/AdminEditButtons"
import CodeEditor from "@/components/CodeElements/CodeEditor"
import Markdown from "@/components/Markdown/Markdown"
import MarkdownForm from "@/components/Markdown/MarkdownForm"
import { useAuth } from "@/context/auth/useAuth"
import { CourseChapter } from "@/types/api"

function Chapter() {
  const { chapterId } = useParams()
  const [chapter, setChapter] = useState<CourseChapter | null>(null)
  const [exercise, setExercise] = useState<string>("")
  const [adminIsEditing, setAdminIsEditing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!chapterId) return

    async function getChapter() {
      const chapterUrl = `${getUrl("chapters")}/${chapterId}`
      const chapterData: CourseChapter = await getData(chapterUrl)

      setChapter(chapterData)
      setExercise(chapterData?.exercise)
    }

    getChapter()
  }, [chapterId])

  const handleDescriptionUpdate = async (body: { description: string }) => {
    if (!chapterId) {
      console.error("Chapter ID is missing.")
      return
    }
    if (!chapter) {
      console.error("Chapter data not loaded.")
      return
    }

    try {
      // Update database
      await updateChapter(chapterId, body)

      // Update local state
      setChapter((prevChapter) => {
        if (!prevChapter) return null
        return { ...prevChapter, description: body.description }
      })

      toast.success("Chapter description updated successfully!")
    } catch (error) {
      console.error("Failed to update chapter description:", error)
      toast.error("Failed to update description. Please try again.")
    }
  }

  const showMarkdownElements = () => {
    if (user?.is_superuser && chapter && adminIsEditing) {
      return (
        <MarkdownForm defaultValue={chapter.description} callbackFn={handleDescriptionUpdate} />
      )
    } else {
      return <Markdown markdown={chapter?.description} />
    }
  }

  const MarkdownElements = showMarkdownElements()

  const toggleEdit = () => {
    setAdminIsEditing((prev) => !prev)
  }

  const handleDelete = () => {
    toast.error(<div>Chapter successfully deleted!</div>, {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  }

  return (
    <div className="relative flex flex-col gap-4">
      <h1>{chapter?.title}</h1>
      <AdminEditButtons
        isEditing={adminIsEditing}
        onEdit={toggleEdit}
        onDelete={handleDelete}
        className="absolute right-0"
      />

      {MarkdownElements}

      {exercise && <CodeEditor defaultValue={exercise} />}
      {/* key={chapter?.id || exercise} Is that necessary for CodeEditor?*/}
    </div>
  )
}

export default Chapter

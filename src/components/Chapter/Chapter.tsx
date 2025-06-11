import { useState } from "react"

import { useParams } from "react-router-dom"

import AdminEditButtons from "@/components/Admin/AdminEditButtons"
import CodeEditor from "@/components/CodeElements/CodeEditor"
import NotFound from "@/pages/NotFound"

import LoadingSpinner from "../LoadingSpinner"
import Markdown from "../Markdown/Markdown"
import useChapters from "./useChapters"

function Chapter() {
  const { chapterId, courseId } = useParams()
  const [adminIsEditing, setAdminIsEditing] = useState(false)
  const { data, isLoading, isError, updateChapter, deleteChapter } = useChapters({
    chapterId: chapterId!,
    courseId: courseId!,
  })

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <NotFound
        title="Chapter not found"
        message={"Sorry something went wrong. The chapter you are looking for does not exist."}
      />
    )
  }

  const chapter = data?.data?.find((chapter) => chapter.id === chapterId)
  if (!chapter) return

  const toggleEdit = () => {
    setAdminIsEditing((prev) => !prev)
  }

  return (
    <div className="relative flex flex-6 flex-col gap-4">
      <h1 className="text-3xl">{chapter.title}</h1>
      <AdminEditButtons
        isEditing={adminIsEditing}
        onEdit={toggleEdit}
        onDelete={deleteChapter}
        className="absolute right-0"
      />

      <Markdown
        markdown={chapter.description}
        onEdit={updateChapter}
        isEditing={adminIsEditing}
        setIsEditing={setAdminIsEditing}
      />

      {chapter.exercise && <CodeEditor defaultValue={chapter.exercise} />}
    </div>
  )
}

export default Chapter

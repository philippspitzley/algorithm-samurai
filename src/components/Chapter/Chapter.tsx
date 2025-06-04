import { useState } from "react"

import { useParams } from "react-router-dom"

import AdminEditButtons from "@/components/Admin/AdminEditButtons"
import CodeEditor from "@/components/CodeElements/CodeEditor"

import AlertDestructive from "../AlertDestructive"
import LoadingSpinner from "../LoadingSpinner"
import Markdown from "../Markdown/Markdown"
import useChapter from "./useChapter"

function Chapter() {
  const { chapterId } = useParams()
  const [adminIsEditing, setAdminIsEditing] = useState(false)

  const { data, isLoading, isError, updateChapter, deleteChapter } = useChapter({
    chapterId: chapterId!, // force TS to treat chapterID as string and not as string | undefined
  })

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <AlertDestructive
        title="Chapter not found"
        message={"Sorry something went wrong. The chapter you are looking for does not exist."}
      />
    )
  }

  const chapterData = data
  if (!chapterData) return

  const toggleEdit = () => {
    setAdminIsEditing((prev) => !prev)
  }

  return (
    <div className="relative flex flex-col gap-4">
      <h1>{chapterData.title}</h1>
      <AdminEditButtons
        isEditing={adminIsEditing}
        onEdit={toggleEdit}
        onDelete={deleteChapter}
        className="absolute right-0"
      />

      <Markdown
        markdown={chapterData.description}
        onEdit={updateChapter}
        isEditing={adminIsEditing}
        setIsEditing={setAdminIsEditing}
      />

      {chapterData.exercise && <CodeEditor defaultValue={chapterData.exercise} />}
    </div>
  )
}

export default Chapter

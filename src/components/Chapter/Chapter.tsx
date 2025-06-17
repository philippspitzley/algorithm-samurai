import { useEffect, useState } from "react"

import { SquareArrowRight } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import AdminEditButtons from "@/components/Admin/AdminEditButtons"
import CodeEditor from "@/components/CodeElements/CodeEditor"
import NotFound from "@/pages/NotFound"

import LoadingSpinner from "../LoadingSpinner"
import Markdown from "../Markdown/Markdown"
import { Button } from "../ui/button"
import UpdateChapterForm from "./UpdateChapterForm"
import useChapters from "./useChapters"

function Chapter() {
  const { chapterId, courseId } = useParams()
  const [adminIsEditing, setAdminIsEditing] = useState(false)
  const { data, isLoading, isError, updateChapter, deleteChapter } = useChapters({
    chapterId: chapterId!,
    courseId: courseId!,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [chapterId])

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <NotFound
        title="Chapter not found"
        message={"Sorry something went wrong. The chapter you are looking for does not exist."}
      />
    )
  }

  const chapter = data?.data?.find((c) => c.id === chapterId)
  if (!chapter) return

  const nextChapter = data?.data?.find(
    (c) => c.chapter_num === chapter.chapter_num + 1 && c.course_id === chapter.course_id,
  )

  const toggleEdit = () => {
    setAdminIsEditing((prev) => !prev)
  }

  return (
    <div className="relative flex flex-6 flex-col gap-4">
      <h1 className="text-3xl">{chapter.title}</h1>

      <UpdateChapterForm
        key={`chapter-form-${chapter.id}`}
        onSubmit={updateChapter}
        defaultValues={chapter}
      />

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

      {chapter.exercise && (
        <CodeEditor defaultValue={chapter.exercise} testCode={chapter.test_code} />
      )}
      {nextChapter && (
        <Button asChild>
          <Link to={`/courses/${courseId}/${nextChapter.id}`}>
            Next Chapter <SquareArrowRight />
          </Link>
        </Button>
      )}
    </div>
  )
}

export default Chapter

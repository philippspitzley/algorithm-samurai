import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import AdminContext from "@/components/Admin/AdminContext"
import AdminEditButtons from "@/components/Admin/AdminEditButtons"
import CodeEditor from "@/components/CodeElements/CodeEditor"
import LoadingSpinner from "@/components/LoadingSpinner"
import Markdown from "@/components/Markdown/Markdown"
import NotFound from "@/pages/NotFound"

import NextChapterButton from "./NextChapterButton"
import useChapters from "./useChapters"

function Chapter() {
  const { chapterId, courseId } = useParams()
  const [adminIsEditing, setAdminIsEditing] = useState(false)
  const [testPassed, setTestPassed] = useState(false)
  const {
    data: chapters,
    isLoading,
    isError,
    updateChapter,
    deleteChapter,
  } = useChapters({
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

  const chapter = chapters?.data?.find((c) => c.id === chapterId)
  if (!chapter) return

  const nextChapter = chapters?.data?.find(
    (c) => c.chapter_num === chapter.chapter_num + 1 && c.course_id === chapter.course_id,
  )

  const toggleEdit = () => {
    setAdminIsEditing((prev) => !prev)
  }

  return (
    <div className="relative flex min-w-0 flex-6 flex-col gap-4 overflow-hidden">
      <h1 className="text-3xl">{`Chapter ${chapter.chapter_num}`}</h1>
      <AdminContext>
        <AdminEditButtons
          isEditing={adminIsEditing}
          onEdit={toggleEdit}
          onDelete={deleteChapter}
          className="absolute top-0 right-0"
          chapter={chapter}
          onUpdate={updateChapter}
        />
      </AdminContext>
      <div className="flex-1 overflow-y-auto">
        <Markdown
          markdown={chapter.description}
          onEdit={updateChapter}
          isEditing={adminIsEditing}
          setIsEditing={setAdminIsEditing}
        />
        {chapter.exercise && (
          <CodeEditor
            key={`code-editor-${chapter.id}`}
            defaultValue={chapter.exercise}
            testCode={chapter.test_code}
            onTestPassedChange={setTestPassed}
          />
        )}
      </div>

      <NextChapterButton
        lastChapterNum={chapters?.data && chapters.data.length}
        currentChapter={chapter}
        nextChapter={nextChapter}
        testPassed={testPassed}
      />
    </div>
  )
}

export default Chapter

import { Circle, CircleCheck, Plus } from "lucide-react"
import { NavLink } from "react-router-dom"
import { toast } from "sonner"

import { APISchemas } from "@/api/types"
import useUserCourses from "@/context/userCourses/useUserCourses"
import { cn } from "@/lib/utils"
import NotFound from "@/pages/NotFound"

import AdminContext from "../Admin/AdminContext"
import LoadingSpinner from "../LoadingSpinner"
import { Button } from "../ui/button"
import useChapters from "./useChapters"

interface Props {
  courseId: string | undefined
  title: string | undefined
  className?: string
}

function ChapterSidebar(props: Props) {
  const { courseId, title, className } = props

  const { data: chapters, isLoading, isError, createChapter } = useChapters({ courseId: courseId! })
  const { userCourses } = useUserCourses()

  if (isLoading) return <LoadingSpinner />

  if (isError) return <NotFound title="Chapters not found." message="Sorry something went wrong" />

  const finishedChapters =
    userCourses?.find((course) => course.course_id === courseId)?.finished_chapters || []

  const createNewChapter = () => {
    const newChapterTitle = "New Chapter"
    const newChapterDescription = "Description of the new chapter"
    if (!chapters) {
      toast.error("Chapters data is not available.")
      return
    }
    const newChapter: APISchemas["ChapterCreate"] = {
      title: newChapterTitle,
      description: newChapterDescription,
      chapter_num: chapters?.count ? chapters.count + 1 : 1,
    }
    createChapter(newChapter)
  }
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <NavLink
        to={`courses/${courseId}`}
        end
        className={({ isActive }) =>
          `hover:bg-primary/5 flex min-w-50 items-center justify-between rounded-xl px-4 py-2 ${
            isActive ? "bg-primary/10 text-primary font-semibold" : ""
          }`
        }
      >
        {title} Intro
      </NavLink>

      {chapters?.data?.map((chapter) => {
        return (
          <NavLink
            key={chapter.id}
            to={`courses/${courseId}/${chapter.id}`}
            className={({ isActive }) =>
              `hover:bg-primary/5 flex min-w-50 items-center justify-between rounded-xl px-4 py-2 ${
                isActive ? "bg-primary/10 text-primary font-semibold" : ""
              }`
            }
          >
            {chapter.title}
            {finishedChapters?.includes(chapter.id) ? (
              <CircleCheck size={18} className="text-green-400" />
            ) : (
              <Circle size={18} />
            )}
          </NavLink>
        )
      })}
      <AdminContext className="w-full">
        <Button variant="outline" onClick={createNewChapter} className="w-full">
          <Plus /> Add Chapter
        </Button>
      </AdminContext>
    </div>
  )
}

export default ChapterSidebar

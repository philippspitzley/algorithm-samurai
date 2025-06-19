import { Circle, CircleCheck } from "lucide-react"
import { NavLink } from "react-router-dom"

import useUserCourses from "@/context/userCourses/useUserCourses"
import { cn } from "@/lib/utils"
import NotFound from "@/pages/NotFound"

import AdminContext from "../Admin/AdminContext"
import LoadingSpinner from "../LoadingSpinner"
import AddChapterButton from "./AddChapterButton"
import useChapters from "./useChapters"

interface Props {
  courseId: string | undefined
  title: string | undefined
  className?: string
}

function ChapterSidebar(props: Props) {
  const { courseId, title, className } = props

  const { data: chapters, isLoading, isError, createChapter } = useChapters({ courseId: courseId! })
  const { userCourses, updateMyCourseProgress } = useUserCourses()

  if (isLoading) return <LoadingSpinner />

  if (isError) return <NotFound title="Chapters not found." message="Sorry something went wrong" />

  const finishedChapters =
    userCourses?.find((course) => course.course_id === courseId)?.finished_chapters || []

  return (
    <div className={cn("flex flex-col items-center gap-2 max-lg:w-10", className)}>
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
              <CircleCheck size={18} className="text-terminal" />
            ) : (
              <Circle size={18} />
            )}
          </NavLink>
        )
      })}
      <AdminContext className="w-full">
        <AddChapterButton
          courseId={courseId!}
          onCreateChapter={createChapter}
          onProgressUpdate={updateMyCourseProgress}
        />
      </AdminContext>
    </div>
  )
}

export default ChapterSidebar

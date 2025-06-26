import { Menu } from "lucide-react"

import useUserCourses from "@/context/userCourses/useUserCourses"
import { cn } from "@/lib/utils"
import NotFound from "@/pages/NotFound"

import LoadingSpinner from "../LoadingSpinner"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import SidebarContent from "./SidebarContent"
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
    <>
      {/* Desktop Sidebar - visible on md screens and up */}
      <div className={cn("hidden flex-col items-center gap-2 md:flex", className)}>
        <SidebarContent
          courseId={courseId!}
          title={title!}
          chapters={chapters!}
          finishedChapters={finishedChapters}
          createChapter={createChapter}
          updateMyCourseProgress={updateMyCourseProgress}
        />
      </div>

      {/* Mobile Popover - visible below md screens */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="sticky z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-64 p-4">
            <SidebarContent
              courseId={courseId!}
              title={title!}
              chapters={chapters!}
              finishedChapters={finishedChapters}
              createChapter={createChapter}
              updateMyCourseProgress={updateMyCourseProgress}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}

export default ChapterSidebar

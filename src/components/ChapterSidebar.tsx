import { useEffect, useState } from "react"

import { Circle, CircleCheck } from "lucide-react"
import { NavLink } from "react-router-dom"

import { getChapters, getUserProgress } from "@/api/routes"
import { cn } from "@/lib/utils"
import { CourseChapter, UserCourse } from "@/types/api"

interface Props {
  courseId: string | undefined
  title: string | undefined
  className?: string
}

function ChapterSidebar(props: Props) {
  const { courseId, title, className } = props
  const [chapters, setChapters] = useState<CourseChapter[] | null>(null)
  const [userProgress, setUserProgress] = useState<UserCourse | null>(null)

  useEffect(() => {
    if (!courseId) {
      setChapters(null)
      setUserProgress(null) // Also reset userProgress
      return
    }

    async function loadData() {
      try {
        // Fetch in parallel
        const [fetchedChapters, fetchedUserProgressResponse] = await Promise.all([
          getChapters(courseId as string),
          getUserProgress(courseId as string),
        ])

        setChapters(fetchedChapters)

        if (fetchedUserProgressResponse) {
          setUserProgress({
            ...fetchedUserProgressResponse,
            // Ensure finished_chapters is an array, even if API sends null
            finished_chapters: fetchedUserProgressResponse.finished_chapters || [],
          })
        } else {
          setUserProgress(null)
        }
      } catch (error) {
        console.error("Failed to load sidebar data:", error)
        setChapters(null)
        setUserProgress(null)
      }
    }

    loadData()
  }, [courseId])

  const chapterElements = chapters?.map((chapter) => {
    // Now, userProgress.finished_chapters will be an array (possibly empty) if userProgress is not null
    const isChapterFinished = userProgress?.finished_chapters?.includes(chapter.id) ?? false

    return (
      <div key={chapter.id} className={cn("flex flex-col", className)}>
        <NavLink
          to={`courses/${courseId}/${chapter.id}`}
          className={({ isActive }) =>
            `hover:bg-primary/5 ml-2 flex items-center justify-between rounded-xl px-4 py-2 ${
              isActive ? "bg-primary/10 text-primary font-semibold" : ""
            }`
          }
        >
          {chapter.title}
          {isChapterFinished ? (
            <CircleCheck size={18} className="text-green-500" />
          ) : (
            <Circle size={18} />
          )}
        </NavLink>
      </div>
    )
  })

  return (
    <div className="bg-background/50 flex w-80 flex-col gap-2 rounded-lg border p-4">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      {chapterElements}
    </div>
  )
}

export default ChapterSidebar

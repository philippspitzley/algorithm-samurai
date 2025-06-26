import { Circle, CircleCheck } from "lucide-react"
import { NavLink } from "react-router-dom"

import { APISchemas } from "@/api/types"

import AdminContext from "../Admin/AdminContext"
import AddChapterButton from "./AddChapterButton"

interface SidebarContentProps {
  courseId: string
  title: string
  chapters: APISchemas["ChaptersPublic"]
  finishedChapters: string[]
  createChapter: (chapter: APISchemas["ChapterCreate"]) => void
  updateMyCourseProgress: (courseId: string) => void
}

function SidebarContent({
  courseId,
  title,
  chapters,
  finishedChapters,
  createChapter,
  updateMyCourseProgress,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col items-center gap-2">
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
              <CircleCheck size={18} className="text-accent" />
            ) : (
              <Circle size={18} />
            )}
          </NavLink>
        )
      })}
      <AdminContext className="w-full">
        <AddChapterButton
          courseId={courseId}
          onCreateChapter={createChapter}
          onProgressUpdate={updateMyCourseProgress}
        />
      </AdminContext>
    </div>
  )
}

export default SidebarContent

import { createContext, use } from "react"

import { components } from "@/api/openapi-schemas"
import { APISchemas } from "@/api/types"

interface UserCoursesContextType {
  userCourses: APISchemas["UserCoursePublic"][] | undefined
  error: {
    detail?: components["schemas"]["ValidationError"][]
  } | null
  isLoading: boolean
  isError: boolean
  isEnrolled: (courseId: string) => boolean
  enrollCourse: (courseId: string) => void
  getMyCourse: (courseId: string) => APISchemas["UserCoursePublic"] | undefined
  updateMyCourse: (courseId: string, body: APISchemas["UserCourseUpdate"]) => void
  completeMyChapter: (chapterId: string) => void
  isMyChapterCompleted: (chapterId: string, courseId: string) => boolean
  updateMyCourseProgress: (courseId: string) => void
}

// Context Provider
export const UserCoursesContext = createContext<UserCoursesContextType | undefined>(undefined)

// useContext Hook
export const useUserCoursesContext = () => {
  const context = use(UserCoursesContext)
  if (context === undefined) {
    throw new Error("useUserCoursesContext must be used within a UserCoursesProvider")
  }
  return context
}

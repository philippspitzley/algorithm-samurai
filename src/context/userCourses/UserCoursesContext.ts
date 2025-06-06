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
  isEnrolledInCourse: (courseId: string) => boolean
  getCourse: (courseId: string) => APISchemas["UserCoursePublic"] | undefined
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

import { ReactNode } from "react"

import { UserCoursesContext } from "./UserCoursesContext"
import useUserCourses from "./useUserCourses"

export const UserCoursesProvider = ({ children }: { children: ReactNode }) => {
  const userCourseData = useUserCourses()

  return <UserCoursesContext value={userCourseData}>{children}</UserCoursesContext>
}

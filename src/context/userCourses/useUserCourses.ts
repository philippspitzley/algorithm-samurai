import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"
import { useAuth } from "@/context/auth/useAuth"

function useUserCourses() {
  const { isAuthenticated } = useAuth()

  const { data, error, isLoading, isError } = $api.useQuery(
    "get",
    "/api/v1/users/me/courses",
    {},
    {
      enabled: isAuthenticated, // Only run if authenticated
      staleTime: Infinity, // Cache indefinitely
      refetchOnWindowFocus: false, // Prevent excessive refetching
    },
  )

  const isEnrolledInCourse = (courseId: string) => {
    if (!data) return false

    const isEnrolled = (uc: APISchemas["UserCoursePublic"]) => {
      return uc.course_id === courseId && uc.status === "enrolled"
    }

    return data.some((userCourse) => isEnrolled(userCourse))
  }

  const getCourse = (courseId: string) => {
    if (!data) return

    return data.find((userCourse) => userCourse.course_id === courseId)
  }

  return { userCourses: data, error, isLoading, isError, isEnrolledInCourse, getCourse }
}

export default useUserCourses

import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"
import { useAuth } from "@/context/auth/useAuth"

function useUserCourses() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

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

  const { mutate: enroll } = $api.useMutation("post", "/api/v1/users/me/courses/{course_id}", {
    onSuccess: () => {
      // Invalidate the user courses query to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/users/me/courses"],
      })

      toast.success("Successfully enrolled in the course!")
    },
    onError: (error) => {
      // FIXME: add detail props to the error type
      // @ts-expect-error detail is not defined in the type
      toast.error("Failed to enroll in the course.", { description: error.detail.message })
      console.error("Enrollment error:", error)
    },
  })

  const getCourse = (courseId: string) => {
    if (!data) return

    return data.find((userCourse) => userCourse.course_id === courseId)
  }

  const isEnrolled = (courseId: string) => {
    if (!data) return false

    const isEnrolled = (uc: APISchemas["UserCoursePublic"]) => {
      return uc.course_id === courseId && uc.status === "enrolled"
    }

    return data.some((userCourse) => isEnrolled(userCourse))
  }

  const enrollCourse = (courseId: string) => {
    enroll({
      params: { path: { course_id: courseId } },
    })
  }

  return {
    userCourses: data,
    error,
    isLoading,
    isError,
    isEnrolled,
    enrollCourse,
    getCourse,
  }
}

export default useUserCourses

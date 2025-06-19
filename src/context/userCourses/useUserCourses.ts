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

  const { mutate: enroll } = $api.useMutation(
    "post",
    "/api/v1/users/me/courses/{course_id}/enroll",
    {
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
    },
  )

  const { mutate: complete } = $api.useMutation(
    "post",
    "/api/v1/users/me/chapters/{chapter_id}/complete",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/users/me/courses"],
        })

        toast.success("Chapter completed!")
      },
      onError: () => {
        // FIXME: add detail props to the error type
        // @ts-expect-error detail is not defined in the type
        toast.error("Failed to complete chapter.", { description: error.detail.message })
        console.error("Completion error:", error)
      },
    },
  )

  const { mutate: updateProgress } = $api.useMutation(
    "patch",
    "/api/v1/users/me/course/{course_id}/updateProgress",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/users/me/courses"], // Add the leading slash
        })

        toast.success("Progress updated")
      },
      onError: () => {
        // FIXME: add detail props to the error type
        // @ts-expect-error detail is not defined in the type
        toast.error("Failed to update progress.", { description: error.detail.message })
        console.error("Update error:", error)
      },
    },
  )

  const { mutate: updateCourse } = $api.useMutation(
    "patch",
    "/api/v1/users/me/courses/{course_id}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/v1/users/me/courses"], // Add the leading slash here too
        })

        toast.success("Successfully updated chapter!")
      },
      onError: () => {
        // FIXME: add detail props to the error type
        // @ts-expect-error detail is not defined in the type
        toast.error("Failed to update chapter.", { description: error.detail.message })
        console.error("Update error:", error)
      },
    },
  )

  const getMyCourse = (courseId: string) => {
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

  const completeMyChapter = (chapterId: string) => {
    complete({
      params: { path: { chapter_id: chapterId } },
    })
  }

  const isMyChapterCompleted = (chapterId: string, courseId: string) => {
    const myCourse = getMyCourse(courseId)
    return !!myCourse?.finished_chapters.find((id) => id === chapterId)
  }

  const updateMyCourseProgress = (courseId: string) => {
    updateProgress({ params: { path: { course_id: courseId } } })
  }

  const updateMyCourse = (courseId: string, body: APISchemas["UserCourseUpdate"]) => {
    updateCourse({
      params: { path: { course_id: courseId } },
      body: body,
    })
  }

  return {
    // Data
    userCourses: data,
    error,

    // State
    isLoading,
    isError,
    isEnrolled,

    // Action
    enrollCourse,
    getMyCourse,
    updateMyCourse,
    updateMyCourseProgress,
    completeMyChapter,
    isMyChapterCompleted,
  }
}

export default useUserCourses

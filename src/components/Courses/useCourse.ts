import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

type CourseUpdate = APISchemas["CourseUpdate"]

interface Props {
  courseId: string
}

function useCourses({ courseId }: Props) {
  const queryClient = useQueryClient()

  const { mutate: update } = $api.useMutation("patch", "/api/v1/courses/{course_id}", {
    onSuccess: () => {
      toast.success("Course updated.")

      queryClient.invalidateQueries({
        queryKey: [
          "get",
          "/api/v1/courses/{course_id}",
          { params: { path: { course_id: courseId } } },
        ],
      })

      queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/courses/"],
      })
    },
    onError: (error) => {
      toast.error("Something went wrong.")
      console.error(error)
    },
  })

  const updateCourse = (body: CourseUpdate) => {
    update({ params: { path: { course_id: courseId } }, body: body })
  }

  const { mutate: remove } = $api.useMutation("delete", "/api/v1/courses/{course_id}", {
    onSuccess: () => {
      toast.success("Course deleted.")

      queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/courses/"],
      })

      queryClient.removeQueries({
        queryKey: [
          "get",
          "/api/v1/courses/{course_id}",
          { params: { path: { course_id: courseId } } },
        ],
      })
    },
    onError: (error) => {
      toast.error("Something went wrong.")
      console.error(error)
    },
  })

  const deleteCourse = () => {
    remove({ params: { path: { course_id: courseId } } })
  }

  return { updateCourse, deleteCourse }
}

export default useCourses

import { useIsFetching, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

type CourseCreate = APISchemas["CourseCreate"]

function useCourses() {
  const queryClient = useQueryClient()
  const isLoading = useIsFetching()

  const { data, error, isError } = $api.useQuery("get", "/api/v1/courses/", {
    params: { query: { include_chapters: false } },
  })

  const { mutate: create } = $api.useMutation("post", "/api/v1/courses/", {
    onSuccess: () => {
      toast.success("New Course added.")

      queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/courses/"],
      })
    },
    onError: (error) => {
      // FIXME: add detail props to the error type
      // @ts-expect-error detail is not defined in the type
      toast.error("Something went wrong.", { description: error.detail.message })
      console.error(error)
    },
  })

  const createCourse = (body: CourseCreate) => {
    create({ body: body })
  }

  return { data, createCourse, error, isLoading, isError }
}

export default useCourses

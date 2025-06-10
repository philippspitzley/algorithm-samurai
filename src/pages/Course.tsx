import { useParams } from "react-router-dom"

import { $api } from "@/api/api"
import LoadingSpinner from "@/components/LoadingSpinner"
import NotFound from "@/pages/NotFound"
import { type Course } from "@/types/api"

function Course() {
  const { courseId } = useParams()

  const { data, isLoading, isError } = $api.useQuery("get", "/api/v1/courses/{course_id}", {
    params: { path: { course_id: courseId! } },

    enabled: !!courseId,
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <NotFound />
  }

  const course = data

  return (
    <div className="flex gap-6">
      <div className="max-w-4xl">
        <h2 className="text-2xl">{course?.title}</h2>
        <p>{course?.description}</p>
      </div>
    </div>
  )
}

export default Course

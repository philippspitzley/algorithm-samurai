import { Outlet, useParams } from "react-router-dom"

import { $api } from "@/api/api"
import ChapterSidebar from "@/components/Chapter/ChapterSidebar"
import LoadingSpinner from "@/components/LoadingSpinner"

import NotFound from "./NotFound"

function CourseLayout() {
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
    <>
      <div className="bg-background/90 flex gap-6 rounded-xl border-1 p-8 backdrop-blur-lg">
        <ChapterSidebar courseId={course?.id} title={course?.title} />
        <Outlet />
      </div>
    </>
  )
}

export default CourseLayout

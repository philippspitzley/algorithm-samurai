import { Outlet, useParams } from "react-router-dom"

import { $api } from "@/api/api"
import ChapterSidebar from "@/components/Chapter/ChapterSidebar"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Card } from "@/components/ui/card"

import NotFound from "../../pages/NotFound"

function CourseLayout() {
  const { courseId } = useParams()

  const { data, isLoading, isError } = $api.useQuery("get", "/api/v1/courses/{course_id}", {
    params: { path: { course_id: courseId! }, query: { include_chapters: false } },
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
    <Card className="flex flex-row rounded-xl border-1 p-4 backdrop-blur-lg md:p-12">
      <ChapterSidebar courseId={course?.id} title={course?.title} />
      <Outlet />
    </Card>
  )
}

export default CourseLayout

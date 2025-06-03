import { toast } from "sonner"

import { $api } from "@/api/api"
import LoadingSpinner from "@/components/LoadingSpinner"

import Course from "./Course"

function Courses() {
  const { data, error, isLoading, isError } = $api.useQuery("get", "/api/v1/courses/")

  if (isLoading) return <LoadingSpinner />

  if (isError) return toast.error("Something went wrong.", { description: error?.detail?.[0].msg })

  const courses = data?.data
  const courseElements = courses?.map((course) => <Course key={course.id} data={course} />)

  return (
    <main className="mt-8 px-4">
      {courses && <div className="flex flex-col items-center gap-4">{courseElements}</div>}
    </main>
  )
}

export default Courses

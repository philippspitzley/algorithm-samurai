import { toast } from "sonner"

import LoadingSpinner from "@/components/LoadingSpinner"

import AdminContext from "../Admin/AdminContext"
import { Card } from "../ui/card"
import Course from "./Course"
import CreateCourseForm from "./CreateCourseForm"
import useCourses from "./useCourses"

function Courses() {
  const { data, error, isLoading, isError, createCourse } = useCourses()

  if (isLoading) return <LoadingSpinner />

  if (isError) return toast.error("Something went wrong.", { description: error?.detail?.[0].msg })

  const courses = data?.data
  const courseElements = courses?.map((course) => <Course key={course.id} data={course} />)

  return (
    <main className="mt-8 flex flex-col items-center px-4">
      <AdminContext className="mb-6 w-full max-w-3xl min-w-xs">
        <Card className="w-full max-w-3xl min-w-xs px-6">
          <CreateCourseForm onSubmit={createCourse} />
        </Card>
      </AdminContext>
      {courses && <div className="flex flex-col items-center gap-4">{courseElements}</div>}
    </main>
  )
}

export default Courses

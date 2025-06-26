import { toast } from "sonner"

import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/context/auth/useAuth"

import AdminContext from "../Admin/AdminContext"
import LoginButton from "../LoginButton"
import { Card } from "../ui/card"
import Course from "./Course"
import CreateCourseForm from "./CreateCourseForm"
import useCourses from "./useCourses"

function Courses() {
  const { data, error, isLoading, isError, createCourse } = useCourses()
  const { isAuthenticated } = useAuth()

  if (isLoading) return <LoadingSpinner />

  if (isError) return toast.error("Something went wrong.", { description: error?.detail?.[0].msg })

  const courses = data?.data
  const courseElements = courses?.map((course) => <Course key={course.id} data={course} />)

  return (
    <main className="mt-8 flex flex-col items-center px-4">
      <AdminContext className="mb-6 w-full min-w-xs">
        <Card className="w-full min-w-xs px-6">
          <CreateCourseForm onSubmit={createCourse} />
        </Card>
      </AdminContext>

      {courses && <div className="flex flex-wrap items-center gap-4">{courseElements}</div>}
      {!isAuthenticated && (
        <LoginButton className="mt-4 w-full">Please log in to enroll</LoginButton>
      )}
    </main>
  )
}

export default Courses

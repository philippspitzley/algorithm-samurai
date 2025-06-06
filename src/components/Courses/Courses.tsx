import { Link } from "react-router-dom"
import { toast } from "sonner"

import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/context/auth/useAuth"

import AdminContext from "../Admin/AdminContext"
import { Button } from "../ui/button"
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
      <AdminContext className="mb-6 w-full max-w-3xl min-w-xs">
        <Card className="w-full max-w-3xl min-w-xs px-6">
          <CreateCourseForm onSubmit={createCourse} />
        </Card>
      </AdminContext>

      {!isAuthenticated && (
        <div className="mb-6 w-full max-w-3xl min-w-xs">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Please log in to enroll</Link>
          </Button>
        </div>
      )}

      {courses && <div className="flex flex-wrap items-center gap-4">{courseElements}</div>}
    </main>
  )
}

export default Courses

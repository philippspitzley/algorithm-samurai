import { X } from "lucide-react"
import { Link } from "react-router-dom"

import { APISchemas } from "@/api/types"
import Markdown from "@/components/Markdown/MarkdownRender"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

import AdminContext from "../Admin/AdminContext"
import { Button } from "../ui/button"
import UpdateCourseForm from "./UpdateCourseForm"
import useCourses from "./useCourse"

interface Props {
  data: APISchemas["CoursePublic"]
}

function Course({ data: course }: Props) {
  const { updateCourse, deleteCourse } = useCourses({ courseId: course.id })

  return (
    <Card key={course.id} className="relative w-full max-w-3xl min-w-xs px-6">
      <AdminContext className="absolute right-6 flex gap-2">
        <UpdateCourseForm onSubmit={updateCourse} defaultValues={course} />
        <Button onClick={deleteCourse} variant="destructive" size="icon">
          <span className="sr-only">Delete</span>
          <X />
        </Button>
      </AdminContext>

      <div className="flex justify-between">
        <Link to={course.id}>
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </Link>
      </div>

      {course?.description && (
        <CardDescription className="-mt-4">
          <div className="line-clamp-4">
            <Markdown markdown={course.description} />
          </div>
        </CardDescription>
      )}
    </Card>
  )
}

export default Course

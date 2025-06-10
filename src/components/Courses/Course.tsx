import { Award, BadgeCheck, X } from "lucide-react"
import { Link } from "react-router-dom"

import { APISchemas } from "@/api/types"
import Markdown from "@/components/Markdown/MarkdownRender"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth/useAuth"
import { useUserCoursesContext } from "@/context/userCourses/UserCoursesContext"

import AdminContext from "../Admin/AdminContext"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import UpdateCourseForm from "./UpdateCourseForm"
import useCourses from "./useCourse"

interface Props {
  data: APISchemas["CoursePublic"]
}

function Course({ data: course }: Props) {
  const { isAuthenticated } = useAuth()
  const { updateCourse, deleteCourse } = useCourses({ courseId: course.id })
  const { isEnrolledInCourse, getCourse } = useUserCoursesContext()

  const isEnrolled = isAuthenticated ? isEnrolledInCourse(course.id) : false
  const canAccessCourse = isAuthenticated && isEnrolled
  const userCourse = getCourse(course.id)

  const StatusBadge = (
    <Badge variant={"secondary"} className="bg-terminal text-background">
      <BadgeCheck />
      {userCourse?.status}
    </Badge>
  )
  const ProgressBadge = (
    <Badge variant={"secondary"} className="text-background bg-amber-200">
      <Award />
      {userCourse?.progress}% complete
    </Badge>
  )

  return (
    <Card key={course.id} className="group relative max-w-3xl min-w-xs flex-1 basis-sm px-6">
      <AdminContext className="absolute right-6 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <UpdateCourseForm onSubmit={updateCourse} defaultValues={course} />
        <Button onClick={deleteCourse} variant="destructive" size="icon">
          <span className="sr-only">Delete</span>
          <X />
        </Button>
      </AdminContext>

      {canAccessCourse ? (
        <div className="flex flex-wrap items-center gap-6">
          <Link to={course.id}>
            <CardTitle className="cursor-pointer text-lg hover:underline">{course.title}</CardTitle>
          </Link>
          <div className="flex flex-99999 gap-2">
            {StatusBadge}
            {ProgressBadge}
          </div>
        </div>
      ) : (
        <CardTitle className="text-lg">{course.title}</CardTitle>
      )}

      {course?.description && (
        <CardDescription className="line-clamp-4">
          <Markdown markdown={course.description} />
        </CardDescription>
      )}

      {!canAccessCourse && isAuthenticated && (
        <div className="mt-4">
          <Button className="w-full">Enroll now</Button>
        </div>
      )}

      {canAccessCourse && <Progress value={userCourse?.progress} />}
    </Card>
  )
}

export default Course

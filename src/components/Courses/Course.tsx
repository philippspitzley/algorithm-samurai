import { Award, BadgeCheck, X } from "lucide-react"
import { Link } from "react-router-dom"

import { APISchemas } from "@/api/types"
import Markdown from "@/components/Markdown/MarkdownRender"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  const { isEnrolled, enrollCourse, getMyCourse } = useUserCoursesContext()
  const userCourse = getMyCourse(course.id)

  const courseEnrolled = isAuthenticated ? isEnrolled(course.id) : false
  const canAccessCourse = isAuthenticated && courseEnrolled

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
    <Card key={course.id} className="group @container relative h-68 min-w-xs flex-1 basis-sm">
      <AdminContext className="absolute right-6 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <UpdateCourseForm onSubmit={updateCourse} defaultValues={course} />
        <Button onClick={deleteCourse} variant="destructive" size="icon">
          <span className="sr-only">Delete</span>
          <X />
        </Button>
      </AdminContext>

      <CardHeader className="flex flex-col gap-4 @lg:flex-row @lg:items-center">
        {canAccessCourse ? (
          <>
            <Link to={course.id} className="flex-1 cursor-pointer hover:underline">
              <CardTitle className="text-2xl">{course.title}</CardTitle>
            </Link>

            <div className="flex gap-2">
              {StatusBadge}
              {ProgressBadge}
            </div>
          </>
        ) : (
          <CardTitle className="text-2xl">{course.title}</CardTitle>
        )}
      </CardHeader>

      {course?.description && (
        <CardContent className="text-foreground/60 relative overflow-hidden">
          <Markdown markdown={course.description} />
          <div className="via-card from-card pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t to-transparent" />
        </CardContent>
      )}

      <CardFooter>
        {!canAccessCourse && isAuthenticated && (
          <Button onClick={() => enrollCourse(course.id)} className="w-full">
            Enroll now
          </Button>
        )}
        {canAccessCourse && <Progress value={userCourse?.progress} />}
      </CardFooter>
    </Card>
  )
}

export default Course

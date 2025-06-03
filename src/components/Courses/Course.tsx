import { SquarePen, X } from "lucide-react"
import { Link } from "react-router-dom"

import { APISchemas } from "@/api/types"
import { useAuth } from "@/context/auth/useAuth"

import Markdown from "../Markdown/Markdown"
import { Button } from "../ui/button"
import { Card, CardDescription, CardTitle } from "../ui/card"

interface Props {
  data: APISchemas["CoursePublic"]
}

function Course({ data: course }: Props) {
  const { user } = useAuth()

  return (
    <Card key={course.id} className="w-full max-w-3xl min-w-xs px-6">
      <div className="flex justify-between">
        <Link to={course.id}>
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </Link>
        {user?.is_superuser && (
          <div className="flex gap-2">
            <Button variant="secondary" size="icon">
              <SquarePen />
            </Button>
            <Button variant="destructive" size="icon">
              <X />
            </Button>
          </div>
        )}
      </div>

      {course?.description && (
        <CardDescription className="-mt-4">
          <Markdown markdown={course.description} />
        </CardDescription>
      )}
    </Card>
  )
}

export default Course

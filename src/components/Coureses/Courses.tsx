import { LoaderCircle, SquarePen, X } from "lucide-react"
import { Link } from "react-router-dom"

import { $api } from "@/api/api"
import Markdown from "@/components/Markdown/Markdown"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth/useAuth"

function Courses() {
  const { user } = useAuth()
  const { data, error, isLoading } = $api.useQuery("get", "/api/v1/courses/")

  if (!data || isLoading)
    return (
      <div className="flex w-full items-center justify-center backdrop-blur-2xl">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    )
  if (error) return `Error: ${error.detail}`

  const courses = data.data
  return (
    <main className="mt-8 px-4">
      {courses && (
        <div className="flex flex-col items-center gap-4">
          {courses.map((course) => (
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
          ))}
        </div>
      )}
    </main>
  )
}

export default Courses

import { useEffect, useState } from "react"

import { SquarePen, X } from "lucide-react"

import { fetchData } from "@/api/fetch"
import { getUrl } from "@/api/url-constants"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth/useAuth"

type apiResponse = {
  count: number | null
  data: Course[]
}

type Course = {
  title: string
  description: string
  id: string
  chapters: Chapter[]
}

type Chapter = {
  chapter_num: number
  title: string
  description: string
  id: string
  course_id: string
  points: Point[]
}

type Point = {
  chapter_point_num: number
  text: string
  code_block: string
  image: string
  video: string
  id: string
  chapter_id: string
}

function Courses() {
  const [courses, setCourse] = useState<Course[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  async function getCourses() {
    setIsLoading(true)
    const url = getUrl("courses")
    const data = await fetchData<apiResponse>(url)
    setCourse(data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getCourses()
  }, [])

  return (
    <main className="mt-8 px-4">
      {isLoading ? "Loading..." : null}
      {courses && (
        <div className="flex flex-col items-center gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="w-full max-w-3xl min-w-xs px-6">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{course.title}</CardTitle>
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

              <CardDescription className="-mt-4">
                {course.description.split("\n").map((line, i) => (
                  <p key={i + line}>{line}</p>
                ))}
              </CardDescription>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default Courses

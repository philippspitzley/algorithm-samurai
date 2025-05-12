import { useEffect, useState } from "react"

import { fetchData } from "@/api/fetch"
import { getUrl } from "@/api/url-constants"
import CodeBlock from "@/components/CodeElements/CodeBlock"

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
    <main className="mt-8 flex justify-center px-4">
      {isLoading ? "Loading..." : null}
      {courses && (
        <div>
          {courses.map((course) => (
            <div key={course.id} className="mx-auto w-2xl">
              <div className="flex flex-col items-center gap-4 p-2">
                <header className="self-start">
                  <h2 className="text-primary font-samurai text-8xl uppercase">
                    {course.title}
                  </h2>

                  <p>{course.description}</p>
                </header>
                <div className="w-2xl">
                  <section>
                    <h3 className="text-2xl">
                      <span className="mr-4">
                        {course.chapters[0].chapter_num}
                      </span>
                      <span>{course.chapters[0].title}</span>
                    </h3>

                    <p>{course.chapters[0].description}</p>
                    <p>{course.chapters[0].points[0].chapter_point_num}</p>
                    <p>{course.chapters[0].points[0].text}</p>
                  </section>
                </div>
                <CodeBlock
                  code={course.chapters[0].points[0].code_block}
                  language="python"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Courses

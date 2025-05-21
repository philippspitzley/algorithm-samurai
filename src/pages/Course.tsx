import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { ApiError, getData } from "@/api/fetch"
import { getUrl } from "@/api/url-constants"
import AlertDestructive from "@/components/AlertDestructive"
import NotFound from "@/pages/NotFound"
import { type Course } from "@/types/api"

function Course() {
  const { courseId } = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    async function getCourse() {
      const courseUrl = `${getUrl("courses")}/${courseId}`
      const course: Course = await getData(courseUrl)
      setCourse(course)
      return course
    }

    async function getCourseData() {
      try {
        const course = await getCourse()
        if (!course) {
          setNotFound(true)
        }
      } catch (error: any) {
        setNotFound(true)
        const apiError = error as ApiError
        setErrorMessage(apiError.message)
        console.error(`${apiError.status} (${apiError.statusText})\n${apiError.message}`)
      }
    }

    getCourseData()
  }, [courseId])

  if (notFound) {
    return <NotFound />
  }

  return (
    <div className="flex gap-6">
      {errorMessage && <AlertDestructive message={errorMessage} />}
      <div className="max-w-4xl">
        <h2 className="text-2xl">{course?.title}</h2>
        <p>{course?.description}</p>
      </div>
    </div>
  )
}

export default Course

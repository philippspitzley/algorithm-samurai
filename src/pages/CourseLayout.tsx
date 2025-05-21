import { useEffect, useState } from "react"

import { Outlet, useParams } from "react-router-dom"

import { ApiError, getData } from "@/api/fetch"
import { getUrl } from "@/api/url-constants"
import AlertDestructive from "@/components/AlertDestructive"
import ChapterSidebar from "@/components/ChapterSidebar"

import Course from "./Course"
import NotFound from "./NotFound"

function CourseLayout() {
  const { courseId } = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    async function getCourse() {
      try {
        const courseUrl = `${getUrl("courses")}/${courseId}`
        const course: Course = await getData(courseUrl)

        if (!course) {
          setNotFound(true)
        } else {
          setCourse(course)
        }
      } catch (error: any) {
        setNotFound(true)
        const apiError = error as ApiError
        setErrorMessage(apiError.message)
        console.error(`${apiError.status} (${apiError.statusText})\n${apiError.message}`)
      }
    }

    getCourse()
  }, [courseId])

  if (notFound) {
    return <NotFound />
  }

  return (
    <>
      {errorMessage && <AlertDestructive message={errorMessage} />}
      <div className="bg-background/90 flex gap-6 rounded-xl border-1 p-8 backdrop-blur-lg">
        <ChapterSidebar courseId={course?.id} title={course?.title} />
        <Outlet />
      </div>
    </>
  )
}

export default CourseLayout

import { $api } from "@/api/api"

interface Props {
  courseId: string
}

function UseUserCourse({ courseId }: Props) {
  const { data, error, isLoading, isError } = $api.useQuery("get", "/api/v1/users/me/courses", {
    params: { query: { course_id: courseId } },
  })

  const getProgress = () => {
    if (!data) return
    console.log(data)
  }

  return { data, error, getProgress, isLoading, isError }
}

export default UseUserCourse

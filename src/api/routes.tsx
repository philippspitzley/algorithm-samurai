import { CourseChapter, UserCourse } from "@/types/api"

import { getData, postData } from "./fetch"
import { getUrl } from "./url-constants"

export async function getChapters(courseId: string) {
  const chapterUrl = `${getUrl("courses")}/${courseId}/chapters`
  const chapters: CourseChapter[] = await getData(chapterUrl)
  return chapters
}

export async function signUp(email: string, password: string, user_name: string) {
  const signUpUrl = `${getUrl("signUp")}`

  await postData(signUpUrl, { email, password, user_name })
}

export async function getUserProgress(courseId: string) {
  const userProgressUrl = `${getUrl("userMe")}/courses?course_id=${courseId}`

  const userProgress: UserCourse = await getData(userProgressUrl)
  return userProgress
}

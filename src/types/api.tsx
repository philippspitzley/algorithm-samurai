export interface User {
  id: string
  user_name: string
  email: string
  is_active: boolean
  is_superuser: boolean
}

export interface Course {
  id: number
  title: string
  description: string
  chapters?: CourseChapter[]
}

export interface CourseChapter {
  id: string
  course_id: string
  chapter_num: number
  title: string
  description: string
  points?: ChapterPoint[]
}

export interface ChapterPoint {
  id: string
  chapter_id: string
  chapter_point_num: number
  text?: string
  code_block?: string
  image?: string
  video?: string
}

export interface UserCourse {
  user_id: string
  course_id: string
  finished_chapters: string[]
}

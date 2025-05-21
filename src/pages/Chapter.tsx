import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { getData } from "@/api/fetch"
import { getUrl } from "@/api/url-constants"
import CodeBlock from "@/components/CodeElements/CodeBlock"
import CodeEditor from "@/components/CodeElements/CodeEditor"
import { ChapterPoint, CourseChapter } from "@/types/api"

function Chapter() {
  const { chapterId } = useParams()
  const [chapter, setChapter] = useState<CourseChapter | null>(null)
  const [chapterPoints, setChapterPoints] = useState<ChapterPoint[] | null>(null)
  const [exercise, setExercise] = useState<string>("")

  useEffect(() => {
    if (!chapterId) return

    async function getChapter() {
      const chapterUrl = `${getUrl("chapters")}/${chapterId}`
      const chapter: CourseChapter = await getData(chapterUrl)

      setChapter(chapter)
      setExercise(chapter?.exercise)
    }

    async function getChapterPoints() {
      const pointUrl = `${getUrl("chapters")}/${chapterId}/chapter-points`
      const chapterPoints: ChapterPoint[] = await getData(pointUrl)

      setChapterPoints(chapterPoints)
    }

    getChapter()
    getChapterPoints()
  }, [chapterId])

  const chapterPointElements = chapterPoints?.map((point) => (
    <div key={point.id}>{point?.code_block && <CodeBlock code={point.code_block} />}</div>
  ))
  return (
    <div className="flex flex-col gap-4">
      <h1>{chapter?.title}</h1>
      {chapterPointElements}
      {exercise && <CodeEditor key={chapter?.id || exercise} defaultValue={exercise} />}
    </div>
  )
}

export default Chapter

import { PartyPopper, SquareArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { APISchemas } from "@/api/types"
import useUserCourses from "@/context/userCourses/useUserCourses"

import { Button } from "../ui/button"

interface Props {
  lastChapterNum?: number
  currentChapter: APISchemas["ChapterPublic"]
  nextChapter?: APISchemas["ChapterPublic"]
  testPassed: boolean
}

function NextChapterButton(props: Props) {
  const { currentChapter: chapter, nextChapter = undefined, testPassed, lastChapterNum } = props

  const navigate = useNavigate()
  const { isMyChapterCompleted, completeMyChapter, updateMyCourseProgress, getMyCourse } =
    useUserCourses()

  const courseId = chapter.course_id
  const chapterId = chapter.id
  const currentChapterCompleted = isMyChapterCompleted(chapter.id, courseId!)
  const userCourse = getMyCourse(courseId)
  const chapterNum = lastChapterNum ? lastChapterNum : 0
  const couldFinishCourse = userCourse?.progress === chapterNum - 1 / chapterNum

  const handleNextChapter = () => {
    if (!courseId || !chapterId) {
      console.error("Course ID or Chapter ID is missing.")
      return
    }

    const currentExerciseCompleted = chapter.exercise ? testPassed : true

    // Case 1: Chapter not completed yet, but exercise is done - complete it and show success
    if (!currentChapterCompleted && currentExerciseCompleted) {
      completeMyChapter(chapter.id)
      updateMyCourseProgress(courseId)
      if (nextChapter) {
        navigate(`/courses/${courseId}/${nextChapter.id}`)
      } else {
        toast.success("🎉 Congratulations! You have completed this chapter and the entire course!")
      }
      return
    }

    // Case 2: Chapter already completed and there's a next chapter - navigate
    if (currentChapterCompleted && nextChapter) {
      navigate(`/courses/${courseId}/${nextChapter.id}`)
      return
    }

    // Case 3: Chapter completed and no next chapter - show completion message
    if (currentChapterCompleted && !nextChapter && couldFinishCourse) {
      toast.success("🎉 Congratulations! You have completed the entire course!")
      return
    }

    // Case 4: Exercise not completed but user wants to skip - show warning
    if (!currentExerciseCompleted && nextChapter) {
      toast.info(
        "🎯 Almost there! Complete the exercise to unlock the next chapter and track your progress. Ready to skip ahead anyway?",
        {
          action: {
            label: "Skip Ahead",
            onClick: () => navigate(`/courses/${courseId}/${nextChapter.id}`),
          },
        },
      )
      return
    }

    // Case 5: Exercise not completed and no next chapter
    if (!currentExerciseCompleted && !nextChapter) {
      toast.info("💪 Complete the exercise to finish this chapter!")
      return
    }
  }

  return (
    <>
      {nextChapter ? (
        <Button onClick={handleNextChapter}>
          Next Chapter <SquareArrowRight />
        </Button>
      ) : !currentChapterCompleted ? (
        <Button onClick={handleNextChapter} className="from-ctp-red to-ctp-pink hover:bg-linear-65">
          <PartyPopper /> Complete Chapter <PartyPopper />
        </Button>
      ) : (
        <Button onClick={() => navigate("/courses")}> Try another course </Button>
      )}
    </>
  )
}

export default NextChapterButton

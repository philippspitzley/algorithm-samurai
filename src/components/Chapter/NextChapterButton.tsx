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

    // If chapter needs to be completed and exercise is done, complete it
    if (!currentChapterCompleted && currentExerciseCompleted) {
      completeMyChapter(chapter.id)
    }

    // Handle navigation and completion messages
    if (currentExerciseCompleted || currentChapterCompleted) {
      if (nextChapter) {
        navigate(`/courses/${courseId}/${nextChapter.id}`)
      } else {
        const message =
          currentChapterCompleted && couldFinishCourse
            ? "🎉 Congratulations! You have completed the entire course!"
            : "🎉 Congratulations! You have completed this chapter and the entire course!"
        toast.success(message, { duration: 5000 })
      }
    } else {
      // Exercise not completed - show appropriate message
      if (nextChapter) {
        toast.info(
          "🎯 Almost there! Complete the exercise to unlock the next chapter and track your progress. Ready to skip ahead anyway?",
          {
            action: {
              label: "Skip Ahead",
              onClick: () => navigate(`/courses/${courseId}/${nextChapter.id}`),
            },
            duration: Infinity,
          },
        )
      } else {
        toast.info("💪 Complete the exercise first to finish this chapter!", {
          cancel: {
            label: "Ok",
            onClick: () => undefined,
          },
          duration: Infinity,
        })
      }
    }

    updateMyCourseProgress(courseId)
  }

  return (
    <>
      {nextChapter ? (
        <Button onClick={handleNextChapter}>
          Next Chapter <SquareArrowRight />
        </Button>
      ) : !currentChapterCompleted ? (
        <Button onClick={handleNextChapter} className="from-rosewater to-pink hover:bg-linear-65">
          <PartyPopper /> Complete Course <PartyPopper />
        </Button>
      ) : (
        <Button onClick={() => navigate("/courses")}> Try another course </Button>
      )}
    </>
  )
}

export default NextChapterButton

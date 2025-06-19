import { Plus } from "lucide-react"

import { APISchemas } from "@/api/types"
import { Button } from "@/components/ui/button"

interface Props {
  onCreateChapter: (chapter: APISchemas["ChapterCreate"]) => void
  onProgressUpdate: (courseId: string) => void
  courseId: string
}

function AddChapterButton(props: Props) {
  const { onCreateChapter: createChapter, onProgressUpdate: updateProgress, courseId } = props

  const createNewChapter = () => {
    const newChapterTitle = "New Chapter"
    const newChapterDescription = "Description of the new chapter"

    const newChapter: APISchemas["ChapterCreate"] = {
      title: newChapterTitle,
      description: newChapterDescription,
    }
    createChapter(newChapter)
    updateProgress(courseId!)
  }
  return (
    <Button variant="outline" onClick={createNewChapter} className="w-full">
      <Plus /> Add Chapter
    </Button>
  )
}

export default AddChapterButton

import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

type ChapterCreate = APISchemas["ChapterCreate"]
type ChapterUpdate = APISchemas["ChapterUpdate"]

interface Props {
  courseId: string
  chapterId?: string
}

function useChapters({ courseId, chapterId }: Props) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, error, isLoading, isError } = $api.useQuery(
    "get",
    "/api/v1/courses/{course_id}/chapters",
    {
      params: { query: { include_count: true }, path: { course_id: courseId } },
    },
  )

  function invalidateChapters() {
    queryClient.invalidateQueries({
      queryKey: [
        "get",
        "/api/v1/courses/{course_id}/chapters",
        {
          params: { query: { include_count: true }, path: { course_id: courseId } },
        },
      ],
    })
  }

  const { mutate: create } = $api.useMutation("post", "/api/v1/chapters/{course_id}", {
    onSuccess: () => {
      toast.success("Chapter added successfully!")
      invalidateChapters()
    },
  })

  const createChapter = (body: ChapterCreate) => {
    create({ params: { path: { course_id: courseId } }, body: body })
  }

  const { mutate: update } = $api.useMutation("patch", "/api/v1/chapters/{chapter_id}", {
    onSuccess: () => {
      toast.info("Chapter updated.")
      invalidateChapters()
    },

    onError: (error) => {
      toast.error("Something went wrong.")
      console.error(error)
    },
  })

  const updateChapter = (body: ChapterUpdate) => {
    if (!chapterId) {
      throw new Error("Chapter ID is required for updating a chapter.")
    }
    return update({ params: { path: { chapter_id: chapterId } }, body: body })
  }

  const { mutate: remove } = $api.useMutation("delete", "/api/v1/chapters/{chapter_id}", {
    onSuccess: () => {
      toast.success("Chapter deleted successfully!")

      invalidateChapters()

      navigate(-1)
    },
    onError: (error) => {
      toast.error("Something went wrong.")
      console.error(error)
    },
  })

  const deleteChapter = () => {
    if (!chapterId) {
      throw new Error("Chapter ID is required for updating a chapter.")
    }
    remove({ params: { path: { chapter_id: chapterId } } })
  }

  return { data, error, isLoading, isError, createChapter, updateChapter, deleteChapter }
}

export default useChapters

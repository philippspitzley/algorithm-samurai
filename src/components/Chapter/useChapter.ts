import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

type ChapterUpdate = APISchemas["ChapterUpdate"]
type ChapterCreate = APISchemas["ChapterCreate"]
interface Props {
  chapterId: string
}

function useChapter({ chapterId }: Props) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, error, isLoading, isError } = $api.useQuery(
    "get",
    "/api/v1/chapters/{chapter_id}",
    {
      params: { path: { chapter_id: chapterId } },
    },
  )

  const { mutate: update } = $api.useMutation("patch", "/api/v1/chapters/{chapter_id}", {
    onSuccess: () => {
      toast.info("Chapter updated.")

      queryClient.invalidateQueries({
        queryKey: [
          "get",
          "/api/v1/chapters/{chapter_id}",
          { params: { path: { chapter_id: chapterId } } },
        ],
      })
    },
    onError: (error) => {
      toast.error("Something went wrong.")
      console.error(error)
    },
  })

  const updateChapter = (body: ChapterUpdate) => {
    return update({ params: { path: { chapter_id: chapterId } }, body: body })
  }

  const { mutate: remove } = $api.useMutation("delete", "/api/v1/chapters/{chapter_id}", {
    onSuccess: () => {
      toast.success("Chapter deleted successfully!")

      queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/chapters/"],
      })

      queryClient.removeQueries({
        queryKey: [
          "get",
          "/api/v1/chapters/{chapter_id}",
          { params: { path: { chapter_id: chapterId } } },
        ],
      })

      navigate(-1)
    },
    onError: (error) => {
      toast.error("Something went wrong.")
      console.error(error)
    },
  })

  const deleteChapter = () => {
    remove({ params: { path: { chapter_id: chapterId } } })
  }

  const { mutate: add } = $api.useMutation("post", "/api/v1/chapters/{course_id}", {
    onSuccess: () => {
      toast.success("Chapter added successfully!")

      queryClient.invalidateQueries({
        queryKey: ["get", "/api/v1/chapters/"],
      })
    },
  })

  const addChapter = (courseId: string, body: ChapterCreate) => {
    add({ params: { path: { course_id: courseId } }, body: body })
  }

  return { data, error, isLoading, isError, addChapter, updateChapter, deleteChapter }
}

export default useChapter

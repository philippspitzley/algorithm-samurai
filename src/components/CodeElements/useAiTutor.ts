import { useState } from "react"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

interface Props {
  userCode: string
  testCode: string
  error?: string | null
  exercise_description?: string
}

function useAiTutor(props: Props) {
  const { userCode, testCode, error, exercise_description = "" } = props
  const [aiHints, setAiHints] = useState<APISchemas["HintResponse"][]>([])
  const generateMutation = $api.useMutation("post", "/api/v1/ai/generate", {
    onSuccess: (data) => {
      setAiHints((prev) => [...prev, data])
    },
    onError: (error) => {
      console.error("Error generating AI Tutor response:", error)
    },
  })

  const generateAiHints = () => {
    const body: APISchemas["HintRequest"] = {
      user_code: userCode,
      exercise_description: exercise_description,
      test_cases: testCode,
      error: error,
      difficulty_level: "beginner",
      previous_hints: aiHints.map((hint) => hint),
    }
    generateMutation.mutate({ body })
  }

  return {
    // Data
    aiHint: generateMutation.data,
    aiHints,
    error: generateMutation.error,

    // State
    isLoading: generateMutation.isPending,
    isError: generateMutation.isError,

    // Actions
    generateAiHints,
  }
}

export default useAiTutor

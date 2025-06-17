import { useCallback, useEffect, useState } from "react"

import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

export type CodeRequest = APISchemas["CodeRequest"]
export type CodeError = APISchemas["CodeError"]

function usePistonApi() {
  const [runtimeError, setRuntimeError] = useState<CodeError | null>(null)
  const [hasRuntimeError, setHasRuntimeError] = useState(false)
  const [output, setOutput] = useState<string[] | null>(null)

  const executionMutation = $api.useMutation("post", "/api/v1/piston/execute", {
    onSuccess: () => {
      toast.success("Code executed.")
    },
    onError: (error) => {
      toast.error("Something went wrong during code execution.")
      console.error(error)
    },
  })

  const executeCode = (body: CodeRequest) => {
    onClearOutput()
    executionMutation.mutate({ body: body })
  }

  useEffect(() => {
    const data = executionMutation.data
    if (!data) return

    if (data.run) {
      const { stdout, stderr, code: exitCode } = data.run

      if (exitCode === 0) {
        // Successful execution
        setHasRuntimeError(false)
        setOutput([stdout || "Code executed successfully (no output)"])
      } else {
        // Runtime Error
        setHasRuntimeError(true)
        if (data.error) {
          // Format Error Output
          const e = data.error
          setRuntimeError(data.error)

          const errorLocation = [
            e?.location || "No location provided",
            e?.error_snippet || "No error snippet provided",
            e?.pointer || "No pointer provided",
          ].join("\n")

          const errorInfo = [
            e?.type + ":" || "No error type provided",
            e?.message || "No error message provided",
          ].join("\n")

          setOutput([errorInfo, "", errorLocation])
        } else {
          // Fallback Error Output
          setOutput([stderr])
        }
      }
    }
  }, [executionMutation.data])

  const onClearOutput = useCallback(() => {
    setOutput([])
    setRuntimeError(null)
    setHasRuntimeError(false)
  }, [])

  return {
    // Data
    output,
    runtimeError,
    error: executionMutation.error,

    // States
    isLoading: executionMutation.isPending,
    isError: executionMutation.isError,
    hasRuntimeError,

    // Actions
    executeCode,
    onClearOutput,
  }
}

export default usePistonApi

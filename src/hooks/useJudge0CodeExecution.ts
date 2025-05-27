import { useEffect } from "react"

import { MonacoEditorInstance } from "@/components/CodeElements/CodeEditor"

interface Judge0Submission {
  token: string
  stdout?: string | null
  stderr?: string | null
  compile_output?: string | null
  message?: string | null
  status_id: number
  status: {
    id: number
    description: string
  }
}

const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY as string
const JUDGE0_API_HOST = "judge0-ce.p.rapidapi.com"
const POLLING_INTERVAL_MS = 3000

interface Props {
  pollingIntervalRef: React.RefObject<NodeJS.Timeout | null>
  setEditorOutput: React.Dispatch<React.SetStateAction<string[]>>
  isSubmitting: boolean
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
  editorRef: React.RefObject<MonacoEditorInstance | null>
}

function useJudge0CodeExecution({
  pollingIntervalRef,
  setEditorOutput,
  isSubmitting,
  setIsSubmitting,
  editorRef,
}: Props) {
  // Clear any ongoing polling when the component unmounts
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  async function requestCodeExecution() {
    if (!editorRef.current) {
      setEditorOutput((prev) => [...prev, "Error: Editor not initialized."])
      return
    }
    if (isSubmitting) {
      setEditorOutput((prev) => [...prev, "A submission is already in progress."])
      return
    }

    const sourceCode = editorRef.current.getValue()
    if (!sourceCode.trim()) {
      setEditorOutput((prev) => [...prev, "Warning: Editor is empty. Nothing to submit."])
      return
    }

    setIsSubmitting(true)
    setEditorOutput((prev) => [...prev, "Submitting code..."])

    // Clear previous polling if any
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    const encodedSourceCode = btoa(unescape(encodeURIComponent(sourceCode)))
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=token"
    const options: RequestInit = {
      method: "POST",
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY,
        "x-rapidapi-host": JUDGE0_API_HOST,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: 102, // JavaScript (Node.js 22.08.0)
        source_code: encodedSourceCode,
      }),
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()

      if (!response.ok || result.error || result.errors) {
        const errorMessage =
          result?.message || result?.error || result?.errors?.[0]?.message || JSON.stringify(result)
        console.error(`API Error: ${response.status}`, result)
        setEditorOutput((prev) => [...prev, `Submission Error: ${errorMessage}`])
        setIsSubmitting(false)
        return
      }

      if (result.token) {
        // setCodeToken(result.token)
        setEditorOutput((prev) => [
          ...prev,
          `Submission created. Token: ${result.token}. Fetching results...`,
        ])
        // Start polling immediately
        getResolvedCodeFromToken(result.token)
        // Set up interval polling
        pollingIntervalRef.current = setInterval(() => {
          getResolvedCodeFromToken(result.token)
        }, POLLING_INTERVAL_MS) // Use the constant
      } else {
        console.error("Submission failed: No token received.", result)
        setEditorOutput((prev) => [...prev, `Submission failed: ${JSON.stringify(result)}`])
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Network or other error during code submission:", error)
      const message = error instanceof Error ? error.message : "An unknown error occurred."
      setEditorOutput((prev) => [...prev, `Error: ${message}`])
      setIsSubmitting(false)
    }
  }

  async function getResolvedCodeFromToken(token: string | null) {
    if (!token) return

    const url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`
    const options: RequestInit = {
      method: "GET",
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY,
        "x-rapidapi-host": JUDGE0_API_HOST,
      },
    }

    try {
      const response = await fetch(url, options)
      const result: Judge0Submission = await response.json()

      if (!response.ok) {
        const errorMessage = result?.message || JSON.stringify(result)
        console.error(`API Error fetching submission: ${response.status}`, result)
        // Don't stop polling on transient server errors, but log them
        setEditorOutput((prev) => [
          ...prev,
          `Error fetching results (token: ${token}): ${response.status} - ${errorMessage}`,
        ])
        return
      }

      // Status ID 1: In Queue, Status ID 2: Processing
      if (result.status_id === 1 || result.status_id === 2) {
        setEditorOutput((prev) => {
          // Avoid duplicate "Processing..." messages if already there
          const lastMessage = prev[prev.length - 1]
          if (
            lastMessage &&
            lastMessage.startsWith(`Status (token: ${token}): ${result.status.description}`)
          ) {
            return prev
          }
          return [...prev, `Status (token: ${token}): ${result.status.description}...`]
        })
        // Polling is handled by setInterval now
      } else {
        // Submission finished (Accepted, Wrong Answer, Error, etc.)
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current) // Stop polling
          pollingIntervalRef.current = null
        }
        setIsSubmitting(false)
        // setCodeToken(null) // Clear token once resolved

        const outputLines: string[] = [`--- Result for token: ${token} ---`]
        outputLines.push(`Status: ${result.status?.description || "Unknown"}`)

        const decodeIfNeeded = (value: string | null | undefined) => {
          if (!value) return ""
          try {
            return atob(value)
          } catch (e) {
            console.warn("Failed to decode base64 string:", value, e)
            return value /* return raw if not base64 */
          }
        }

        if (result.compile_output)
          outputLines.push(`Compile Output: ${decodeIfNeeded(result.compile_output)}`)
        if (result.stdout) outputLines.push(`Stdout: ${decodeIfNeeded(result.stdout)}`)
        if (result.stderr) outputLines.push(`Stderr: ${decodeIfNeeded(result.stderr)}`)
        if (result.message) outputLines.push(`Message: ${decodeIfNeeded(result.message)}`)
        outputLines.push(`-------------------------`)

        setEditorOutput((prev) => [...prev, ...outputLines])
      }
    } catch (error) {
      console.error("Network or other error fetching submission details:", error)
      const message = error instanceof Error ? error.message : "An unknown error occurred."
      setEditorOutput((prev) => [...prev, `Error fetching results (token: ${token}): ${message}`])
      // Potentially stop polling on certain errors
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      setIsSubmitting(false)
    }
  }

  return { requestCodeExecution }
}

export default useJudge0CodeExecution

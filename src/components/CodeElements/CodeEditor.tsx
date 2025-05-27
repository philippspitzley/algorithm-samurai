import { useEffect, useRef, useState } from "react"

import Editor, { useMonaco } from "@monaco-editor/react"
import { shikiToMonaco } from "@shikijs/monaco"
import { Ban, LoaderCircle, Play, SendHorizontal, Sparkles, SquareTerminal } from "lucide-react"
import type { editor as MonacoEditorTypes } from "monaco-editor"
import { createHighlighter, Highlighter } from "shiki"

import { useTheme } from "@/context/theme/useTheme"

import { Button } from "../ui/button"
import { Card } from "../ui/card"

const LANGUAGES = ["javascript", "typescript"]
const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY as string
const JUDGE0_API_HOST = "judge0-ce.p.rapidapi.com"
const POLLING_INTERVAL_MS = 3000

// Module-level cache for the Shiki highlighter promise
let shikiHighlighterPromise: Promise<Highlighter> | null = null

type EditorThemes = EditorTheme.dark | EditorTheme.light
enum EditorTheme {
  light = "catppuccin-latte",
  dark = "catppuccin-mocha",
}

type MonacoEditorInstance = MonacoEditorTypes.IStandaloneCodeEditor

// Define a type for the Judge0 submission response for better type safety
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

interface CodeEditorProps {
  defaultValue?: string
}

function CodeEditor({ defaultValue }: CodeEditorProps) {
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const { theme: appEffectiveTheme } = useTheme()
  const monacoInstance = useMonaco()
  const [editorOutput, setEditorOutput] = useState<string[]>(["Welcome to your first exercise 👋"])

  const [currentEditorMonacoTheme, setCurrentEditorMonacoTheme] = useState<EditorThemes>(
    appEffectiveTheme === "dark" ? EditorTheme.dark : EditorTheme.light,
  )
  const [shikiHighlighter, setShikiHighlighter] = useState<Highlighter | null>()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Effect 1: Initialize Shiki (modified for singleton pattern)
  useEffect(() => {
    if (!monacoInstance) return
    if (shikiHighlighter) return

    let isMounted = true

    async function initializeShikiSingleton() {
      if (!shikiHighlighterPromise) {
        shikiHighlighterPromise = createHighlighter({
          themes: [EditorTheme.dark, EditorTheme.light],
          langs: LANGUAGES,
        })
      }

      try {
        const highlighter = await shikiHighlighterPromise
        if (!isMounted) return

        setShikiHighlighter(highlighter) // Set the resolved highlighter to local state

        // Register languages and apply Shiki to Monaco
        LANGUAGES.forEach((lang) => {
          monacoInstance.languages.register({ id: lang })
        })
        shikiToMonaco(highlighter, monacoInstance)
      } catch (error) {
        if (isMounted) {
          console.error("Failed to initialize Shiki highlighter:", error)
        }
        // If createHighlighter itself failed, nullify the promise to allow potential retry
        shikiHighlighterPromise = null
      }
    }

    initializeShikiSingleton()

    return () => {
      isMounted = false
      // Do not dispose the shared highlighter here, as other instances might still be using it.
    }
  }, [monacoInstance, shikiHighlighter])

  // Effect 2: Update the editor's active theme when appEffectiveTheme changes or Shiki setup completes.
  useEffect(() => {
    if (!monacoInstance || !shikiHighlighter) {
      return
    }

    const newMonacoTheme = appEffectiveTheme === "dark" ? EditorTheme.dark : EditorTheme.light
    monacoInstance.editor.setTheme(newMonacoTheme)
    setCurrentEditorMonacoTheme(newMonacoTheme)
  }, [appEffectiveTheme, monacoInstance, shikiHighlighter])

  useEffect(() => {
    // Clear any ongoing polling when the component unmounts
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  function handleEditorDidMount(editor: MonacoEditorInstance) {
    editorRef.current = editor
  }

  function resetTerminal() {
    setEditorOutput(["Console cleared."])
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    setIsSubmitting(false)
    // setCodeToken(null)
  }

  // Function to trigger code formatting
  function formatCode() {
    if (editorRef.current) {
      editorRef.current.trigger("anyString", "editor.action.formatDocument", null)
    }
  }

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

      // setResolvedCodeObjects((prev) => [...prev, result]) // Store the full object if needed

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

  return (
    <div className="container">
      <Card className="bg-background gap-14 rounded-xl py-6 pr-10 pl-4 shadow-2xl">
        <div className="relative h-80">
          <Editor
            height="100%"
            width="100%"
            theme={currentEditorMonacoTheme}
            defaultLanguage={"javascript"}
            defaultValue={defaultValue}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollbar: { vertical: "hidden" },
              fontSize: 16,
              overviewRulerLanes: 0,
            }}
          />

          <div className="absolute right-0 -bottom-11 flex gap-2">
            <Button size="icon" variant={"outline"} onClick={formatCode} title="Format Code">
              <Sparkles />
            </Button>
            {/* The "Play" button can also trigger execution or be used for local tests if you implement that */}
            <Button
              size="icon"
              variant={"outline"}
              onClick={requestCodeExecution}
              disabled={isSubmitting}
              title="Run Code"
            >
              <Play />
            </Button>
            <Button onClick={requestCodeExecution} disabled={isSubmitting} title="Submit Code">
              <SendHorizontal />
              {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </div>
        <Card className="bg-primary/5 ml-6 min-h-16 rounded-lg px-4 py-4 text-left shadow-none">
          <div className="flex justify-between">
            <h3 className="text-md mb-4 flex gap-2 opacity-70">
              <SquareTerminal size={24} /> Console Output:
            </h3>
            <Button size="icon" variant="outline" onClick={resetTerminal} title="Clear Console">
              <Ban size={16} />
            </Button>
          </div>
          {editorOutput.map((line, index) => (
            <p key={index} className="text-terminal font-mono whitespace-pre-wrap">
              {" "}
              {/* Added whitespace-pre-wrap */}
              {line}
            </p>
          ))}
        </Card>
      </Card>
    </div>
  )
}

export default CodeEditor

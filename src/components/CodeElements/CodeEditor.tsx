import { useCallback, useEffect, useRef } from "react"

import Editor, { useMonaco } from "@monaco-editor/react"
import { Bot, LoaderCircle, Play, SendHorizontal, Sparkles } from "lucide-react"
import type { editor as MonacoEditorTypes } from "monaco-editor"
import { toast } from "sonner"

import { useTheme } from "@/context/theme/useTheme"
import useShikiMonacoTheme from "@/hooks/useShikiMonacoTheme"

import { Button } from "../ui/button"
import { Card } from "../ui/card"
import AiTutor from "./AiTutor"
import Terminal from "./Terminal"
import useAiTutor from "./useAiTutor"
import usePistonApi, { CodeRequest } from "./usePistonApi"

export type MonacoEditorInstance = MonacoEditorTypes.IStandaloneCodeEditor

interface CodeEditorProps {
  defaultValue?: string
  testCode?: string | null
  onTestPassedChange?: (testPassed: boolean) => void
}

function CodeEditor(props: CodeEditorProps) {
  const { defaultValue, testCode, onTestPassedChange } = props
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const decorationsRef = useRef<MonacoEditorTypes.IEditorDecorationsCollection | null>(null)
  const { theme: appEffectiveTheme } = useTheme()
  const monacoInstance = useMonaco()
  const { currentEditorMonacoTheme } = useShikiMonacoTheme(appEffectiveTheme, monacoInstance)
  const {
    executeCode,
    onClearOutput,
    isLoading,
    isError,
    hasRuntimeError,
    output,
    runtimeError,
    testPassed,
  } = usePistonApi()

  const {
    generateAiHints,
    aiHints,
    error: aiError,
    isError: aiIsError,
    isLoading: aiIsLoading,
  } = useAiTutor({
    userCode: editorRef.current?.getValue() || "",
    testCode: testCode || "",
    error: runtimeError?.message || null,
    exercise_description: "",
  })

  const highlightErrors = useCallback(
    (lineNumber: number) => {
      if (!editorRef.current || !monacoInstance) return

      // Clear previous decorations if they exist
      if (decorationsRef.current) {
        decorationsRef.current.clear()
      }

      decorationsRef.current = editorRef.current.createDecorationsCollection([
        {
          range: new monacoInstance.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className: "bg-terminal-error opacity-10",
          },
        },
      ])

      // Scroll to the error line
      editorRef.current.revealLineInCenter(lineNumber)
    },
    [editorRef, monacoInstance],
  )

  const clearErrorHighlights = useCallback(() => {
    if (decorationsRef.current) {
      decorationsRef.current.clear()
      decorationsRef.current = null
    }
  }, [])

  // Highlight errors when errorLineNumber changes
  useEffect(() => {
    if (runtimeError?.line && hasRuntimeError) {
      highlightErrors(Number(runtimeError.line))
    } else {
      clearErrorHighlights()
    }
  }, [runtimeError, hasRuntimeError, highlightErrors, clearErrorHighlights])

  function handleEditorDidMount(editor: MonacoEditorInstance) {
    editorRef.current = editor
  }

  function handleCodeExecution() {
    if (decorationsRef.current) {
      decorationsRef.current.clear()
    }
    const userCode = editorRef.current?.getValue() || ""

    if (!userCode.trim()) {
      return
    }
    onClearOutput()

    const fullCode = testCode ? `${userCode}\n${testCode}` : userCode
    const body: CodeRequest = {
      language: "javascript",
      version: "20.11.1",
      files: [{ name: "main.js", content: fullCode }],
    }

    executeCode(body)
  }

  function handleSubmit() {
    const userCode = editorRef.current?.getValue() || ""

    if (!userCode.trim()) {
      return
    }
    toast.info("Placeholder for Submitting your code. Not implemented yet.")
    //TODO: Write submitted code to a backend UserCourse and handle submission logic
  }

  function formatCode() {
    if (editorRef.current) {
      editorRef.current.trigger("anyString", "editor.action.formatDocument", null)
    }
  }

  function handleAiHints() {
    generateAiHints()
  }

  // Notify parent when testPassed changes
  useEffect(() => {
    if (onTestPassedChange && typeof onTestPassedChange === "function") {
      onTestPassedChange(testPassed)
    }
  }, [testPassed, onTestPassedChange])

  return (
    <Card className="bg-card gap-14 rounded-xl p-6 pr-10 pl-4 shadow-lg">
      <div className="relative h-[50dvh]">
        <Editor
          height="100%"
          width="100%"
          theme={currentEditorMonacoTheme}
          defaultLanguage={"javascript"}
          defaultValue={defaultValue}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            overviewRulerLanes: 0,
            wordWrap: "on",
            lineNumbers: "on",
          }}
        />

        <div className="absolute right-0 -bottom-11 flex gap-2">
          <Button size="icon" variant={"outline"} onClick={formatCode} title="Format Code">
            <Sparkles />
          </Button>

          <Button size="icon" variant={"outline"} onClick={handleAiHints} title="Generate AI Hints">
            <Bot />
          </Button>

          <Button
            size="icon"
            variant={"outline"}
            onClick={handleCodeExecution}
            disabled={isLoading}
            title="Run Code"
          >
            <Play />
          </Button>
          <Button disabled={isLoading} onClick={handleSubmit} title="Submit Code">
            <SendHorizontal />
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </div>

      <AiTutor aiHints={aiHints} isLoading={aiIsLoading} isError={aiIsError} error={aiError} />

      <Terminal
        output={output}
        isLoading={isLoading}
        isError={isError}
        hasRuntimeError={hasRuntimeError}
        onClearOutput={onClearOutput}
        testPassed={testPassed}
      />
    </Card>
  )
}

export default CodeEditor

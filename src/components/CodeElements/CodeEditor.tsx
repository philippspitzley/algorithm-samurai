import { useCallback, useEffect, useRef } from "react"

import Editor, { useMonaco } from "@monaco-editor/react"
import { LoaderCircle, Play, SendHorizontal, Sparkles } from "lucide-react"
import type { editor as MonacoEditorTypes } from "monaco-editor"

import { useTheme } from "@/context/theme/useTheme"
// import useJudge0CodeExecution from "@/hooks/useJudge0CodeExecution"
import useShikiMonacoTheme from "@/hooks/useShikiMonacoTheme"

import { Button } from "../ui/button"
import { Card } from "../ui/card"
import Terminal from "./Terminal"
import usePistonApi, { CodeRequest } from "./usePistonApi"

export type MonacoEditorInstance = MonacoEditorTypes.IStandaloneCodeEditor

interface CodeEditorProps {
  defaultValue?: string
  testCode?: string | null
}

function CodeEditor({ defaultValue, testCode }: CodeEditorProps) {
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const decorationsRef = useRef<MonacoEditorTypes.IEditorDecorationsCollection | null>(null)
  const { theme: appEffectiveTheme } = useTheme()
  const monacoInstance = useMonaco()
  const { currentEditorMonacoTheme } = useShikiMonacoTheme(appEffectiveTheme, monacoInstance)

  const { executeCode, onClearOutput, isLoading, isError, hasRuntimeError, output, runtimeError } =
    usePistonApi()

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
    console.info("Code Error:", runtimeError)
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
      console.info("Clearing previous decorations")
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

  function formatCode() {
    if (editorRef.current) {
      editorRef.current.trigger("anyString", "editor.action.formatDocument", null)
    }
  }

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

          <Button
            size="icon"
            variant={"outline"}
            onClick={handleCodeExecution}
            disabled={isLoading}
            title="Run Code"
          >
            <Play />
          </Button>
          <Button disabled={isLoading} title="Submit Code">
            <SendHorizontal />
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </div>

      <Terminal
        output={output}
        isLoading={isLoading}
        isError={isError}
        hasRuntimeError={hasRuntimeError}
        onClearOutput={onClearOutput}
      />
    </Card>
  )
}

export default CodeEditor

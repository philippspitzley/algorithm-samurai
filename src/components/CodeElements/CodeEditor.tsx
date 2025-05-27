import { useRef, useState } from "react"

import Editor, { useMonaco } from "@monaco-editor/react"
import { Ban, LoaderCircle, Play, SendHorizontal, Sparkles, SquareTerminal } from "lucide-react"
import type { editor as MonacoEditorTypes } from "monaco-editor"

import { useTheme } from "@/context/theme/useTheme"
import useJudge0CodeExecution from "@/hooks/useJudge0CodeExecution"
import useShikiMonacoTheme from "@/hooks/useShikiMonacoTheme"

import { Button } from "../ui/button"
import { Card } from "../ui/card"

export type MonacoEditorInstance = MonacoEditorTypes.IStandaloneCodeEditor

interface CodeEditorProps {
  defaultValue?: string
}

function CodeEditor({ defaultValue }: CodeEditorProps) {
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const { theme: appEffectiveTheme } = useTheme()
  const monacoInstance = useMonaco()
  const { currentEditorMonacoTheme } = useShikiMonacoTheme(appEffectiveTheme, monacoInstance)
  const [editorOutput, setEditorOutput] = useState<string[]>(["Welcome to your first exercise 👋"])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { requestCodeExecution } = useJudge0CodeExecution({
    pollingIntervalRef,
    setEditorOutput,
    isSubmitting,
    setIsSubmitting,
    editorRef,
  })

  function handleEditorDidMount(editor: MonacoEditorInstance) {
    editorRef.current = editor
  }

  function resetTerminal() {
    setEditorOutput(["Console cleared."])
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    setIsSubmitting(false)
  }

  function formatCode() {
    if (editorRef.current) {
      editorRef.current.trigger("anyString", "editor.action.formatDocument", null)
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

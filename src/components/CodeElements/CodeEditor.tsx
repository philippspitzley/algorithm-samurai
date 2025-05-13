import { useEffect, useRef, useState } from "react"

import Editor, { useMonaco } from "@monaco-editor/react"
import { shikiToMonaco } from "@shikijs/monaco"
import {
  Ban,
  Play,
  SendHorizonal,
  Sparkles,
  SquareTerminal,
} from "lucide-react"
import type { editor as MonacoEditorTypes } from "monaco-editor"
import { createHighlighter, Highlighter } from "shiki"

import { useTheme } from "@/context/theme/useTheme"

import { Button } from "../ui/button"
import { Card } from "../ui/card"

const LANGUAGES = ["javascript", "typescript"]

type EditorThemes = EditorTheme.dark | EditorTheme.light
enum EditorTheme {
  light = "catppuccin-latte",
  dark = "catppuccin-mocha",
}

type MonacoEditorInstance = MonacoEditorTypes.IStandaloneCodeEditor

function CodeEditor() {
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const { theme: appEffectiveTheme } = useTheme()
  const monacoInstance = useMonaco()
  const [editorOutput, setEditorOutput] = useState<string[]>([
    "Welcome to your first exercise 👋",
  ])
  const [currentEditorMonacoTheme, setCurrentEditorMonacoTheme] =
    useState<EditorThemes>(
      appEffectiveTheme === "dark" ? EditorTheme.dark : EditorTheme.light,
    )
  const [shikiHighlighter, setShikiHighlighter] = useState<Highlighter | null>(
    null,
  )

  // Effect 1: Initialize Shiki (no changes needed here from your previous correct version)
  useEffect(() => {
    if (!monacoInstance || shikiHighlighter) {
      return
    }
    let isMounted = true
    async function initializeShiki() {
      try {
        const highlighter = await createHighlighter({
          themes: [EditorTheme.dark, EditorTheme.light],
          langs: LANGUAGES,
        })
        if (!isMounted) return
        setShikiHighlighter(highlighter)
        LANGUAGES.forEach((lang) => {
          monacoInstance.languages.register({ id: lang })
        })
        shikiToMonaco(highlighter, monacoInstance)
      } catch (error) {
        console.error("Failed to initialize Shiki highlighter:", error)
      }
    }
    initializeShiki()
    return () => {
      isMounted = false
    }
  }, [monacoInstance, shikiHighlighter])

  // Effect 2: Update the editor's active theme when appEffectiveTheme changes or Shiki setup completes.
  useEffect(() => {
    if (!monacoInstance || !shikiHighlighter) {
      return // Wait for Monaco and Shiki to be ready
    }

    // appEffectiveTheme is already "light" or "dark"
    const newMonacoTheme =
      appEffectiveTheme === "dark" ? EditorTheme.dark : EditorTheme.light

    monacoInstance.editor.setTheme(newMonacoTheme)
    setCurrentEditorMonacoTheme(newMonacoTheme)
  }, [appEffectiveTheme, monacoInstance, shikiHighlighter]) // Dependencies updated

  function handleEditorDidMount(editor: MonacoEditorInstance) {
    editorRef.current = editor
  }

  function addToTerminal() {
    setEditorOutput((prev) => [
      ...prev,
      editorRef.current ? editorRef.current.getValue() : "",
    ])
  }

  function resetTerminal() {
    setEditorOutput([""])
  }

  // Function to trigger code formatting
  function formatCode() {
    if (editorRef.current) {
      editorRef.current.trigger(
        "anyString",
        "editor.action.formatDocument",
        null,
      )
    }
  }

  return (
    <div className="container">
      <Card className="bg-background rounded-xl py-6 pr-10 pl-4 shadow-2xl">
        <div className="relative h-80">
          <Editor
            height="100%"
            width="100%"
            theme={currentEditorMonacoTheme}
            defaultLanguage={"typescript"}
            defaultValue={'console.log("Welcome to your first exercise 👋")'}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollbar: { vertical: "hidden" },
              fontSize: 16,
              overviewRulerLanes: 0,
            }}
          />

          <div className="absolute right-0 -bottom-7 flex gap-2">
            <Button size="icon" variant={"outline"} onClick={formatCode}>
              <Sparkles />
            </Button>
            <Button size="icon" variant={"outline"} onClick={addToTerminal}>
              <Play />
            </Button>
            <Button onClick={addToTerminal}>
              <SendHorizonal />
              Submit
            </Button>
          </div>
        </div>
        <Card className="bg-primary/5 mt-4 ml-6 min-h-16 rounded-lg px-4 py-4 text-left shadow-none">
          <div className="flex justify-between">
            <h3 className="text-md mb-4 flex gap-2 opacity-70">
              <SquareTerminal size={24} /> Console Output:
            </h3>
            <Button size="icon" variant="outline" onClick={resetTerminal}>
              <Ban size={16} />
            </Button>
          </div>
          {editorOutput.map((line, index) => (
            <p key={index} className="text-terminal font-mono">
              {line}
            </p>
          ))}
        </Card>
      </Card>
    </div>
  )
}

export default CodeEditor

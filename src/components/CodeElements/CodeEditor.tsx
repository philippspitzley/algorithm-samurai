import { useEffect, useRef, useState } from "react"

import Editor, { Monaco } from "@monaco-editor/react"
import { shikiToMonaco } from "@shikijs/monaco"
import {
  Ban,
  Play,
  SendHorizonal,
  Sparkles,
  SquareTerminal,
} from "lucide-react"
import { createHighlighter, Highlighter } from "shiki"

import { Button } from "../ui/button"

const THEMES = ["catppuccin-mocha", "catppuccin-latte", "catppuccin-frappe"]
const LANGUAGES = ["javascript", "typescript"]

function CodeEditor() {
  const editorRef = useRef(null)
  const [monaco, setMonaco] = useState<Monaco | null>(null)
  const [output, setOutput] = useState<string[]>([
    "WTF, I am running VSCode in my browser 🤩",
  ])

  useEffect(() => {
    async function setHilighter() {
      const highlighter: Highlighter = await createHighlighter({
        themes: THEMES,
        langs: LANGUAGES,
      })

      if (monaco) {
        LANGUAGES.map((lang) => monaco.languages.register({ id: lang }))
      }

      // Register the themes from Shiki, and provide syntax highlighting for Monaco.
      shikiToMonaco(highlighter, monaco)
    }

    if (monaco) {
      setHilighter()
    }
  }, [monaco])

  function handleEditorDidMount(editor, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor
    setMonaco(monaco)
  }

  function addToTerminal() {
    setOutput((prev) => [...prev, editorRef.current.getValue()])
  }

  function resetTerminal() {
    setOutput([])
  }

  // Function to trigger code formatting
  function formatCode() {
    if (editorRef.current) {
      // editorRef.current.getAction('editor.action.formatDocument').run();
      // A more direct way if the action ID is known and you don't need the action object:
      editorRef.current.trigger(
        "anyString",
        "editor.action.formatDocument",
        null,
      )
    }
  }

  return (
    <>
      <div className="relative h-80">
        <Editor
          height="100%"
          theme="catppuccin-mocha"
          defaultLanguage={"typescript"}
          defaultValue={"// this is a comment"}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden" },
            fontSize: 16,
            overviewRulerLanes: 0,
          }}
        />

        <div className="absolute right-0 bottom-0 flex gap-2">
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
      <div className="mt-4 ml-6 min-h-16 rounded-lg bg-[#2B2B3C] px-4 py-4 text-left">
        <div className="flex justify-between">
          <h3 className="text-md mb-4 flex gap-2 opacity-70">
            <SquareTerminal size={24} /> Console Output:
          </h3>
          <Button size="icon" variant="outline" onClick={resetTerminal}>
            <Ban size={16} />
          </Button>
        </div>
        {output.map((line) => (
          <p className="text-violet-300">◉ {line}</p>
        ))}
      </div>
    </>
  )
}

export default CodeEditor

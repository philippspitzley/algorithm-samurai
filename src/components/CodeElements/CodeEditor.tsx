import { useEffect, useRef, useState } from "react"

import Editor, { Monaco } from "@monaco-editor/react"
import { shikiToMonaco } from "@shikijs/monaco"
import { createHighlighter, Highlighter } from "shiki"

import { Button } from "../ui/button"

const THEMES = ["catppuccin-mocha", "catppuccin-latte", "catppuccin-frappe"]
const LANGUAGES = ["javascript", "typescript"]

function CodeEditor() {
  const editorRef = useRef(null)
  const [monaco, setMonaco] = useState<Monaco | null>(null)

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

  function showValue() {
    alert(editorRef.current.getValue())
  }

  return (
    <>
      <Button onClick={showValue}>Get Value</Button>
      <Editor
        height="50vh"
        theme="catppuccin-latte"
        defaultLanguage={"typescript"}
        defaultValue={"// this is a comment"}
        onMount={handleEditorDidMount}
      />
    </>
  )
}

export default CodeEditor

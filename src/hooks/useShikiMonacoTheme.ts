import { useEffect, useState } from "react"

import { shikiToMonaco } from "@shikijs/monaco"

import { ResolvedTheme } from "@/context/theme/useTheme"
import {
  BundledLanguage,
  getSingletonHighlighter,
  Highlighter,
} from "@/shiki-highlighter/shiki.bundle"

const LANGUAGES: BundledLanguage[] = ["javascript", "typescript"]

type EditorThemes = EditorTheme.dark | EditorTheme.light
enum EditorTheme {
  light = "catppuccin-latte",
  dark = "catppuccin-mocha",
}

type MonacoInstance =
  | typeof import("/Users/philipp/Developer/Masterschool/frontend_track/algorithm-watch/frontend/node_modules/monaco-editor/esm/vs/editor/editor.api")
  | null

let shikiHighlighterPromise: Promise<Highlighter> | null = null

function useShikiMonacoTheme(appEffectiveTheme: ResolvedTheme, monacoInstance: MonacoInstance) {
  const [currentEditorMonacoTheme, setCurrentEditorMonacoTheme] = useState<EditorThemes>(
    appEffectiveTheme === "dark" ? EditorTheme.dark : EditorTheme.light,
  )
  const [shikiHighlighter, setShikiHighlighter] = useState<Highlighter | null>()

  useEffect(() => {
    if (!monacoInstance) return

    let isMounted = true

    async function initializeShikiSingleton() {
      if (!shikiHighlighterPromise) {
        shikiHighlighterPromise = getSingletonHighlighter()
      }

      try {
        const highlighter = await shikiHighlighterPromise
        if (!isMounted) return

        await highlighter.loadTheme(EditorTheme.dark)
        await highlighter.loadTheme(EditorTheme.light)

        for (const lang of LANGUAGES) {
          await highlighter.loadLanguage(lang)
        }

        setShikiHighlighter(highlighter)

        shikiToMonaco(highlighter, monacoInstance)
      } catch (error) {
        if (isMounted) {
          console.error("Failed to initialize Shiki highlighter:", error)
        }

        shikiHighlighterPromise = null
      }
    }

    initializeShikiSingleton()

    return () => {
      isMounted = false
    }
  }, [monacoInstance])

  useEffect(() => {
    if (!monacoInstance || !shikiHighlighter) {
      return
    }

    const newMonacoTheme = appEffectiveTheme === "dark" ? EditorTheme.dark : EditorTheme.light
    monacoInstance.editor.setTheme(newMonacoTheme)
    setCurrentEditorMonacoTheme(newMonacoTheme)
  }, [appEffectiveTheme, monacoInstance, shikiHighlighter])

  return {
    currentEditorMonacoTheme,
  }
}

export default useShikiMonacoTheme

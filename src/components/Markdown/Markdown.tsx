import { useEffect, useMemo, useState } from "react"

import "./Markdown.css"

import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async"
import MarkdownItAsync from "markdown-it-async"

import { useTheme } from "@/context/theme/useTheme"
import { BundledTheme, codeToHtml } from "@/shiki-highlighter/shiki.bundle"

interface Props {
  markdown: string
}

function Markdown({ markdown }: Props) {
  const [html, setHtml] = useState<string>("")
  const { theme: appTheme } = useTheme()

  const SHIKITHEME_MAP: Record<typeof appTheme, BundledTheme> = {
    light: "catppuccin-latte",
    dark: "catppuccin-mocha",
  }

  const currentShikiTheme = SHIKITHEME_MAP[appTheme]

  const mdParser = useMemo(() => {
    const instance = MarkdownItAsync({
      html: true,
      linkify: true,
      typographer: true,
    })

    instance.use(
      fromAsyncCodeToHtml(codeToHtml, {
        theme: currentShikiTheme,
      }),
    )

    return instance
  }, [currentShikiTheme])

  useEffect(() => {
    if (markdown === undefined) return

    const renderMarkdownAsync = async () => {
      const renderedHtml = await mdParser.renderAsync(markdown)
      setHtml(renderedHtml)
    }

    renderMarkdownAsync()
  }, [markdown, mdParser])

  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
}

export default Markdown

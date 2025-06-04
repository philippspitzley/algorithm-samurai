import { useEffect, useMemo, useState } from "react"

import "./MarkdownRender.css"

import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async"
import MarkdownItAsync from "markdown-it-async"

import { useTheme } from "@/context/theme/useTheme"
import { cn } from "@/lib/utils"
import { BundledTheme, codeToHtml } from "@/shiki-highlighter/shiki.bundle"

interface Props {
  markdown: string | undefined
  className?: string
}

function Markdown({ markdown: markdown, className }: Props) {
  const [html, setHtml] = useState<string>("")
  const { theme: appTheme } = useTheme()

  const styles = cn("prose", className)

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

  return (
    <div
      className={styles}
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Markdown

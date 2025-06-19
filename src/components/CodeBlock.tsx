import { useEffect, useState } from "react"

import { CheckCheck, Copy } from "lucide-react"
import { codeToHtml } from "shiki"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/context/theme/useTheme"

interface CodeBlockProps {
  code: string
  language?: string
  theme?: string
  fileName?: string
}

function CodeBlock(props: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const { theme: websiteTheme } = useTheme()
  const { code, language = "javascript", theme: shikiTheme, fileName } = props

  const shikiThemeMap = {
    dark: "catppuccin-frappe",
    light: "catppuccin-latte",
    system: "catppuccin-frappe",
  }
  // shiki theme depending on website Theme ("dark" | "light")
  const currentTheme = shikiTheme || shikiThemeMap[websiteTheme]

  useEffect(() => {
    const loadHighlighter = async () => {
      const html = await codeToHtml(code, {
        lang: language,
        theme: currentTheme,
      })

      setHighlightedCode(html)
    }

    loadHighlighter()
  }, [code, language, currentTheme])

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err)
      })
  }

  return (
    <div className="container rounded-xl">
      <Card className="relative w-full">
        <CardHeader className="-mt-5 flex items-baseline gap-6">
          {fileName && <span className="text-primary/90 text-sm">{fileName}</span>}
          <span className="text-primary/50 text-xs">{language}</span>

          <Button
            className="relative top-1 -mr-4 ml-auto cursor-pointer"
            onClick={handleCopy}
            variant="ghost"
            size="icon"
          >
            <Copy
              className={`transition-transform duration-300 ${copied ? "scale-0" : "scale-100"}`}
            />
            <CheckCheck
              className={`absolute transition-transform duration-300 ${copied ? "scale-100" : "scale-0"}`}
            />
          </Button>
        </CardHeader>

        <Separator className="-mt-3" />

        <CardContent className="flex items-center justify-between">
          {}
          <div className="shiki-container" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CodeBlock

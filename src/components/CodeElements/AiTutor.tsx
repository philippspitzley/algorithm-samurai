import { useEffect, useState } from "react"

import { toast } from "sonner"

import { APISchemas } from "@/api/types"

import LoadingSpinner from "../LoadingSpinner"
import Markdown from "../Markdown/MarkdownRender"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card, CardContent, CardHeader } from "../ui/card"

interface Props {
  aiHints: APISchemas["HintResponse"][]
  isLoading: boolean
  isError: boolean
  error: { detail?: { loc: (string | number)[]; msg: string; type: string }[] | undefined } | null
}

function AiTutor(props: Props) {
  const { aiHints, error: aiError, isError: aiIsError, isLoading: aiIsLoading } = props
  const [openAiHint, setOpenAiHint] = useState<string>("")

  // Update open item when hints change
  useEffect(() => {
    if (aiHints.length > 0) {
      setOpenAiHint(`item-${aiHints.length}`)
    }
  }, [aiHints.length])

  if (aiIsError) {
    if (aiError?.detail) {
      aiError.detail.forEach((err) => {
        const errorMessage = `Error: ${err.msg} at ${err.loc.join(" -> ")}`
        console.error(errorMessage)
        toast.error(errorMessage)
      })
    } else {
      console.error("Error generating AI hints:", aiError)
      toast.error("Error: Somthing went wrong with AI hints")
    }
  }
  if (aiHints.length === 0 && !aiIsLoading) return null

  return (
    <Card className="bg-card ml-6 rounded-lg px-4 py-4 text-left shadow-none">
      <CardHeader>AI Tutor</CardHeader>
      <CardContent className="-mt-4">
        {aiIsLoading && <LoadingSpinner />}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAiHint}
          onValueChange={setOpenAiHint}
        >
          {aiHints.map((hint, index) => (
            <AccordionItem value={`item-${index + 1}`} key={`item-${index + 1}`}>
              <AccordionTrigger>Hint {index + 1}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <Card className="bg-primary text-primary-foreground text-md font-mono leading-loose">
                  <CardContent>
                    <Markdown markdown={hint.hint} className="mb-2" />
                    <p className="mb-1">Next steps:</p>
                    <ol className="ml-4 list-inside space-y-1">
                      {hint.next_steps.map((step) => (
                        <li key={Math.random()}>
                          <Markdown markdown={step} />
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default AiTutor

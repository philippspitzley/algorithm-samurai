import { toast } from "sonner"

import { APISchemas } from "@/api/types"

import LoadingSpinner from "../LoadingSpinner"
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
      <CardContent>
        {aiIsLoading && <LoadingSpinner />}
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {aiHints.map((hint, index) => (
            <AccordionItem value={`item-${index + 1}`} key={`item-${index + 1}`}>
              <AccordionTrigger>Hint {index + 1}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>{hint.explanation}</p>
                <p>{hint.hint}</p>
                <p>{hint.next_steps.join("\n")}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default AiTutor

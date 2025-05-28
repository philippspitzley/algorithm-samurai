import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import Markdown from "@/components/Markdown/Markdown"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  defaultValue: string | undefined
  callbackFn: (body: { description: string }) => Promise<void> | void
}

function MarkdownForm({ defaultValue, callbackFn }: Props) {
  const FormSchema = z.object({
    markdown: z.string().min(1, { message: "Provide at least one character!" }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      markdown: defaultValue || "",
    },
  })
  const watchedMarkdown = form.watch("markdown") // acts like a controlled input

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== form.getValues("markdown")) {
      form.reset({ markdown: defaultValue || "" })
    }
  }, [defaultValue, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.markdown === defaultValue) {
      toast.info("No changes detected!")
      return
    }
    const body = { description: data.markdown }

    await callbackFn(body)
  }

  return (
    <div className="container flex gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative flex-3">
          <FormField
            control={form.control}
            name="markdown"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="absolute top-3 right-4">Markdown Editor</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={form.formState.isSubmitting}
                    placeholder="# My Markdown!"
                    className="dark:bg-background bg-background resize-none px-8 pt-10 pb-14 font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1/2">
              {form.formState.isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button
              type="reset"
              onClick={() => form.reset({ markdown: defaultValue || "" })}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>

      <Markdown markdown={watchedMarkdown} className="flex-4" />
    </div>
  )
}

export default MarkdownForm

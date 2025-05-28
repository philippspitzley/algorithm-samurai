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

function MarkdownForm() {
  const FormSchema = z.object({
    markdown: z.string(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const watchedMarkdown = form.watch("markdown")

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // delay to simulate saving to a database
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast("You submitted the following values:", {
      description: data.markdown,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
    console.log("Save data to db: ", data)
  }

  return (
    <div className="container flex gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-1/3">
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
          <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2 w-full">
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>

      <Markdown markdown={watchedMarkdown} />
    </div>
  )
}

export default MarkdownForm

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { postData } from "@/api/fetch"
import { getUrl } from "@/api/url-constants"

import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
})

function NewCourseForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(value: z.infer<typeof formSchema>) {
    const url = getUrl("courses")
    try {
      const result = await postData(url, value)
      console.log("Success:", result)
    } catch (error) {
      console.error("Failed to post data:", error)
    }
  }

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My new Course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="My new Course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className={`$ mb-2 w-full`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Create Course"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default NewCourseForm

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, SquarePen } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"

import { APISchemas } from "@/api/types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

const FormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "We'd love to know what you're calling this course! Please add a title." })
    .max(255, {
      message: "That's a great title! Could you keep it under 255 characters to make it snappy?",
    }),
  description: z
    .string()
    .min(1, {
      message: "Help learners understand what they'll discover - add a brief description!",
    })
    .max(500, {
      message: "Love the detail! Let's keep the description under 500 characters to stay focused.",
    }),
})

type CourseUpdate = APISchemas["CourseUpdate"]

interface Props {
  defaultValues: CourseUpdate
  onSubmit: (body: CourseUpdate) => void
}

function UpdateCourseForm({ onSubmit: createCourse, defaultValues: course }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: course.title ?? "",
      description: course.description ?? "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    createCourse(data)
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon">
          <span className="sr-only">Edit</span>
          <SquarePen />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new Course</SheetTitle>
          <SheetDescription>Hello</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id="course-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid flex-1 auto-rows-min gap-6 px-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="My new Course"
                      {...field}
                    />
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
                  <FormDescription>A short description of the course content.</FormDescription>
                  <FormControl>
                    <Textarea
                      disabled={form.formState.isSubmitting}
                      placeholder="This new course teaches about ..."
                      className="max-h-[60vh] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <Button type="submit" form="course-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>

          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default UpdateCourseForm

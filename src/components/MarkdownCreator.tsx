"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import "./MarkdownCreator.css"

import { useEffect, useMemo, useState } from "react"

import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async"
import { LoaderCircle } from "lucide-react"
import MarkdownItAsync from "markdown-it-async"

import { useTheme } from "@/context/theme/useTheme"

import { BundledTheme, codeToHtml } from "../shiki-highlighter/shiki.bundle"
import { Textarea } from "./ui/textarea"

function MarkdownTest() {
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

  const FormSchema = z.object({
    markdown: z.string(),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const watchedMarkdown = form.watch("markdown")

  useEffect(() => {
    const renderMarkdownAsync = async () => {
      if (typeof watchedMarkdown === "string") {
        const renderedHtml = await mdParser.renderAsync(watchedMarkdown)
        setHtml(renderedHtml)
      } else {
        setHtml("")
      }
    }

    renderMarkdownAsync()
  }, [watchedMarkdown, mdParser])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
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
                    placeholder="# My Markdown!"
                    className="dark:bg-background resize-none px-8 pt-10 pb-14 font-mono"
                    disabled={form.formState.isSubmitting}
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

      <div className="prose flex-2" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default MarkdownTest

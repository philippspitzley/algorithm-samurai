import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ApiError } from "@/api/fetch"
import { signUp } from "@/api/routes"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import AlertDestructive from "./AlertDestructive"
import { Card, CardTitle } from "./ui/card"

const formSchema = z
  .object({
  email: z.string().email({
    message: "Your email is invalid.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
    confirmPassword: z.string(),
  user_name: z
    .string()
    .min(1, {
      message: "Your name must be at least 1 character.",
    })
    .max(20, {
      message: "Your name can not be longer than 20 characters.",
    }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      user_name: "",
    },
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    if (errorMessage) {
      setShowAlert(true)
      const timer = setTimeout(() => {
        setShowAlert(false)
        
      }, 5000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [errorMessage])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage("")
    try {
      await signUp(values.email, values.password, values.user_name)
    } catch (error) {
      const apiError = error as ApiError
      const cleanErrorMessage = apiError.message.replace(
        /^((\p{Extended_Pictographic}\s*){2})/u,
        "",
      )
      setErrorMessage(cleanErrorMessage)
    }
  }

  return (
    <div className="flex flex-col">
      {errorMessage && showAlert ? (
        <div className="bg-background mb-4 rounded-md border p-4 shadow-lg">
          <AlertDestructive message={errorMessage.slice(1)} />
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div className="animate-scale-x-progress h-0.5 origin-left rounded-full bg-red-600 dark:bg-red-500"></div>
          </div>
        </div>
      ) : (
        <div className="h-32"></div>
      )}

      <Card className="w-lg px-6">
        <CardTitle className="text-2xl font-semibold">
          Create a new Account
        </CardTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-6 space-y-8">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        disabled={isSubmitting}
                      />
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
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

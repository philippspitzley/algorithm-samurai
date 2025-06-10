import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

import { $api } from "@/api/api"
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
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      user_name: "",
    },
  })

  const signUpMutation = $api.useMutation("post", "/api/v1/users/signup", {
    onSuccess: () => {
      toast.success("Sign up successful! Please log in.")
      navigate("/login")
    },
    onError: (error) => {
      // FIXME: add detail props to the error type
      // @ts-expect-error detail is not defined in the type
      toast.error(error?.detail?.message || "Sign up failed")
    },
  })

  const isSubmitting = signUpMutation.isPending

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    signUpMutation.mutate({
      body: {
        email: values.email,
        password: values.password,
        user_name: values.user_name,
      },
    })
  }

  return (
    <div className="flex flex-col">
      <Card className="w-lg px-6">
        <CardTitle className="text-2xl font-semibold">Create a new Account</CardTitle>

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
                      <Input placeholder="Enter your username" {...field} disabled={isSubmitting} />
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
                      <Input placeholder="user@example.com" {...field} disabled={isSubmitting} />
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

            <Button type="submit" className="mb-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

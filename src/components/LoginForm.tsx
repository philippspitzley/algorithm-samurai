import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
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
import { Input } from "@/components/ui/input"

import { useAuth } from "../context/auth/useAuth"
import AlertDestructive from "./AlertDestructive"
import { Card, CardTitle } from "./ui/card"

const formSchema = z.object({
  email: z.string().email({
    message: "Your email is invalid.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface LocationState {
  from?: {
    pathname?: string
  }
}

export function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const authContext = useAuth()
  const navigate = useNavigate()
  const from: string =
    (useLocation().state as LocationState)?.from?.pathname || "/"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    if (authContext.errorMessage) {
      setShowAlert(true)
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [authContext.errorMessage])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isLoggedIn = await authContext.login(values.email, values.password)
    if (authContext.errorMessage) {
      setErrorMessage(authContext.errorMessage)
    }

    if (isLoggedIn) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="flex flex-col">
      {errorMessage && showAlert ? (
        <div className="bg-background mb-4 rounded-md border p-4 shadow-lg">
          <AlertDestructive message={authContext.errorMessage.slice(2)} />
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div className="animate-scale-x-progress h-0.5 origin-left rounded-full bg-red-600 dark:bg-red-500"></div>
          </div>
        </div>
      ) : (
        <div className="h-32"></div>
      )}
      <Card className="w-lg px-6">
        <header>
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
          <p className="text-muted-foreground text-sm">
            Login with your Apple or Google account
          </p>
        </header>
        <Button variant="default" disabled={isSubmitting}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          Login with GitHub
        </Button>
        <Button variant="default" disabled={isSubmitting}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              fill="currentColor"
            />
          </svg>
          Login with Apple
        </Button>
        <div className="after:border-border relative mt-4 mb-1 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-6 space-y-8">
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
                    <div className="flex">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="#"
                        className={`ml-auto inline text-sm underline-offset-4 hover:underline ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="L2sGdVW9WbvQ6S"
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
                "Login"
              )}
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className={`underline underline-offset-4 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

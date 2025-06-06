import { useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { $api } from "@/api/api"

function useUser() {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = $api.useQuery(
    "get",
    "/api/v1/users/me",
    {},
    {
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error.detail.status_code === 401) {
          setIsAuthenticated(false)
          return false
        }
        return failureCount < 3
      },
    },
  )

  const loginMutation = $api.useMutation("post", "/api/v1/login/access-token")

  const login = async (email: string, password: string): Promise<boolean> => {
    const formData = new URLSearchParams()
    formData.append("grant_type", "password")
    formData.append("username", email)
    formData.append("password", password)
    formData.append("scope", "")

    try {
      await loginMutation.mutateAsync({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: { grant_type: "password", username: email, password: password, scope: "" },
      })

      // onSuccess
      setIsAuthenticated(true)
      toast.success("Login successful!")
      return true
    } catch (error) {
      // onError
      setIsAuthenticated(false)
      console.info(error)
      toast.error(error?.detail?.message || "Login failed")
      return false
    }
  }

  const logoutMutation = $api.useMutation("post", "/api/v1/logout", {
    onSuccess: () => {
      setIsAuthenticated(false)
      queryClient.clear()
      toast.success("Bye! 👋")
    },
    onError: (error) => {
      console.info(error)
      toast.error("You could not log out.")
    },
  })

  const logout = () => logoutMutation.mutate({})

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: Boolean(user?.is_superuser),
    isLoading: isUserLoading || loginMutation.isPending,
    isError: isUserError || loginMutation.isError,
    error: userError || loginMutation.error,
  }
}

export default useUser

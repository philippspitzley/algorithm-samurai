import { useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { $api } from "@/api/api"
import { APISchemas } from "@/api/types"

function useUser() {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

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
        // FIXME: add detail props to the error type
        // @ts-expect-error detail.status_code is not defined in the type
        if (error.detail.status_code === 401) {
          setIsAuthenticated(false)
          return false
        }
        return failureCount < 3
      },
    },
  )

  const updateUserMutation = $api.useMutation("patch", "/api/v1/users/me", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/users/me", {}] })
    },
    onError: (error) => {
      // FIXME: add detail props to the error type
      // @ts-expect-error detail.status_code is not defined in the type
      toast.error(error.detail?.message || "Failed to update user information")
    },
  })

  const updateUser = (userData: APISchemas["UserUpdateMe"]) => {
    return updateUserMutation.mutate({
      body: userData,
    })
  }

  const updatePasswordMutation = $api.useMutation("patch", "/api/v1/users/me/password", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/api/v1/users/me", {}] })
      toast.success("Password updated successfully. Please log in again.")
    },
    onError: (error) => {
      // FIXME: add detail props to the error type
      // @ts-expect-error detail.status_code is not defined in the type
      toast.error(error?.detail?.message || "Failed to update password")
    },
  })

  const updatePassword = (passwordData: APISchemas["UpdatePassword"]) => {
    return updatePasswordMutation.mutate({
      body: passwordData,
    })
  }

  const loginMutation = $api.useMutation("post", "/api/v1/login/access-token")

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: { grant_type: "password", username: email, password: password, scope: "" },
      })

      // onSuccess
      setIsAuthenticated(true)

      // -- navigate to previous url
      const searchParams = new URLSearchParams(location.search)
      const returnTo = searchParams.get("returnTo") || "/"
      navigate(returnTo)

      return true
    } catch (error) {
      // onError
      setIsAuthenticated(false)
      console.info(error)
      // FIXME: add detail props to the error type
      // @ts-expect-error detail is not defined in the type
      toast.error(error?.detail?.message || "Login failed")
      return false
    }
  }

  const logoutMutation = $api.useMutation("post", "/api/v1/logout", {
    onSuccess: () => {
      setIsAuthenticated(false)
      queryClient.clear()
      window.location.reload()
    },
    onError: (error) => {
      console.info(error)
      toast.error("You could not log out.")
    },
  })

  const logout = () => logoutMutation.mutate({})

  const goToLogin = (returnToCurrentPage = true) => {
    const returnPath = returnToCurrentPage ? location.pathname : undefined
    if (returnPath) {
      navigate(`/login?returnTo=${returnPath}`)
    } else {
      navigate("/login")
    }
  }

  return {
    user,
    updateUser,
    updatePassword,
    login,
    logout,
    goToLogin,
    isAuthenticated: !!user,
    isAdmin: Boolean(user?.is_superuser),
    isLoading: isUserLoading || loginMutation.isPending,
    isError: isUserError || loginMutation.isError,
    error: userError || loginMutation.error,
  }
}

export default useUser

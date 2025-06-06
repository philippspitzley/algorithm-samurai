import { useCallback, useEffect, useMemo, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { APISchemas } from "@/api/types"

import { AuthContext } from "./useAuth"

export type User = APISchemas["UserPublic"]
const HOST = "http://localhost:8000/api/v1"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const queryClient = useQueryClient()

  const clearErrorMessage = useCallback(() => {
    setErrorMessage("")
  }, [])

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true)
      clearErrorMessage()
      try {
        const response = await fetch(HOST + "/users/me", {
          credentials: "include",
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData as User)
        } else {
          const errorData = await response.json().catch(() => ({}))
          if (errorData?.detail) {
            setErrorMessage(errorData.detail)
          } else {
            setErrorMessage("Failed to check authentication status.")
          }
          setUser(null)
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during auth check.",
        )
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [clearErrorMessage])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true)
      clearErrorMessage()
      try {
        const formData = new URLSearchParams()
        formData.append("username", email)
        formData.append("password", password)

        const response = await fetch(HOST + "/login/access-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
          credentials: "include",
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (errorData?.detail) {
            setErrorMessage(errorData.detail)
          } else {
            setErrorMessage("Login failed. Please check your credentials.")
            console.error("Authentication error:", response.statusText)
          }
          return false
        }

        const userResponse = await fetch(HOST + "/users/me", {
          credentials: "include",
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData as User)
          return true
        } else {
          const errorData = await userResponse.json().catch(() => ({}))
          setErrorMessage(errorData?.detail || "Failed to fetch user data after login.")
          return false
        }
      } catch (error) {
        console.error("Login failed", error)
        setErrorMessage(
          error instanceof Error ? error.message : "An unexpected error occurred during login.",
        )
        return false
      } finally {
        setLoading(false)
      }
    },
    [clearErrorMessage],
  )

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true)
    clearErrorMessage()
    try {
      await fetch(HOST + "/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)

      // clear query cache
      queryClient.removeQueries({ queryKey: ["get", "/api/v1/users/me/courses"] })

      toast.success("You logged out successfully.")
    } catch (error) {
      toast.error("Logout failed.")
      setErrorMessage(error instanceof Error ? error.message : "Logout failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [clearErrorMessage, queryClient])

  const value = useMemo(() => {
    return {
      isAuthenticated: !!user,
      isAdmin: Boolean(user?.is_superuser),
      user,
      login,
      logout,
      loading,
      errorMessage,
      clearErrorMessage,
    }
  }, [user, login, logout, loading, errorMessage, clearErrorMessage])

  return <AuthContext value={value}>{children}</AuthContext>
}

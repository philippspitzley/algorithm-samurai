import { useMemo } from "react"

import { APISchemas } from "@/api/types"

import { AuthContext } from "./useAuth"
import useUser from "./useUser"

export type User = APISchemas["UserPublic"]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, logout, isAuthenticated, isAdmin, isError, error, isLoading } = useUser()

  const value = useMemo(() => {
    return {
      user,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isLoading,
      isError,
      error,
    }
  }, [user, login, logout, isAuthenticated, isAdmin, isLoading, isError, error])

  return <AuthContext value={value}>{children}</AuthContext>
}

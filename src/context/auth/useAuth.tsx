import { createContext, use } from "react"

import { APISchemas } from "@/api/types"

interface AuthContextType {
  user: APISchemas["UserPublic"] | undefined
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  isError: boolean
  error: unknown
}

// Context Provider
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// useContext Hook
export const useAuth = (): AuthContextType => {
  const context = use(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

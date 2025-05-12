import { createContext, use } from "react"

import { User } from "@/types/api"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null // Use the User interface
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  errorMessage: string
  clearErrorMessage: () => void // Optional: for manually clearing errors
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

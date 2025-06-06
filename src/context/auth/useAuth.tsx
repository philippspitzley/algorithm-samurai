import { createContext, use } from "react"

import useUser from "./useUser"

type AuthContextType = ReturnType<typeof useUser>

// Context Provider
export const AuthContext = createContext<AuthContextType | null>(null)

// useContext Hook
export const useAuth = () => {
  const context = use(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

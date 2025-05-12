import { createContext, use } from "react"

export type Theme = "dark" | "light" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeContextType = {
  theme: "dark",
  setTheme: () => null,
}

// Context Provider
export const ThemeProviderContext =
  createContext<ThemeContextType>(initialState)

// useContext Hook
export const useTheme = () => {
  const context = use(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

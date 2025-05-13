import { createContext, use, useEffect, useState } from "react" // Import useState and useEffect

export type Theme = "dark" | "light" | "system"
export type ResolvedTheme = "dark" | "light" // For clarity

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolveTheme: (theme: Theme) => ResolvedTheme
}

// Define the return type for the enhanced useTheme hook
export type UseThemeReturnType = {
  theme: ResolvedTheme // This will be the actual "dark" or "light"
  setTheme: (theme: Theme) => void // For setting the preference ("system", "light", "dark")
  selectedTheme: Theme // The user's actual selection
  resolveTheme: (theme: Theme) => ResolvedTheme // Keep for utility
}

const initialState: ThemeContextType = {
  theme: "system", // Default selected theme, ThemeProvider will initialize with stored/default
  setTheme: () => null,
  resolveTheme, // Uses the resolveTheme function defined below
}

export const ThemeProviderContext =
  createContext<ThemeContextType>(initialState)

export const useTheme = (): UseThemeReturnType => {
  const context = use(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  // State for the actual resolved theme ("light" or "dark")
  const [effectiveTheme, setEffectiveTheme] = useState<ResolvedTheme>(() =>
    context.resolveTheme(context.theme),
  )

  useEffect(() => {
    // Update effectiveTheme if the selected theme changes
    const currentResolved = context.resolveTheme(context.theme)
    setEffectiveTheme(currentResolved)

    // If selected theme is "system", listen for OS changes
    if (context.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        setEffectiveTheme(mediaQuery.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      // Initial check in case the OS theme changed while the listener wasn't active
      handleChange()

      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [context.theme, context.resolveTheme]) // context.resolveTheme is stable

  return {
    theme: effectiveTheme, // Consumers get the resolved "light" or "dark"
    setTheme: context.setTheme, // To change the selected preference
    selectedTheme: context.theme, // The actual preference ("system", "light", "dark")
    resolveTheme: context.resolveTheme,
  }
}

// Theme Resolver (remains the same)
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

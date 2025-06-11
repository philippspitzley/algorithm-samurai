import { useEffect, useMemo, useState } from "react"

import { resolveTheme, Theme, ThemeProviderContext } from "@/context/theme/useTheme"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initiateTheme)

  function initiateTheme(): Theme {
    const stored = localStorage.getItem(storageKey)
    const validThemes: Theme[] = ["dark", "light", "system"]

    return stored && validThemes.includes(stored as Theme) ? (stored as Theme) : defaultTheme
  }

  // function resolveTheme(theme: Theme): "dark" | "light" {
  //   if (theme !== "system") return theme
  //   return window.matchMedia("(prefers-color-scheme: dark)").matches
  //     ? "dark"
  //     : "light"
  // }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolveTheme(theme))

    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(mediaQuery.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
      },
      resolveTheme,
    }),
    [theme, storageKey],
  )

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

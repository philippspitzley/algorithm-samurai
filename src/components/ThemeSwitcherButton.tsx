import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme/useTheme"

function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const sharedStyles = "h-[1.2rem] w-[1.2rem] transition-all"

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun
        className={`${sharedStyles} scale-100 rotate-0 dark:scale-0 dark:-rotate-360`}
      />
      <Moon
        className={`${sharedStyles} absolute scale-0 rotate-360 dark:scale-100 dark:rotate-0`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ThemeSwitcherButton

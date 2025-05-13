import { motion } from "framer-motion"
import { Monitor, Moon, Sun } from "lucide-react"

import { useTheme } from "@/context/theme/useTheme"

export function ThemeToggle() {
  const { setTheme, selectedTheme } = useTheme()

  // totalLength: 134, knobLength: 44
  const variants = {
    dark: { x: 4 },
    system: { x: 134 / 2 - 22 },
    light: { x: 134 - 44 - 4 },
  }

  return (
    <div
      className="bg-secondary relative h-8 w-[134px] rounded-full border p-0"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {/* Icons */}
      <div className="relative flex h-full items-center justify-between px-4">
        <span
          className={`z-10 translate-x-0.5 ${selectedTheme === "dark" ? "text-background" : "text-foreground/50"} cursor-pointer`}
          onClick={() => setTheme("dark")}
        >
          <Moon size={16} />
        </span>
        <span
          className={`z-10 ${selectedTheme === "system" ? "text-background" : "text-foreground/50"} cursor-pointer`}
          onClick={() => setTheme("system")}
        >
          <Monitor size={16} />
        </span>
        <span
          className={`z-10 ${selectedTheme === "light" ? "text-background" : "text-foreground/50"} cursor-pointer`}
          onClick={() => setTheme("light")}
        >
          <Sun size={16} />
        </span>
      </div>

      {/* Moving Slider */}
      <motion.div
        className={`bg-primary absolute top-[3px] h-6 w-11 rounded-full`}
        variants={variants}
        animate={selectedTheme}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </div>
  )
}

"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Set theme based on user preference if available
    if (isAuthenticated && user?.darkMode !== undefined) {
      setTheme(user.darkMode ? "dark" : "light")
    }
  }, [setTheme, user, isAuthenticated])

  // Update user preference when theme changes
  useEffect(() => {
    if (mounted && isAuthenticated && theme) {
      // Only update if the user is logged in and theme has changed
      updateUserThemePreference(theme === "dark")
    }
  }, [theme, isAuthenticated, mounted])

  if (!mounted) {
    return null
  }

  async function updateUserThemePreference(isDarkMode: boolean) {
    try {
      await fetch("/api/user/update-theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ darkMode: isDarkMode }),
      })
    } catch (error) {
      console.error("Failed to update theme preference:", error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

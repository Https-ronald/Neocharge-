"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { SessionTimeout } from "@/components/session-timeout"

type User = {
  id: string
  name?: string
  email?: string
  role?: string
  darkMode?: boolean
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  setUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount and path change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setError(null)

        // Skip auth check for public pages
        const publicPages = [
          "/",
          "/login",
          "/register",
          "/admin/login",
          "/verify-email",
          "/reset-password",
          "/two-factor",
          "/about",
          "/services",
          "/contact",
          "/pricing",
          "/blog",
          "/privacy-policy",
          "/terms-of-service",
          "/careers",
        ]

        if (publicPages.includes(pathname) || pathname.startsWith("/reset-password/")) {
          setIsLoading(false)
          return
        }

        const res = await fetch("/api/auth/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!res.ok) {
          console.error("Auth status response not OK:", res.status, res.statusText)
          setUser(null)
          setIsLoading(false)

          // Only redirect if trying to access protected routes
          if (
            pathname.startsWith("/dashboard") ||
            (pathname.startsWith("/admin") && !pathname.includes("/admin/login"))
          ) {
            if (pathname.startsWith("/admin")) {
              router.push("/admin/login")
            } else {
              router.push("/login")
            }
          }
          return
        }

        const data = await res.json()

        if (data.authenticated && data.user) {
          setUser(data.user)

          // Check if two-factor verification is required
          if (data.requiresTwoFactor && !data.twoFactorVerified) {
            router.push(`/two-factor?userId=${data.user.id}&redirectTo=${pathname}`)
            return
          }
        } else {
          setUser(null)

          // Only redirect if trying to access protected routes
          if (
            pathname.startsWith("/dashboard") ||
            (pathname.startsWith("/admin") && !pathname.includes("/admin/login"))
          ) {
            if (pathname.startsWith("/admin")) {
              router.push("/admin/login")
            } else {
              router.push("/login")
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setError("Failed to check authentication status")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const logout = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (res.ok) {
        setUser(null)
        if (pathname.startsWith("/admin")) {
          router.push("/admin/login")
        } else {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Logout error:", error)
      setError("Failed to logout")
    } finally {
      setIsLoading(false)
    }
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        setUser,
      }}
    >
      {children}
      <SessionTimeout />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

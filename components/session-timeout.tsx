"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

// Session timeout in milliseconds (20 minutes)
const SESSION_TIMEOUT = 20 * 60 * 1000
// Warning before timeout in milliseconds (1 minute)
const WARNING_BEFORE_TIMEOUT = 60 * 1000

export function SessionTimeout() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Reset timer on user activity
  const resetTimer = () => {
    setLastActivity(Date.now())
    setShowWarning(false)
  }

  // Handle user activity
  useEffect(() => {
    if (!isAuthenticated) return

    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const handleActivity = () => {
      resetTimer()
    }

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated])

  // Check for inactivity
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivity

      if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT) {
        // Show warning dialog
        setShowWarning(true)
        setTimeLeft(Math.max(0, SESSION_TIMEOUT - timeSinceLastActivity))
      }

      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        // Log out user
        handleLogout()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, lastActivity])

  // Update countdown timer
  useEffect(() => {
    if (!showWarning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1000
        if (newTimeLeft <= 0) {
          clearInterval(interval)
          handleLogout()
          return 0
        }
        return newTimeLeft
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showWarning])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleStayLoggedIn = () => {
    resetTimer()
  }

  if (!isAuthenticated || !showWarning) {
    return null
  }

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Timeout Warning</DialogTitle>
          <DialogDescription>
            Your session will expire in {Math.ceil(timeLeft / 1000)} seconds due to inactivity.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleLogout}>
            Logout Now
          </Button>
          <Button onClick={handleStayLoggedIn}>Stay Logged In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

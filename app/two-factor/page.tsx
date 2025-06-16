"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyTwoFactorCode } from "@/lib/email-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function TwoFactorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setError("Invalid verification request")
      return
    }

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await verifyTwoFactorCode(userId, code)

      if (result.success) {
        // Set a session flag to indicate 2FA is complete
        await fetch("/api/auth/complete-2fa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        })

        router.push(redirectTo)
      } else {
        setError(result.error || "Invalid verification code")
        setIsVerifying(false)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>Enter the verification code sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Didn't receive a code?{" "}
            <Button variant="link" className="h-auto p-0 text-sm" onClick={() => router.refresh()}>
              Resend code
            </Button>
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmailToken } from "@/lib/email-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false)
        setError("Invalid verification link")
        return
      }

      try {
        const result = await verifyEmailToken(token)

        setIsVerifying(false)

        if (result.success) {
          setIsSuccess(true)
        } else {
          setError(result.error || "Failed to verify email")
        }
      } catch (error) {
        setIsVerifying(false)
        setError("An unexpected error occurred")
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {isVerifying ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-center text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Email Verified!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
              </div>
              <Button asChild className="mt-4 w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Verification Failed</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

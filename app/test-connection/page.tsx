"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestConnectionPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-connection")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to connect to API",
        details: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Supabase Connection Test
          </CardTitle>
          <CardDescription>Test your Supabase configuration and database connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Supabase URL:</strong> https://tyetwntjxqgxrbyhwbny.supabase.co
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Anon Key:</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (configured)
            </p>
          </div>

          <Button onClick={testConnection} disabled={testing} className="w-full">
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Database Connection"
            )}
          </Button>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  {result.success ? (
                    <div>
                      <p className="font-semibold text-green-700">✅ Connection Successful!</p>
                      <p className="text-sm mt-1">Database tables found: {result.tables?.join(", ") || "None"}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-red-700">❌ Connection Failed</p>
                      <p className="text-sm mt-1">{result.error}</p>
                      {result.details && (
                        <pre className="text-xs mt-2 bg-red-50 p-2 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {result?.success && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎉 Ready to go!</h3>
              <p className="text-sm text-green-700">Your Supabase connection is working. You can now:</p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>
                  • Test user registration at{" "}
                  <a href="/register" className="underline">
                    /register
                  </a>
                </li>
                <li>
                  • Test admin login at{" "}
                  <a href="/admin/login" className="underline">
                    /admin/login
                  </a>
                </li>
                <li>• Use credentials: admin / admin123</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

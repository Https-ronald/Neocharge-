"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DebugPage() {
  const [envCheck, setEnvCheck] = useState<any>(null)
  const [dbTest, setDbTest] = useState<any>(null)

  const checkEnvironment = () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
      NODE_ENV: process.env.NODE_ENV,
    }
    setEnvCheck(env)
  }

  const testDatabase = async () => {
    try {
      const response = await fetch("/api/debug/db-test")
      const result = await response.json()
      setDbTest(result)
    } catch (error) {
      setDbTest({ success: false, error: error.message })
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if required environment variables are set</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={checkEnvironment} className="mb-4">
              Check Environment
            </Button>
            {envCheck && (
              <div className="space-y-2">
                {Object.entries(envCheck).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono">{key}:</span>
                    <span className={value === "Missing" ? "text-red-500" : "text-green-500"}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>Test connection to Supabase database</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testDatabase} className="mb-4">
              Test Database
            </Button>
            {dbTest && (
              <Alert variant={dbTest.success ? "default" : "destructive"}>
                <AlertDescription>
                  {dbTest.success ? "Database connection successful!" : `Error: ${dbTest.error}`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

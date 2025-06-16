"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Key, Database, Settings, Users } from "lucide-react"
import Link from "next/link"

export default function AdminAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Access Guide</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Complete setup instructions for NeoCharge Admin</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Database Setup */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                1. Database Setup
              </CardTitle>
              <CardDescription>Run these SQL scripts in your Supabase dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <code className="text-sm">scripts/001-create-auth-tables.sql</code>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <code className="text-sm">scripts/002-create-default-admin.sql</code>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <code className="text-sm">scripts/003-seed-service-plans.sql</code>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Creates default admin account
              </Badge>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                2. Admin Login
              </CardTitle>
              <CardDescription>Default admin credentials (change after first login)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Username:</span>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">admin</code>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Password:</span>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">admin123</code>
                </div>
              </div>
              <Link href="/admin/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">Go to Admin Login</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-600" />
                3. Environment Setup
              </CardTitle>
              <CardDescription>Required environment variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div>✅ NEXT_PUBLIC_SUPABASE_URL</div>
                <div>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                <div>✅ SUPABASE_SERVICE_ROLE_KEY</div>
                <div>✅ POSTGRES_URL</div>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Already configured
              </Badge>
            </CardContent>
          </Card>

          {/* Admin Features */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                4. Admin Features
              </CardTitle>
              <CardDescription>What you can do in the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div>📊 View Dashboard Analytics</div>
                <div>👥 Manage Users & Admins</div>
                <div>💳 Monitor Transactions</div>
                <div>📝 Manage Blog Posts</div>
                <div>⚙️ System Settings</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Shield className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Test Registration
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                <User className="mr-2 h-4 w-4" />
                User Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Troubleshooting */}
        <Card className="mt-8 border-2 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Can't login as admin?</strong> Make sure you've run the SQL scripts first
            </div>
            <div>
              <strong>Registration not working?</strong> Check Supabase connection and environment variables
            </div>
            <div>
              <strong>Pages not loading?</strong> Verify all environment variables are set correctly
            </div>
            <div>
              <strong>Database errors?</strong> Check Supabase project status and connection string
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

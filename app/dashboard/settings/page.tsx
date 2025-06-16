"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Mail, Smartphone, Shield, Eye, EyeOff } from "lucide-react"
import { useTheme } from "next-themes"

interface UserSettings {
  darkMode: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  twoFactorAuth: boolean
  showBalance: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const { setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false,
    showBalance: true,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch("/api/auth/status")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.user) {
            setUser(userData.user)

            // Set dark mode based on user preference
            if (userData.user.darkMode) {
              setSettings((prev) => ({ ...prev, darkMode: userData.user.darkMode }))
              setTheme(userData.user.darkMode ? "dark" : "light")
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUserData()
  }, [setTheme])

  const handleToggle = async (setting: keyof UserSettings, checked: boolean) => {
    if (!user?.id) return

    setSettings((prev) => ({ ...prev, [setting]: checked }))

    if (setting === "darkMode") {
      setTheme(checked ? "dark" : "light")
    }

    setIsLoading(true)
    try {
      // Update user settings
      const response = await fetch("/api/user/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          settings: { [setting]: checked },
        }),
      })

      if (response.ok) {
        toast({
          title: "Settings updated",
          description: `Your ${setting} preference has been updated.`,
          variant: "default",
        })
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error(`Error updating ${setting}:`, error)
      toast({
        title: "Update failed",
        description: `Failed to update ${setting} setting. Please try again.`,
        variant: "destructive",
      })
      // Revert the setting
      setSettings((prev) => ({ ...prev, [setting]: !checked }))
      if (setting === "darkMode") {
        setTheme(!checked ? "dark" : "light")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    toast({
      title: "Password reset email sent",
      description: "Check your email for instructions to reset your password.",
      variant: "default",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how NeoCharge looks on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleToggle("darkMode", checked)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications for transactions and account updates
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleToggle("emailNotifications", checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">SMS Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive SMS notifications for transactions and account updates
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => handleToggle("smsNotifications", checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Marketing Emails</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive marketing emails and promotions</p>
              </div>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => handleToggle("marketingEmails", checked)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => handleToggle("twoFactorAuth", checked)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 bg-blue-100 rounded-md dark:bg-blue-900/30">
                {settings.showBalance ? (
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <p className="font-medium dark:text-white">Show Balance</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Show or hide your wallet balance on the dashboard
                </p>
              </div>
            </div>
            <Switch
              checked={settings.showBalance}
              onCheckedChange={(checked) => handleToggle("showBalance", checked)}
              disabled={isLoading}
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleChangePassword}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

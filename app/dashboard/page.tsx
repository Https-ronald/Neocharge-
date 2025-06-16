"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingUp,
  History,
  PiggyBank,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  status: "completed" | "pending" | "failed"
  created_at: string
}

interface DashboardStats {
  balance: number
  totalSpent: number
  totalTransactions: number
  savings: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    totalSpent: 0,
    totalTransactions: 0,
    savings: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Set greeting based on time of day and user name
        if (user?.name) {
          const firstName = user.name.split(" ")[0]
          setUserName(firstName)

          const hour = new Date().getHours()
          let timeGreeting = "Hello"
          if (hour < 12) timeGreeting = "Good morning"
          else if (hour < 18) timeGreeting = "Good afternoon"
          else timeGreeting = "Good evening"

          setGreeting(timeGreeting)
        }

        if (user?.id) {
          // Fetch real user stats
          const statsResponse = await fetch(`/api/user/stats?userId=${user.id}`)
          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setStats(statsData)
          }

          // Fetch real transactions
          const transactionsResponse = await fetch(`/api/user/transactions?userId=${user.id}&limit=5`)
          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json()
            setTransactions(transactionsData.transactions || [])
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Keep stats at zero if there's an error
        setStats({
          balance: 0,
          totalSpent: 0,
          totalTransactions: 0,
          savings: 0,
        })
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const services = [
    { name: "Airtime", icon: Smartphone, href: "/dashboard/airtime", color: "bg-blue-500" },
    { name: "Data", icon: Wifi, href: "/dashboard/data", color: "bg-green-500" },
    { name: "Electricity", icon: Zap, href: "/dashboard/electricity", color: "bg-yellow-500" },
    { name: "TV", icon: Tv, href: "/dashboard/tv", color: "bg-purple-500" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {greeting}, {userName || "there"}!
            </h1>
            <p className="text-blue-100">
              {stats.totalTransactions === 0
                ? "Welcome to NeoCharge! Start by funding your wallet to begin."
                : "Manage your utilities and top-ups with ease"}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/dashboard/fund-wallet">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Plus className="mr-2 h-4 w-4" />
                {stats.balance === 0 ? "Get Started" : "Fund Wallet"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.balance === 0 ? "Fund your wallet to get started" : "Available balance"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">{stats.totalSpent === 0 ? "No spending yet" : "This month"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTransactions === 0 ? "No transactions yet" : "Total transactions"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.savings)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.savings === 0 ? "Start saving with transactions" : "From discounts"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Services</CardTitle>
          <CardDescription>
            {stats.balance === 0 ? "Fund your wallet first to access these services" : "Access your most used services"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = service.icon
              const isDisabled = stats.balance === 0
              return (
                <div key={service.name}>
                  {isDisabled ? (
                    <div className="flex flex-col items-center p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed">
                      <div className={`p-3 rounded-full ${service.color} text-white mb-2 opacity-50`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">{service.name}</span>
                    </div>
                  ) : (
                    <Link href={service.href}>
                      <div className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className={`p-3 rounded-full ${service.color} text-white mb-2`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest account activity</CardDescription>
          </div>
          {transactions.length > 0 && (
            <Link href="/dashboard/transactions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No transactions yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start by funding your wallet to begin making transactions.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/fund-wallet">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Fund Wallet
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { getUserTransactions } from "@/lib/auth"
import { Download, Upload, Loader2, Search, FileDown } from "lucide-react"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.id) {
        try {
          const data = await getUserTransactions(user.id)
          setTransactions(data)
          setFilteredTransactions(data)
        } catch (error) {
          console.error("Error fetching transactions:", error)
          setError("Failed to load transactions. Please try again.")
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [user])

  useEffect(() => {
    // Apply filters and search
    let result = [...transactions]

    // Filter by type
    if (filter !== "all") {
      result = result.filter((transaction) => transaction.type === filter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(query) || transaction.amount.toString().includes(query),
      )
    }

    setFilteredTransactions(result)
  }, [filter, searchQuery, transactions])

  const handleDownloadCSV = () => {
    if (filteredTransactions.length === 0) return

    // Create CSV content
    const headers = ["Date", "Description", "Type", "Amount", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [new Date(t.created_at).toLocaleDateString(), `"${t.description}"`, t.type, t.amount, t.status].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">Loading your transactions...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage your transaction history</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Your complete transaction history</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-white">
                  All Transactions
                </SelectItem>
                <SelectItem value="credit" className="dark:text-white">
                  Credits Only
                </SelectItem>
                <SelectItem value="debit" className="dark:text-white">
                  Debits Only
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleDownloadCSV}
              disabled={filteredTransactions.length === 0}
            >
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="rounded-md border dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr
                        key={index}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(transaction.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                            >
                              {transaction.type === "credit" ? (
                                <Upload className="w-3 h-3 text-green-600" />
                              ) : (
                                <Download className="w-3 h-3 text-red-600" />
                              )}
                            </div>
                            {transaction.description}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === "credit"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {transaction.type === "credit" ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          <span
                            className={
                              transaction.type === "credit"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium dark:text-white">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {transactions.length === 0
                  ? "You haven't made any transactions yet."
                  : "No transactions match your current filters."}
              </p>
              {transactions.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFilter("all")
                    setSearchQuery("")
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { fundWallet } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { CreditCard } from "lucide-react"
import { initializeFlutterwavePayment } from "@/lib/flutterwave"

export default function FundWalletPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFundWallet = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      // Initialize Flutterwave payment
      initializeFlutterwavePayment({
        amount: Number(amount),
        customer: {
          email: user.email || "customer@example.com",
          name: user.name || "Customer",
        },
        description: `Wallet funding of ₦${Number(amount).toLocaleString()}`,
        onSuccess: async (reference, transactionId) => {
          try {
            // Process the wallet funding after successful payment
            const result = await fundWallet(user.id, Number(amount))

            if (result.success) {
              setSuccess(
                `Successfully added ₦${Number(amount).toLocaleString()} to your wallet. New balance: ₦${result.newBalance.toLocaleString()}`,
              )
              setAmount("")

              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                router.push("/dashboard")
              }, 2000)
            } else {
              setError(result.error)
            }
          } catch (error) {
            setError("An error occurred while processing your wallet funding")
          } finally {
            setIsLoading(false)
          }
        },
        onFailure: (error) => {
          setError("Payment failed: " + error)
          setIsLoading(false)
        },
        onClose: () => {
          setIsLoading(false)
        },
      })
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Fund Wallet</h1>
        <p className="text-gray-500">Add money to your NeoCharge wallet</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>Pay with Flutterwave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₦</span>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">Pay with Flutterwave</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    You will be redirected to Flutterwave's secure payment page to complete your transaction.
                  </p>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleFundWallet}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Summary</CardTitle>
            <CardDescription>Your current wallet status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold">₦{user?.walletBalance?.toLocaleString() || "0.00"}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-sm font-medium">₦0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-sm font-medium">₦0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Pending Transactions</p>
                <p className="text-sm font-medium">₦0.00</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Funds are usually credited to your wallet instantly after payment is confirmed through Flutterwave.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

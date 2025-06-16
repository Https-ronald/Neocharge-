"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { purchaseAirtime, getServiceProviders } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Check, Smartphone } from "lucide-react"
import { initializeFlutterwavePayment } from "@/lib/flutterwave"

export default function AirtimePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getServiceProviders("airtime")
        setProviders(data)
        if (data.length > 0) {
          setSelectedProvider(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching providers:", error)
      }
    }

    fetchProviders()
  }, [])

  const handlePurchase = async () => {
    // Validate inputs
    if (!selectedProvider) {
      setError("Please select a network provider")
      return
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

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
          phoneNumber: phoneNumber,
        },
        description: `Airtime purchase for ${phoneNumber} on ${providers.find((p) => p.id === selectedProvider)?.name}`,
        onSuccess: async (reference, transactionId) => {
          try {
            // Process the airtime purchase after successful payment
            const result = await purchaseAirtime(user.id, selectedProvider, phoneNumber, Number(amount))

            if (result.success) {
              setSuccess(result.message)
              // Reset form
              setPhoneNumber("")
              setAmount("")

              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                router.push("/dashboard")
              }, 2000)
            } else {
              setError(result.error)
            }
          } catch (error) {
            setError("An error occurred while processing your purchase")
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

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Airtime Recharge</h1>
        <p className="text-gray-500 dark:text-gray-400">Purchase airtime for any network</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
          <Check className="h-4 w-4 mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Purchase Airtime</CardTitle>
            <CardDescription>Select network, enter phone number and amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Select Network</Label>
              <RadioGroup
                value={selectedProvider}
                onValueChange={setSelectedProvider}
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                        : "border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="mb-2">
                      <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <RadioGroupItem value={provider.id} id={provider.id} className="sr-only" />
                    <Label htmlFor={provider.id} className="cursor-pointer font-medium dark:text-white">
                      {provider.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-number" className="dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone-number"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="dark:text-gray-300">
                Amount
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">₦</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">Quick Amounts</Label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(amt.toString())}
                    className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    ₦{amt.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Purchase Airtime"}
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Review your transaction details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Network</p>
                <p className="text-sm font-medium dark:text-white">
                  {selectedProvider ? providers.find((p) => p.id === selectedProvider)?.name || selectedProvider : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                <p className="text-sm font-medium dark:text-white">{phoneNumber || "-"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p className="text-sm font-medium dark:text-white">
                  {amount ? `₦${Number(amount).toLocaleString()}` : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Service Fee</p>
                <p className="text-sm font-medium dark:text-white">₦0.00</p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <p className="text-sm font-medium dark:text-white">Total</p>
                <p className="text-sm font-medium dark:text-white">
                  {amount ? `₦${Number(amount).toLocaleString()}` : "-"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By proceeding with this transaction, you agree to our terms and conditions. Airtime will be delivered
                instantly to the provided number.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

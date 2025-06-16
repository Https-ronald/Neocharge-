"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { getServiceProviders, validateMeterNumber, purchaseElectricity } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Check, Zap, Loader2 } from "lucide-react"

export default function ElectricityPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [meterNumber, setMeterNumber] = useState("")
  const [meterType, setMeterType] = useState("Prepaid")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getServiceProviders("electricity")
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

  const handleValidateMeter = async () => {
    if (!selectedProvider) {
      setError("Please select an electricity provider")
      return
    }

    if (!meterNumber || meterNumber.length < 10) {
      setError("Please enter a valid meter number")
      return
    }

    setIsValidating(true)
    setError(null)
    setCustomerInfo(null)

    try {
      const result = await validateMeterNumber(selectedProvider, meterNumber, meterType)

      if (result.valid) {
        setCustomerInfo(result)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const handlePurchase = async () => {
    if (!customerInfo) {
      setError("Please validate your meter number first")
      return
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) < 500) {
      setError("Please enter a valid amount (minimum ₦500)")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setToken(null)

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      const result = await purchaseElectricity(user.id, selectedProvider, meterNumber, meterType, Number(amount))

      if (result.success) {
        setSuccess(result.message)
        setToken(result.token)

        // Reset form after 5 seconds
        setTimeout(() => {
          setMeterNumber("")
          setAmount("")
          setCustomerInfo(null)
          setToken(null)
          router.push("/dashboard")
        }, 5000)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickAmounts = [1000, 2000, 5000, 10000, 20000]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Electricity Bill Payment</h1>
        <p className="text-gray-500 dark:text-gray-400">Pay your electricity bills and get token instantly</p>
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

      {token && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
          <div className="flex flex-col">
            <p className="font-medium">Your token has been generated:</p>
            <p className="text-lg font-bold mt-2 tracking-wider">{token}</p>
            <p className="text-xs mt-1">Please use this token to recharge your meter</p>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Pay Electricity Bill</CardTitle>
            <CardDescription>Select provider, enter meter number and amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Select Electricity Provider</Label>
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
                      <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <RadioGroupItem value={provider.id} id={provider.id} className="sr-only" />
                    <Label htmlFor={provider.id} className="cursor-pointer font-medium text-center dark:text-white">
                      {provider.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meter-type" className="dark:text-gray-300">
                Meter Type
              </Label>
              <Select value={meterType} onValueChange={setMeterType}>
                <SelectTrigger id="meter-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select meter type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="Prepaid" className="dark:text-white">
                    Prepaid
                  </SelectItem>
                  <SelectItem value="Postpaid" className="dark:text-white">
                    Postpaid
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meter-number" className="dark:text-gray-300">
                Meter Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="meter-number"
                  placeholder="Enter meter number"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button
                  onClick={handleValidateMeter}
                  disabled={isValidating}
                  className="dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>
            </div>

            {customerInfo && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Customer Information</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name:</p>
                    <p className="text-sm font-medium dark:text-white">{customerInfo.customerName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address:</p>
                    <p className="text-sm font-medium dark:text-white">{customerInfo.address}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Meter Number:</p>
                    <p className="text-sm font-medium dark:text-white">{customerInfo.meterNumber}</p>
                  </div>
                </div>
              </div>
            )}

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
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
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
              disabled={isLoading || !customerInfo}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Provider</p>
                <p className="text-sm font-medium dark:text-white">
                  {selectedProvider ? providers.find((p) => p.id === selectedProvider)?.name || selectedProvider : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Meter Type</p>
                <p className="text-sm font-medium dark:text-white">{meterType}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Meter Number</p>
                <p className="text-sm font-medium dark:text-white">{meterNumber || "-"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Name</p>
                <p className="text-sm font-medium dark:text-white">{customerInfo ? customerInfo.customerName : "-"}</p>
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
                By proceeding with this transaction, you agree to our terms and conditions. Your token will be generated
                instantly after payment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

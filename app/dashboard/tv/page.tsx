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
import { getServiceProviders, getTVPlans, purchaseTVSubscription } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Check, Tv } from "lucide-react"

export default function TVPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [smartCardNumber, setSmartCardNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getServiceProviders("tv")
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

  useEffect(() => {
    const fetchPlans = async () => {
      if (selectedProvider) {
        try {
          const data = await getTVPlans(selectedProvider)
          setPlans(data)
          if (data.length > 0) {
            setSelectedPlan(data[0].id)
          } else {
            setSelectedPlan("")
          }
        } catch (error) {
          console.error("Error fetching plans:", error)
        }
      }
    }

    fetchPlans()
  }, [selectedProvider])

  const handlePurchase = async () => {
    // Validate inputs
    if (!selectedProvider) {
      setError("Please select a TV provider")
      return
    }

    if (!selectedPlan) {
      setError("Please select a subscription plan")
      return
    }

    if (!smartCardNumber || smartCardNumber.length < 10) {
      setError("Please enter a valid SmartCard/IUC number")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      const result = await purchaseTVSubscription(user.id, selectedPlan, smartCardNumber)

      if (result.success) {
        setSuccess(result.message)
        // Reset form
        setSmartCardNumber("")

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlanDetails = plans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">TV Subscription</h1>
        <p className="text-gray-500 dark:text-gray-400">Pay for your TV subscription</p>
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
            <CardTitle>Pay TV Subscription</CardTitle>
            <CardDescription>Select provider, subscription plan and enter SmartCard number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Select TV Provider</Label>
              <RadioGroup
                value={selectedProvider}
                onValueChange={setSelectedProvider}
                className="grid grid-cols-2 gap-4 md:grid-cols-3"
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
                      <Tv className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
              <Label htmlFor="subscription-plan" className="dark:text-gray-300">
                Select Subscription Plan
              </Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="subscription-plan" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select a subscription plan" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id} className="dark:text-white">
                      {plan.name} - ₦{plan.amount.toLocaleString()} ({plan.validity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smartcard-number" className="dark:text-gray-300">
                SmartCard/IUC Number
              </Label>
              <Input
                id="smartcard-number"
                placeholder="Enter SmartCard/IUC number"
                value={smartCardNumber}
                onChange={(e) => setSmartCardNumber(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Pay Now"}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                <p className="text-sm font-medium dark:text-white">
                  {selectedPlanDetails ? selectedPlanDetails.name : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Validity</p>
                <p className="text-sm font-medium dark:text-white">
                  {selectedPlanDetails ? selectedPlanDetails.validity : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">SmartCard Number</p>
                <p className="text-sm font-medium dark:text-white">{smartCardNumber || "-"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p className="text-sm font-medium dark:text-white">
                  {selectedPlanDetails ? `₦${selectedPlanDetails.amount.toLocaleString()}` : "-"}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Service Fee</p>
                <p className="text-sm font-medium dark:text-white">₦0.00</p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <p className="text-sm font-medium dark:text-white">Total</p>
                <p className="text-sm font-medium dark:text-white">
                  {selectedPlanDetails ? `₦${selectedPlanDetails.amount.toLocaleString()}` : "-"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By proceeding with this transaction, you agree to our terms and conditions. Your subscription will be
                activated instantly after payment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

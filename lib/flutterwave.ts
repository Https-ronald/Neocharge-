"use client"

// Flutterwave API integration
// Documentation: https://developer.flutterwave.com/docs
// Dashboard: https://dashboard.flutterwave.com/
// Test Cards: https://developer.flutterwave.com/docs/integration-guides/testing-helpers/

interface FlutterwaveConfig {
  amount: number
  customer: {
    email: string
    name: string
    phoneNumber?: string
  }
  description: string
  onSuccess: (reference: string, transactionId: string) => void
  onFailure: (error: string) => void
  onClose: () => void
}

export const initializeFlutterwavePayment = async (config: FlutterwaveConfig) => {
  try {
    // First, get the payment link from our server
    const response = await fetch("/api/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: config.amount,
        customer: config.customer,
        description: config.description,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create payment")
    }

    const data = await response.json()

    // Redirect to the payment link
    if (data.paymentLink) {
      window.location.href = data.paymentLink
      return
    }

    // Load Flutterwave script if not already loaded
    if (typeof window !== "undefined" && !window.FlutterwaveCheckout) {
      await loadFlutterwaveScript()
    }

    // Check if Flutterwave is available
    if (typeof window === "undefined" || !window.FlutterwaveCheckout) {
      console.error("Flutterwave not available")
      config.onFailure("Flutterwave not available")
      return
    }

    // Initialize payment with the data from the server
    window.FlutterwaveCheckout({
      public_key: data.publicKey,
      tx_ref: data.reference,
      amount: config.amount,
      currency: "NGN",
      payment_options: "card,ussd,banktransfer",
      customer: {
        email: config.customer.email,
        name: config.customer.name,
        phone_number: config.customer.phoneNumber || "",
      },
      customizations: {
        title: "NeoCharge",
        description: config.description,
        logo: "/logo.png",
      },
      callback: (response: any) => {
        if (response.status === "successful") {
          config.onSuccess(data.reference, response.transaction_id)
        } else {
          config.onFailure("Payment was not successful")
        }
      },
      onclose: () => {
        config.onClose()
      },
    })
  } catch (error) {
    console.error("Error initializing Flutterwave:", error)
    config.onFailure(error.toString())
  }
}

const loadFlutterwaveScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== "undefined" && !window.FlutterwaveCheckout) {
      const script = document.createElement("script")
      script.src = "https://checkout.flutterwave.com/v3.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Flutterwave script"))
      document.body.appendChild(script)
    } else {
      resolve()
    }
  })
}

export const verifyFlutterwavePayment = async (transactionId: string) => {
  try {
    const response = await fetch(`/api/verify-payment?transaction_id=${transactionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      success: false,
      message: "An error occurred while verifying the payment",
    }
  }
}

// Add this to the global Window interface
declare global {
  interface Window {
    FlutterwaveCheckout: any
  }
}

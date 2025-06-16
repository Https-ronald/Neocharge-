"use server"

// VTPass API integration for data, airtime, TV, and electricity services
// Documentation: https://vtpass.com/documentation/api/

const VTPASS_API_URL = "https://sandbox.vtpass.com/api"
const VTPASS_API_KEY = process.env.VTPASS_API_KEY || ""
const VTPASS_SECRET_KEY = process.env.VTPASS_SECRET_KEY || ""
const VTPASS_PUBLIC_KEY = process.env.VTPASS_PUBLIC_KEY || ""

// Base headers for VTPass API
const getHeaders = () => {
  const auth = Buffer.from(`${VTPASS_API_KEY}:${VTPASS_SECRET_KEY}`).toString("base64")
  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
    "api-key": VTPASS_API_KEY,
    "public-key": VTPASS_PUBLIC_KEY,
  }
}

// Get all service providers (network operators)
export async function getNetworkProviders() {
  try {
    const response = await fetch(`${VTPASS_API_URL}/service-categories`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Filter for mobile operators
    const mobileOperators = data.content.filter(
      (service: any) => service.identifier === "airtime" || service.identifier === "data",
    )

    return mobileOperators.map((operator: any) => ({
      id: operator.serviceID,
      name: operator.name,
      type: operator.identifier,
    }))
  } catch (error) {
    console.error("Error fetching network providers:", error)
    // Fallback data in case API fails
    return [
      { id: "mtn", name: "MTN", type: "both" },
      { id: "airtel", name: "Airtel", type: "both" },
      { id: "glo", name: "Glo", type: "both" },
      { id: "9mobile", name: "9Mobile", type: "both" },
    ]
  }
}

// Get data plans for a specific provider
export async function getDataPlans(providerId: string) {
  try {
    const response = await fetch(`${VTPASS_API_URL}/service-variations?serviceID=${providerId}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return data.content.variations.map((plan: any) => ({
      id: plan.variation_code,
      name: plan.name,
      amount: Number.parseFloat(plan.variation_amount),
      validity: plan.variation_desc || "30 days",
    }))
  } catch (error) {
    console.error(`Error fetching data plans for ${providerId}:`, error)
    // Fallback data in case API fails
    return [
      { id: `${providerId}-1gb`, name: "1GB Data", amount: 300, validity: "30 days" },
      { id: `${providerId}-2gb`, name: "2GB Data", amount: 500, validity: "30 days" },
      { id: `${providerId}-5gb`, name: "5GB Data", amount: 1000, validity: "30 days" },
      { id: `${providerId}-10gb`, name: "10GB Data", amount: 2000, validity: "30 days" },
    ]
  }
}

// Purchase airtime
export async function purchaseAirtime(phone: string, amount: number, provider: string, reference: string) {
  try {
    const payload = {
      request_id: reference,
      serviceID: provider,
      amount: amount.toString(),
      phone,
    }

    const response = await fetch(`${VTPASS_API_URL}/pay`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.code === "000") {
      return {
        success: true,
        message: "Airtime purchase successful",
        transactionId: data.content.transactions.transactionId,
      }
    } else {
      return {
        success: false,
        message: data.response_description || "Transaction failed",
      }
    }
  } catch (error) {
    console.error("Error purchasing airtime:", error)
    return {
      success: false,
      message: "An error occurred while processing your request",
    }
  }
}

// Purchase data bundle
export async function purchaseData(phone: string, plan: string, provider: string, reference: string) {
  try {
    const payload = {
      request_id: reference,
      serviceID: provider,
      billersCode: phone,
      variation_code: plan,
      phone,
    }

    const response = await fetch(`${VTPASS_API_URL}/pay`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.code === "000") {
      return {
        success: true,
        message: "Data purchase successful",
        transactionId: data.content.transactions.transactionId,
      }
    } else {
      return {
        success: false,
        message: data.response_description || "Transaction failed",
      }
    }
  } catch (error) {
    console.error("Error purchasing data:", error)
    return {
      success: false,
      message: "An error occurred while processing your request",
    }
  }
}

// Get TV providers
export async function getTVProviders() {
  try {
    const response = await fetch(`${VTPASS_API_URL}/service-categories`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Filter for TV providers
    const tvProviders = data.content.filter((service: any) => service.identifier === "tv")

    return tvProviders.map((provider: any) => ({
      id: provider.serviceID,
      name: provider.name,
    }))
  } catch (error) {
    console.error("Error fetching TV providers:", error)
    // Fallback data in case API fails
    return [
      { id: "dstv", name: "DSTV" },
      { id: "gotv", name: "GOTV" },
      { id: "startimes", name: "StarTimes" },
    ]
  }
}

// Get TV subscription plans
export async function getTVPlans(providerId: string) {
  try {
    const response = await fetch(`${VTPASS_API_URL}/service-variations?serviceID=${providerId}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return data.content.variations.map((plan: any) => ({
      id: plan.variation_code,
      name: plan.name,
      amount: Number.parseFloat(plan.variation_amount),
      validity: "30 days",
    }))
  } catch (error) {
    console.error(`Error fetching TV plans for ${providerId}:`, error)
    // Fallback data in case API fails
    return [
      { id: `${providerId}-basic`, name: "Basic Package", amount: 1850, validity: "30 days" },
      { id: `${providerId}-standard`, name: "Standard Package", amount: 2500, validity: "30 days" },
      { id: `${providerId}-premium`, name: "Premium Package", amount: 4000, validity: "30 days" },
    ]
  }
}

// Verify TV smart card number
export async function verifySmartCardNumber(providerId: string, smartCardNumber: string) {
  try {
    const payload = {
      serviceID: providerId,
      billersCode: smartCardNumber,
    }

    const response = await fetch(`${VTPASS_API_URL}/merchant-verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.code === "000") {
      return {
        valid: true,
        customerName: data.content.Customer_Name || "Verified Customer",
        customerNumber: smartCardNumber,
      }
    } else {
      return {
        valid: false,
        message: data.response_description || "Invalid smart card number",
      }
    }
  } catch (error) {
    console.error("Error verifying smart card number:", error)
    return {
      valid: false,
      message: "An error occurred while verifying the smart card number",
    }
  }
}

// Purchase TV subscription
export async function purchaseTVSubscription(
  smartCardNumber: string,
  plan: string,
  provider: string,
  customerName: string,
  reference: string,
) {
  try {
    const payload = {
      request_id: reference,
      serviceID: provider,
      billersCode: smartCardNumber,
      variation_code: plan,
      phone: "customer_phone", // This should be the customer's phone number
      subscription_type: "change", // or "renew"
      customer_name: customerName,
    }

    const response = await fetch(`${VTPASS_API_URL}/pay`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.code === "000") {
      return {
        success: true,
        message: "TV subscription successful",
        transactionId: data.content.transactions.transactionId,
      }
    } else {
      return {
        success: false,
        message: data.response_description || "Transaction failed",
      }
    }
  } catch (error) {
    console.error("Error purchasing TV subscription:", error)
    return {
      success: false,
      message: "An error occurred while processing your request",
    }
  }
}

// Get electricity providers
export async function getElectricityProviders() {
  try {
    const response = await fetch(`${VTPASS_API_URL}/service-categories`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Filter for electricity providers
    const electricityProviders = data.content.filter((service: any) => service.identifier === "electricity")

    return electricityProviders.map((provider: any) => ({
      id: provider.serviceID,
      name: provider.name,
    }))
  } catch (error) {
    console.error("Error fetching electricity providers:", error)
    // Fallback data in case API fails
    return [
      { id: "ikeja-electric", name: "Ikeja Electric" },
      { id: "eko-electric", name: "Eko Electric" },
      { id: "kano-electric", name: "Kano Electric" },
      { id: "phed", name: "Port Harcourt Electric" },
    ]
  }
}

// Verify meter number
export async function verifyMeterNumber(providerId: string, meterNumber: string, meterType: string) {
  try {
    const payload = {
      serviceID: providerId,
      billersCode: meterNumber,
      type: meterType.toLowerCase(), // "prepaid" or "postpaid"
    }

    const response = await fetch(`${VTPASS_API_URL}/merchant-verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.code === "000") {
      return {
        valid: true,
        customerName: data.content.Customer_Name || "Verified Customer",
        address: data.content.Address || "Customer Address",
        meterNumber,
      }
    } else {
      return {
        valid: false,
        message: data.response_description || "Invalid meter number",
      }
    }
  } catch (error) {
    console.error("Error verifying meter number:", error)
    return {
      valid: false,
      message: "An error occurred while verifying the meter number",
    }
  }
}

// Purchase electricity
export async function purchaseElectricity(
  meterNumber: string,
  amount: number,
  provider: string,
  meterType: string,
  customerPhone: string,
  customerName: string,
  reference: string,
) {
  try {
    const payload = {
      request_id: reference,
      serviceID: provider,
      billersCode: meterNumber,
      variation_code: meterType.toLowerCase(), // "prepaid" or "postpaid"
      amount: amount.toString(),
      phone: customerPhone,
      customer_name: customerName,
    }

    const response = await fetch(`${VTPASS_API_URL}/pay`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.code === "000") {
      return {
        success: true,
        message: "Electricity purchase successful",
        transactionId: data.content.transactions.transactionId,
        token: data.content.token || "Token will be sent to your phone",
      }
    } else {
      return {
        success: false,
        message: data.response_description || "Transaction failed",
      }
    }
  } catch (error) {
    console.error("Error purchasing electricity:", error)
    return {
      success: false,
      message: "An error occurred while processing your request",
    }
  }
}

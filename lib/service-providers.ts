"use server"

import { createClient } from "@/lib/supabase/server"

export async function getServiceProviders(serviceType: "airtime" | "data" | "tv" | "electricity") {
  const supabase = createClient()

  // Fetch providers from the database
  const { data, error } = await supabase
    .from("service_providers")
    .select("provider_id, name, logo_url")
    .eq("type", serviceType)
    .eq("active", true)

  if (error) {
    console.error("Error fetching service providers:", error)

    // Fallback to mock data if database query fails
    return getMockServiceProviders(serviceType)
  }

  if (!data || data.length === 0) {
    // If no data in database, use mock data
    return getMockServiceProviders(serviceType)
  }

  return data.map((provider) => ({
    id: provider.provider_id,
    name: provider.name,
    logo: provider.logo_url || `/providers/${provider.provider_id}.png`,
  }))
}

export async function getDataPlans(providerId: string) {
  const supabase = createClient()

  // Fetch data plans from the database
  const { data, error } = await supabase
    .from("service_plans")
    .select("plan_id, name, amount, validity")
    .eq("provider_id", providerId)
    .eq("active", true)

  if (error) {
    console.error("Error fetching data plans:", error)

    // Fallback to mock data if database query fails
    return getMockDataPlans(providerId)
  }

  if (!data || data.length === 0) {
    // If no data in database, use mock data
    return getMockDataPlans(providerId)
  }

  return data.map((plan) => ({
    id: plan.plan_id,
    name: plan.name,
    amount: Number(plan.amount),
    validity: plan.validity,
  }))
}

export async function getTVPlans(providerId: string) {
  const supabase = createClient()

  // Fetch TV plans from the database
  const { data, error } = await supabase
    .from("service_plans")
    .select("plan_id, name, amount, validity")
    .eq("provider_id", providerId)
    .eq("active", true)

  if (error) {
    console.error("Error fetching TV plans:", error)

    // Fallback to mock data if database query fails
    return getMockTVPlans(providerId)
  }

  if (!data || data.length === 0) {
    // If no data in database, use mock data
    return getMockTVPlans(providerId)
  }

  return data.map((plan) => ({
    id: plan.plan_id,
    name: plan.name,
    amount: Number(plan.amount),
    validity: plan.validity,
  }))
}

export async function validateMeterNumber(providerId: string, meterNumber: string, meterType: string) {
  // In a real app, this would validate with the provider's API using VTPass
  if (meterNumber.length < 10) {
    return { success: false, error: "Invalid meter number" }
  }

  // Mock customer details
  return {
    success: true,
    customerName: "John Doe",
    address: "123 Main Street, Lagos",
    meterNumber,
  }
}

// Mock data functions as fallback
function getMockServiceProviders(serviceType: "airtime" | "data" | "tv" | "electricity") {
  const networkProviders = [
    { id: "mtn", name: "MTN", logo: "/providers/mtn.png" },
    { id: "airtel", name: "Airtel", logo: "/providers/airtel.png" },
    { id: "glo", name: "Glo", logo: "/providers/glo.png" },
    { id: "9mobile", name: "9Mobile", logo: "/providers/9mobile.png" },
  ]

  const electricityProviders = [
    { id: "ekedc", name: "Eko Electric", logo: "/providers/ekedc.png" },
    { id: "ikedc", name: "Ikeja Electric", logo: "/providers/ikedc.png" },
    { id: "aedc", name: "Abuja Electric", logo: "/providers/aedc.png" },
    { id: "phedc", name: "Port Harcourt Electric", logo: "/providers/phedc.png" },
  ]

  const tvProviders = [
    { id: "dstv", name: "DSTV", logo: "/providers/dstv.png" },
    { id: "gotv", name: "GOTV", logo: "/providers/gotv.png" },
    { id: "startimes", name: "StarTimes", logo: "/providers/startimes.png" },
  ]

  switch (serviceType) {
    case "airtime":
    case "data":
      return networkProviders
    case "tv":
      return tvProviders
    case "electricity":
      return electricityProviders
    default:
      return []
  }
}

function getMockDataPlans(providerId: string) {
  const dataPlans: Record<string, any[]> = {
    mtn: [
      { id: "mtn-100mb", name: "100MB", amount: 100, validity: "1 Day" },
      { id: "mtn-1gb", name: "1GB", amount: 300, validity: "1 Day" },
      { id: "mtn-2gb", name: "2GB", amount: 500, validity: "2 Days" },
      { id: "mtn-5gb", name: "5GB", amount: 1300, validity: "30 Days" },
      { id: "mtn-10gb", name: "10GB", amount: 2500, validity: "30 Days" },
    ],
    airtel: [
      { id: "airtel-100mb", name: "100MB", amount: 100, validity: "1 Day" },
      { id: "airtel-1gb", name: "1GB", amount: 300, validity: "1 Day" },
      { id: "airtel-2gb", name: "2GB", amount: 500, validity: "2 Days" },
      { id: "airtel-5gb", name: "5GB", amount: 1300, validity: "30 Days" },
      { id: "airtel-10gb", name: "10GB", amount: 2500, validity: "30 Days" },
    ],
    glo: [
      { id: "glo-100mb", name: "100MB", amount: 100, validity: "1 Day" },
      { id: "glo-1gb", name: "1GB", amount: 300, validity: "1 Day" },
      { id: "glo-2gb", name: "2GB", amount: 500, validity: "2 Days" },
      { id: "glo-5gb", name: "5GB", amount: 1300, validity: "30 Days" },
      { id: "glo-10gb", name: "10GB", amount: 2500, validity: "30 Days" },
    ],
    "9mobile": [
      { id: "9mobile-100mb", name: "100MB", amount: 100, validity: "1 Day" },
      { id: "9mobile-1gb", name: "1GB", amount: 300, validity: "1 Day" },
      { id: "9mobile-2gb", name: "2GB", amount: 500, validity: "2 Days" },
      { id: "9mobile-5gb", name: "5GB", amount: 1300, validity: "30 Days" },
      { id: "9mobile-10gb", name: "10GB", amount: 2500, validity: "30 Days" },
    ],
  }

  return dataPlans[providerId] || []
}

function getMockTVPlans(providerId: string) {
  const tvPlans: Record<string, any[]> = {
    dstv: [
      { id: "dstv-access", name: "Access", amount: 2000, validity: "1 Month" },
      { id: "dstv-family", name: "Family", amount: 4000, validity: "1 Month" },
      { id: "dstv-compact", name: "Compact", amount: 7900, validity: "1 Month" },
      { id: "dstv-premium", name: "Premium", amount: 18400, validity: "1 Month" },
    ],
    gotv: [
      { id: "gotv-lite", name: "GOtv Lite", amount: 900, validity: "1 Month" },
      { id: "gotv-jinja", name: "GOtv Jinja", amount: 1900, validity: "1 Month" },
      { id: "gotv-jolli", name: "GOtv Jolli", amount: 2800, validity: "1 Month" },
      { id: "gotv-max", name: "GOtv Max", amount: 4150, validity: "1 Month" },
    ],
    startimes: [
      { id: "startimes-nova", name: "Nova", amount: 900, validity: "1 Month" },
      { id: "startimes-basic", name: "Basic", amount: 1700, validity: "1 Month" },
      { id: "startimes-smart", name: "Smart", amount: 2200, validity: "1 Month" },
      { id: "startimes-classic", name: "Classic", amount: 2500, validity: "1 Month" },
      { id: "startimes-super", name: "Super", amount: 4200, validity: "1 Month" },
    ],
  }

  return tvPlans[providerId] || []
}

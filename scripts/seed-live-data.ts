import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// VTPass API configuration
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

// Fetch service categories from VTPass
async function fetchServiceCategories() {
  try {
    console.log("🔄 Fetching service categories from VTPass...")
    const response = await fetch(`${VTPASS_API_URL}/service-categories`, {
      method: "GET",
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Service categories fetched successfully")
    return data.content || []
  } catch (error) {
    console.error("❌ Error fetching service categories:", error)
    return []
  }
}

// Fetch service variations (plans) for a specific service
async function fetchServiceVariations(serviceID: string) {
  try {
    console.log(`🔄 Fetching variations for ${serviceID}...`)
    const response = await fetch(`${VTPASS_API_URL}/service-variations?serviceID=${serviceID}`, {
      method: "GET",
      headers: getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ Variations for ${serviceID} fetched successfully`)
    return data.content?.variations || []
  } catch (error) {
    console.error(`❌ Error fetching variations for ${serviceID}:`, error)
    return []
  }
}

// Clear existing service plans
async function clearServicePlans() {
  console.log("🧹 Clearing existing service plans...")
  const { error } = await supabase.from("service_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000") // Delete all

  if (error) {
    console.error("❌ Error clearing service plans:", error)
  } else {
    console.log("✅ Service plans cleared successfully")
  }
}

// Insert service plans into database
async function insertServicePlans(plans: any[]) {
  console.log(`🔄 Inserting ${plans.length} service plans...`)

  const { data, error } = await supabase.from("service_plans").insert(plans)

  if (error) {
    console.error("❌ Error inserting service plans:", error)
    return false
  } else {
    console.log("✅ Service plans inserted successfully")
    return true
  }
}

// Main seeding function
async function seedLiveData() {
  console.log("🚀 Starting live data seeding from VTPass API...")

  try {
    // Clear existing data
    await clearServicePlans()

    // Fetch all service categories
    const categories = await fetchServiceCategories()

    if (categories.length === 0) {
      console.log("⚠️ No categories found, using fallback data...")
      await seedFallbackData()
      return
    }

    const allPlans: any[] = []

    // Process each category
    for (const category of categories) {
      const serviceType = category.identifier
      const serviceID = category.serviceID
      const serviceName = category.name

      console.log(`📋 Processing ${serviceName} (${serviceType})...`)

      // Skip unsupported service types
      if (!["airtime", "data", "tv", "electricity"].includes(serviceType)) {
        console.log(`⏭️ Skipping unsupported service type: ${serviceType}`)
        continue
      }

      // For airtime, create a simple plan
      if (serviceType === "airtime") {
        allPlans.push({
          plan_id: `${serviceID}_airtime`,
          provider_id: serviceID,
          name: `${serviceName} Airtime`,
          description: `${serviceName} Airtime Recharge`,
          amount: 100, // Minimum airtime amount
          type: "airtime",
          created_at: new Date().toISOString(),
        })
        continue
      }

      // For other services, fetch variations
      const variations = await fetchServiceVariations(serviceID)

      for (const variation of variations) {
        const plan = {
          plan_id: `${serviceID}_${variation.variation_code}`,
          provider_id: serviceID,
          name: variation.name,
          description: variation.variation_desc || `${serviceName} - ${variation.name}`,
          amount: Number.parseFloat(variation.variation_amount) || 0,
          type: serviceType,
          created_at: new Date().toISOString(),
        }

        allPlans.push(plan)
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Insert all plans
    if (allPlans.length > 0) {
      await insertServicePlans(allPlans)
      console.log(`🎉 Successfully seeded ${allPlans.length} live service plans!`)
    } else {
      console.log("⚠️ No plans found, using fallback data...")
      await seedFallbackData()
    }
  } catch (error) {
    console.error("❌ Error in main seeding process:", error)
    console.log("⚠️ Falling back to static data...")
    await seedFallbackData()
  }
}

// Fallback static data if API fails
async function seedFallbackData() {
  console.log("🔄 Seeding fallback static data...")

  const fallbackPlans = [
    // Airtime
    {
      plan_id: "mtn_airtime",
      provider_id: "mtn",
      name: "MTN Airtime",
      description: "MTN Airtime Recharge",
      amount: 100,
      type: "airtime",
    },
    {
      plan_id: "airtel_airtime",
      provider_id: "airtel",
      name: "Airtel Airtime",
      description: "Airtel Airtime Recharge",
      amount: 100,
      type: "airtime",
    },
    {
      plan_id: "glo_airtime",
      provider_id: "glo",
      name: "Glo Airtime",
      description: "Glo Airtime Recharge",
      amount: 100,
      type: "airtime",
    },
    {
      plan_id: "9mobile_airtime",
      provider_id: "9mobile",
      name: "9Mobile Airtime",
      description: "9Mobile Airtime Recharge",
      amount: 100,
      type: "airtime",
    },

    // Data Plans
    {
      plan_id: "mtn_1gb",
      provider_id: "mtn",
      name: "MTN 1GB",
      description: "1GB Data valid for 30 days",
      amount: 300,
      type: "data",
    },
    {
      plan_id: "mtn_2gb",
      provider_id: "mtn",
      name: "MTN 2GB",
      description: "2GB Data valid for 30 days",
      amount: 500,
      type: "data",
    },
    {
      plan_id: "mtn_5gb",
      provider_id: "mtn",
      name: "MTN 5GB",
      description: "5GB Data valid for 30 days",
      amount: 1200,
      type: "data",
    },
    {
      plan_id: "airtel_1gb",
      provider_id: "airtel",
      name: "Airtel 1GB",
      description: "1GB Data valid for 30 days",
      amount: 300,
      type: "data",
    },
    {
      plan_id: "airtel_2gb",
      provider_id: "airtel",
      name: "Airtel 2GB",
      description: "2GB Data valid for 30 days",
      amount: 500,
      type: "data",
    },

    // TV Subscriptions
    {
      plan_id: "dstv_compact",
      provider_id: "dstv",
      name: "DStv Compact",
      description: "DStv Compact monthly subscription",
      amount: 7900,
      type: "tv",
    },
    {
      plan_id: "dstv_premium",
      provider_id: "dstv",
      name: "DStv Premium",
      description: "DStv Premium monthly subscription",
      amount: 18400,
      type: "tv",
    },
    {
      plan_id: "gotv_max",
      provider_id: "gotv",
      name: "GOtv Max",
      description: "GOtv Max monthly subscription",
      amount: 4150,
      type: "tv",
    },

    // Electricity
    {
      plan_id: "ikedc_prepaid",
      provider_id: "ikeja-electric",
      name: "Ikeja Electric",
      description: "Ikeja Electric Prepaid",
      amount: 1000,
      type: "electricity",
    },
    {
      plan_id: "ekedc_prepaid",
      provider_id: "eko-electric",
      name: "Eko Electric",
      description: "Eko Electric Prepaid",
      amount: 1000,
      type: "electricity",
    },
  ]

  const plansWithTimestamp = fallbackPlans.map((plan) => ({
    ...plan,
    created_at: new Date().toISOString(),
  }))

  await insertServicePlans(plansWithTimestamp)
  console.log("✅ Fallback data seeded successfully")
}

// Run the seeding
seedLiveData()
  .then(() => {
    console.log("🎉 Data seeding completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Data seeding failed:", error)
    process.exit(1)
  })

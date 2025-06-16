import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Free API alternatives for Nigerian services
const FREE_APIS = {
  // Paystack (Free tier available)
  paystack: "https://api.paystack.co/bank",

  // Nigerian Exchange Rate API (Free)
  exchangeRate: "https://api.exchangerate-api.com/v4/latest/NGN",

  // Free Nigerian Banks API
  banks: "https://api.paystack.co/bank",
}

// Nigerian service providers data (researched current market rates)
const NIGERIAN_SERVICE_DATA = {
  networks: [
    {
      id: "mtn",
      name: "MTN Nigeria",
      type: "mobile",
      ussd: "*131#",
    },
    {
      id: "airtel",
      name: "Airtel Nigeria",
      type: "mobile",
      ussd: "*140#",
    },
    {
      id: "glo",
      name: "Globacom",
      type: "mobile",
      ussd: "*127#",
    },
    {
      id: "9mobile",
      name: "9mobile",
      type: "mobile",
      ussd: "*200#",
    },
  ],

  // Current market rates (as of 2024)
  dataPlans: {
    mtn: [
      { size: "500MB", amount: 200, validity: "30 days", code: "mtn_500mb" },
      { size: "1GB", amount: 300, validity: "30 days", code: "mtn_1gb" },
      { size: "2GB", amount: 500, validity: "30 days", code: "mtn_2gb" },
      { size: "3GB", amount: 750, validity: "30 days", code: "mtn_3gb" },
      { size: "5GB", amount: 1200, validity: "30 days", code: "mtn_5gb" },
      { size: "10GB", amount: 2000, validity: "30 days", code: "mtn_10gb" },
      { size: "15GB", amount: 3000, validity: "30 days", code: "mtn_15gb" },
      { size: "20GB", amount: 4000, validity: "30 days", code: "mtn_20gb" },
    ],
    airtel: [
      { size: "500MB", amount: 200, validity: "30 days", code: "airtel_500mb" },
      { size: "1GB", amount: 300, validity: "30 days", code: "airtel_1gb" },
      { size: "2GB", amount: 500, validity: "30 days", code: "airtel_2gb" },
      { size: "3GB", amount: 750, validity: "30 days", code: "airtel_3gb" },
      { size: "5GB", amount: 1200, validity: "30 days", code: "airtel_5gb" },
      { size: "10GB", amount: 2000, validity: "30 days", code: "airtel_10gb" },
      { size: "15GB", amount: 3000, validity: "30 days", code: "airtel_15gb" },
      { size: "20GB", amount: 4000, validity: "30 days", code: "airtel_20gb" },
    ],
    glo: [
      { size: "500MB", amount: 150, validity: "30 days", code: "glo_500mb" },
      { size: "1GB", amount: 250, validity: "30 days", code: "glo_1gb" },
      { size: "2GB", amount: 450, validity: "30 days", code: "glo_2gb" },
      { size: "3GB", amount: 700, validity: "30 days", code: "glo_3gb" },
      { size: "5GB", amount: 1100, validity: "30 days", code: "glo_5gb" },
      { size: "10GB", amount: 1800, validity: "30 days", code: "glo_10gb" },
    ],
    "9mobile": [
      { size: "500MB", amount: 200, validity: "30 days", code: "9mobile_500mb" },
      { size: "1GB", amount: 350, validity: "30 days", code: "9mobile_1gb" },
      { size: "2GB", amount: 550, validity: "30 days", code: "9mobile_2gb" },
      { size: "3GB", amount: 800, validity: "30 days", code: "9mobile_3gb" },
      { size: "5GB", amount: 1300, validity: "30 days", code: "9mobile_5gb" },
      { size: "10GB", amount: 2200, validity: "30 days", code: "9mobile_10gb" },
    ],
  },

  tvProviders: [
    {
      id: "dstv",
      name: "DStv",
      packages: [
        { name: "DStv Padi", amount: 2150, code: "dstv_padi" },
        { name: "DStv Yanga", amount: 2950, code: "dstv_yanga" },
        { name: "DStv Confam", amount: 5300, code: "dstv_confam" },
        { name: "DStv Compact", amount: 9000, code: "dstv_compact" },
        { name: "DStv Compact Plus", amount: 14250, code: "dstv_compact_plus" },
        { name: "DStv Premium", amount: 21000, code: "dstv_premium" },
      ],
    },
    {
      id: "gotv",
      name: "GOtv",
      packages: [
        { name: "GOtv Smallie", amount: 900, code: "gotv_smallie" },
        { name: "GOtv Jinja", amount: 2250, code: "gotv_jinja" },
        { name: "GOtv Jolli", amount: 2800, code: "gotv_jolli" },
        { name: "GOtv Max", amount: 4850, code: "gotv_max" },
        { name: "GOtv Supa", amount: 6200, code: "gotv_supa" },
      ],
    },
    {
      id: "startimes",
      name: "StarTimes",
      packages: [
        { name: "Nova", amount: 900, code: "startimes_nova" },
        { name: "Basic", amount: 1850, code: "startimes_basic" },
        { name: "Smart", amount: 2600, code: "startimes_smart" },
        { name: "Classic", amount: 2750, code: "startimes_classic" },
        { name: "Super", amount: 4900, code: "startimes_super" },
      ],
    },
  ],

  electricityProviders: [
    { id: "ikedc", name: "Ikeja Electric", states: ["Lagos"] },
    { id: "ekedc", name: "Eko Electric", states: ["Lagos"] },
    { id: "aedc", name: "Abuja Electric", states: ["FCT", "Kogi", "Nasarawa", "Niger"] },
    { id: "phedc", name: "Port Harcourt Electric", states: ["Rivers", "Bayelsa", "Cross River", "Akwa Ibom"] },
    { id: "eedc", name: "Enugu Electric", states: ["Enugu", "Abia", "Anambra", "Ebonyi", "Imo"] },
    { id: "kedco", name: "Kano Electric", states: ["Kano", "Jigawa", "Katsina"] },
    { id: "jedc", name: "Jos Electric", states: ["Plateau", "Bauchi", "Benue", "Gombe"] },
    { id: "kaedco", name: "Kaduna Electric", states: ["Kaduna", "Kebbi", "Sokoto", "Zamfara"] },
  ],
}

// Clear existing service plans
async function clearServicePlans() {
  console.log("🧹 Clearing existing service plans...")
  const { error } = await supabase.from("service_plans").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  if (error) {
    console.error("❌ Error clearing service plans:", error)
  } else {
    console.log("✅ Service plans cleared successfully")
  }
}

// Insert service plans into database
async function insertServicePlans(plans: any[]) {
  console.log(`🔄 Inserting ${plans.length} service plans...`)

  // Insert in batches to avoid overwhelming the database
  const batchSize = 50
  for (let i = 0; i < plans.length; i += batchSize) {
    const batch = plans.slice(i, i + batchSize)

    const { error } = await supabase.from("service_plans").insert(batch)

    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
      return false
    } else {
      console.log(`✅ Batch ${i / batchSize + 1} inserted successfully`)
    }
  }

  return true
}

// Generate comprehensive service plans
async function generateServicePlans() {
  console.log("🚀 Generating comprehensive service plans...")

  const allPlans: any[] = []

  // Generate Airtime plans
  console.log("📱 Generating airtime plans...")
  for (const network of NIGERIAN_SERVICE_DATA.networks) {
    allPlans.push({
      service_type: "airtime",
      provider: network.name,
      plan_name: `${network.name} Airtime`,
      amount: 100, // Minimum airtime amount
      description: `${network.name} Airtime Recharge - Any amount from ₦100`,
      is_active: true,
      created_at: new Date().toISOString(),
    })
  }

  // Generate Data plans
  console.log("📊 Generating data plans...")
  for (const [networkId, plans] of Object.entries(NIGERIAN_SERVICE_DATA.dataPlans)) {
    const network = NIGERIAN_SERVICE_DATA.networks.find((n) => n.id === networkId)
    if (!network) continue

    for (const plan of plans) {
      allPlans.push({
        service_type: "data",
        provider: network.name,
        plan_name: `${network.name} ${plan.size}`,
        amount: plan.amount,
        description: `${plan.size} Data Bundle - Valid for ${plan.validity}`,
        is_active: true,
        created_at: new Date().toISOString(),
      })
    }
  }

  // Generate TV plans
  console.log("📺 Generating TV subscription plans...")
  for (const provider of NIGERIAN_SERVICE_DATA.tvProviders) {
    for (const pkg of provider.packages) {
      allPlans.push({
        service_type: "tv",
        provider: provider.name,
        plan_name: pkg.name,
        amount: pkg.amount,
        description: `${pkg.name} Monthly Subscription`,
        is_active: true,
        created_at: new Date().toISOString(),
      })
    }
  }

  // Generate Electricity plans
  console.log("⚡ Generating electricity provider plans...")
  for (const provider of NIGERIAN_SERVICE_DATA.electricityProviders) {
    allPlans.push({
      service_type: "electricity",
      provider: provider.name,
      plan_name: `${provider.name} Prepaid`,
      amount: 1000, // Minimum electricity purchase
      description: `${provider.name} Prepaid Electricity - Serving ${provider.states.join(", ")}`,
      is_active: true,
      created_at: new Date().toISOString(),
    })
  }

  return allPlans
}

// Main seeding function
async function seedFreeApiData() {
  console.log("🚀 Starting comprehensive service data seeding...")

  try {
    // Clear existing data
    await clearServicePlans()

    // Generate all service plans
    const allPlans = await generateServicePlans()

    // Insert all plans
    if (allPlans.length > 0) {
      const success = await insertServicePlans(allPlans)
      if (success) {
        console.log(`🎉 Successfully seeded ${allPlans.length} service plans!`)

        // Log summary
        const summary = {
          airtime: allPlans.filter((p) => p.service_type === "airtime").length,
          data: allPlans.filter((p) => p.service_type === "data").length,
          tv: allPlans.filter((p) => p.service_type === "tv").length,
          electricity: allPlans.filter((p) => p.service_type === "electricity").length,
        }

        console.log("📊 Seeding Summary:")
        console.log(`   📱 Airtime Plans: ${summary.airtime}`)
        console.log(`   📊 Data Plans: ${summary.data}`)
        console.log(`   📺 TV Plans: ${summary.tv}`)
        console.log(`   ⚡ Electricity Plans: ${summary.electricity}`)
      }
    } else {
      console.log("❌ No plans generated")
    }
  } catch (error) {
    console.error("❌ Error in seeding process:", error)
  }
}

// Run the seeding
seedFreeApiData()
  .then(() => {
    console.log("🎉 Free API data seeding completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Free API data seeding failed:", error)
    process.exit(1)
  })

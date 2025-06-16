"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@/lib/supabase/server"
import {
  getServiceProviders as getServiceProvidersFromLib,
  getDataPlans as getDataPlansFromLib,
  getTVPlans as getTVPlansFromLib,
  validateMeterNumber as validateMeterNumberFromLib,
} from "@/lib/service-providers"

// User registration
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string
  const phone = (formData.get("phone") as string) || null

  // Validate input
  if (!email || !firstName || !lastName || !password || !confirmPassword) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  try {
    const supabase = createClient()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return { success: false, error: "Failed to check if user exists" }
    }

    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Generate username from email if not provided
    const username = email.split("@")[0]

    // Create user in the database
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          phone,
          password_hash: passwordHash,
          role: "user",
          dark_mode: false,
        },
      ])
      .select("id")
      .single()

    if (userError) {
      console.error("Error creating user:", userError)
      return { success: false, error: "Failed to create user account" }
    }

    // Create wallet for the user
    const { error: walletError } = await supabase.from("wallets").insert([
      {
        user_id: user.id,
        balance: 0,
      },
    ])

    if (walletError) {
      console.error("Error creating wallet:", walletError)
      // Don't return error here, as the user is already created
    }

    // Create session token
    const sessionToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const { error: sessionError } = await supabase.from("user_sessions").insert([
      {
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      },
    ])

    if (sessionError) {
      console.error("Error creating session:", sessionError)
      return { success: false, error: "Failed to create session" }
    }

    // Set session cookie
    cookies().set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true, redirect: "/dashboard" }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// User login
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    return { success: false, error: "Server configuration error. Please contact support." }
  }

  try {
    const supabase = createClient()

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, password_hash, role, dark_mode")
      .eq("email", email)
      .maybeSingle()

    if (userError) {
      console.error("Error fetching user:", userError)
      return { success: false, error: "An error occurred while logging in" }
    }

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session token
    const sessionToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    // Delete any existing sessions for this user
    await supabase.from("user_sessions").delete().eq("user_id", user.id)

    // Create new session
    const { error: sessionError } = await supabase.from("user_sessions").insert([
      {
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      },
    ])

    if (sessionError) {
      console.error("Error creating session:", sessionError)
      return { success: false, error: "Failed to create session" }
    }

    // Set session cookie
    cookies().set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      redirect: "/dashboard",
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        darkMode: user.dark_mode,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Admin login
export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Username and password are required" }
  }

  try {
    const supabase = createClient()

    // Get admin from database
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, username, password_hash, name, role")
      .eq("username", username)
      .maybeSingle()

    if (adminError) {
      console.error("Error fetching admin:", adminError)
      return { success: false, error: "An error occurred while logging in" }
    }

    if (!admin) {
      return { success: false, error: "Invalid username or password" }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid username or password" }
    }

    // Create session token
    const sessionToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1) // 1 day from now for admin sessions

    // Set session cookie with admin info
    cookies().set(
      "admin_session",
      JSON.stringify({
        id: admin.id,
        role: admin.role,
        name: admin.name,
        sessionToken,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      },
    )

    return { success: true, redirect: "/admin/dashboard" }
  } catch (error) {
    console.error("Admin login error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Logout
export async function logout() {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      const supabase = createClient()

      // Delete session from database
      await supabase.from("user_sessions").delete().eq("session_token", sessionToken)

      // Delete session cookie
      cookies().delete("session_token")
    }

    // Also handle admin logout
    if (cookies().has("admin_session")) {
      cookies().delete("admin_session")
    }

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to logout" }
  }
}

// Get current authenticated user
export async function getAuthStatus() {
  try {
    const sessionToken = cookies().get("session_token")?.value
    const adminSession = cookies().get("admin_session")?.value

    // Check for admin session first
    if (adminSession) {
      try {
        const adminData = JSON.parse(adminSession)
        return {
          authenticated: true,
          user: {
            id: adminData.id,
            role: adminData.role,
            name: adminData.name,
          },
        }
      } catch (error) {
        cookies().delete("admin_session")
      }
    }

    // Check for user session
    if (sessionToken) {
      const supabase = createClient()

      // Get session from database
      const { data: session, error: sessionError } = await supabase
        .from("user_sessions")
        .select("user_id, expires_at")
        .eq("session_token", sessionToken)
        .maybeSingle()

      if (sessionError) {
        console.error("Error fetching session:", sessionError)
        cookies().delete("session_token")
        return { authenticated: false, user: null }
      }

      if (!session) {
        cookies().delete("session_token")
        return { authenticated: false, user: null }
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        // Delete expired session
        await supabase.from("user_sessions").delete().eq("session_token", sessionToken)

        cookies().delete("session_token")
        return { authenticated: false, user: null }
      }

      // Get user from database
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, first_name, last_name, role, dark_mode")
        .eq("id", session.user_id)
        .maybeSingle()

      if (userError || !user) {
        cookies().delete("session_token")
        return { authenticated: false, user: null }
      }

      return {
        authenticated: true,
        user: {
          id: user.id,
          role: user.role,
          name: `${user.first_name} ${user.last_name}`,
          darkMode: user.dark_mode,
        },
      }
    }

    return { authenticated: false, user: null }
  } catch (error) {
    console.error("Auth status error:", error)
    return { authenticated: false, user: null }
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const supabase = createClient()

    const { data: user, error } = await supabase
      .from("users")
      .select(`
        id, 
        email, 
        username, 
        first_name, 
        last_name, 
        phone, 
        role, 
        dark_mode, 
        address, 
        city, 
        state, 
        country, 
        created_at,
        wallets (balance)
      `)
      .eq("id", id)
      .single()

    if (error || !user) {
      console.error("Error fetching user:", error)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      darkMode: user.dark_mode,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      createdAt: user.created_at,
      walletBalance: user.wallets?.[0]?.balance || 0,
    }
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: string, profileData: any) {
  try {
    const response = await fetch(`/api/user/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...profileData,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// Add admin
export async function addAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const email = formData.get("email") as string
  const name = formData.get("name") as string

  // Validate input
  if (!username || !password || !email || !name) {
    return { success: false, error: "All fields are required" }
  }

  try {
    const supabase = createClient()

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from("admins")
      .select("id")
      .or(`username.eq.${username},email.eq.${email}`)
      .single()

    if (existingAdmin) {
      return { success: false, error: "Username or email already in use" }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create admin in the database
    const { error } = await supabase.from("admins").insert([
      {
        username,
        email,
        name,
        password_hash: passwordHash,
        role: "admin",
      },
    ])

    if (error) {
      console.error("Error creating admin:", error)
      return { success: false, error: "Failed to create admin account" }
    }

    return { success: true, message: "Admin added successfully" }
  } catch (error) {
    console.error("Add admin error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Get all admins
export async function getAdmins() {
  try {
    const supabase = createClient()

    const { data: admins, error } = await supabase
      .from("admins")
      .select("id, username, email, name, role, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Get admins error:", error)
      return []
    }

    return admins
  } catch (error) {
    console.error("Get admins error:", error)
    return []
  }
}

// Fund Wallet
export async function fundWallet(userId: string, amount: number) {
  try {
    const supabase = createClient()

    // Get current wallet balance
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (walletError) {
      console.error("Error fetching wallet:", walletError)
      return { success: false, error: "Failed to fetch wallet" }
    }

    if (!walletData) {
      return { success: false, error: "Wallet not found" }
    }

    const newBalance = walletData.balance + amount

    // Update wallet balance
    const { error: updateError } = await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", userId)

    if (updateError) {
      console.error("Error updating wallet:", updateError)
      return { success: false, error: "Failed to update wallet" }
    }

    return { success: true, newBalance }
  } catch (error) {
    console.error("Fund wallet error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Purchase Airtime
export async function purchaseAirtime(userId: string, providerId: string, phoneNumber: string, amount: number) {
  try {
    const supabase = createClient()

    // Get user's wallet balance
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (walletError) {
      console.error("Error fetching wallet:", walletError)
      return { success: false, error: "Failed to fetch wallet" }
    }

    if (!walletData) {
      return { success: false, error: "Wallet not found" }
    }

    if (walletData.balance < amount) {
      return { success: false, error: "Insufficient balance" }
    }

    const newBalance = walletData.balance - amount

    // Update wallet balance
    const { error: updateError } = await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", userId)

    if (updateError) {
      console.error("Error updating wallet:", updateError)
      return { success: false, error: "Failed to update wallet" }
    }

    // Record transaction
    const { error: transactionError } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "debit",
        amount,
        description: `Airtime purchase for ${phoneNumber} on ${providerId}`,
        status: "completed",
      },
    ])

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
      // Consider reverting wallet update if transaction recording fails
    }

    return { success: true, message: `Airtime purchase successful. New balance: ₦${newBalance.toLocaleString()}` }
  } catch (error) {
    console.error("Purchase airtime error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Purchase Data
export async function purchaseData(userId: string, planId: string, phoneNumber: string) {
  try {
    const supabase = createClient()

    // Get data plan details
    const { data: planData, error: planError } = await supabase
      .from("service_plans")
      .select("amount, name")
      .eq("plan_id", planId)
      .single()

    if (planError) {
      console.error("Error fetching data plan:", planError)
      return { success: false, error: "Failed to fetch data plan" }
    }

    if (!planData) {
      return { success: false, error: "Data plan not found" }
    }

    const amount = planData.amount

    // Get user's wallet balance
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (walletError) {
      console.error("Error fetching wallet:", walletError)
      return { success: false, error: "Failed to fetch wallet" }
    }

    if (!walletData) {
      return { success: false, error: "Wallet not found" }
    }

    if (walletData.balance < amount) {
      return { success: false, error: "Insufficient balance" }
    }

    const newBalance = walletData.balance - amount

    // Update wallet balance
    const { error: updateError } = await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", userId)

    if (updateError) {
      console.error("Error updating wallet:", updateError)
      return { success: false, error: "Failed to update wallet" }
    }

    // Record transaction
    const { error: transactionError } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "debit",
        amount,
        description: `Data purchase - ${planData.name} for ${phoneNumber}`,
        status: "completed",
      },
    ])

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
      // Consider reverting wallet update if transaction recording fails
    }

    return { success: true, message: `Data purchase successful. New balance: ₦${newBalance.toLocaleString()}` }
  } catch (error) {
    console.error("Purchase data error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Purchase TV Subscription
export async function purchaseTVSubscription(userId: string, planId: string, smartCardNumber: string) {
  try {
    const supabase = createClient()

    // Get TV plan details
    const { data: planData, error: planError } = await supabase
      .from("service_plans")
      .select("amount, name")
      .eq("plan_id", planId)
      .single()

    if (planError) {
      console.error("Error fetching TV plan:", planError)
      return { success: false, error: "Failed to fetch TV plan" }
    }

    if (!planData) {
      return { success: false, error: "TV plan not found" }
    }

    const amount = planData.amount

    // Get user's wallet balance
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (walletError) {
      console.error("Error fetching wallet:", walletError)
      return { success: false, error: "Failed to fetch wallet" }
    }

    if (!walletData) {
      return { success: false, error: "Wallet not found" }
    }

    if (walletData.balance < amount) {
      return { success: false, error: "Insufficient balance" }
    }

    const newBalance = walletData.balance - amount

    // Update wallet balance
    const { error: updateError } = await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", userId)

    if (updateError) {
      console.error("Error updating wallet:", updateError)
      return { success: false, error: "Failed to update wallet" }
    }

    // Record transaction
    const { error: transactionError } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "debit",
        amount,
        description: `TV Subscription - ${planData.name} for ${smartCardNumber}`,
        status: "completed",
      },
    ])

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
      // Consider reverting wallet update if transaction recording fails
    }

    return { success: true, message: `TV subscription successful. New balance: ₦${newBalance.toLocaleString()}` }
  } catch (error) {
    console.error("Purchase TV subscription error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Purchase Electricity
export async function purchaseElectricity(
  userId: string,
  providerId: string,
  meterNumber: string,
  meterType: string,
  amount: number,
) {
  try {
    const supabase = createClient()

    // Get user's wallet balance
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (walletError) {
      console.error("Error fetching wallet:", walletError)
      return { success: false, error: "Failed to fetch wallet" }
    }

    if (!walletData) {
      return { success: false, error: "Wallet not found" }
    }

    if (walletData.balance < amount) {
      return { success: false, error: "Insufficient balance" }
    }

    const newBalance = walletData.balance - amount

    // Update wallet balance
    const { error: updateError } = await supabase.from("wallets").update({ balance: newBalance }).eq("user_id", userId)

    if (updateError) {
      console.error("Error updating wallet:", updateError)
      return { success: false, error: "Failed to update wallet" }
    }

    // Record transaction
    const { error: transactionError } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "debit",
        amount,
        description: `Electricity bill payment for meter ${meterNumber} (${meterType})`,
        status: "completed",
      },
    ])

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
      // Consider reverting wallet update if transaction recording fails
    }

    // Generate a mock token (in a real app, this would come from the provider)
    const token = Math.floor(Math.random() * 1000000000000).toString()

    return { success: true, message: "Electricity bill payment successful. Token generated.", token }
  } catch (error) {
    console.error("Purchase electricity error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Get user transactions
export async function getUserTransactions(userId: string) {
  try {
    const response = await fetch(`/api/user/transactions?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return data.transactions || []
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

export async function getServiceProviders(serviceType: "airtime" | "data" | "tv" | "electricity") {
  return getServiceProvidersFromLib(serviceType)
}

export async function getDataPlans(providerId: string) {
  return getDataPlansFromLib(providerId)
}

export async function getTVPlans(providerId: string) {
  return getTVPlansFromLib(providerId)
}

export async function validateMeterNumber(providerId: string, meterNumber: string, meterType: string) {
  return validateMeterNumberFromLib(providerId, meterNumber, meterType)
}

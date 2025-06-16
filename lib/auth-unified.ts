"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "@/lib/supabase/server"

// Test database connection
async function testDatabaseConnection() {
  try {
    const supabase = createClient()

    // Simple query to test connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Database connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error: "Unable to connect to database" }
  }
}

// User registration
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string
  const phone = (formData.get("phone") as string) || null

  console.log("Registration attempt for:", email)

  // Validate input
  if (!email || !firstName || !lastName || !password || !confirmPassword) {
    return { success: false, error: "All required fields must be filled" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long" }
  }

  // Test database connection first
  const connectionTest = await testDatabaseConnection()
  if (!connectionTest.success) {
    return { success: false, error: `Database connection failed: ${connectionTest.error}` }
  }

  try {
    const supabase = createClient()

    // Check if user already exists
    console.log("Checking if user exists...")
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return { success: false, error: `Database query failed: ${checkError.message}` }
    }

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" }
    }

    // Hash password
    console.log("Hashing password...")
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Generate username from email
    const username = email.split("@")[0] + "_" + Math.random().toString(36).substring(2, 8)

    // Create user in the database
    console.log("Creating user...")
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
      return { success: false, error: `Failed to create account: ${userError.message}` }
    }

    console.log("User created successfully:", user.id)

    // Create wallet for the user
    console.log("Creating wallet...")
    const { error: walletError } = await supabase.from("wallets").insert([
      {
        user_id: user.id,
        balance: 0,
      },
    ])

    if (walletError) {
      console.error("Error creating wallet:", walletError)
      // Continue anyway, wallet can be created later
    }

    // Create session token
    console.log("Creating session...")
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
      return { success: false, error: `Session creation failed: ${sessionError.message}` }
    }

    // Set session cookie
    console.log("Setting session cookie...")
    cookies().set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    })

    console.log("Registration completed successfully")
    return { success: true, redirect: "/dashboard" }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// User login
export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  console.log("Login attempt for:", email)

  // Test database connection first
  const connectionTest = await testDatabaseConnection()
  if (!connectionTest.success) {
    return { success: false, error: `Database connection failed: ${connectionTest.error}` }
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
      return { success: false, error: `Login failed: ${userError.message}` }
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
      return { success: false, error: `Login failed: ${sessionError.message}` }
    }

    // Set session cookie
    cookies().set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    })

    return {
      success: true,
      redirect: "/dashboard",
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        darkMode: user.dark_mode,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
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

      if (sessionError || !session) {
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
        .select("id, first_name, last_name, role, dark_mode, email")
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
          email: user.email,
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

// Logout function
export async function logout() {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      const supabase = createClient()
      // Delete session from database
      await supabase.from("user_sessions").delete().eq("session_token", sessionToken)
    }

    // Delete cookies
    cookies().delete("session_token")
    cookies().delete("admin_session")

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to logout" }
  }
}

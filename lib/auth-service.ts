"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Create a Supabase client for server-side operations
const createServerClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// User registration
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string
  const phone = formData.get("phone") as string

  // Validate input
  if (!email || !firstName || !lastName || !password || !confirmPassword) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  try {
    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

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

  try {
    const supabase = createServerClient()

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, password_hash, role, dark_mode")
      .eq("email", email)
      .single()

    if (userError || !user) {
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

    return { success: true, redirect: "/dashboard" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}

// Admin login
export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  try {
    const supabase = createServerClient()

    // Get admin from database
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, username, password_hash, name, role")
      .eq("username", username)
      .single()

    if (adminError || !admin) {
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
      const supabase = createServerClient()

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
      const supabase = createServerClient()

      // Get session from database
      const { data: session, error: sessionError } = await supabase
        .from("user_sessions")
        .select("user_id, expires_at")
        .eq("session_token", sessionToken)
        .single()

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
        .select("id, first_name, last_name, role, dark_mode")
        .eq("id", session.user_id)
        .single()

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
    const supabase = createServerClient()

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
      walletBalance: user.wallets?.balance || 0,
    }
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: string, userData: any) {
  try {
    const supabase = createServerClient()

    // Prepare data for update
    const updateData: any = {}

    if (userData.firstName !== undefined) updateData.first_name = userData.firstName
    if (userData.lastName !== undefined) updateData.last_name = userData.lastName
    if (userData.email !== undefined) updateData.email = userData.email
    if (userData.phone !== undefined) updateData.phone = userData.phone
    if (userData.address !== undefined) updateData.address = userData.address
    if (userData.city !== undefined) updateData.city = userData.city
    if (userData.state !== undefined) updateData.state = userData.state
    if (userData.country !== undefined) updateData.country = userData.country
    if (userData.darkMode !== undefined) updateData.dark_mode = userData.darkMode

    // Update user data
    const { data: user, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error("Update user error:", error)
      return { success: false, error: "Failed to update profile" }
    }

    return {
      success: true,
      user: {
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
      },
    }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
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
    const supabase = createServerClient()

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

// Get all users (for admin)
export async function getUsers() {
  try {
    const supabase = createServerClient()

    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id, 
        email, 
        username, 
        first_name, 
        last_name, 
        role, 
        created_at
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Get users error:", error)
      return []
    }

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      createdAt: user.created_at,
    }))
  } catch (error) {
    console.error("Get users error:", error)
    return []
  }
}

// Get all admins
export async function getAdmins() {
  try {
    const supabase = createServerClient()

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

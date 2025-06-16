import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("email", email).maybeSingle()

    if (userError) {
      console.error("Error checking user:", userError)
      return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
    }

    // Even if user doesn't exist, we don't want to reveal that for security reasons
    // So we'll return success regardless, but only create a token if the user exists
    if (user) {
      // Generate reset token
      const resetToken = uuidv4()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

      // Delete any existing reset tokens for this user
      await supabase.from("password_resets").delete().eq("user_id", user.id)

      // Create new reset token
      const { error: tokenError } = await supabase.from("password_resets").insert([
        {
          user_id: user.id,
          token: resetToken,
          expires_at: expiresAt.toISOString(),
        },
      ])

      if (tokenError) {
        console.error("Error creating reset token:", tokenError)
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
      }

      // In a real application, you would send an email with the reset link
      // For this example, we'll just log it to the console
      console.log(`Password reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`)

      // You could implement email sending here using a service like SendGrid, Mailgun, etc.
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if token exists and is not expired
    const { data: resetData, error: resetError } = await supabase
      .from("password_resets")
      .select("user_id, expires_at")
      .eq("token", token)
      .maybeSingle()

    if (resetError) {
      console.error("Error checking reset token:", resetError)
      return NextResponse.json({ error: "Failed to validate token" }, { status: 500 })
    }

    if (!resetData) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Check if token is expired
    if (new Date(resetData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Update user's password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", resetData.user_id)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Delete the used token
    await supabase.from("password_resets").delete().eq("token", token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get the current session
    const sessionToken = cookies().get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "No active session" }, { status: 401 })
    }

    // Update the session to mark 2FA as complete
    const { error } = await supabase
      .from("user_sessions")
      .update({ two_factor_verified: true })
      .eq("session_token", sessionToken)
      .eq("user_id", userId)

    if (error) {
      console.error("Error updating session:", error)
      return NextResponse.json({ success: false, error: "Failed to complete authentication" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error completing 2FA:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}

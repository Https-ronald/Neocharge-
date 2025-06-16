import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { userId, name, email, phone, address } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    // Update user profile in the database
    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        email,
        phone,
        address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("Error updating user profile:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: data?.[0] || null,
    })
  } catch (error) {
    console.error("Error in update profile route:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}

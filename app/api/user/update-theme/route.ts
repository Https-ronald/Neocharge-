import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { darkMode } = await request.json()
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("users").update({ dark_mode: darkMode }).eq("id", session.user.id)

    if (error) {
      console.error("Error updating theme preference:", error)
      return NextResponse.json({ error: "Failed to update theme preference" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in update-theme route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

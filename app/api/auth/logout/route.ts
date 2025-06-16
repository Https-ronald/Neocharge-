import { NextResponse } from "next/server"
import { logout } from "@/lib/auth-unified"

export async function POST() {
  try {
    const result = await logout()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { getAuthStatus } from "@/lib/auth-unified"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const authStatus = await getAuthStatus()
    return NextResponse.json(authStatus)
  } catch (error) {
    console.error("Auth status error:", error)
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 })
  }
}

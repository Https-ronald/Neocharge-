import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAuthStatus } from "@/lib/auth-unified"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const authStatus = await getAuthStatus()

    if (!authStatus.authenticated || !authStatus.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const supabase = createClient()

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", authStatus.user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      transactions: transactions || [],
      pagination: {
        page,
        limit,
        total: transactions?.length || 0,
      },
    })
  } catch (error) {
    console.error("Error in transactions route:", error)
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}

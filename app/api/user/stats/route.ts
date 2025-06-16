import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const sessionToken = cookies().get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Verify session
    const { data: session } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("session_token", sessionToken)
      .eq("user_id", userId)
      .single()

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Get wallet balance
    const { data: wallet } = await supabase.from("wallets").select("balance").eq("user_id", userId).single()

    // Get all transactions for this user
    const { data: transactions } = await supabase
      .from("transactions")
      .select("type, amount, status")
      .eq("user_id", userId)

    // Calculate stats from real data
    let totalSpent = 0
    let totalTransactions = 0
    let completedTransactions = 0

    if (transactions && transactions.length > 0) {
      totalTransactions = transactions.length

      transactions.forEach((transaction) => {
        if (transaction.status === "completed") {
          completedTransactions++
          if (transaction.type === "debit") {
            totalSpent += transaction.amount
          }
        }
      })
    }

    // Calculate savings as 2% of total spent (or 0 if no spending)
    const savings = totalSpent > 0 ? Math.floor(totalSpent * 0.02) : 0

    const stats = {
      balance: wallet?.balance || 0,
      totalSpent,
      totalTransactions: completedTransactions,
      savings,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json(
      {
        balance: 0,
        totalSpent: 0,
        totalTransactions: 0,
        savings: 0,
      },
      { status: 200 },
    )
  }
}

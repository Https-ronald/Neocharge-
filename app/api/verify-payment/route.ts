import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const tx_ref = searchParams.get("tx_ref")
    const transaction_id = searchParams.get("transaction_id")

    if (!status || !tx_ref) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = createClient()

    if (status === "successful") {
      // Update transaction status
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          flutterwave_ref: transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", tx_ref)

      if (error) {
        console.error("Error updating transaction:", error)
        return NextResponse.json({ success: false, error: "Failed to update transaction" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
      })
    } else {
      // Update transaction as failed
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("reference", tx_ref)

      if (error) {
        console.error("Error updating failed transaction:", error)
      }

      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, error: "An error occurred during verification" }, { status: 500 })
  }
}

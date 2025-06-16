// =============================================================================
// FLUTTERWAVE WEBHOOK HANDLER - ADD YOUR WEBHOOK LOGIC HERE
// =============================================================================
// Documentation: https://developer.flutterwave.com/docs/integration-guides/webhooks/
// =============================================================================

import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // =============================================================================
    // TODO: ADD YOUR FLUTTERWAVE WEBHOOK VERIFICATION
    // =============================================================================
    // Get the webhook signature from headers
    const signature = request.headers.get("verif-hash")
    const payload = await request.text()

    // TODO: Replace with your actual Flutterwave secret hash
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || "YOUR_FLUTTERWAVE_SECRET_HASH"

    // Verify the webhook signature
    const hash = crypto.createHmac("sha256", secretHash).update(payload).digest("hex")

    if (hash !== signature) {
      console.error("Invalid Flutterwave webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const data = JSON.parse(payload)

    // =============================================================================
    // TODO: PROCESS FLUTTERWAVE WEBHOOK EVENTS
    // =============================================================================
    // Handle different webhook events:
    // - charge.completed: Payment completed successfully
    // - charge.failed: Payment failed
    // - transfer.completed: Transfer completed
    // - transfer.failed: Transfer failed
    //
    // Example event processing:
    // if (data.event === "charge.completed" && data.data.status === "successful") {
    //   const supabase = createClient()
    //
    //   // Update transaction status in your database
    //   await supabase
    //     .from("transactions")
    //     .update({
    //       status: "completed",
    //       flutterwave_ref: data.data.id,
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("reference", data.data.tx_ref)
    //
    //   // Update user wallet balance if it's a funding transaction
    //   if (data.data.meta && data.data.meta.transaction_type === "wallet_funding") {
    //     await supabase
    //       .from("wallets")
    //       .update({
    //         balance: data.data.amount,
    //       })
    //       .eq("user_id", data.data.meta.user_id)
    //   }
    // }
    // =============================================================================

    console.log("Flutterwave webhook received:", data)

    // Mock processing for development
    if (data.event === "charge.completed") {
      console.log("Processing successful payment:", data.data.tx_ref)
      // TODO: Add your payment processing logic here
    }

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error) {
    console.error("Flutterwave webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// =============================================================================
// PAYSTACK WEBHOOK HANDLER - ADD YOUR WEBHOOK LOGIC HERE
// =============================================================================
// Documentation: https://paystack.com/docs/payments/webhooks/
// =============================================================================

import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // =============================================================================
    // TODO: ADD YOUR PAYSTACK WEBHOOK VERIFICATION
    // =============================================================================
    // Get the webhook signature from headers
    const signature = request.headers.get("x-paystack-signature")
    const payload = await request.text()

    // TODO: Replace with your actual Paystack secret key
    const secretKey = process.env.PAYSTACK_SECRET_KEY || "YOUR_PAYSTACK_SECRET_KEY"

    // Verify the webhook signature
    const hash = crypto.createHmac("sha512", secretKey).update(payload).digest("hex")

    if (hash !== signature) {
      console.error("Invalid Paystack webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const data = JSON.parse(payload)

    // =============================================================================
    // TODO: PROCESS PAYSTACK WEBHOOK EVENTS
    // =============================================================================
    // Handle different webhook events:
    // - charge.success: Payment completed successfully
    // - charge.failed: Payment failed
    // - transfer.success: Transfer completed
    // - transfer.failed: Transfer failed
    //
    // Example event processing:
    // if (data.event === "charge.success") {
    //   const supabase = createClient()
    //
    //   // Update transaction status in your database
    //   await supabase
    //     .from("transactions")
    //     .update({
    //       status: "completed",
    //       paystack_ref: data.data.id,
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("reference", data.data.reference)
    //
    //   // Update user wallet balance if it's a funding transaction
    //   if (data.data.metadata && data.data.metadata.transaction_type === "wallet_funding") {
    //     await supabase
    //       .from("wallets")
    //       .update({
    //         balance: data.data.amount / 100, // Convert from kobo to naira
    //       })
    //       .eq("user_id", data.data.metadata.user_id)
    //   }
    // }
    // =============================================================================

    console.log("Paystack webhook received:", data)

    // Mock processing for development
    if (data.event === "charge.success") {
      console.log("Processing successful payment:", data.data.reference)
      // TODO: Add your payment processing logic here
    }

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error) {
    console.error("Paystack webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

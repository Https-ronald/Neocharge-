import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const flutterwaveKey = process.env.FLUTTERWAVE_PUBLIC_KEY

    if (!flutterwaveKey) {
      return NextResponse.json({ error: "Flutterwave key is not defined" }, { status: 500 })
    }

    const body = await request.json()
    const { amount, customer, description } = body

    if (!amount || !customer || !customer.email || !customer.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reference = `NeoCharge-${uuidv4()}`

    // Return the necessary data for the client to initialize the payment
    return NextResponse.json({
      success: true,
      publicKey: flutterwaveKey,
      reference,
      // You can also generate a payment link here if you want to redirect the user
      // paymentLink: `https://checkout.flutterwave.com/v3/hosted/pay?public_key=${flutterwaveKey}&tx_ref=${reference}&amount=${amount}&currency=NGN&customer[email]=${customer.email}&customer[name]=${customer.name}&customizations[title]=NeoCharge&customizations[description]=${description || "Payment for services"}`
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "An error occurred while creating the payment" }, { status: 500 })
  }
}

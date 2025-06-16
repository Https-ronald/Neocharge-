import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-unified"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Convert JSON to FormData for compatibility with existing function
    const formData = new FormData()
    Object.keys(body).forEach((key) => {
      if (body[key] !== null && body[key] !== undefined) {
        formData.append(key, body[key])
      }
    })

    const result = await registerUser(formData)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during registration",
      },
      { status: 500 },
    )
  }
}

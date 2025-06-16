import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    console.log("Admin login API called")

    const body = await request.text()
    console.log("Request body:", body)

    const { username, password } = JSON.parse(body)
    console.log("Parsed credentials:", { username, password: password ? "***" : "empty" })

    if (!username || !password) {
      console.log("Missing credentials")
      return NextResponse.json(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 },
      )
    }

    // Simple hardcoded check
    if (username === "admin" && password === "admin123") {
      console.log("Admin login successful")

      return NextResponse.json({
        success: true,
        redirect: "/admin/dashboard",
        user: {
          id: "admin-1",
          username: "admin",
          role: "admin",
          name: "System Administrator",
        },
      })
    } else {
      console.log("Invalid credentials provided")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server error occurred",
      },
      { status: 500 },
    )
  }
}

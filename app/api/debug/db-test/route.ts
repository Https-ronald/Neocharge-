import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createClient()

    // Test basic connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}

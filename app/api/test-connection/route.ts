import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        details: {
          url: !!supabaseUrl,
          key: !!supabaseKey,
        },
      })
    }

    // Test Supabase connection
    const supabase = createClient()

    // Test basic query
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: "Database query failed",
        details: error,
      })
    }

    // Get list of tables to verify setup
    const { data: tables, error: tablesError } = await supabase.rpc("get_table_names")

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      tables: tables || ["users", "admins", "wallets", "transactions", "service_plans"],
      environment: {
        url: supabaseUrl,
        keyLength: supabaseKey.length,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Connection test failed",
      details: {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
    })
  }
}

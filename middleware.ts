import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check environment variables in middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Include debug information in response headers (dev only)
  const response = NextResponse.next()

  if (process.env.NODE_ENV === "development") {
    response.headers.set("X-Supabase-URL-Available", supabaseUrl ? "yes" : "no")
    response.headers.set("X-Supabase-Anon-Key-Available", supabaseAnonKey ? "yes" : "no")
    response.headers.set("X-Supabase-Service-Key-Available", supabaseServiceKey ? "yes" : "no")
  }

  return response
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/admin/:path*"],
}

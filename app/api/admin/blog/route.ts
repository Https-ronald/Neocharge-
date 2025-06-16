import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const published = searchParams.get("published")

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published, created_at, updated_at, author_id", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Add search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // Add published filter if provided
    if (published !== null && published !== undefined) {
      query = query.eq("published", published === "true")
    }

    const { data: posts, count, error } = await query

    if (error) {
      console.error("Error fetching blog posts:", error)
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
    }

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    })
  } catch (error) {
    console.error("Error in blog posts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create blog post
    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        published: body.published || false,
        featured_image: body.featured_image,
        author_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating blog post:", error)
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error in create blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

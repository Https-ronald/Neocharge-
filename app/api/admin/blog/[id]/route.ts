import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get blog post
    const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
    }

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error in blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Update blog post
    const { data: post, error } = await supabase
      .from("blog_posts")
      .update({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        published: body.published,
        featured_image: body.featured_image,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating blog post:", error)
      return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error in update blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete blog post
    const { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting blog post:", error)
      return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete blog post API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Upload, Save } from "lucide-react"
import dynamic from "next/dynamic"

// Import the editor component dynamically to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  featured_image?: string
}

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPost()
  }, [postId])

  const fetchBlogPost = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch blog post")
      }

      const data = await response.json()
      setPost(data.post)

      if (data.post.featured_image) {
        setImagePreview(data.post.featured_image)
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
      setError("Failed to load blog post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create a preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post) return

    setIsSaving(true)
    setError(null)

    try {
      // Upload image if selected
      let imageUrl = post.featured_image

      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image")
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
      }

      // Update post
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...post,
          featured_image: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update blog post")
      }

      router.push("/admin/blog")
    } catch (error) {
      console.error("Error updating blog post:", error)
      setError("Failed to update blog post. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="py-12">
        <Alert variant="destructive">
          <AlertDescription>Blog post not found.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Posts
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-gray-500 dark:text-gray-400">Update your blog post</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Basic information about your blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={post.published}
                  onCheckedChange={(checked) => setPost({ ...post, published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>Upload a featured image for your blog post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview && (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Featured image preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-4">
                <Label
                  htmlFor="image"
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                      setPost({ ...post, featured_image: undefined })
                    }}
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write your blog post content</CardDescription>
            </CardHeader>
            <CardContent>
              <Editor value={post.content} onChange={(value) => setPost({ ...post, content: value })} />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

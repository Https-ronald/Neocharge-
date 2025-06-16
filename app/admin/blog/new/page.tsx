"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function NewBlogPostPage() {
  const router = useRouter()
  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setPost({
      ...post,
      title,
      // Generate slug from title
      slug: title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-"),
    })
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

    setIsSaving(true)
    setError(null)

    try {
      // Upload image if selected
      let imageUrl = undefined

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

      // Create post
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...post,
          featured_image: imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create blog post")
      }

      router.push("/admin/blog")
    } catch (error) {
      console.error("Error creating blog post:", error)
      setError("Failed to create blog post. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
          <p className="text-gray-500 dark:text-gray-400">Create a new blog post</p>
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
                <Input id="title" value={post.title} onChange={handleTitleChange} required />
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
                  Create Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

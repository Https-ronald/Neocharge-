"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  created_at: string
  updated_at: string
  author_id: string
  author_name: string
  featured_image?: string
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/blog", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch blog posts")
      }

      const data = await response.json()
      setBlogPosts(data.posts)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setError("Failed to load blog posts. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/blog/${postToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog post")
      }

      // Remove the deleted post from the state
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete))
      setShowDeleteDialog(false)
      setPostToDelete(null)
    } catch (error) {
      console.error("Error deleting blog post:", error)
      setError("Failed to delete blog post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update blog post")
      }

      // Update the post status in the state
      setBlogPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? { ...post, published: !currentStatus } : post)),
      )
    } catch (error) {
      console.error("Error updating blog post:", error)
      setError("Failed to update blog post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your blog posts</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/admin/blog/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>A list of all your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No blog posts found matching your search."
                : "No blog posts found. Create your first post!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "success" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(post.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>{post.author_name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleTogglePublish(post.id, post.published)}
                            title={post.published ? "Unpublish" : "Publish"}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/admin/blog/edit/${post.id}`)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(post.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

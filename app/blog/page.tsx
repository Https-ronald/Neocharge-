import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, User } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "How to Save Money on Your Electricity Bills",
      excerpt:
        "Learn practical tips and strategies to reduce your electricity consumption and save money on your monthly bills.",
      date: "May 10, 2023",
      author: "John Doe",
      readTime: "5 min read",
      category: "Tips & Tricks",
      image: "/placeholder.svg?height=200&width=400",
      slug: "how-to-save-money-on-electricity-bills",
    },
    {
      id: 2,
      title: "Understanding Data Plans: Which One is Right for You?",
      excerpt:
        "With so many data plans available, it can be confusing to choose the right one. This guide will help you make an informed decision.",
      date: "April 25, 2023",
      author: "Jane Smith",
      readTime: "8 min read",
      category: "Guides",
      image: "/placeholder.svg?height=200&width=400",
      slug: "understanding-data-plans",
    },
    {
      id: 3,
      title: "The Future of Digital Payments in Nigeria",
      excerpt:
        "Explore the evolving landscape of digital payments in Nigeria and what the future holds for consumers and businesses.",
      date: "April 12, 2023",
      author: "Michael Johnson",
      readTime: "10 min read",
      category: "Industry Insights",
      image: "/placeholder.svg?height=200&width=400",
      slug: "future-of-digital-payments-nigeria",
    },
    {
      id: 4,
      title: "How to Protect Yourself from Online Payment Scams",
      excerpt:
        "Stay safe online with these essential tips to protect yourself from common payment scams and fraud attempts.",
      date: "March 30, 2023",
      author: "Sarah Williams",
      readTime: "7 min read",
      category: "Security",
      image: "/placeholder.svg?height=200&width=400",
      slug: "protect-from-online-payment-scams",
    },
    {
      id: 5,
      title: "Comparing TV Subscription Packages: Value for Money",
      excerpt:
        "A comprehensive comparison of different TV subscription packages available in Nigeria to help you get the best value for your money.",
      date: "March 15, 2023",
      author: "David Brown",
      readTime: "9 min read",
      category: "Comparisons",
      image: "/placeholder.svg?height=200&width=400",
      slug: "comparing-tv-subscription-packages",
    },
    {
      id: 6,
      title: "The Benefits of Using a Digital Wallet for Your Payments",
      excerpt:
        "Discover how using a digital wallet can simplify your payment process and provide additional security for your transactions.",
      date: "February 28, 2023",
      author: "Emily Chen",
      readTime: "6 min read",
      category: "Digital Wallets",
      image: "/placeholder.svg?height=200&width=400",
      slug: "benefits-of-digital-wallet",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-blue-600 text-white dark:bg-blue-800">
          <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">NeoCharge Blog</h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-blue-100 dark:text-blue-200">
              Insights, tips, and updates about digital payments and services in Nigeria.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-lg md:h-auto">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Featured post"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    Featured
                  </span>
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  The Complete Guide to Managing Your Digital Payments
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  In this comprehensive guide, we'll walk you through everything you need to know about managing your
                  digital payments effectively, from choosing the right payment methods to securing your transactions.
                </p>
                <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-4">Admin</span>
                  <CalendarDays className="w-4 h-4 mr-1" />
                  <span className="mr-4">May 15, 2023</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>12 min read</span>
                </div>
                <Link href="/blog/complete-guide-to-digital-payments">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Read Full Article
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Latest Articles</h2>
              <div className="flex mt-4 space-x-2 md:mt-0">
                <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  All
                </Button>
                <Button variant="ghost" className="dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                  Tips & Tricks
                </Button>
                <Button variant="ghost" className="dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                  Guides
                </Button>
                <Button variant="ghost" className="dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                  Security
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden border-0 shadow-lg transition-transform hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-700"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription className="text-gray-600 dark:text-gray-400">{post.excerpt}</CardDescription>
                    <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/blog/${post.slug}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Read More
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Button variant="outline" className="px-8 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Stay updated with the latest articles, tips, and insights about digital payments and services.
              </p>
              <div className="flex flex-col items-center justify-center mt-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:w-64"
                />
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                  Subscribe
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Shield,
  Clock,
  CreditCard,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const services = [
    {
      icon: Smartphone,
      title: "Airtime Recharge",
      description: "Instant airtime top-up for all networks with up to 5% discount",
      color: "text-blue-600",
      href: "/dashboard/airtime",
    },
    {
      icon: Wifi,
      title: "Data Bundles",
      description: "Affordable data plans for MTN, Airtel, Glo, and 9mobile",
      color: "text-green-600",
      href: "/dashboard/data",
    },
    {
      icon: Tv,
      title: "Cable TV",
      description: "DSTV, GOTV, Startimes subscriptions at best rates",
      color: "text-purple-600",
      href: "/dashboard/tv",
    },
    {
      icon: Zap,
      title: "Electricity Bills",
      description: "Pay PHCN, EKEDC, IKEDC bills and get instant tokens",
      color: "text-yellow-600",
      href: "/dashboard/electricity",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level security with SSL encryption for all transactions",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round-the-clock service availability with instant processing",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Pay with cards, bank transfer, USSD, or wallet balance",
    },
    {
      icon: Users,
      title: "Customer Support",
      description: "Dedicated support team available via chat, email, and phone",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Owner",
      content: "NeoCharge has made managing my business utilities so much easier. The platform is reliable and fast.",
      rating: 5,
      image: "/images/happy-customer.jpg",
    },
    {
      name: "Michael Chen",
      role: "Student",
      content: "I love how I can recharge my phone and pay for data bundles all in one place. Very convenient!",
      rating: 5,
      image: "/images/happy-customer.jpg",
    },
    {
      name: "Aisha Okafor",
      role: "Freelancer",
      content: "The best platform for utility payments in Nigeria. Fast, secure, and always available.",
      rating: 5,
      image: "/images/happy-customer.jpg",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1M+", label: "Transactions" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section with Banner Image */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-banner.jpg"
            alt="Happy person using mobile phone for digital payments"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20 container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                🚀 The Future of Digital Payments
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Utilities Made{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Easy
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100 max-w-2xl">
                Recharge airtime, buy data, pay bills, and manage all your digital needs in one secure platform. Fast,
                reliable, and available 24/7 with the best rates in Nigeria.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Image
                  src="/images/mobile-payment.jpg"
                  alt="Mobile payment interface"
                  width={400}
                  height={300}
                  className="rounded-lg w-full"
                />
                <div className="mt-4 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Instant Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span>100% Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need for your digital lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} href={service.href}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="text-center">
                    <service.icon className={`h-12 w-12 mx-auto ${service.color}`} />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{service.description}</CardDescription>
                    <div className="mt-4 text-center">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Get Started <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose NeoCharge?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Built with security, reliability, and user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Trusted by thousands of satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust NeoCharge for their digital utility needs. Start saving time and money
              today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

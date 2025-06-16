"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Tv, Zap, Globe, CreditCard, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Smartphone,
      title: "Airtime Recharge",
      description: "Instant airtime top-up for all major networks in Nigeria",
      features: ["MTN, Airtel, Glo, 9mobile support", "Instant delivery", "Competitive rates", "Bulk recharge options"],
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Wifi,
      title: "Data Bundles",
      description: "Affordable data plans for all networks with instant activation",
      features: ["All network data plans", "SME and Direct data", "Instant activation", "Best market rates"],
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Tv,
      title: "Cable TV Subscription",
      description: "Pay for your cable TV subscriptions with ease",
      features: ["DSTV, GOTV, Startimes", "Instant activation", "All package types", "Renewal reminders"],
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Zap,
      title: "Electricity Bills",
      description: "Pay your electricity bills for all distribution companies",
      features: ["All DISCOs supported", "Instant payment", "Token generation", "Payment history"],
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Globe,
      title: "Internet Services",
      description: "Subscribe to internet services and manage your connections",
      features: ["Fiber internet plans", "WiFi subscriptions", "Router management", "Speed optimization"],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      icon: CreditCard,
      title: "Bill Payments",
      description: "Pay various bills and subscriptions in one place",
      features: ["Utility bills", "Insurance payments", "School fees", "Government services"],
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-level security with SSL encryption",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Service available round the clock",
    },
    {
      icon: CheckCircle,
      title: "Instant Processing",
      description: "Most transactions complete within seconds",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              💼 Complete Digital Solutions
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Our Services
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive digital utility services designed to make your life easier. From airtime to electricity
              bills, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Our Services?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Built with reliability, security, and user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <benefit.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Our Services?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust NeoCharge for their digital utility needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

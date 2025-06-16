import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-blue-600 text-white dark:bg-blue-800">
          <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Transparent Pricing</h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-blue-100 dark:text-blue-200">
              Simple, affordable rates with no hidden fees. Pay only for what you use.
            </p>
          </div>
        </section>

        {/* Service Fees Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Service Fees</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Our competitive rates for all digital payment services.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Airtime */}
              <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Airtime Recharge</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Top up your mobile phone credit
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">0.5%</span>
                    <span className="text-gray-600 dark:text-gray-400"> service fee</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">All networks supported</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Instant delivery</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Minimum amount: ₦50</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Maximum amount: ₦50,000</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/airtime" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Recharge Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Data */}
              <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Data Bundles</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Internet data for all networks
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">1%</span>
                    <span className="text-gray-600 dark:text-gray-400"> service fee</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">All networks supported</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Instant activation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Daily, weekly, monthly plans</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Competitive rates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/data" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Buy Data
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* TV */}
              <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">TV Subscription</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Cable TV subscription renewal
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">1.5%</span>
                    <span className="text-gray-600 dark:text-gray-400"> service fee</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">DSTV, GOTV, StarTimes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">All packages available</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Instant activation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Email receipt</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/tv" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Subscribe Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Electricity */}
              <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Electricity Bills</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Pay for electricity and get tokens
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">1%</span>
                    <span className="text-gray-600 dark:text-gray-400"> service fee</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">All DisCos supported</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Prepaid & postpaid meters</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Instant token generation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Minimum amount: ₦500</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/dashboard/electricity" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Pay Bills
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Account Plans */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Account Plans</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Choose the right plan for your payment needs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Basic</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">Free</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Standard service fees</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Basic customer support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Transaction history (30 days)</span>
                    </li>
                    <li className="flex items-start">
                      <X className="w-5 h-5 mr-2 text-red-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Bulk payments</span>
                    </li>
                    <li className="flex items-start">
                      <X className="w-5 h-5 mr-2 text-red-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">API access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className="border-0 shadow-xl relative dark:bg-gray-900 dark:border-gray-700 before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-b before:from-blue-600 before:to-blue-800 before:p-0.5 before:content-['']">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Premium</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">₦1,000</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Reduced service fees (0.5% off)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Priority customer support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Transaction history (90 days)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Bulk payments (up to 100 transactions)</span>
                    </li>
                    <li className="flex items-start">
                      <X className="w-5 h-5 mr-2 text-red-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">API access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register?plan=premium" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Subscribe Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Business Plan */}
              <Card className="border-0 shadow-lg dark:bg-gray-900 dark:border-gray-700">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Business</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">₦5,000</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Lowest service fees (1% off)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">24/7 dedicated support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Unlimited transaction history</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">Unlimited bulk payments</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">API access with documentation</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register?plan=business" className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      Contact Sales
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Find answers to common questions about our pricing and services.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Are there any hidden fees?</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    No, we believe in complete transparency. The service fees listed above are the only fees you'll pay
                    when using our services. There are no hidden charges or surprise fees.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    How do I upgrade my account plan?
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    You can upgrade your account plan at any time from your account settings. The new plan will take
                    effect immediately, and you'll be charged the prorated amount for the remainder of the billing
                    cycle.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Can I cancel my subscription?</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the
                    current billing cycle, after which you'll be downgraded to the Basic plan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Do you offer discounts for annual subscriptions?
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Yes, we offer a 10% discount for annual subscriptions on both Premium and Business plans. Contact
                    our sales team for more information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    What payment methods do you accept?
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    We accept all major credit and debit cards, bank transfers, and mobile money. You can also pay using
                    your NeoCharge wallet balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-blue-600 text-white dark:bg-blue-800">
          <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-blue-100 dark:text-blue-200">
              Create your free account today and experience the convenience of NeoCharge.
            </p>
            <div className="flex flex-col items-center justify-center mt-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-white/90"
                >
                  Create Free Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

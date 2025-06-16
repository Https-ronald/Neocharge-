"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, HelpCircle, MessageSquare, Phone, Mail } from "lucide-react"

export default function SupportPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      setSuccess("Your message has been sent. We'll get back to you soon!")
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const faqs = [
    {
      question: "How do I fund my wallet?",
      answer:
        "You can fund your wallet using various payment methods including debit/credit cards, bank transfers, or USSD. Navigate to the 'Fund Wallet' page from your dashboard and follow the instructions for your preferred payment method.",
    },
    {
      question: "What happens if my transaction fails?",
      answer:
        "If your transaction fails, the amount will be refunded to your wallet within 24 hours. If you don't see the refund after 24 hours, please contact our support team with your transaction details.",
    },
    {
      question: "How do I get my electricity token?",
      answer:
        "After a successful electricity bill payment, your token will be displayed on the screen and also sent to your registered email address and phone number.",
    },
    {
      question: "Can I schedule recurring payments?",
      answer:
        "Yes, you can schedule recurring payments for services like TV subscriptions and electricity bills. Go to the respective service page and look for the 'Schedule Payment' option.",
    },
    {
      question: "Is there a transaction fee?",
      answer:
        "We do not charge any transaction fees for airtime purchases. However, there may be a small convenience fee for other services like data bundles, TV subscriptions, and electricity bills.",
    },
    {
      question: "How do I change my password?",
      answer:
        "You can change your password by going to the Settings page and clicking on 'Change Password'. You'll need to enter your current password and then your new password.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "If you forget your password, click on the 'Forgot Password' link on the login page. You'll receive a password reset link on your registered email address.",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-gray-500 dark:text-gray-400">Get help with your account and services</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
          <Check className="h-4 w-4 mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our services</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left dark:text-white">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="dark:text-gray-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is your message about?"
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="dark:text-gray-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    required
                    className="min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach out to us directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium dark:text-white">Phone Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">+234 901 234 5678</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available 8am - 8pm, Monday to Friday</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium dark:text-white">Email Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">support@neocharge.com</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We aim to respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium dark:text-white">Live Chat</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Chat with our support team</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available 24/7 for quick assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>Browse our knowledge base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Getting Started Guide</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Troubleshooting</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Security Tips</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Video Tutorials</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

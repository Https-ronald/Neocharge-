"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/images/neocharge-logo.png" alt="NeoCharge" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center ml-10 space-x-4">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Services
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Contact
              </Link>
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300"
              >
                Services
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 dark:text-gray-300"
              >
                Contact
              </Link>
              <div className="flex items-center space-x-2 px-3 py-2">
                <ThemeToggle />
              </div>
              <div className="px-3 py-2 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

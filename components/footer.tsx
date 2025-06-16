import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
              <img src="/images/neocharge-logo.png" alt="NeoCharge - Utilities Made Easy" className="h-12 w-auto" />
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              The future of digital payments and utility management. Recharge, pay bills, and manage all your digital
              needs in one place.
            </p>
            <div className="flex mt-6 space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/dashboard/airtime"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Airtime Recharge
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/data"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Data Bundles
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/tv"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Cable TV Subscription
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/electricity"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Electricity Bills
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">37, Bariga road Lagos Nigeria</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-500 shrink-0 dark:text-blue-400" />
                <Link
                  href="tel:+2349014437536"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  09014437536
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-500 shrink-0 dark:text-blue-400" />
                <Link
                  href="mailto:azikiweronald@gmail.com"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  azikiweronald@gmail.com
                </Link>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/contact">
                <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} NeoCharge. All rights reserved. Developed by Fluxxx Studios
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

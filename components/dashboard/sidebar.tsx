"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  CreditCard,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const routes = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Airtime",
      icon: Smartphone,
      href: "/dashboard/airtime",
    },
    {
      title: "Data",
      icon: Wifi,
      href: "/dashboard/data",
    },
    {
      title: "TV Subscription",
      icon: Tv,
      href: "/dashboard/tv",
    },
    {
      title: "Electricity",
      icon: Zap,
      href: "/dashboard/electricity",
    },
    {
      title: "Fund Wallet",
      icon: CreditCard,
      href: "/dashboard/fund-wallet",
    },
    {
      title: "Transaction History",
      icon: History,
      href: "/dashboard/transactions",
    },
    {
      title: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/dashboard/support",
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-20 px-4 border-b border-gray-200 md:h-[80px] dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/images/neocharge-logo.png" alt="NeoCharge - Utilities Made Easy" className="h-12 w-auto" />
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  isActive(route.href)
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <route.icon className="w-5 h-5" />
                {route.title}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] dark:bg-gray-900 dark:border-gray-700">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden border-r border-gray-200 md:block w-[280px] bg-white dark:bg-gray-900 dark:border-gray-700">
        <SidebarContent />
      </div>
    </>
  )
}

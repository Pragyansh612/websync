"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AnimatePresence } from "framer-motion"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from "react"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClientComponentClient()
  const pathname = usePathname()
  
  // Hide footer on dashboard pages
  const isDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            {!isDashboard && <Footer />}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
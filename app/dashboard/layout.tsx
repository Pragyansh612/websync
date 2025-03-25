"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
        <div className="flex flex-1">
          <div className="fixed h-[calc(100vh-4rem)] top-16 z-40">
            <DashboardSidebar pathname={pathname} />
          </div>
          <motion.div
            className="flex-1 ml-[var(--sidebar-width)] transition-all duration-300 ease-in-out pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </SidebarProvider>
    </div>
  )
}


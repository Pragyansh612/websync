"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Bell, Globe, LineChart, Plus, Settings, BarChart3, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardSidebarProps {
  pathname?: string
}

export function DashboardSidebar({ pathname = "" }: DashboardSidebarProps) {
  const menuItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: BarChart3,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Websites",
      href: "/dashboard/websites",
      icon: Globe,
      isActive: pathname.includes("/dashboard/websites") || pathname.includes("/dashboard/website/"),
    },
    {
      label: "Alerts",
      href: "/dashboard/alerts",
      icon: AlertCircle,
      isActive: pathname.includes("/dashboard/alerts"),
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: LineChart,
      isActive: pathname.includes("/dashboard/reports"),
    },
    {
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      isActive: pathname.includes("/dashboard/notifications"),
    },
  ]

  const settingsItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      isActive: pathname === "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ]

  const sidebarAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <Sidebar className="border-r h-full glass-sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="text-xl font-bold gradient-text">WebSync</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <motion.div initial="hidden" animate="visible" variants={sidebarAnimation}>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item, index) => (
                  <motion.div key={item.label} variants={itemAnimation}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link href={item.href} className="group">
                          <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item, index) => (
                  <motion.div key={item.label} variants={itemAnimation}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link href={item.href} className="group">
                          <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <Button
            variant="outline"
            className="w-full justify-start transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-primary group"
            asChild
          >
            <Link href="/add-website">
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
              Add Website
            </Link>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowUpRight,
  BellOff,
  Clock,
  Filter,
  Search,
  X,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

// Sample data for notifications
const notifications = [
  {
    id: 1,
    website: "Documentation",
    websiteId: 4,
    message: "Website is down",
    details: "Connection timeout after 30 seconds",
    time: "5 minutes ago",
    timestamp: "2024-03-17T12:15:00Z",
    severity: "critical",
    status: "unread",
    channel: "email",
  },
  {
    id: 2,
    website: "E-commerce Store",
    websiteId: 6,
    message: "High response time detected",
    details: "Response time increased to 320ms (threshold: 300ms)",
    time: "15 minutes ago",
    timestamp: "2024-03-17T12:05:00Z",
    severity: "warning",
    status: "unread",
    channel: "email",
  },
  {
    id: 3,
    website: "Customer Portal",
    websiteId: 3,
    message: "SSL certificate expires in 7 days",
    details: "Certificate will expire on 2024-03-24",
    time: "1 hour ago",
    timestamp: "2024-03-17T11:20:00Z",
    severity: "info",
    status: "read",
    channel: "email",
  },
  {
    id: 4,
    website: "API Service",
    websiteId: 2,
    message: "Intermittent 503 errors detected",
    details: "3 occurrences in the last 10 minutes",
    time: "30 minutes ago",
    timestamp: "2024-03-17T11:50:00Z",
    severity: "warning",
    status: "read",
    channel: "slack",
  },
  {
    id: 5,
    website: "Blog",
    websiteId: 5,
    message: "Slow response time detected",
    details: "Response time increased to 180ms (threshold: 150ms)",
    time: "2 hours ago",
    timestamp: "2024-03-17T10:20:00Z",
    severity: "warning",
    status: "read",
    channel: "sms",
  },
  {
    id: 6,
    website: "Main Website",
    websiteId: 1,
    message: "Brief downtime detected",
    details: "Website was down for 2 minutes",
    time: "3 hours ago",
    timestamp: "2024-03-17T09:15:00Z",
    severity: "critical",
    status: "read",
    channel: "email",
  },
  {
    id: 7,
    website: "Documentation",
    websiteId: 4,
    message: "404 errors on multiple pages",
    details: "5 broken links detected during crawl",
    time: "4 hours ago",
    timestamp: "2024-03-17T08:20:00Z",
    severity: "warning",
    status: "read",
    channel: "slack",
  },
  {
    id: 8,
    website: "E-commerce Store",
    websiteId: 6,
    message: "Payment gateway timeout",
    details: "Checkout process affected for 5 minutes",
    time: "5 hours ago",
    timestamp: "2024-03-17T07:15:00Z",
    severity: "critical",
    status: "read",
    channel: "email",
  },
]

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Filter notifications based on search, severity, status, and active tab
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "all" || notification.severity === severityFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter

    // Filter based on active tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && notification.status === "unread") ||
      (activeTab === "read" && notification.status === "read")

    return matchesSearch && matchesSeverity && matchesStatus && matchesTab
  })

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <motion.div className="container py-6 space-y-6" initial="hidden" animate="visible" variants={containerAnimation}>
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemAnimation}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight gradient-text">Notifications</h1>
          <p className="text-muted-foreground">View and manage your notification settings</p>
        </div>
      </motion.div>

      <motion.div variants={itemAnimation}>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList className="bg-muted/60 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
              >
                All Notifications
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
              >
                Unread
              </TabsTrigger>
              <TabsTrigger
                value="read"
                className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
              >
                Read
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[180px] transition-all border-primary/20 hover:border-primary/50">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="hover:bg-primary/10 hover:border-primary/30">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
            <Input
              type="search"
              placeholder="Search notifications..."
              className="w-full transition-all border-primary/20 focus-visible:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost" className="hover:bg-primary/10">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="enhanced-glass-card">
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Stay updated with alerts from your monitored websites</CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsContent value="all" className="m-0">
                    <NotificationList notifications={filteredNotifications} />
                  </TabsContent>

                  <TabsContent value="unread" className="m-0">
                    <NotificationList notifications={filteredNotifications} />
                  </TabsContent>

                  <TabsContent value="read" className="m-0">
                    <NotificationList notifications={filteredNotifications} />
                  </TabsContent>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredNotifications.length} of {notifications.length} notifications
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="enhanced-glass-card">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <Label htmlFor="email-notifications">Email</Label>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <Label htmlFor="slack-notifications">Slack</Label>
                        </div>
                        <Switch id="slack-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-primary" />
                          <Label htmlFor="sms-notifications">SMS</Label>
                        </div>
                        <Switch id="sms-notifications" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Alert Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="downtime-alerts">Downtime Alerts</Label>
                        <Switch id="downtime-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="performance-alerts">Performance Alerts</Label>
                        <Switch id="performance-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ssl-alerts">SSL Certificate Alerts</Label>
                        <Switch id="ssl-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="security-alerts">Security Alerts</Label>
                        <Switch id="security-alerts" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function NotificationList({ notifications }: { notifications: typeof notifications }) {
  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <BellOff className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No notifications found matching your criteria</p>
        </div>
      ) : (
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-primary/5 hover:border-primary/30 ${
                notification.status === "unread" ? "bg-primary/5 border-primary/20" : ""
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{
                scale: 1.01,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.2 },
              }}
            >
              <div className="mt-0.5">
                {notification.severity === "critical" ? (
                  <div className="rounded-full bg-destructive/20 p-1">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                ) : notification.severity === "warning" ? (
                  <div className="rounded-full bg-yellow-500/20 p-1">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </div>
                ) : (
                  <div className="rounded-full bg-blue-500/20 p-1">
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
                      className="h-4 w-4 text-blue-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notification.website}</p>
                    {notification.status === "unread" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        New
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-sm text-muted-foreground">{notification.details}</p>
                <div className="flex items-center gap-2 mt-1">
                  {notification.channel === "email" ? (
                    <Mail className="h-3 w-3 text-muted-foreground" />
                  ) : notification.channel === "slack" ? (
                    <MessageSquare className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Smartphone className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    Sent via {notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                  <Link href={`/dashboard/website/${notification.websiteId}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View Website</span>
                  </Link>
                </Button>
                {notification.status === "unread" && (
                  <Button variant="outline" size="sm" className="text-xs hover:bg-primary/10 hover:border-primary/30">
                    Mark as Read
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}


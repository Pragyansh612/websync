"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowUpRight, Bell, BellOff, Check, Clock, Filter, Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

// Sample data for alerts
const alerts = [
  {
    id: 1,
    website: "Documentation",
    websiteId: 4,
    message: "Website is down",
    details: "Connection timeout after 30 seconds",
    time: "5 minutes ago",
    timestamp: "2024-03-17T12:15:00Z",
    severity: "critical",
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "resolved",
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
    status: "resolved",
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
    status: "resolved",
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
    status: "resolved",
  },
]

// Sample data for alert statistics
const alertStats = {
  total: alerts.length,
  active: alerts.filter((a) => a.status === "active").length,
  critical: alerts.filter((a) => a.severity === "critical").length,
  warning: alerts.filter((a) => a.severity === "warning").length,
  info: alerts.filter((a) => a.severity === "info").length,
  resolved: alerts.filter((a) => a.status === "resolved").length,
}

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Filter alerts based on search, severity, status, and active tab
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter

    // Filter based on active tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && alert.status === "active") ||
      (activeTab === "resolved" && alert.status === "resolved")

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
          <h1 className="text-2xl font-bold tracking-tight gradient-text">Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage alerts for your websites</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/alerts/settings">
            <Button
              variant="outline"
              size="sm"
              className="transition-all hover:bg-primary/10 hover:border-primary/30 btn-shine"
            >
              <Bell className="h-4 w-4 mr-2" />
              Alert Settings
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Alert Statistics */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={itemAnimation}>
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{alertStats.total}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{alertStats.active}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <X className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                {alertStats.critical}
              </div>
              <p className="text-xs text-muted-foreground">High priority issues</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Alerts</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {alertStats.resolved}
              </div>
              <p className="text-xs text-muted-foreground">Successfully addressed</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemAnimation}>
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-muted/60 p-1 rounded-lg">
            <TabsTrigger
              value="all"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              All Alerts
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Resolved
            </TabsTrigger>
          </TabsList>

          <Card className="glass-card gradient-border">
            <CardHeader>
              <CardTitle>Alert Management</CardTitle>
              <CardDescription>View and manage alerts for your monitored websites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Search alerts..."
                    className="w-full transition-all border-primary/20 focus-visible:border-primary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="ghost" className="hover:bg-primary/10">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
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

              <TabsContent value="all" className="m-0">
                <AlertList alerts={filteredAlerts} />
              </TabsContent>

              <TabsContent value="active" className="m-0">
                <AlertList alerts={filteredAlerts} />
              </TabsContent>

              <TabsContent value="resolved" className="m-0">
                <AlertList alerts={filteredAlerts} />
              </TabsContent>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Showing {filteredAlerts.length} of {alerts.length} alerts
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function AlertList({ alerts }: { alerts: typeof alerts }) {
  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <BellOff className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No alerts found matching your criteria</p>
        </div>
      ) : (
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
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
                {alert.severity === "critical" ? (
                  <div className="rounded-full bg-destructive/20 p-1">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                ) : alert.severity === "warning" ? (
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
                    <p className="text-sm font-medium">{alert.website}</p>
                    <Badge
                      variant={alert.status === "active" ? "outline" : "secondary"}
                      className={
                        alert.status === "active"
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-green-500/10 text-green-500 border-green-500/30"
                      }
                    >
                      {alert.status === "active" ? "Active" : "Resolved"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.time}
                  </span>
                </div>
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-sm text-muted-foreground">{alert.details}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                  <Link href={`/dashboard/website/${alert.websiteId}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View Website</span>
                  </Link>
                </Button>
                {alert.status === "active" && (
                  <Button variant="outline" size="sm" className="text-xs hover:bg-primary/10 hover:border-primary/30">
                    Resolve
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


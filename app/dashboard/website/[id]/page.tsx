"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Clock, ExternalLink, RefreshCw, X, AlertCircle, ArrowUpRight, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

// Sample website data
const websites = [
  {
    id: 1,
    name: "Main Website",
    url: "https://example.com",
    status: "up",
    uptime: "99.98%",
    responseTime: "124ms",
    lastChecked: "2 minutes ago",
    errors: 0,
    description: "Company's main marketing website",
    location: "US East",
    checkInterval: "1 minute",
    sslExpiry: "2024-12-31",
    performanceHistory: [
      { date: "2023-06-01", responseTime: 120 },
      { date: "2023-06-02", responseTime: 118 },
      { date: "2023-06-03", responseTime: 125 },
      { date: "2023-06-04", responseTime: 132 },
      { date: "2023-06-05", responseTime: 128 },
      { date: "2023-06-06", responseTime: 122 },
      { date: "2023-06-07", responseTime: 119 },
      { date: "2023-06-08", responseTime: 130 },
      { date: "2023-06-09", responseTime: 135 },
      { date: "2023-06-10", responseTime: 124 },
      { date: "2023-06-11", responseTime: 120 },
      { date: "2023-06-12", responseTime: 118 },
      { date: "2023-06-13", responseTime: 122 },
      { date: "2023-06-14", responseTime: 124 },
    ],
    uptimeHistory: [
      { date: "2023-06-01", uptime: 100 },
      { date: "2023-06-02", uptime: 100 },
      { date: "2023-06-03", uptime: 100 },
      { date: "2023-06-04", uptime: 99.8 },
      { date: "2023-06-05", uptime: 100 },
      { date: "2023-06-06", uptime: 100 },
      { date: "2023-06-07", uptime: 100 },
      { date: "2023-06-08", uptime: 100 },
      { date: "2023-06-09", uptime: 99.9 },
      { date: "2023-06-10", uptime: 100 },
      { date: "2023-06-11", uptime: 100 },
      { date: "2023-06-12", uptime: 100 },
      { date: "2023-06-13", uptime: 100 },
      { date: "2023-06-14", uptime: 100 },
    ],
    recentErrors: [
      { date: "2023-06-04 14:23", message: "Connection timeout", duration: "2 minutes" },
      { date: "2023-06-09 08:12", message: "503 Service Unavailable", duration: "1 minute" },
    ],
  },
  {
    id: 2,
    name: "API Service",
    url: "https://api.example.com",
    status: "up",
    uptime: "99.95%",
    responseTime: "89ms",
    lastChecked: "1 minute ago",
    errors: 0,
    description: "REST API for mobile and web applications",
    location: "US East",
    checkInterval: "30 seconds",
    sslExpiry: "2024-10-15",
    performanceHistory: [
      { date: "2023-06-01", responseTime: 85 },
      { date: "2023-06-02", responseTime: 88 },
      { date: "2023-06-03", responseTime: 90 },
      { date: "2023-06-04", responseTime: 87 },
      { date: "2023-06-05", responseTime: 92 },
      { date: "2023-06-06", responseTime: 89 },
      { date: "2023-06-07", responseTime: 86 },
      { date: "2023-06-08", responseTime: 88 },
      { date: "2023-06-09", responseTime: 91 },
      { date: "2023-06-10", responseTime: 89 },
      { date: "2023-06-11", responseTime: 87 },
      { date: "2023-06-12", responseTime: 85 },
      { date: "2023-06-13", responseTime: 88 },
      { date: "2023-06-14", responseTime: 89 },
    ],
    uptimeHistory: [
      { date: "2023-06-01", uptime: 100 },
      { date: "2023-06-02", uptime: 100 },
      { date: "2023-06-03", uptime: 99.9 },
      { date: "2023-06-04", uptime: 100 },
      { date: "2023-06-05", uptime: 100 },
      { date: "2023-06-06", uptime: 100 },
      { date: "2023-06-07", uptime: 99.8 },
      { date: "2023-06-08", uptime: 100 },
      { date: "2023-06-09", uptime: 100 },
      { date: "2023-06-10", uptime: 100 },
      { date: "2023-06-11", uptime: 100 },
      { date: "2023-06-12", uptime: 100 },
      { date: "2023-06-13", uptime: 99.9 },
      { date: "2023-06-14", uptime: 100 },
    ],
    recentErrors: [
      { date: "2023-06-03 10:15", message: "429 Too Many Requests", duration: "45 seconds" },
      { date: "2023-06-07 16:30", message: "Database connection error", duration: "3 minutes" },
      { date: "2023-06-13 22:45", message: "Gateway timeout", duration: "1 minute" },
    ],
  },
  {
    id: 3,
    name: "Customer Portal",
    url: "https://portal.example.com",
    status: "up",
    uptime: "99.90%",
    responseTime: "156ms",
    lastChecked: "3 minutes ago",
    errors: 2,
    description: "Customer login and account management portal",
    location: "US East, Europe",
    checkInterval: "1 minute",
    sslExpiry: "2024-08-22",
    performanceHistory: [
      { date: "2023-06-01", responseTime: 150 },
      { date: "2023-06-02", responseTime: 155 },
      { date: "2023-06-03", responseTime: 158 },
      { date: "2023-06-04", responseTime: 152 },
      { date: "2023-06-05", responseTime: 160 },
      { date: "2023-06-06", responseTime: 165 },
      { date: "2023-06-07", responseTime: 155 },
      { date: "2023-06-08", responseTime: 150 },
      { date: "2023-06-09", responseTime: 148 },
      { date: "2023-06-10", responseTime: 152 },
      { date: "2023-06-11", responseTime: 158 },
      { date: "2023-06-12", responseTime: 162 },
      { date: "2023-06-13", responseTime: 156 },
      { date: "2023-06-14", responseTime: 154 },
    ],
    uptimeHistory: [
      { date: "2023-06-01", uptime: 100 },
      { date: "2023-06-02", uptime: 99.8 },
      { date: "2023-06-03", uptime: 100 },
      { date: "2023-06-04", uptime: 100 },
      { date: "2023-06-05", uptime: 99.9 },
      { date: "2023-06-06", uptime: 100 },
      { date: "2023-06-07", uptime: 100 },
      { date: "2023-06-08", uptime: 100 },
      { date: "2023-06-09", uptime: 99.7 },
      { date: "2023-06-10", uptime: 100 },
      { date: "2023-06-11", uptime: 100 },
      { date: "2023-06-12", uptime: 99.9 },
      { date: "2023-06-13", uptime: 100 },
      { date: "2023-06-14", uptime: 100 },
    ],
    recentErrors: [
      { date: "2023-06-02 09:45", message: "Database query timeout", duration: "2 minutes" },
      { date: "2023-06-05 14:20", message: "Authentication service error", duration: "1 minute" },
      { date: "2023-06-09 18:30", message: "500 Internal Server Error", duration: "5 minutes" },
      { date: "2023-06-12 11:15", message: "Session management error", duration: "1 minute" },
    ],
  },
  {
    id: 4,
    name: "Documentation",
    url: "https://docs.example.com",
    status: "down",
    uptime: "98.45%",
    responseTime: "0ms",
    lastChecked: "5 minutes ago",
    errors: 1,
    description: "Product documentation and API reference",
    location: "US East, US West",
    checkInterval: "5 minutes",
    sslExpiry: "2024-11-05",
    performanceHistory: [
      { date: "2023-06-01", responseTime: 180 },
      { date: "2023-06-02", responseTime: 175 },
      { date: "2023-06-03", responseTime: 182 },
      { date: "2023-06-04", responseTime: 178 },
      { date: "2023-06-05", responseTime: 185 },
      { date: "2023-06-06", responseTime: 180 },
      { date: "2023-06-07", responseTime: 176 },
      { date: "2023-06-08", responseTime: 179 },
      { date: "2023-06-09", responseTime: 183 },
      { date: "2023-06-10", responseTime: 180 },
      { date: "2023-06-11", responseTime: 175 },
      { date: "2023-06-12", responseTime: 178 },
      { date: "2023-06-13", responseTime: 0 },
      { date: "2023-06-14", responseTime: 0 },
    ],
    uptimeHistory: [
      { date: "2023-06-01", uptime: 100 },
      { date: "2023-06-02", uptime: 100 },
      { date: "2023-06-03", uptime: 99.8 },
      { date: "2023-06-04", uptime: 100 },
      { date: "2023-06-05", uptime: 100 },
      { date: "2023-06-06", uptime: 99.9 },
      { date: "2023-06-07", uptime: 100 },
      { date: "2023-06-08", uptime: 100 },
      { date: "2023-06-09", uptime: 100 },
      { date: "2023-06-10", uptime: 99.7 },
      { date: "2023-06-11", uptime: 100 },
      { date: "2023-06-12", uptime: 100 },
      { date: "2023-06-13", uptime: 0 },
      { date: "2023-06-14", uptime: 0 },
    ],
    recentErrors: [
      { date: "2023-06-03 12:30", message: "DNS resolution failure", duration: "3 minutes" },
      { date: "2023-06-06 08:15", message: "Connection refused", duration: "1 minute" },
      { date: "2023-06-10 16:45", message: "504 Gateway Timeout", duration: "4 minutes" },
      { date: "2023-06-13 10:00", message: "Host unreachable", duration: "ongoing" },
    ],
  },
  {
    id: 5,
    name: "Blog",
    url: "https://blog.example.com",
    status: "up",
    uptime: "99.99%",
    responseTime: "110ms",
    lastChecked: "2 minutes ago",
    errors: 0,
    description: "Company blog and news",
    location: "US East, Europe",
    checkInterval: "5 minutes",
    sslExpiry: "2024-09-18",
    performanceHistory: [
      { date: "2023-06-01", responseTime: 108 },
      { date: "2023-06-02", responseTime: 112 },
      { date: "2023-06-03", responseTime: 110 },
      { date: "2023-06-04", responseTime: 105 },
      { date: "2023-06-05", responseTime: 115 },
      { date: "2023-06-06", responseTime: 112 },
      { date: "2023-06-07", responseTime: 108 },
      { date: "2023-06-08", responseTime: 110 },
      { date: "2023-06-09", responseTime: 113 },
      { date: "2023-06-10", responseTime: 110 },
      { date: "2023-06-11", responseTime: 107 },
      { date: "2023-06-12", responseTime: 110 },
      { date: "2023-06-13", responseTime: 112 },
      { date: "2023-06-14", responseTime: 110 },
    ],
    uptimeHistory: [
      { date: "2023-06-01", uptime: 100 },
      { date: "2023-06-02", uptime: 100 },
      { date: "2023-06-03", uptime: 100 },
      { date: "2023-06-04", uptime: 100 },
      { date: "2023-06-05", uptime: 100 },
      { date: "2023-06-06", uptime: 100 },
      { date: "2023-06-07", uptime: 100 },
      { date: "2023-06-08", uptime: 100 },
      { date: "2023-06-09", uptime: 100 },
      { date: "2023-06-10", uptime: 100 },
      { date: "2023-06-11", uptime: 99.9 },
      { date: "2023-06-12", uptime: 100 },
      { date: "2023-06-13", uptime: 100 },
      { date: "2023-06-14", uptime: 100 },
    ],
    recentErrors: [{ date: "2023-06-11 15:20", message: "Slow response time", duration: "1 minute" }],
  },
  {
    id: 6,
    name: "E-commerce Store",
    url: "https://store.example.com",
    status: "degraded",
    uptime: "99.80%",
    responseTime: "320ms",
    lastChecked: "1 minute ago",
    errors: 3,
    description: "Online store and shopping cart",
    location: "US East, US West, Europe, Asia",
    checkInterval: "30 seconds",
    sslExpiry: "2024-07-12",
    performanceHistory: [
      { date: "2023-06-01", responseTime: 220 },
      { date: "2023-06-02", responseTime: 225 },
      { date: "2023-06-03", responseTime: 230 },
      { date: "2023-06-04", responseTime: 228 },
      { date: "2023-06-05", responseTime: 235 },
      { date: "2023-06-06", responseTime: 240 },
      { date: "2023-06-07", responseTime: 250 },
      { date: "2023-06-08", responseTime: 260 },
      { date: "2023-06-09", responseTime: 270 },
      { date: "2023-06-10", responseTime: 280 },
      { date: "2023-06-11", responseTime: 290 },
      { date: "2023-06-12", responseTime: 300 },
      { date: "2023-06-13", responseTime: 310 },
      { date: "2023-06-14", responseTime: 320 },
    ],
    uptimeHistory: [
      { date: "2023-06-01", uptime: 100 },
      { date: "2023-06-02", uptime: 99.9 },
      { date: "2023-06-03", uptime: 100 },
      { date: "2023-06-04", uptime: 99.8 },
      { date: "2023-06-05", uptime: 100 },
      { date: "2023-06-06", uptime: 99.9 },
      { date: "2023-06-07", uptime: 100 },
      { date: "2023-06-08", uptime: 99.7 },
      { date: "2023-06-09", uptime: 100 },
      { date: "2023-06-10", uptime: 99.8 },
      { date: "2023-06-11", uptime: 100 },
      { date: "2023-06-12", uptime: 99.9 },
      { date: "2023-06-13", uptime: 99.8 },
      { date: "2023-06-14", uptime: 99.7 },
    ],
    recentErrors: [
      { date: "2023-06-02 11:30", message: "Database connection error", duration: "1 minute" },
      { date: "2023-06-04 14:45", message: "Payment gateway timeout", duration: "2 minutes" },
      { date: "2023-06-08 09:15", message: "Product catalog service error", duration: "5 minutes" },
      { date: "2023-06-10 16:30", message: "Checkout process failure", duration: "3 minutes" },
      { date: "2023-06-12 13:20", message: "Inventory service error", duration: "1 minute" },
      { date: "2023-06-13 18:45", message: "High response time", duration: "2 minutes" },
      { date: "2023-06-14 10:10", message: "Search functionality degraded", duration: "ongoing" },
    ],
  },
]

export default function WebsiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [website, setWebsite] = useState<any>(null)
  const [animateCharts, setAnimateCharts] = useState(false)

  useEffect(() => {
    // Find the website by ID
    const websiteId = Number(params.id)
    const foundWebsite = websites.find((w) => w.id === websiteId)

    if (foundWebsite) {
      setWebsite(foundWebsite)
    } else {
      // Redirect to dashboard if website not found
      router.push("/dashboard")
      toast({
        title: "Website not found",
        description: "The requested website could not be found.",
        variant: "destructive",
      })
    }

    // Trigger chart animation after component mounts
    setTimeout(() => {
      setAnimateCharts(true)
    }, 500)
  }, [params.id, router, toast])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Website Status Refreshed",
        description: "The latest status has been fetched.",
        duration: 3000,
      })
    }, 1000)
  }

  if (!website) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold">Loading website data...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we fetch the website details.</p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

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
    <motion.div className="container py-10" initial="hidden" animate="visible" variants={containerAnimation}>
      <motion.div className="mb-8" variants={itemAnimation}>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              {website.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center"
              >
                {website.url}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="transition-all hover:bg-muted hover:border-primary/30"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Status
            </Button>
            <Link href={`/dashboard/website/${website.id}/settings`}>
              <Button size="sm" className="shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                <Settings className="h-4 w-4 mr-2" />
                Website Settings
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Status Overview */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8" variants={itemAnimation}>
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className={`card-hover-enhanced glass-card ${website.status === "down" ? "border-destructive/50" : ""}`}
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {website.status === "up" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : website.status === "down" ? (
                <X className="h-4 w-4 text-destructive" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    website.status === "up" ? "outline" : website.status === "down" ? "destructive" : "secondary"
                  }
                  className={
                    website.status === "up"
                      ? "bg-green-500/10 text-green-500"
                      : website.status === "down"
                        ? ""
                        : "bg-yellow-500/10 text-yellow-500"
                  }
                >
                  <span className="flex items-center gap-1">
                    {website.status === "up" ? (
                      <Check className="h-3 w-3" />
                    ) : website.status === "down" ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                  </span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last checked {website.lastChecked}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className="card-hover-enhanced glass-card">
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {website.uptime}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className="card-hover-enhanced glass-card">
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {website.responseTime}
              </div>
              <p className="text-xs text-muted-foreground">Average over last 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className="card-hover-enhanced glass-card">
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {website.errors}
              </div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemAnimation}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger
              value="overview"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="uptime"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Uptime
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Error Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                className="card-hover-enhanced glass-card md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle>Website Information</CardTitle>
                    <CardDescription>Basic information and monitoring settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                        <p>{website.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Monitoring Location</h3>
                        <p>{website.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Check Interval</h3>
                        <p>{website.checkInterval}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">SSL Certificate Expiry</h3>
                        <p>{website.sslExpiry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="card-hover-enhanced glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle>Response Time Trend</CardTitle>
                    <CardDescription>Last 14 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <div className="h-full w-full">
                      <div className="h-full w-full flex flex-col">
                        <div className="flex-1 relative">
                          <div className="absolute inset-0 flex items-end">
                            {website.performanceHistory.map((data, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                                <motion.div
                                  className="w-full bg-gradient-to-t from-primary/80 to-primary/40 mx-[1px] rounded-t-sm"
                                  initial={{ height: 0 }}
                                  animate={{
                                    height: animateCharts ? `${(data.responseTime / 350) * 100}%` : "0%",
                                    transition: { duration: 1, delay: index * 0.05 },
                                  }}
                                  whileHover={{
                                    scale: 1.05,
                                    backgroundColor: "rgba(var(--primary), 0.8)",
                                    transition: { duration: 0.2 },
                                  }}
                                ></motion.div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h-6 flex">
                          {website.performanceHistory.map((data, index) => (
                            <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                              {index % 2 === 0 ? data.date.split("-")[2] : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="card-hover-enhanced glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle>Uptime History</CardTitle>
                    <CardDescription>Last 14 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <div className="h-full w-full">
                      <div className="h-full w-full flex flex-col">
                        <div className="flex-1 relative">
                          <div className="absolute inset-0 flex items-end">
                            {website.uptimeHistory.map((data, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                                <motion.div
                                  className="w-full mx-[1px] rounded-t-sm"
                                  initial={{ height: 0 }}
                                  animate={{
                                    height: animateCharts ? `${data.uptime}%` : "0%",
                                    transition: { duration: 1, delay: index * 0.05 },
                                  }}
                                  style={{
                                    backgroundColor:
                                      data.uptime < 99 ? "hsla(var(--destructive)/0.6)" : "hsla(var(--primary)/0.6)",
                                  }}
                                  whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 },
                                  }}
                                ></motion.div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h-6 flex">
                          {website.uptimeHistory.map((data, index) => (
                            <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                              {index % 2 === 0 ? data.date.split("-")[2] : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <motion.div
              className="card-hover-enhanced glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle>Response Time Analysis</CardTitle>
                  <CardDescription>Detailed performance metrics over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <div className="h-full w-full">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 flex items-end">
                          {website.performanceHistory.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                className="w-full bg-gradient-to-t from-primary/80 to-primary/40 mx-[1px] rounded-t-sm"
                                initial={{ height: 0 }}
                                animate={{
                                  height: animateCharts ? `${(data.responseTime / 350) * 100}%` : "0%",
                                  transition: { duration: 1, delay: index * 0.05 },
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "rgba(var(--primary), 0.8)",
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <motion.div
                                  className="opacity-0 hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 pointer-events-none"
                                  initial={{ opacity: 0, y: 10 }}
                                  whileHover={{ opacity: 1, y: 0 }}
                                >
                                  {data.responseTime}ms
                                </motion.div>
                              </motion.div>
                            </div>
                          ))}
                        </div>

                        {/* Y-axis labels */}
                        <div className="absolute inset-y-0 left-0 flex flex-col justify-between pointer-events-none">
                          <div className="text-xs text-muted-foreground">350ms</div>
                          <div className="text-xs text-muted-foreground">175ms</div>
                          <div className="text-xs text-muted-foreground">0ms</div>
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {website.performanceHistory.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {data.date.split("-")[2]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between text-sm text-muted-foreground">
                    <span>
                      Average:{" "}
                      <span className="font-medium text-primary">
                        {Math.round(
                          website.performanceHistory.reduce((acc, data) => acc + data.responseTime, 0) /
                            website.performanceHistory.length,
                        )}
                        ms
                      </span>
                    </span>
                    <span>
                      Min:{" "}
                      <span className="font-medium text-green-500">
                        {Math.min(...website.performanceHistory.map((data) => data.responseTime))}ms
                      </span>
                    </span>
                    <span>
                      Max:{" "}
                      <span className="font-medium text-amber-500">
                        {Math.max(...website.performanceHistory.map((data) => data.responseTime))}ms
                      </span>
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="uptime">
            <motion.div
              className="card-hover-enhanced glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle>Uptime History</CardTitle>
                  <CardDescription>Daily uptime percentage</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <div className="h-full w-full">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 flex items-end">
                          {website.uptimeHistory.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                className="w-full mx-[1px] rounded-t-sm"
                                initial={{ height: 0 }}
                                animate={{
                                  height: animateCharts ? `${data.uptime}%` : "0%",
                                  transition: { duration: 1, delay: index * 0.05 },
                                }}
                                style={{
                                  backgroundColor:
                                    data.uptime < 99 ? "hsla(var(--destructive)/0.6)" : "hsla(var(--primary)/0.6)",
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <motion.div
                                  className="opacity-0 hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 pointer-events-none"
                                  initial={{ opacity: 0, y: 10 }}
                                  whileHover={{ opacity: 1, y: 0 }}
                                >
                                  {data.uptime}%
                                </motion.div>
                              </motion.div>
                            </div>
                          ))}
                        </div>

                        {/* Y-axis labels */}
                        <div className="absolute inset-y-0 left-0 flex flex-col justify-between pointer-events-none">
                          <div className="text-xs text-muted-foreground">100%</div>
                          <div className="text-xs text-muted-foreground">50%</div>
                          <div className="text-xs text-muted-foreground">0%</div>
                        </div>

                        {/* 99.9% line */}
                        <div className="absolute w-full h-[0.5px] bg-muted-foreground/30 top-[0.1%]">
                          <div className="absolute -top-3 right-0 text-xs text-muted-foreground">99.9%</div>
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {website.uptimeHistory.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {data.date.split("-")[2]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between text-sm text-muted-foreground">
                    <span>
                      Average:{" "}
                      <span className="font-medium text-primary">
                        {(
                          website.uptimeHistory.reduce((acc, data) => acc + data.uptime, 0) /
                          website.uptimeHistory.length
                        ).toFixed(2)}
                        %
                      </span>
                    </span>
                    <span>
                      Min:{" "}
                      <span className="font-medium text-amber-500">
                        {Math.min(...website.uptimeHistory.map((data) => data.uptime))}%
                      </span>
                    </span>
                    <span>
                      SLA: <span className="font-medium text-green-500">99.9%</span>
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="errors">
            <motion.div
              className="card-hover-enhanced glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle>Error Log</CardTitle>
                  <CardDescription>Recent errors and incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  {website.recentErrors.length === 0 ? (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-muted-foreground">No errors recorded in the last 30 days</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {website.recentErrors.map((error, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{
                            scale: 1.01,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            transition: { duration: 0.2 },
                          }}
                        >
                          <div className="mt-0.5">
                            <div className="rounded-full bg-destructive/20 p-1">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{error.message}</p>
                              <span className="text-xs text-muted-foreground">{error.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Duration: {error.duration}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full transition-all hover:bg-muted hover:border-primary/30"
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    View Full Error History
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}


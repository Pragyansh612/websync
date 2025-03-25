"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Clock,
  ExternalLink,
  Filter,
  LineChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

// Sample data for the dashboard
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
  },
]

// Sample data for performance chart
const performanceData = [
  { time: "00:00", value: 120 },
  { time: "02:00", value: 110 },
  { time: "04:00", value: 125 },
  { time: "06:00", value: 130 },
  { time: "08:00", value: 140 },
  { time: "10:00", value: 135 },
  { time: "12:00", value: 160 },
  { time: "14:00", value: 155 },
  { time: "16:00", value: 170 },
  { time: "18:00", value: 190 },
  { time: "20:00", value: 185 },
  { time: "22:00", value: 130 },
]

// Sample data for recent alerts
const recentAlerts = [
  {
    id: 1,
    website: "Documentation",
    message: "Website is down",
    time: "5 minutes ago",
    severity: "critical",
  },
  {
    id: 2,
    website: "E-commerce Store",
    message: "High response time detected",
    time: "15 minutes ago",
    severity: "warning",
  },
  {
    id: 3,
    website: "Customer Portal",
    message: "SSL certificate expires in 7 days",
    time: "1 hour ago",
    severity: "info",
  },
]

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [animateChart, setAnimateChart] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0])

  useEffect(() => {
    // Trigger chart animation after component mounts
    setTimeout(() => {
      setAnimateChart(true)
    }, 500)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Dashboard Refreshed",
        description: "All website data has been updated.",
        duration: 3000,
      })
    }, 1000)
  }

  const handleWebsiteClick = (websiteId: number) => {
    router.push(`/dashboard/website/${websiteId}`)
  }

  const filteredWebsites = websites.filter((website) => {
    const matchesSearch =
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || website.status === statusFilter
    return matchesSearch && matchesStatus
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
    <motion.div
      className="container py-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      ref={containerRef}
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemAnimation}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your websites</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="transition-all hover:bg-primary/10 hover:border-primary/30 btn-shine"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Link href="/add-website">
            <Button
              size="sm"
              className="shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:shadow-primary/20 btn-shine"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Website
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={itemAnimation}>
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{websites.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Websites Up</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {websites.filter((w) => w.status === "up").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((websites.filter((w) => w.status === "up").length / websites.length) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Websites Down</CardTitle>
              <X className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
                {websites.filter((w) => w.status === "down").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((websites.filter((w) => w.status === "down").length / websites.length) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="card-hover-enhanced glass-card gradient-border"
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {Math.round(
                  websites
                    .filter((w) => w.status !== "down")
                    .reduce((acc, site) => acc + Number.parseInt(site.responseTime), 0) /
                    websites.filter((w) => w.status !== "down").length,
                )}
                ms
              </div>
              <p className="text-xs text-muted-foreground">-12ms from last week</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemAnimation} style={{ opacity, y }}>
        <Tabs defaultValue="websites" className="space-y-4">
          <TabsList className="bg-muted/60 p-1 rounded-lg">
            <TabsTrigger
              value="websites"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Websites
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Recent Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="websites" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search websites..."
                  className="w-full transition-all border-primary/20 focus-visible:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon" variant="ghost" className="hover:bg-primary/10">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] transition-all border-primary/20 hover:border-primary/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="up">Up</SelectItem>
                    <SelectItem value="down">Down</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="hover:bg-primary/10 hover:border-primary/30">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="rounded-lg border glass-card overflow-hidden gradient-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebsites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No websites found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {filteredWebsites.map((website, index) => (
                        <motion.tr
                          key={website.id}
                          className="cursor-pointer hover:bg-primary/5 transition-colors"
                          onClick={() => handleWebsiteClick(website.id)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(var(--primary), 0.1)" }}
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{website.name}</span>
                              <span className="text-xs text-muted-foreground">{website.url}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                website.status === "up"
                                  ? "outline"
                                  : website.status === "down"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className={
                                website.status === "up"
                                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                                  : website.status === "down"
                                    ? ""
                                    : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500"
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
                          </TableCell>
                          <TableCell>{website.uptime}</TableCell>
                          <TableCell>{website.responseTime}</TableCell>
                          <TableCell>{website.lastChecked}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                                <Link href={`/dashboard/website/${website.id}`}>
                                  <LineChart className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Link>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
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
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="animate-in fade-in-50 zoom-in-95">
                                  <DropdownMenuItem className="cursor-pointer">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    <span>Refresh Status</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    <span>Visit Website</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Edit Settings</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
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
                                      className="mr-2 h-4 w-4"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      <line x1="10" x2="10" y1="11" y2="17" />
                                      <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                    <span>Remove</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="performance" className="space-y-4">
            <motion.div
              className="card-hover-enhanced glass-card gradient-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle className="gradient-text">Response Time (Last 24 Hours)</CardTitle>
                  <CardDescription>Average response time across all monitored websites</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex-1 relative">
                        {/* Simple chart visualization */}
                        <div className="absolute inset-0 flex items-end">
                          {performanceData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                className="w-full bg-gradient-to-t from-primary/80 to-primary/40 mx-[1px] rounded-t-sm"
                                style={{
                                  height: animateChart ? `${(data.value / 200) * 100}%` : "0%",
                                  transitionDelay: `${index * 50}ms`,
                                }}
                                initial={{ height: 0 }}
                                animate={{
                                  height: animateChart ? `${(data.value / 200) * 100}%` : "0%",
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
                                  {data.value}ms
                                </motion.div>
                              </motion.div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {performanceData.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {index % 2 === 0 ? data.time : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="alerts" className="space-y-4">
            <motion.div
              className="card-hover-enhanced glass-card gradient-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <CardTitle className="gradient-text">Recent Alerts</CardTitle>
                  <CardDescription>Notifications and alerts from your monitored websites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAlerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        className="flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
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
                            <p className="text-sm font-medium">{alert.website}</p>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full transition-all hover:bg-primary/10 hover:border-primary/30 btn-shine"
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    View All Alerts
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


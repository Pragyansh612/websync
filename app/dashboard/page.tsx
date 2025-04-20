"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowUpRight, Check, Clock, ExternalLink, Filter, Plus, RefreshCw, Search, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"

type Website = {
  id: string
  name: string
  url: string
  status: string
  uptime?: string
  response_time_ms?: number
  last_checked_at?: string
  error_message?: string
  user_id?: string
}

// Update the Alert type to properly handle the website name
type Alert = {
  id: string
  website_id: string
  website_name?: string
  type: string
  severity: string
  description: string
  created_at: string
  is_resolved: boolean
  websites?: { name: string } | { name: string }[] | null
}

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
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [performanceData, setPerformanceData] = useState<{ time: string; value: number }[]>([])
  const [isMobile, setIsMobile] = useState(false)

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0])

  // Check if the screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Ensure animation happens when we have performance data
  useEffect(() => {
    if (performanceData.length > 0) {
      // Set timeout to allow the component to render first
      const timer = setTimeout(() => {
        setAnimateChart(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [performanceData])

  const fetchData = async () => {
    setIsLoading(true)

    // Get the session using the same method as in Navbar.tsx
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || !session.user) {
      console.error("No authenticated user found")
      toast({
        title: "Authentication Error",
        description: "Please log in to view your dashboard.",
        variant: "destructive",
      })
      router.push("/login")
      setIsLoading(false)
      return
    }

    const userId = session.user.id

    // Fetch websites with their latest check data
    const { data: websitesData, error: websitesError } = await supabase
      .from("websites")
      .select(`
        id, 
        name, 
        url, 
        status,
        last_checked_at,
        user_id
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    console.log(websitesData)

    if (websitesError) {
      console.error("Error fetching websites:", websitesError)
    } else if (websitesData) {
      // For each website, get its latest check data

      const websitesWithStatus = await Promise.all(
        websitesData.map(async (website) => {
          const { data: latestCheck } = await supabase
            .from("website_checks")
            .select("status_code, response_time_ms, is_up, error_message")
            .eq("website_id", website.id)
            .order("timestamp", { ascending: false })
            .limit(1)
            .single()

          // Calculate uptime based on is_up history
          const { data: uptimeData } = await supabase
            .from("website_checks")
            .select("is_up")
            .eq("website_id", website.id)
            .order("timestamp", { ascending: false })
            .limit(100)

          const uptimePercentage = uptimeData && uptimeData.length > 0
            ? ((uptimeData.filter((check) => check.is_up).length / uptimeData.length) * 100).toFixed(2) + "%"
            : "N/A"

          // Fix: Map "active" status to "up" for display
          let displayStatus = "down"
          if (website.status === "active" || website.status === "up" || (latestCheck && latestCheck.is_up)) {
            displayStatus = "up"
          } else if (latestCheck && latestCheck.status_code >= 400 && latestCheck.status_code < 500) {
            displayStatus = "degraded"
          }

          return {
            ...website,
            status: displayStatus,
            uptime: uptimePercentage,
            response_time_ms: latestCheck?.response_time_ms || 0,
            error_message: latestCheck?.error_message,
          }
        }),
      )

      setWebsites(websitesWithStatus)
    }

    if (websitesData) {

      // Get user's website IDs
      const userWebsiteIds = websitesData.map(website => website.id)

      // Fetch alerts only for the user's websites
      const { data: alertsData, error: alertsError } = await supabase
        .from("alerts")
        .select(`
    id,
    website_id,
    type,
    severity,
    description,
    created_at,
    is_resolved,
    websites:website_id (name)
  `)
        .in("website_id", userWebsiteIds.length > 0 ? userWebsiteIds : ['no-websites']) // Use dummy value if no websites
        .order("created_at", { ascending: false })
        .limit(5)

      if (alertsError) {
        console.error("Error fetching alerts:", alertsError)
      } else if (alertsData && alertsData.length > 0) {
        const formattedAlerts = alertsData.map((alert) => {
          // Format code remains the same
          let websiteName = "Unknown Site"

          if (alert.websites) {
            if (Array.isArray(alert.websites)) {
              websiteName = alert.websites.length > 0 && alert.websites[0]?.name ? alert.websites[0].name : "Unknown Site"
            } else if (typeof alert.websites === "object" && alert.websites !== null) {
              websiteName = (alert.websites as { name?: string }).name || "Unknown Site"
            }
          }

          return {
            ...alert,
            website_name: websiteName,
          }
        })

        setRecentAlerts(formattedAlerts)
      } else {
        setRecentAlerts([])
      }
    }

    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    interface PerformanceRecord {
      timestamp: string;
      response_time_ms: number | null;
    }

    let performanceHistoryData: PerformanceRecord[] = []
    let performanceError = null

    if (websitesData && websitesData.length > 0) {
      const response = await supabase
        .from("website_checks")
        .select("timestamp, response_time_ms")
        .eq("website_id", websitesData[0].id)
        .gte("timestamp", oneDayAgo.toISOString())
        .order("timestamp", { ascending: true })

      performanceHistoryData = response.data || []
      performanceError = response.error
    } else {
      console.log("No websites found to fetch performance data for")
    }

    console.log(performanceHistoryData)

    if (performanceError) {
      console.error("Error fetching performance data:", performanceError)
    } else if (performanceHistoryData && performanceHistoryData.length > 0) {
      // Group by hour and calculate average
      const hourlyData: Record<string, number[]> = {}

      performanceHistoryData.forEach((record) => {
        if (!record.response_time_ms) return; // Skip if no response time
        const date = new Date(record.timestamp);
        const hour = date.getHours();
        const hourString = `${hour}:00`;

        if (!hourlyData[hourString]) {
          hourlyData[hourString] = []
        }
        hourlyData[hourString].push(record.response_time_ms)
      })

      // Fill in missing hours with default values
      for (let i = 0; i < 24; i++) {
        const hourString = `${i}:00`;
        if (!hourlyData[hourString]) {
          hourlyData[hourString] = [100]; // Default value
        }
      }

      const chartData = Object.entries(hourlyData).map(([time, values]) => ({
        time,
        value: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
      })).sort((a, b) => {
        return parseInt(a.time) - parseInt(b.time);
      });

      setPerformanceData(chartData)
      setAnimateChart(true) // Make sure chart animates
    } else {
      // Generate sample data if no real data is available
      // const sampleData = Array.from({ length: 24 }, (_, i) => ({
      //   time: `${i}:00`,
      //   value: Math.floor(Math.random() * 100) + 50,
      // }));
      // setPerformanceData(sampleData);
      // setAnimateChart(true);
    }

    setIsLoading(false)
  }

  // Update the refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
    toast({
      title: "Dashboard Refreshed",
      description: "All website data has been updated.",
      duration: 3000,
    })
  }

  useEffect(() => {
    fetchData()

    // Set up a refresh interval (e.g., every 5 minutes)
    const intervalId = setInterval(
      () => {
        fetchData()
      },
      15 * 60 * 1000,
    )

    return () => clearInterval(intervalId)
  }, [])

  const handleWebsiteClick = (websiteId: string) => {
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

  // Render a card for mobile view of each website
  const renderWebsiteCard = (website: Website, index: number) => (
    <motion.div
      key={website.id}
      className="rounded-lg border p-4 mb-4 hover:bg-primary/5 transition-colors cursor-pointer"
      onClick={() => handleWebsiteClick(website.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ backgroundColor: "rgba(var(--primary), 0.1)" }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{website.name}</h3>
          <p className="text-xs text-muted-foreground">{website.url}</p>
        </div>
        <Badge
          variant={website.status === "up" ? "outline" : website.status === "down" ? "destructive" : "secondary"}
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
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Uptime</p>
          <p>{website.uptime || "N/A"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Response</p>
          <p>{website.response_time_ms ? `${website.response_time_ms}ms` : "N/A"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground">Last Checked</p>
          <p>{website.last_checked_at ? new Date(website.last_checked_at).toLocaleString() : "Never"}</p>
        </div>
      </div>
    </motion.div>
  )

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
      <motion.div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" variants={itemAnimation}>
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
              <p className="text-xs text-muted-foreground">Monitor your sites</p>
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
                {websites.length > 0
                  ? Math.round((websites.filter((w) => w.status === "up").length / websites.length) * 100)
                  : 0}
                % of total
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
                {websites.length > 0
                  ? Math.round((websites.filter((w) => w.status === "down").length / websites.length) * 100)
                  : 0}
                % of total
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
                {websites.length > 0 && websites.some(w => w.response_time_ms && w.response_time_ms > 0)
                  ? Math.round(
                    websites
                      .filter((w) => w.status !== "down" && w.response_time_ms && w.response_time_ms > 0)
                      .reduce((acc, site) => acc + (site.response_time_ms || 0), 0) /
                    websites.filter((w) => w.status !== "down" && w.response_time_ms && w.response_time_ms > 0).length,
                  )
                  : 0}
                ms
              </div>
              <p className="text-xs text-muted-foreground">-12ms from last week</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemAnimation} style={{ opacity, y }}>
        <Tabs defaultValue="websites" className="space-y-4">
          <TabsList className="bg-muted/60 p-1 rounded-lg w-full flex overflow-x-auto">
            <TabsTrigger
              value="websites"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10 flex-1"
            >
              Websites
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10 flex-1"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10 flex-1"
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
                  <SelectTrigger className="w-full sm:w-[180px] transition-all border-primary/20 hover:border-primary/50">
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

            {/* Responsive handling for websites display */}
            {isMobile ? (
              // Mobile view - cards
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredWebsites.length === 0 ? (
                  <div className="text-center py-8">No websites found matching your criteria</div>
                ) : (
                  <AnimatePresence>
                    {filteredWebsites.map((website, index) => renderWebsiteCard(website, index))}
                  </AnimatePresence>
                )}
              </div>
            ) : (
              // Desktop view - table
              <div className="rounded-lg border glass-card overflow-hidden gradient-border">
                <div className="overflow-x-auto">
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
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : filteredWebsites.length === 0 ? (
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
                              <TableCell>{website.uptime || "N/A"}</TableCell>
                              <TableCell>
                                {website.response_time_ms ? `${website.response_time_ms}ms` : "N/A"}
                              </TableCell>
                              <TableCell>
                                {website.last_checked_at
                                  ? new Date(website.last_checked_at).toLocaleTimeString()
                                  : "Never"}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
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
                <CardContent className="h-[300px] sm:h-[300px]">
                  <div className="h-full w-full">
                    {performanceData.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground">No performance data available yet</p>
                        </div>
                      </div>
                    ) : (
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
                        <div className="h-6 flex overflow-x-auto">
                          {performanceData.map((data, index) => (
                            <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                              {index % (isMobile ? 4 : 2) === 0 ? data.time : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                            <p className="text-sm font-medium">{alert.website_name}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
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

"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Check,
  Clock,
  ExternalLink,
  RefreshCw,
  X,
  AlertCircle,
  ArrowUpRight,
  Settings
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { format, formatDistance, subDays } from "date-fns"
import { supabase } from "@/lib/supabaseClient"

interface WebsiteCheck {
  id: string
  website_id: string
  timestamp: string
  status_code: number
  response_time_ms: number
  is_up: boolean
  error_message: string | null
  ssl_expiry_date: string | null
  ssl_valid: boolean | null
}

interface Website {
  id: string
  user_id: string
  url: string
  name: string
  status: string
  monitoring_interval: number
  created_at: string
  last_checked_at: string | null
}

interface Alert {
  id: string
  website_id: string
  type: string
  severity: string
  description: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
}

interface RouteCheck {
  id: string
  route_id: string
  status_code: number
  is_up: boolean
  response_time_ms: number
  checked_at: string
  error_message: string | null
}

interface WebsiteData {
  website: Website | null
  checks: WebsiteCheck[]
  alerts: Alert[]
  uptimePercentage: number
  avgResponseTime: number
  recentErrors: number
}

export default function WebsiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [animateCharts, setAnimateCharts] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [performanceHistory, setPerformanceHistory] = useState<{ date: string, responseTime: number }[]>([])
  const [uptimeHistory, setUptimeHistory] = useState<{ date: string, uptime: number }[]>([])
  const [errorLog, setErrorLog] = useState<{ message: string, date: string, duration: string }[]>([])

  const websiteId = params.id as string

  const fetchWebsiteData = async () => {
    setIsLoading(true)
    try {
      // Fetch website details
      const { data: website, error: websiteError } = await supabase
        .from('websites')
        .select('*')
        .eq('id', websiteId)
        .single()

      if (websiteError) throw websiteError

      // Fetch website checks
      const { data: checks, error: checksError } = await supabase
        .from('website_checks')
        .select('*')
        .eq('website_id', websiteId)
        .order('timestamp', { ascending: false })
        .limit(100)

      if (checksError) throw checksError

      // Fetch alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('website_id', websiteId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (alertsError) throw alertsError

      // Calculate uptime percentage
      const recentChecks = checks.filter(check =>
        new Date(check.timestamp) > subDays(new Date(), 30)
      )

      const uptimePercentage = recentChecks.length > 0
        ? (recentChecks.filter(check => check.is_up).length / recentChecks.length) * 100
        : 100

      // Calculate average response time
      const recentResponseTimes = recentChecks
        .filter(check => check.is_up && check.response_time_ms > 0)
        .map(check => check.response_time_ms)

      const avgResponseTime = recentResponseTimes.length > 0
        ? Math.round(recentResponseTimes.reduce((sum, time) => sum + time, 0) / recentResponseTimes.length)
        : 0

      // Count recent errors
      const recentErrors = recentChecks.filter(check => !check.is_up).length

      // Prepare performance history data
      const last14DaysChecks = checks
        .filter(check => new Date(check.timestamp) > subDays(new Date(), 14))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

      const performanceData: { date: string, responseTime: number }[] = []
      const uptimeData: { date: string, uptime: number }[] = []

      // Group checks by day
      const checksByDay = last14DaysChecks.reduce((acc, check) => {
        const day = check.timestamp.split('T')[0]
        if (!acc[day]) acc[day] = []
        acc[day].push(check)
        return acc
      }, {} as Record<string, WebsiteCheck[]>)

      // Get last 14 days
      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = subDays(new Date(), 13 - i)
        return format(date, 'yyyy-MM-dd')
      })

      // Prepare data for each day
      last14Days.forEach(day => {
        const dayChecks = checksByDay[day] || []

        // Calculate average response time for the day
        const dayResponseTimes = dayChecks
          .filter((check: any) => check.is_up && check.response_time_ms > 0)
          .map((check: any) => check.response_time_ms)

        const avgDayResponseTime = dayResponseTimes.length > 0
          ? Math.round(dayResponseTimes.reduce((sum: any, time: any) => sum + time, 0) / dayResponseTimes.length)
          : 0

        performanceData.push({
          date: day,
          responseTime: avgDayResponseTime || 0
        })

        // Calculate uptime for the day
        const dayUptime = dayChecks.length > 0
          ? (dayChecks.filter((check: any) => check.is_up).length / dayChecks.length) * 100
          : 100

        uptimeData.push({
          date: day,
          uptime: Number(dayUptime.toFixed(2))
        })
      })

      // Prepare error log data
      const errorLogData = alerts
        .filter(alert => alert.type === 'downtime' || alert.type === 'error')
        .map(alert => {
          const duration = alert.resolved_at
            ? formatDistance(new Date(alert.resolved_at), new Date(alert.created_at))
            : 'Ongoing'

          return {
            message: alert.description,
            date: format(new Date(alert.created_at), 'MMM dd, yyyy HH:mm'),
            duration
          }
        })

      setWebsiteData({
        website,
        checks,
        alerts,
        uptimePercentage: Number(uptimePercentage.toFixed(2)),
        avgResponseTime,
        recentErrors
      })

      setPerformanceHistory(performanceData)
      setUptimeHistory(uptimeData)
      setErrorLog(errorLogData)

      setIsLoading(false)

      // Trigger chart animation after data is loaded
      setTimeout(() => {
        setAnimateCharts(true)
      }, 500)

    } catch (error) {
      console.error('Error fetching website data:', error)
      setIsLoading(false)
      toast({
        title: "Error loading website data",
        description: "An error occurred while fetching website data.",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }

  useEffect(() => {
    fetchWebsiteData()
  }, [websiteId])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchWebsiteData()
      toast({
        title: "Website Status Refreshed",
        description: "The latest status has been fetched.",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error refreshing website data:', error)
      toast({
        title: "Error refreshing data",
        description: "An error occurred while refreshing website data.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusInfo = useMemo(() => {
    if (!websiteData?.website) return { status: 'unknown', label: 'Unknown' }

    const latestCheck = websiteData.checks[0]
    if (!latestCheck) return { status: 'unknown', label: 'Unknown' }

    return {
      status: latestCheck.is_up ? 'up' : 'down',
      label: latestCheck.is_up ? 'Up' : 'Down'
    }
  }, [websiteData])

  const getLastCheckedTime = useMemo(() => {
    if (!websiteData?.website?.last_checked_at) return 'Never'
    return formatDistance(new Date(websiteData.website.last_checked_at), new Date(), { addSuffix: true })
  }, [websiteData])

  const getCheckInterval = useMemo(() => {
    if (!websiteData?.website?.monitoring_interval) return 'Not set'
    const interval = websiteData.website.monitoring_interval
    // Convert seconds to minutes and handle zero case
    const minutes = Math.floor(interval / 60)
    return minutes > 0 ? `${minutes} minutes` : `${interval} seconds`
  }, [websiteData])

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

  if (isLoading) {
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

  if (!websiteData || !websiteData.website) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold">Website not found</h2>
            <p className="text-muted-foreground mt-2">The requested website could not be found.</p>
            <div className="mt-4">
              <Link href="/dashboard">
                <Button>Go back to Dashboard</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
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
              {websiteData.website.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <a
                href={websiteData.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center"
              >
                {websiteData.website.url}
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
            <Link href={`/dashboard/website/${websiteData.website.id}/settings`}>
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
          className={`card-hover-enhanced glass-card ${getStatusInfo.status === "down" ? "border-destructive/50" : ""}`}
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {getStatusInfo.status === "up" ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : getStatusInfo.status === "down" ? (
                <X className="h-4 w-4 text-destructive" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    getStatusInfo.status === "up" ? "outline" : getStatusInfo.status === "down" ? "destructive" : "secondary"
                  }
                  className={
                    getStatusInfo.status === "up"
                      ? "bg-green-500/10 text-green-500"
                      : getStatusInfo.status === "down"
                        ? ""
                        : "bg-yellow-500/10 text-yellow-500"
                  }
                >
                  <span className="flex items-center gap-1">
                    {getStatusInfo.status === "up" ? (
                      <Check className="h-3 w-3" />
                    ) : getStatusInfo.status === "down" ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {getStatusInfo.label}
                  </span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last checked {getLastCheckedTime}</p>
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
                {websiteData.uptimePercentage}%
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
                {websiteData.avgResponseTime}ms
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
                {websiteData.recentErrors}
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
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">URL</h3>
                        <p>{websiteData.website.url}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                        <Badge
                          variant={
                            getStatusInfo.status === "up" ? "outline" : getStatusInfo.status === "down" ? "destructive" : "secondary"
                          }
                          className={
                            getStatusInfo.status === "up"
                              ? "bg-green-500/10 text-green-500"
                              : getStatusInfo.status === "down"
                                ? ""
                                : "bg-yellow-500/10 text-yellow-500"
                          }
                        >
                          <span className="flex items-center gap-1">
                            {getStatusInfo.status === "up" ? (
                              <Check className="h-3 w-3" />
                            ) : getStatusInfo.status === "down" ? (
                              <X className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {getStatusInfo.label}
                          </span>
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Check Interval</h3>
                        <p>{getCheckInterval}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Added On</h3>
                        <p>{format(new Date(websiteData.website.created_at), 'MMM dd, yyyy')}</p>
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
                            {performanceHistory.map((data, index) => (
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
                        </div>
                        <div className="h-6 flex">
                          {performanceHistory.map((data, index) => (
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
                            {uptimeHistory.map((data, index) => (
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
                        </div>
                        <div className="h-6 flex">
                          {uptimeHistory.map((data, index) => (
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
                          {performanceHistory.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                className="w-full bg-gradient-to-t from-blue-500/80 to-blue-400/40 mx-[1px] rounded-t-sm"
                                initial={{ height: 0 }}
                                animate={{
                                  height: animateCharts ? `${(data.responseTime / 500) * 100}%` : "0%",
                                  transition: { duration: 1, delay: index * 0.05 },
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
                                  {data.responseTime}ms
                                </motion.div>
                              </motion.div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {performanceHistory.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {index % 2 === 0 ? format(new Date(data.date), 'MMM dd') : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Lower response times indicate better website performance.
                  </p>
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
                  <CardTitle>Uptime Statistics</CardTitle>
                  <CardDescription>Daily uptime percentages</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <div className="h-full w-full">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 flex items-end">
                          {uptimeHistory.map((data, index) => (
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
                                    data.uptime < 95 ? "hsla(var(--destructive)/0.7)" :
                                      data.uptime < 99 ? "hsla(var(--warning)/0.7)" : "hsla(var(--success)/0.7)",
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
                      </div>
                      <div className="h-6 flex">
                        {uptimeHistory.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {index % 2 === 0 ? format(new Date(data.date), 'MMM dd') : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
                      <span className="text-xs">99-100%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
                      <span className="text-xs">95-99%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
                      <span className="text-xs">&lt;95%</span>
                    </div>
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
                  <CardDescription>Recent downtime and error events</CardDescription>
                </CardHeader>
                <CardContent>
                  {errorLog.length > 0 ? (
                    <div className="space-y-4">
                      {errorLog.map((error, index) => (
                        <motion.div
                          key={index}
                          className="p-4 rounded-lg border border-border bg-background/80 hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                              </div>
                              <div>
                                <p className="font-medium">{error.message}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {error.date}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={error.duration === 'Ongoing' ? 'bg-destructive/10 text-destructive' : 'bg-muted'}
                            >
                              {error.duration}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-green-500/10 p-3 mb-4">
                        <Check className="h-6 w-6 text-green-500" />
                      </div>
                      <h3 className="text-lg font-medium">No errors detected</h3>
                      <p className="text-sm text-muted-foreground max-w-md mt-1">
                        Your website has been operating without any detected errors or downtime events.
                      </p>
                    </div>
                  )}
                </CardContent>
                {errorLog.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      View All Errors
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
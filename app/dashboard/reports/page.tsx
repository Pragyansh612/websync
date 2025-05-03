"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Calendar, Download, FileText, LineChart, RefreshCw, Share2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

// Define types for our data
type WebsiteCheck = {
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

type Website = {
  id: string
  user_id: string
  url: string
  name: string
  status: string
  monitoring_interval: number
  created_at: string
  last_checked_at: string
}

type Alert = {
  id: string
  website_id: string
  type: string
  severity: string
  description: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
}

type Report = {
  id: string;
  title: string;
  date: string;
  type: string;
  format: string;
  size: string;
  website_id?: string | null;
}


export default function ReportsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [timeRange, setTimeRange] = useState("7days")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [animateChart, setAnimateChart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [websites, setWebsites] = useState<Website[]>([])
  const [websiteChecks, setWebsiteChecks] = useState<WebsiteCheck[]>([])
  const [performanceData, setPerformanceData] = useState<{ date: string, avgResponseTime: number, uptime: number, errors: number }[]>([])
  const [websitePerformance, setWebsitePerformance] = useState<{
    name: string,
    url: string,
    avgResponseTime: number,
    uptime: number,
    errors: number,
    trend: string
  }[]>([])
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      fetchData(timeRange)
    }

    checkSession()
  }, [supabase, router, timeRange])

  const getTimeRangeDisplay = (range: string): string => {
    switch (range) {
      case '24hours':
        return 'Last 24 Hours';
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '90days':
        return 'Last 90 Days';
      default:
        return 'Last 7 Days';
    }
  }

  const fetchData = async (range: string) => {
    setIsLoading(true)
    
    try {
      // Get user ID
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Authentication error')
      }
      
      // Calculate the correct start date based on the selected range
      const now = new Date()
      let startDate = new Date()
      
      switch (range) {
        case '24hours':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours in milliseconds
          break
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days in milliseconds
          break
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days in milliseconds
          break
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days in milliseconds
          break
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Default to 7 days
      }
      
      console.log(`Filtering from ${startDate.toISOString()} to ${now.toISOString()} for range: ${range}`)
      
      // Fetch user's websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select('*')
        .eq('user_id', user.id)
      
      if (websitesError) {
        throw new Error('Failed to fetch websites')
      }
      
      setWebsites(websitesData || [])
      
      // If no websites, return early
      if (!websitesData || websitesData.length === 0) {
        setIsLoading(false)
        return
      }
      
      // Get all website IDs
      const websiteIds = websitesData.map(website => website.id)
      
      // Fetch website checks for these websites within the time range
      const { data: checksData, error: checksError } = await supabase
        .from('website_checks')
        .select('*')
        .in('website_id', websiteIds)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', now.toISOString())
        .order('timestamp', { ascending: true })
      
      if (checksError) {
        throw new Error('Failed to fetch website checks')
      }
      
      console.log(`Found ${checksData?.length || 0} website checks in the selected time range`)
      setWebsiteChecks(checksData || [])
      
      // Fetch alerts for these websites within the time range
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .in('website_id', websiteIds)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString())
        .order('created_at', { ascending: false })
      
      if (alertsError) {
        throw new Error('Failed to fetch alerts')
      }
      
      console.log(`Found ${alertsData?.length || 0} alerts in the selected time range`)
      
      // Generate reports based on alerts and checks
      const generatedReports: Report[] = []
      
      // Generate a performance report
      if (checksData && checksData.length > 0) {
        generatedReports.push({
          id: 'perf-' + now.getTime(),
          title: `Performance Report (${getTimeRangeDisplay(range)})`,
          date: now.toISOString(),
          type: 'performance',
          format: 'PDF',
          size: '1.2 MB'
        })
      }
      
      // Generate an uptime report
      if (checksData && checksData.length > 0) {
        generatedReports.push({
          id: 'uptime-' + now.getTime(),
          title: `Uptime Report (${getTimeRangeDisplay(range)})`,
          date: now.toISOString(),
          type: 'uptime',
          format: 'CSV',
          size: '856 KB'
        })
      }
      
      // Generate an error report if there are alerts
      if (alertsData && alertsData.length > 0) {
        generatedReports.push({
          id: 'errors-' + now.getTime(),
          title: `Error Analysis (${getTimeRangeDisplay(range)})`,
          date: now.toISOString(),
          type: 'errors',
          format: 'PDF',
          size: '2.4 MB'
        })
        
        // Add website-specific reports for sites with issues
        const alertsByWebsite: Record<string, any[]> = {}
        alertsData.forEach(alert => {
          if (!alertsByWebsite[alert.website_id]) {
            alertsByWebsite[alert.website_id] = []
          }
          alertsByWebsite[alert.website_id].push(alert)
        })
        
        // For each website with alerts, create a report
        Object.keys(alertsByWebsite).forEach(websiteId => {
          const website = websitesData.find(w => w.id === websiteId)
          if (website && alertsByWebsite[websiteId].length > 0) {
            generatedReports.push({
              id: 'site-' + website.id + '-' + now.getTime(),
              title: `${website.name || website.url} Issue Report`,
              date: alertsByWebsite[websiteId][0].created_at,
              type: 'errors',
              format: 'PDF',
              size: '1.1 MB',
              website_id: websiteId
            })
          }
        })
      }
      
      // Sort reports by date (newest first)
      generatedReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      setReports(generatedReports)
      
      // Process website checks into performance data for charts
      processPerformanceData(checksData || [], websitesData, range)
      
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
      setAnimateChart(true)
    }
  }

  const processPerformanceData = (checks: WebsiteCheck[], sites: Website[], timeRange: string) => {
    // Define the time interval and number of data points based on the time range
    let interval: 'day' | 'hour'
    let dataPoints: number
    
    switch (timeRange) {
      case '24hours':
        interval = 'hour'
        dataPoints = 24
        break
      case '7days':
        interval = 'day'  
        dataPoints = 7
        break
      case '30days':
        interval = 'day'
        dataPoints = 30
        break
      case '90days':
        interval = 'day'
        dataPoints = 90
        break
      default:
        interval = 'day'
        dataPoints = 7
    }
    
    // Generate time buckets for the selected range
    const now = new Date()
    const timeBuckets: Record<string, WebsiteCheck[]> = {}
    
    // Create empty buckets for all intervals in our range
    for (let i = 0; i < dataPoints; i++) {
      let bucketDate: Date
      
      if (interval === 'hour') {
        bucketDate = new Date(now.getTime() - i * 60 * 60 * 1000)
        const bucketKey = bucketDate.toISOString().slice(0, 13) // Format: YYYY-MM-DDTHH
        timeBuckets[bucketKey] = []
      } else {
        bucketDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const bucketKey = bucketDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
        timeBuckets[bucketKey] = []
      }
    }
    
    // Place checks into appropriate buckets
    checks.forEach(check => {
      const checkDate = new Date(check.timestamp)
      let bucketKey: string
      
      if (interval === 'hour') {
        bucketKey = checkDate.toISOString().slice(0, 13) // Format: YYYY-MM-DDTHH
      } else {
        bucketKey = checkDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
      }
      
      if (timeBuckets[bucketKey]) {
        timeBuckets[bucketKey].push(check)
      }
    })
    
    // Calculate statistics for each bucket
    const stats = Object.keys(timeBuckets).map(date => {
      const checksInBucket = timeBuckets[date]
      
      // Calculate avg response time
      const responseTimes = checksInBucket
        .filter(check => check.response_time_ms !== null)
        .map(check => check.response_time_ms)
      const avgResponseTime = responseTimes.length > 0 
        ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) 
        : 0
      
      // Calculate uptime percentage
      const totalChecks = checksInBucket.length
      const upChecks = checksInBucket.filter(check => check.is_up).length
      const uptime = totalChecks > 0 ? +(upChecks / totalChecks * 100).toFixed(2) : 100
      
      // Count errors
      const errors = checksInBucket.filter(check => !check.is_up).length
      
      // Format the display date based on interval
      let displayDate = date
      if (interval === 'hour') {
        const hourDate = new Date(date + ':00:00.000Z')
        displayDate = hourDate.toISOString()
      }
      
      return {
        date: displayDate,
        avgResponseTime,
        uptime,
        errors
      }
    })
    
    // Sort by date (oldest to newest)
    stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Take only the number of data points we need
    // Show the most recent data points
    const chartData = stats.slice(-Math.min(dataPoints, 7))
    
    setPerformanceData(chartData)
    
    // Process website-specific performance
    const websiteStats = sites.map(website => {
      const websiteChecks = checks.filter(check => check.website_id === website.id)
      
      // Calculate avg response time
      const responseTimes = websiteChecks
        .filter(check => check.response_time_ms !== null)
        .map(check => check.response_time_ms)
      const avgResponseTime = responseTimes.length > 0 
        ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) 
        : 0
      
      // Calculate uptime percentage
      const totalChecks = websiteChecks.length
      const upChecks = websiteChecks.filter(check => check.is_up).length
      const uptime = totalChecks > 0 ? +(upChecks / totalChecks * 100).toFixed(2) : 100
      
      // Count errors
      const errors = websiteChecks.filter(check => !check.is_up).length
      
      // Determine trend based on recent data (last 3 vs previous)
      let trend = "stable"
      if (websiteChecks.length >= 6) {
        const recent = websiteChecks.slice(-3)
        const previous = websiteChecks.slice(-6, -3)
        
        const recentUptime = recent.filter(check => check.is_up).length / recent.length * 100
        const previousUptime = previous.filter(check => check.is_up).length / previous.length * 100
        
        if (recentUptime > previousUptime + 1) {
          trend = "improving"
        } else if (recentUptime < previousUptime - 1) {
          trend = "degrading"
        }
        
        if (recentUptime < 99) {
          trend = "critical"
        }
      }
      
      return {
        name: website.name || website.url,
        url: website.url,
        avgResponseTime,
        uptime,
        errors,
        trend
      }
    })
    
    setWebsitePerformance(websiteStats)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData(timeRange).then(() => {
      setIsRefreshing(false)
      toast({
        title: "Reports Refreshed",
        description: "All report data has been updated.",
        duration: 3000,
      })
    })
  }

  const handleDownload = (reportId: string) => {
    const report = reports.find(r => r.id === reportId)

    toast({
      title: "Report Downloaded",
      description: `${report?.title || 'Your report'} has been downloaded successfully.`,
      duration: 3000,
    })
  }

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    fetchData(value)
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

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="container py-6 space-y-6" initial="hidden" animate="visible" variants={containerAnimation}>
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemAnimation}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight gradient-text">Reports</h1>
          <p className="text-muted-foreground">View analytics and performance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px] transition-all border-primary/20 hover:border-primary/50">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
      </motion.div>

      <motion.div variants={itemAnimation}>
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="bg-muted/60 p-1 rounded-lg">
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
              Errors
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="transition-all data-[state=active]:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/10 data-[state=active]:to-indigo-600/10"
            >
              Saved Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {performanceData.length === 0 ? (
              <Card className="glass-card gradient-border">
                <CardHeader>
                  <CardTitle>No data available</CardTitle>
                  <CardDescription>
                    {websites.length === 0
                      ? "You need to add websites to monitor before you can view performance reports."
                      : "No performance data available for the selected time range."}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={websites.length === 0 ? "/dashboard/websites/add" : "/dashboard"}>
                      {websites.length === 0 ? "Add Website" : "Go to Dashboard"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <>
                <Card className="glass-card gradient-border">
                  <CardHeader>
                    <CardTitle className="gradient-text">Response Time Trends</CardTitle>
                    <CardDescription>Average response time across all monitored websites</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="h-full w-full">
                      <div className="h-full w-full flex flex-col">
                        <div className="flex-1 relative">
                          {/* Chart visualization */}
                          <div className="absolute inset-0 flex items-end">
                            {performanceData.map((data, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                                <motion.div
                                  className="w-full bg-gradient-to-t from-primary/80 to-primary/40 mx-[1px] rounded-t-sm"
                                  style={{
                                    height: animateChart ? `${(data.avgResponseTime / 1000) * 100}%` : "0%",
                                    transitionDelay: `${index * 50}ms`,
                                  }}
                                  initial={{ height: 0 }}
                                  animate={{
                                    height: `${(data.avgResponseTime / 1000) * 100}%`,
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
                                    {data.avgResponseTime}ms
                                  </motion.div>
                                </motion.div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h-6 flex">
                          {performanceData.map((data, index) => (
                            <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                              {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Average:{" "}
                      <span className="font-medium text-primary">
                        {Math.round(
                          performanceData.reduce((acc, data) => acc + data.avgResponseTime, 0) / performanceData.length,
                        )}
                        ms
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="glass-card gradient-border">
                  <CardHeader>
                    <CardTitle>Website Performance</CardTitle>
                    <CardDescription>Performance metrics for individual websites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {websitePerformance.map((website, index) => (
                        <motion.div
                          key={index}
                          className="rounded-lg border p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            transition: { duration: 0.2 },
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{website.name}</h3>
                              <p className="text-xs text-muted-foreground">{website.url}</p>
                            </div>
                            {website.trend === "improving" ? (
                              <div className="flex items-center text-green-500 text-xs">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                Improving
                              </div>
                            ) : website.trend === "degrading" ? (
                              <div className="flex items-center text-yellow-500 text-xs">
                                <ArrowDown className="h-3 w-3 mr-1" />
                                Degrading
                              </div>
                            ) : website.trend === "critical" ? (
                              <div className="flex items-center text-destructive text-xs">
                                <ArrowDown className="h-3 w-3 mr-1" />
                                Critical
                              </div>
                            ) : (
                              <div className="flex items-center text-blue-500 text-xs">Stable</div>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Response</p>
                              <p
                                className={`text-sm font-medium ${website.avgResponseTime > 500
                                    ? "text-yellow-500"
                                    : website.avgResponseTime > 1000
                                      ? "text-destructive"
                                      : website.avgResponseTime === 0
                                        ? "text-destructive"
                                        : "text-primary"
                                  }`}
                              >
                                {website.avgResponseTime > 0 ? `${website.avgResponseTime}ms` : "Down"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Uptime</p>
                              <p
                                className={`text-sm font-medium ${website.uptime < 99.9
                                    ? "text-yellow-500"
                                    : website.uptime < 99
                                      ? "text-destructive"
                                      : "text-green-500"
                                  }`}
                              >
                                {website.uptime.toFixed(2)}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Errors</p>
                              <p
                                className={`text-sm font-medium ${website.errors > 0
                                    ? "text-yellow-500"
                                    : website.errors > 2
                                      ? "text-destructive"
                                      : "text-green-500"
                                  }`}
                              >
                                {website.errors}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs hover:bg-primary/10 hover:border-primary/30"
                              asChild
                            >
                              <Link href={`/dashboard/website/${websites.find(w => w.name === website.name || w.url === website.url)?.id}`}>
                                <LineChart className="h-3 w-3 mr-2" />
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="uptime" className="space-y-6">
            {performanceData.length === 0 ? (
              <Card className="glass-card gradient-border">
                <CardHeader>
                  <CardTitle>No data available</CardTitle>
                  <CardDescription>
                    {websites.length === 0
                      ? "You need to add websites to monitor before you can view uptime reports."
                      : "No uptime data available for the selected time range."}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={websites.length === 0 ? "/dashboard/websites/add" : "/dashboard"}>
                      {websites.length === 0 ? "Add Website" : "Go to Dashboard"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="glass-card gradient-border">
                <CardHeader>
                  <CardTitle className="gradient-text">Uptime Trends</CardTitle>
                  <CardDescription>Uptime percentage across all monitored websites</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex-1 relative">
                        {/* Chart visualization */}
                        <div className="absolute inset-0 flex items-end">
                          {performanceData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                className="w-full mx-[1px] rounded-t-sm"
                                style={{
                                  height: animateChart ? `${data.uptime}%` : "0%",
                                  backgroundColor:
                                    data.uptime < 99.9
                                      ? "hsla(var(--yellow-500), 0.6)"
                                      : data.uptime < 99
                                        ? "hsla(var(--destructive), 0.6)"
                                        : "hsla(var(--primary), 0.6)",
                                  transitionDelay: `${index * 50}ms`,
                                }}
                                initial={{ height: 0 }}
                                animate={{
                                  height: `${data.uptime}%`,
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
                                  {data.uptime.toFixed(2)}%
                                </motion.div>
                              </motion.div>
                            </div>
                          ))}
                        </div>

                        {/* 99.9% SLA line */}
                        <div className="absolute w-full h-[0.5px] bg-muted-foreground/30 bottom-[99.9%]">
                          <div className="absolute -top-3 right-0 text-xs text-muted-foreground">99.9% SLA</div>
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {performanceData.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Average:{" "}
                    <span className="font-medium text-primary">
                      {(performanceData.reduce((acc, data) => acc + data.uptime, 0) / performanceData.length).toFixed(2)}%
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            {performanceData.length === 0 ? (
              <Card className="glass-card gradient-border">
                <CardHeader>
                  <CardTitle>No data available</CardTitle>
                  <CardDescription>
                    {websites.length === 0
                      ? "You need to add websites to monitor before you can view error reports."
                      : "No error data available for the selected time range."}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={websites.length === 0 ? "/dashboard/websites/add" : "/dashboard"}>
                      {websites.length === 0 ? "Add Website" : "Go to Dashboard"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="glass-card gradient-border">
                <CardHeader>
                  <CardTitle className="gradient-text">Error Trends</CardTitle>
                  <CardDescription>Number of errors across all monitored websites</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="h-full w-full">
                    <div className="h-full w-full flex flex-col">
                      <div className="flex-1 relative">
                        {/* Chart visualization */}
                        <div className="absolute inset-0 flex items-end">
                          {performanceData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                className="w-full bg-gradient-to-t from-destructive/80 to-destructive/40 mx-[1px] rounded-t-sm"
                                style={{
                                  height: animateChart ? `${Math.min((data.errors / 10) * 100, 100)}%` : "0%",
                                  transitionDelay: `${index * 50}ms`,
                                }}
                                initial={{ height: 0 }}
                                animate={{
                                  height: `${Math.min((data.errors / 10) * 100, 100)}%`,
                                  transition: { duration: 1, delay: index * 0.05 },
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "rgba(var(--destructive), 0.8)",
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <motion.div
                                  className="opacity-0 hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 pointer-events-none"
                                  initial={{ opacity: 0, y: 10 }}
                                  whileHover={{ opacity: 1, y: 0 }}
                                >
                                  {data.errors} errors
                                </motion.div>
                              </motion.div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-6 flex">
                        {performanceData.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="font-medium text-destructive">
                      {performanceData.reduce((acc, data) => acc + data.errors, 0)} errors
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle className="gradient-text">Saved Reports</CardTitle>
                <CardDescription>Download previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No saved reports yet.</p>
                    </div>
                  ) : (
                    <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-2">
                      {reports.map((report, index) => (
                        <motion.div
                          key={index}
                          variants={itemAnimation}
                          className="flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-primary/5 hover:border-primary/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-full p-2 bg-primary/10">
                              {report.type === "performance" ? (
                                <LineChart className="h-4 w-4 text-primary" />
                              ) : report.type === "uptime" ? (
                                <RefreshCw className="h-4 w-4 text-green-500" />
                              ) : report.type === "errors" ? (
                                <FileText className="h-4 w-4 text-destructive" />
                              ) : report.type === "security" ? (
                                <Share2 className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{report.title}</p>
                              <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(report.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                                <span className="mx-1">•</span>
                                {report.format} <span className="mx-1">•</span> {report.size}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(report.id)}
                            className="hover:bg-primary/10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="transition-all hover:bg-primary/80">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
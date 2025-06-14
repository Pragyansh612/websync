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
    const chartData = stats.slice(-dataPoints)

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

  // Add these functions to your ReportsPage component

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => headers.map(header => {
        const key = header.toLowerCase().replace(/ /g, '_').replace(/[()%]/g, '');
        let value = '';

        switch (key) {
          case 'date':
            value = new Date(row.date).toLocaleDateString();
            break;
          case 'avg_response_time_ms':
            value = row.avgResponseTime?.toString() || '0';
            break;
          case 'uptime_':
            value = row.uptime?.toFixed(2) || '0';
            break;
          case 'errors':
            value = row.errors?.toString() || '0';
            break;
          default:
            value = row[key]?.toString() || '';
        }

        // Escape commas and quotes in values
        if (value.includes(',') || value.includes('"')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      }).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportPerformanceData = () => {
    const headers = ['Date', 'Avg Response Time (ms)', 'Uptime (%)', 'Errors'];
    exportToCSV(performanceData, `performance_report_${getTimeRangeDisplay(timeRange).replace(/ /g, '_').toLowerCase()}`, headers);

    toast({
      title: "Export Successful",
      description: "Performance data has been exported to CSV.",
      duration: 3000,
    });
  };

  const exportUptimeData = () => {
    const uptimeData = performanceData.map(data => ({
      date: data.date,
      uptime: data.uptime,
      errors: data.errors
    }));

    const headers = ['Date', 'Uptime (%)', 'Errors'];
    exportToCSV(uptimeData, `uptime_report_${getTimeRangeDisplay(timeRange).replace(/ /g, '_').toLowerCase()}`, headers);

    toast({
      title: "Export Successful",
      description: "Uptime data has been exported to CSV.",
      duration: 3000,
    });
  };

  const exportErrorData = () => {
    const errorData = performanceData.map(data => ({
      date: data.date,
      errors: data.errors,
      uptime: data.uptime
    }));

    const headers = ['Date', 'Errors', 'Uptime (%)'];
    exportToCSV(errorData, `error_report_${getTimeRangeDisplay(timeRange).replace(/ /g, '_').toLowerCase()}`, headers);

    toast({
      title: "Export Successful",
      description: "Error data has been exported to CSV.",
      duration: 3000,
    });
  };

  const exportWebsitePerformanceData = () => {
    const headers = ['Website Name', 'URL', 'Avg Response Time (ms)', 'Uptime (%)', 'Errors', 'Trend'];
    const data = websitePerformance.map(website => ({
      website_name: website.name,
      url: website.url,
      avg_response_time_ms: website.avgResponseTime,
      uptime_: website.uptime,
      errors: website.errors,
      trend: website.trend
    }));

    exportToCSV(data, `website_performance_${getTimeRangeDisplay(timeRange).replace(/ /g, '_').toLowerCase()}`, headers);

    toast({
      title: "Export Successful",
      description: "Website performance data has been exported to CSV.",
      duration: 3000,
    });
  };

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
                        <div className="flex-1 relative bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between py-4 text-xs text-muted-foreground">
                            <span>1000ms</span>
                            <span>750ms</span>
                            <span>500ms</span>
                            <span>250ms</span>
                            <span>0ms</span>
                          </div>

                          {/* Grid lines */}
                          <div className="absolute inset-0 ml-12">
                            {[0, 25, 50, 75].map((percent) => (
                              <div
                                key={percent}
                                className="absolute w-full h-px bg-slate-200/60 dark:bg-slate-700/60"
                                style={{ bottom: `${percent}%` }}
                              />
                            ))}
                          </div>

                          {/* Chart bars */}
                          <div className="absolute inset-0 ml-12 flex items-end pb-4">
                            {performanceData.map((data, index) => {
                              const maxResponseTime = Math.max(...performanceData.map(d => d.avgResponseTime)) || 1000;
                              const height = Math.min((data.avgResponseTime / maxResponseTime) * 80, 80);

                              return (
                                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full" style={{ minWidth: '8px', paddingLeft: '1px', paddingRight: '1px' }}>
                                  <motion.div
                                    className="w-full bg-gradient-to-t from-blue-600/90 via-blue-500/80 to-blue-400/70 rounded-t-lg shadow-sm border border-blue-300/30 relative group"
                                    style={{ height: `${height}%` }}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                      height: `${height}%`,
                                      opacity: 1,
                                      transition: {
                                        duration: 0.8,
                                        delay: index * 0.1,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                      },
                                    }}
                                    whileHover={{
                                      scale: 1.05,
                                      filter: "brightness(1.1)",
                                      transition: { duration: 0.2 },
                                    }}
                                  >
                                    {/* Hover tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                      <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-700">
                                        <div className="font-semibold">{data.avgResponseTime}ms</div>
                                        <div className="text-slate-300 text-[10px]">
                                          {new Date(data.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: timeRange === '24hours' ? '2-digit' : undefined,
                                            minute: timeRange === '24hours' ? '2-digit' : undefined
                                          })}
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
                                    </div>

                                    {/* Subtle highlight effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="h-8 flex ml-12 pt-2">
                          {performanceData.map((data, index) => (
                            <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                              {new Date(data.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: timeRange === '24hours' ? '2-digit' : undefined
                              })}
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
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30" onClick={exportPerformanceData}>
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
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30" onClick={exportWebsitePerformanceData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Website Data
                    </Button>
                  </CardFooter>
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
                      <div className="flex-1 relative bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/50 dark:to-emerald-950/30 rounded-lg border border-green-200/50 dark:border-green-700/50">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between py-4 text-xs text-muted-foreground">
                          <span>100%</span>
                          <span>99.9%</span>
                          <span>99%</span>
                          <span>95%</span>
                          <span>90%</span>
                        </div>

                        {/* Grid lines */}
                        <div className="absolute inset-0 ml-12">
                          {[10, 30, 50, 70, 90].map((percent) => (
                            <div
                              key={percent}
                              className="absolute w-full h-px bg-slate-200/60 dark:bg-slate-700/60"
                              style={{ bottom: `${percent}%` }}
                            />
                          ))}
                          {/* SLA line at 99.9% */}
                          <div className="absolute w-full h-px bg-amber-400/80 bottom-[90%] z-10">
                            <div className="absolute -top-5 right-2 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50/80 dark:bg-amber-950/80 px-2 py-1 rounded">
                              99.9% SLA
                            </div>
                          </div>
                        </div>

                        {/* Chart areas */}
                        <div className="absolute inset-0 ml-12 flex items-end pb-4">
                          {performanceData.map((data, index) => {
                            const height = Math.max((data.uptime - 90) / 10 * 80, 2); // Scale from 90-100% to 0-80% height
                            const color = data.uptime >= 99.9
                              ? 'from-green-600/90 via-green-500/80 to-green-400/70 border-green-300/30'
                              : data.uptime >= 99
                                ? 'from-amber-600/90 via-amber-500/80 to-amber-400/70 border-amber-300/30'
                                : 'from-red-600/90 via-red-500/80 to-red-400/70 border-red-300/30';

                            return (
                              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full" style={{ minWidth: '8px', paddingLeft: '1px', paddingRight: '1px' }}>
                                <motion.div
                                  className={`w-full bg-gradient-to-t ${color} rounded-t-lg shadow-sm border relative group`}
                                  style={{ height: `${height}%` }}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{
                                    height: `${height}%`,
                                    opacity: 1,
                                    transition: {
                                      duration: 0.8,
                                      delay: index * 0.1,
                                      ease: [0.25, 0.46, 0.45, 0.94]
                                    },
                                  }}
                                  whileHover={{
                                    scale: 1.05,
                                    filter: "brightness(1.1)",
                                    transition: { duration: 0.2 },
                                  }}
                                >
                                  {/* Hover tooltip */}
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-700">
                                      <div className="font-semibold">{data.uptime.toFixed(2)}%</div>
                                      <div className="text-slate-300 text-[10px]">
                                        {new Date(data.date).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          hour: timeRange === '24hours' ? '2-digit' : undefined
                                        })}
                                      </div>
                                    </div>
                                    <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
                                  </div>

                                  {/* Subtle highlight effect */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* X-axis labels */}
                      <div className="h-8 flex ml-12 pt-2">
                        {performanceData.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {new Date(data.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: timeRange === '24hours' ? '2-digit' : undefined
                            })}
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
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30" onClick={exportUptimeData}>
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
                      <div className="flex-1 relative bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/50 dark:to-rose-950/30 rounded-lg border border-red-200/50 dark:border-red-700/50">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full w-12 flex flex-col justify-between py-4 text-xs text-muted-foreground">
                          <span>10+</span>
                          <span>7</span>
                          <span>5</span>
                          <span>3</span>
                          <span>0</span>
                        </div>

                        {/* Grid lines */}
                        <div className="absolute inset-0 ml-12">
                          {[0, 25, 50, 75].map((percent) => (
                            <div
                              key={percent}
                              className="absolute w-full h-px bg-slate-200/60 dark:bg-slate-700/60"
                              style={{ bottom: `${percent}%` }}
                            />
                          ))}
                        </div>

                        {/* Chart bars */}
                        <div className="absolute inset-0 ml-12 flex items-end pb-4">
                          {performanceData.map((data, index) => {
                            const maxErrors = Math.max(...performanceData.map(d => d.errors), 10);
                            const height = Math.min((data.errors / maxErrors) * 80, 80);

                            return (
                              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full" style={{ minWidth: '8px', paddingLeft: '1px', paddingRight: '1px' }}>
                                <motion.div
                                  className="w-full bg-gradient-to-t from-red-600/90 via-red-500/80 to-red-400/70 rounded-t-lg shadow-sm border border-red-300/30 relative group"
                                  style={{ height: data.errors > 0 ? `${Math.max(height, 8)}%` : '0%' }}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{
                                    height: data.errors > 0 ? `${Math.max(height, 8)}%` : '0%',
                                    opacity: 1,
                                    transition: {
                                      duration: 0.8,
                                      delay: index * 0.1,
                                      ease: [0.25, 0.46, 0.45, 0.94]
                                    },
                                  }}
                                  whileHover={{
                                    scale: data.errors > 0 ? 1.05 : 1,
                                    filter: data.errors > 0 ? "brightness(1.1)" : "none",
                                    transition: { duration: 0.2 },
                                  }}
                                >
                                  {/* Hover tooltip */}
                                  {data.errors > 0 && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                      <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-700">
                                        <div className="font-semibold">{data.errors} error{data.errors !== 1 ? 's' : ''}</div>
                                        <div className="text-slate-300 text-[10px]">
                                          {new Date(data.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: timeRange === '24hours' ? '2-digit' : undefined
                                          })}
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1"></div>
                                    </div>
                                  )}

                                  {/* Success indicator for zero errors */}
                                  {data.errors === 0 && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                                  )}

                                  {/* Subtle highlight effect */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* X-axis labels */}
                      <div className="h-8 flex ml-12 pt-2">
                        {performanceData.map((data, index) => (
                          <div key={index} className="flex-1 text-xs text-center text-muted-foreground">
                            {new Date(data.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: timeRange === '24hours' ? '2-digit' : undefined
                            })}
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
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30" onClick={exportErrorData}>
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
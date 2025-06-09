"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Clock,
  Globe,
  Brain,
  FileText,
  Calendar,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  Eye,
  AlertTriangle
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"

interface MonitoringLog {
  id: string
  website_id: string
  website_name: string
  website_url: string
  check_id: string | null
  log_level: string
  message: string
  ai_analysis: string | null
  created_at: string
}

interface Website {
  id: string
  name: string
  url: string
  status: string
}

interface AIAnalysis {
  summary: string
  insights: string[]
  recommendations: string[]
  severity: string
  possibleCauses: string[]
}

interface LogStats {
  total: number
  errors: number
  warnings: number
  info: number
  withAI: number
}

// Updated RawLogData interface - websites is a single object, not array
interface RawLogData {
  id: string
  website_id: string
  check_id: string | null
  log_level: string
  message: string
  ai_analysis: string | null
  created_at: string
  websites: {
    id: string
    name: string
    url: string
    user_id: string
  } | null  // Single object that can be null
}

export default function MonitoringLogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [logs, setLogs] = useState<MonitoringLog[]>([])
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [logLevelFilter, setLogLevelFilter] = useState("all")
  const [websiteFilter, setWebsiteFilter] = useState(searchParams.get('website') || "all")
  const [timeFilter, setTimeFilter] = useState("24h")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchData()
  }, [websiteFilter, timeFilter, logLevelFilter])

const fetchData = async () => {
  try {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const userId = user.id

    // Fetch websites first
    const { data: websitesData, error: websitesError } = await supabase
      .from('websites')
      .select('id, name, url, status')
      .eq('user_id', userId)
      .order('name')

    if (websitesError) {
      console.error('Websites query error:', websitesError)
      throw websitesError
    }

    const websitesList = websitesData || []
    setWebsites(websitesList)

    // If no websites, no logs to fetch
    if (websitesList.length === 0) {
      setLogs([])
      return
    }

    // Calculate time range
    const now = new Date()
    let startTime: Date
    switch (timeFilter) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    // Get website IDs for additional security
    const userWebsiteIds = websitesList.map(w => w.id)

    // Build query with proper join
    let query = supabase
      .from('monitoring_logs')
      .select(`
        id,
        website_id,
        check_id,
        log_level,
        message,
        ai_analysis,
        created_at,
        websites!monitoring_logs_website_id_fkey(
          id,
          name,
          url,
          user_id
        )
      `)
      .in('website_id', userWebsiteIds)
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false })
      .limit(500)

    // Apply website filter
    if (websiteFilter !== 'all') {
      query = query.eq('website_id', websiteFilter)
    }

    // Apply log level filter
    if (logLevelFilter !== 'all') {
      query = query.eq('log_level', logLevelFilter)
    }

    const { data: logsData, error: logsError } = await query

    if (logsError) {
      console.error('Logs query error:', logsError)
      throw logsError
    }

    console.log('Raw logs data:', logsData)

    // Format logs with proper type handling
    const formattedLogs: MonitoringLog[] = (logsData as RawLogData[])?.map(log => {
      // Find website info from our websites list as backup
      const websiteInfo = websitesList.find(w => w.id === log.website_id)
      
      return {
        id: log.id,
        website_id: log.website_id,
        website_name: log.websites?.name || websiteInfo?.name || 'Unknown Website',
        website_url: log.websites?.url || websiteInfo?.url || '',
        check_id: log.check_id,
        log_level: log.log_level,
        message: log.message,
        ai_analysis: log.ai_analysis,
        created_at: log.created_at
      }
    }).filter(log => {
      // Only include logs for websites that belong to the current user
      const website = websitesList.find(w => w.id === log.website_id)
      return website !== undefined
    }) || []

    console.log('Formatted logs:', formattedLogs)
    setLogs(formattedLogs)

  } catch (error) {
    console.error('Error fetching logs:', error)
    toast({
      title: "Error",
      description: "Failed to load monitoring logs. Please try again.",
      variant: "destructive"
    })
  } finally {
    setLoading(false)
    setRefreshing(false)
  }
}

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const hours = Math.floor(diffInMinutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const parseAIAnalysis = (analysisString: string | null): AIAnalysis | null => {
    if (!analysisString) return null
    try {
      return JSON.parse(analysisString)
    } catch {
      return null
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <X className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Check className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
      case 'info':
        return 'bg-green-500/10 text-green-500 border-green-500/30'
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  // Filter logs based on search and active tab
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.website_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.log_level.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'errors' && log.log_level === 'error') ||
      (activeTab === 'warnings' && log.log_level === 'warning') ||
      (activeTab === 'ai' && log.ai_analysis)

    return matchesSearch && matchesTab
  })

  // Calculate stats
  const logStats: LogStats = {
    total: logs.length,
    errors: logs.filter(l => l.log_level === 'error').length,
    warnings: logs.filter(l => l.log_level === 'warning').length,
    info: logs.filter(l => l.log_level === 'info').length,
    withAI: logs.filter(l => l.ai_analysis).length
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Website', 'Level', 'Message', 'AI Analysis'],
      ...filteredLogs.map(log => [
        log.created_at,
        log.website_name,
        log.log_level,
        log.message,
        log.ai_analysis ? 'Yes' : 'No'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `monitoring-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading monitoring logs...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="container py-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Monitoring Logs</h1>
          <p className="text-muted-foreground mt-1">View and analyze your website monitoring history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportLogs}
            disabled={filteredLogs.length === 0}
            className="btn-shine"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-shine"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass-card gradient-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{logStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card gradient-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-destructive">{logStats.errors}</p>
              </div>
              <X className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card gradient-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-yellow-500">{logStats.warnings}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card gradient-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Info</p>
                <p className="text-2xl font-bold text-green-500">{logStats.info}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card gradient-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Analysis</p>
                <p className="text-2xl font-bold text-purple-500">{logStats.withAI}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card gradient-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Select value={websiteFilter} onValueChange={setWebsiteFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All websites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All websites</SelectItem>
                  {websites.map((website) => (
                    <SelectItem key={website.id} value={website.id}>
                      {website.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Log Level</label>
              <Select value={logLevelFilter} onValueChange={setLogLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Last 24h" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({logStats.total})
          </TabsTrigger>
          <TabsTrigger value="errors">
            Errors ({logStats.errors})
          </TabsTrigger>
          <TabsTrigger value="warnings">
            Warnings ({logStats.warnings})
          </TabsTrigger>
          <TabsTrigger value="ai">
            AI Analysis ({logStats.withAI})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <Card className="glass-card gradient-border">
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No logs found</h3>
                  <p className="text-muted-foreground">
                    {logs.length === 0
                      ? "No monitoring logs available for the selected time period."
                      : "No logs match your current filters. Try adjusting your search criteria."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <AnimatePresence>
                {filteredLogs.map((log, index) => {
                  const aiAnalysis = parseAIAnalysis(log.ai_analysis)
                  const isExpanded = expandedLogs.has(log.id)

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card gradient-border hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              {getLogIcon(log.log_level)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className={getLogBadgeColor(log.log_level)}>
                                    {log.log_level.toUpperCase()}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {log.website_name}
                                  </span>
                                  {log.website_url && (
                                    <a
                                      href={log.website_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>

                                <p className="text-foreground mb-2">{log.message}</p>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getTimeAgo(log.created_at)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(log.created_at).toLocaleString()}
                                  </div>
                                  {aiAnalysis && (
                                    <div className="flex items-center gap-1">
                                      <Brain className="h-3 w-3 text-purple-500" />
                                      <span className="text-purple-500">AI Analysis Available</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {aiAnalysis && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLogExpansion(log.id)}
                                className="shrink-0 btn-shine"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                {isExpanded ? 'Hide' : 'View'} Analysis
                                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </Button>
                            )}
                          </div>

                          {aiAnalysis && isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 pt-6 border-t"
                            >
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Brain className="h-4 w-4 text-purple-500" />
                                    <h4 className="font-semibold">AI Analysis</h4>
                                    <Badge variant="outline" className={`text-xs ${getSeverityColor(aiAnalysis.severity)}`}>
                                      {aiAnalysis.severity.toUpperCase()} SEVERITY
                                    </Badge>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <h5 className="font-medium text-muted-foreground mb-2">Summary</h5>
                                      <p className="text-sm">{aiAnalysis.summary}</p>
                                    </div>

                                    {aiAnalysis.insights && aiAnalysis.insights.length > 0 && (
                                      <div>
                                        <h5 className="font-medium text-muted-foreground mb-2">Key Insights</h5>
                                        <ul className="text-sm space-y-1">
                                          {aiAnalysis.insights.map((insight, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                              <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                                              {insight}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  {aiAnalysis.possibleCauses && aiAnalysis.possibleCauses.length > 0 && (
                                    <div className="mb-4">
                                      <h5 className="font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        Possible Causes
                                      </h5>
                                      <ul className="text-sm space-y-1">
                                        {aiAnalysis.possibleCauses.map((cause, i) => (
                                          <li key={i} className="flex items-start gap-2">
                                            <span className="text-orange-500">•</span>
                                            {cause}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                                    <div>
                                      <h5 className="font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        Recommendations
                                      </h5>
                                      <ul className="text-sm space-y-1">
                                        {aiAnalysis.recommendations.map((rec, i) => (
                                          <li key={i} className="flex items-start gap-2">
                                            <span className="text-green-500">•</span>
                                            {rec}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
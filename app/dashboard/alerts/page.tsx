"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowUpRight, Bell, BellOff, Check, Clock, Filter, Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"

interface Alert {
  id: string
  website_id: string
  website_name: string | null
  website_url: string | null
  type: string
  severity: string | null
  description: string | null
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
}

interface AlertStats {
  total: number
  active: number
  critical: number
  warning: number
  info: number
  resolved: number
}

interface WebsiteInfo {
  name: string;
  url: string;
}


export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (!session) {
          // Redirect to login if not authenticated
          router.push('/login')
          return
        }

        // Get user ID
        const userId = (await supabase.auth.getUser()).data.user?.id;
        
        // First, get all websites for this user
        const { data: websitesData, error: websitesError } = await supabase
          .from('websites')
          .select('id, name, url')
          .eq('user_id', userId);
          
        if (websitesError) throw websitesError;
        
        // Create a map of website IDs to their name and URL for faster lookup
        const websiteMap: Record<string, WebsiteInfo> = {};
        websitesData?.forEach(website => {
          websiteMap[website.id] = {
            name: website.name || 'Unnamed Website',
            url: website.url
          };
        });
        
        // Now get all alerts that reference these websites
        const { data: alertsData, error } = await supabase
          .from('alerts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;

        // Format the alerts with website info from our map
        const formattedAlerts: Alert[] = alertsData?.map(alert => {
          const website = websiteMap[alert.website_id] || { name: 'Unknown Website', url: '#' };
          
          return {
            id: alert.id,
            website_id: alert.website_id,
            website_name: website.name,
            website_url: website.url,
            type: alert.type,
            severity: alert.severity,
            description: alert.description,
            is_resolved: alert.is_resolved,
            created_at: alert.created_at,
            resolved_at: alert.resolved_at
          };
        }) || [];

        setAlerts(formattedAlerts)
      } catch (error) {
        console.error('Error fetching alerts:', error)
        toast({
          title: "Error",
          description: "Failed to load alerts. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [router, toast, supabase])

  // Calculate time ago from timestamp
  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60))
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  // Handle resolving an alert
  const handleResolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)

      if (error) {
        throw new Error(error.message)
      }

      // Update the local state
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, is_resolved: true, resolved_at: new Date().toISOString() }
            : alert
        )
      )

      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved.",
        variant: "default"
      })
    } catch (error) {
      console.error('Error resolving alert:', error)
      toast({
        title: "Error",
        description: "Failed to resolve alert. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Filter alerts based on search, severity, status, and active tab
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      (alert.website_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (alert.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false)

    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && !alert.is_resolved) ||
      (statusFilter === "resolved" && alert.is_resolved)

    // Filter based on active tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && !alert.is_resolved) ||
      (activeTab === "resolved" && alert.is_resolved)

    return matchesSearch && matchesSeverity && matchesStatus && matchesTab
  })

  // Calculate alert statistics
  const alertStats: AlertStats = {
    total: alerts.length,
    active: alerts.filter(a => !a.is_resolved).length,
    critical: alerts.filter(a => a.severity === "critical").length,
    warning: alerts.filter(a => a.severity === "warning").length,
    info: alerts.filter(a => a.severity === "info").length,
    resolved: alerts.filter(a => a.is_resolved).length,
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

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading alerts...</p>
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="m-0">
                    <AlertList alerts={filteredAlerts} onResolve={handleResolveAlert} getTimeAgo={getTimeAgo} />
                  </TabsContent>

                  <TabsContent value="active" className="m-0">
                    <AlertList alerts={filteredAlerts} onResolve={handleResolveAlert} getTimeAgo={getTimeAgo} />
                  </TabsContent>

                  <TabsContent value="resolved" className="m-0">
                    <AlertList alerts={filteredAlerts} onResolve={handleResolveAlert} getTimeAgo={getTimeAgo} />
                  </TabsContent>
                </>
              )}
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

interface AlertListProps {
  alerts: Alert[]
  onResolve: (id: string) => void
  getTimeAgo: (timestamp: string) => string
}

function AlertList({ alerts, onResolve, getTimeAgo }: AlertListProps) {
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
                    <p className="text-sm font-medium">{alert.website_name}</p>
                    <Badge
                      variant={!alert.is_resolved ? "outline" : "secondary"}
                      className={
                        !alert.is_resolved
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-green-500/10 text-green-500 border-green-500/30"
                      }
                    >
                      {!alert.is_resolved ? "Active" : "Resolved"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeAgo(alert.created_at)}
                  </span>
                </div>
                <p className="text-sm font-medium">{alert.type}</p>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                  <Link href={`/dashboard/website/${alert.website_id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View Website</span>
                  </Link>
                </Button>
                {!alert.is_resolved && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs hover:bg-primary/10 hover:border-primary/30"
                    onClick={() => onResolve(alert.id)}
                  >
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
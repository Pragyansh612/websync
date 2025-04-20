"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

// Define the Website type based on your database schema
interface Website {
  id: string
  user_id: string
  url: string
  name: string
  status: string
  monitoring_interval: number
  created_at: string
  last_checked_at: string | null
  uptime?: string
  responseTime?: string
}

interface WebsiteCheckData {
  avg_response_time: number
  uptime_percentage: number
  total_checks: number
  is_up: boolean
}

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [websiteStats, setWebsiteStats] = useState<Map<string, WebsiteCheckData>>(new Map())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [websiteToDelete, setWebsiteToDelete] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const { toast } = useToast()
  const router = useRouter()

  // Fetch websites from the database
  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    try {
      setIsLoading(true)
      const { data: websiteData, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) {
        throw error
      }

      if (websiteData) {
        setWebsites(websiteData)

        // Fetch stats for each website
        const statsMap = new Map<string, WebsiteCheckData>()

        for (const website of websiteData) {
          // Get statistics from website_checks for each website
          const { data: checksData, error: checksError } = await supabase
            .from('website_checks')
            .select('response_time_ms, is_up, status_code')
            .eq('website_id', website.id)
            .order('timestamp', { ascending: false })
            .limit(100)

          if (checksError) {
            console.error('Error fetching website checks:', checksError)
            continue
          }

          if (checksData && checksData.length > 0) {
            // Calculate average response time
            const totalResponseTime = checksData.reduce((sum, check) =>
              sum + (check.response_time_ms || 0), 0)
            const avgResponseTime = checksData.length > 0 ?
              Math.round(totalResponseTime / checksData.length) : 0

            // Calculate uptime percentage
            const upChecks = checksData.filter(check => check.is_up === true).length
            const uptimePercentage = checksData.length > 0 ?
              ((upChecks / checksData.length) * 100).toFixed(2) : "100.00"

            // Get latest status
            const latestCheck = checksData[0]
            const isCurrentlyUp = latestCheck?.is_up || false

            statsMap.set(website.id, {
              avg_response_time: avgResponseTime,
              uptime_percentage: parseFloat(uptimePercentage),
              total_checks: checksData.length,
              is_up: isCurrentlyUp
            })
          } else {
            // No checks data, set defaults
            statsMap.set(website.id, {
              avg_response_time: 0,
              uptime_percentage: 100,
              total_checks: 0,
              is_up: true
            })
          }
        }

        setWebsiteStats(statsMap)
      }
    } catch (error) {
      console.error('Error fetching websites:', error)
      toast({
        title: "Error",
        description: "Failed to fetch websites",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchWebsites()
    setIsRefreshing(false)
    toast({
      title: "Websites Refreshed",
      description: "All website data has been updated.",
      duration: 3000,
    })
  }

  const handleDeleteWebsite = (id: string) => {
    setWebsiteToDelete(id)
  }

  const confirmDelete = async () => {
    if (!websiteToDelete) return

    setIsDeleting(true)
    try {
      // Delete all related records first to maintain referential integrity

      // Delete route_checks related to website routes
      const { data: routeData } = await supabase
        .from('website_routes')
        .select('id')
        .eq('website_id', websiteToDelete)

      if (routeData && routeData.length > 0) {
        const routeIds = routeData.map(route => route.id)

        // Delete route checks for these routes
        await supabase
          .from('route_checks')
          .delete()
          .in('route_id', routeIds)
      }

      // Delete website routes
      await supabase
        .from('website_routes')
        .delete()
        .eq('website_id', websiteToDelete)

      // Delete website checks
      await supabase
        .from('website_checks')
        .delete()
        .eq('website_id', websiteToDelete)

      // Delete monitoring_logs
      await supabase
        .from('monitoring_logs')
        .delete()
        .eq('website_id', websiteToDelete)

      // Delete alerts
      await supabase
        .from('alerts')
        .delete()
        .eq('website_id', websiteToDelete)

      // Finally delete the website
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteToDelete)

      if (error) throw error

      // Update the UI by removing the deleted website
      setWebsites(websites.filter(website => website.id !== websiteToDelete))

      toast({
        title: "Website Deleted",
        description: "The website has been removed from monitoring.",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error deleting website:', error)
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setWebsiteToDelete(null)
    }
  }

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Helper function to get website status from stats
  const getWebsiteStatus = (websiteId: string): 'up' | 'down' | 'degraded' => {
    const stats = websiteStats.get(websiteId)

    if (!stats) return 'up'

    if (!stats.is_up) return 'down'

    if (stats.uptime_percentage < 99.5 || stats.avg_response_time > 300) {
      return 'degraded'
    }

    return 'up'
  }

  // Filter and sort websites
  const filteredWebsites = websites
    .filter((website) => {
      const currentStatus = getWebsiteStatus(website.id)
      const matchesSearch =
        website.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.url.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || currentStatus === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      const statusA = getWebsiteStatus(a.id)
      const statusB = getWebsiteStatus(b.id)
      const statsA = websiteStats.get(a.id)
      const statsB = websiteStats.get(b.id)

      if (sortBy === "name") {
        comparison = (a.name || '').localeCompare(b.name || '')
      } else if (sortBy === "status") {
        comparison = statusA.localeCompare(statusB)
      } else if (sortBy === "uptime") {
        const uptimeA = statsA?.uptime_percentage || 100
        const uptimeB = statsB?.uptime_percentage || 100
        comparison = uptimeA - uptimeB
      } else if (sortBy === "responseTime") {
        const responseTimeA = statsA?.avg_response_time || 0
        const responseTimeB = statsB?.avg_response_time || 0
        comparison = responseTimeA - responseTimeB
      } else if (sortBy === "dateAdded") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }

      return sortOrder === "asc" ? comparison : -comparison
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

  const formatCheckFrequency = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`
    if (seconds === 60) return "1 minute"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`
    if (seconds === 3600) return "1 hour"
    return `${Math.floor(seconds / 3600)} hours`
  }

  const formatTimeSince = (dateStr: string | null): string => {
    if (!dateStr) return "Never"

    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  return (
    <motion.div className="container py-6 space-y-6" initial="hidden" animate="visible" variants={containerAnimation}>
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemAnimation}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight gradient-text">Websites</h1>
          <p className="text-muted-foreground">Manage and monitor your websites</p>
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

      <motion.div variants={itemAnimation}>
        <Card className="glass-card gradient-border">
          <CardHeader>
            <CardTitle>Website Management</CardTitle>
            <CardDescription>View and manage all your monitored websites</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortBy === "name" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortBy === "status" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("uptime")}
                    >
                      <div className="flex items-center">
                        Uptime
                        {sortBy === "uptime" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleSort("responseTime")}
                    >
                      <div className="flex items-center">
                        Response Time
                        {sortBy === "responseTime" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Check Frequency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <div className="flex justify-center items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading websites...</span>
                        </div>
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
                      {filteredWebsites.map((website, index) => {
                        const stats = websiteStats.get(website.id)
                        const status = getWebsiteStatus(website.id)
                        const uptimePercentage = stats ? `${stats.uptime_percentage.toFixed(2)}%` : "100.00%"
                        const responseTime = stats ? `${stats.avg_response_time}ms` : "0ms"

                        return (
                          <motion.tr
                            key={website.id}
                            className="hover:bg-primary/5 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(var(--primary), 0.1)" }}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{website.name || "Unnamed Website"}</span>
                                <span className="text-xs text-muted-foreground">{website.url}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  status === "up"
                                    ? "outline"
                                    : status === "down"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={
                                  status === "up"
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                                    : status === "down"
                                      ? ""
                                      : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500"
                                }
                              >
                                <span className="flex items-center gap-1">
                                  {status === "up" ? (
                                    <Check className="h-3 w-3" />
                                  ) : status === "down" ? (
                                    <X className="h-3 w-3" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3" />
                                  )}
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>{uptimePercentage}</TableCell>
                            <TableCell>{responseTime}</TableCell>
                            <TableCell>{formatCheckFrequency(website.monitoring_interval)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                                  <Link href={`/dashboard/website/${website.id}`}>
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">Visit Website</span>
                                  </a>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="animate-in fade-in-50 zoom-in-95">
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleRefresh}>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      <span>Refresh Status</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/dashboard/website/${website.id}/settings`} className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Edit Settings</span>
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive cursor-pointer"
                                      onClick={() => handleDeleteWebsite(website.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Remove</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={websiteToDelete !== null} onOpenChange={(open) => !open && setWebsiteToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this website from monitoring? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              All monitoring data and history for this website will be permanently deleted.
            </p>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setWebsiteToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Website
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
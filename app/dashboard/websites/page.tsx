"use client"

import { useState } from "react"
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

// Sample data for websites
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
    checkFrequency: "1 minute",
    monitoringLocations: ["US East", "Europe"],
    dateAdded: "2023-12-15",
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
    checkFrequency: "30 seconds",
    monitoringLocations: ["US East", "US West", "Asia"],
    dateAdded: "2023-12-20",
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
    checkFrequency: "1 minute",
    monitoringLocations: ["US East", "Europe"],
    dateAdded: "2024-01-05",
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
    checkFrequency: "5 minutes",
    monitoringLocations: ["US East", "US West"],
    dateAdded: "2024-01-10",
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
    checkFrequency: "5 minutes",
    monitoringLocations: ["US East", "Europe"],
    dateAdded: "2024-01-15",
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
    checkFrequency: "30 seconds",
    monitoringLocations: ["US East", "US West", "Europe", "Asia"],
    dateAdded: "2024-01-20",
  },
]

export default function WebsitesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [websiteToDelete, setWebsiteToDelete] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const { toast } = useToast()

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Websites Refreshed",
        description: "All website data has been updated.",
        duration: 3000,
      })
    }, 1000)
  }

  const handleDeleteWebsite = (id: number) => {
    setWebsiteToDelete(id)
  }

  const confirmDelete = () => {
    setIsDeleting(true)
    // Simulate deletion
    setTimeout(() => {
      setIsDeleting(false)
      setWebsiteToDelete(null)
      toast({
        title: "Website Deleted",
        description: "The website has been removed from monitoring.",
        duration: 3000,
      })
    }, 1000)
  }

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Filter and sort websites
  const filteredWebsites = websites
    .filter((website) => {
      const matchesSearch =
        website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.url.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || website.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status)
      } else if (sortBy === "uptime") {
        comparison = Number.parseFloat(a.uptime) - Number.parseFloat(b.uptime)
      } else if (sortBy === "responseTime") {
        comparison = Number.parseInt(a.responseTime) - Number.parseInt(b.responseTime)
      } else if (sortBy === "dateAdded") {
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
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
                          className="hover:bg-primary/5 transition-colors"
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
                          <TableCell>{website.checkFrequency}</TableCell>
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
                                  <DropdownMenuItem className="cursor-pointer">
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
                      ))}
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


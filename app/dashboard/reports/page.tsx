"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Calendar, Download, FileText, LineChart, RefreshCw, Share2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

// Sample data for performance report
const performanceData = [
  { date: "2024-03-11", avgResponseTime: 120, uptime: 99.98, errors: 0 },
  { date: "2024-03-12", avgResponseTime: 115, uptime: 100, errors: 0 },
  { date: "2024-03-13", avgResponseTime: 125, uptime: 99.95, errors: 1 },
  { date: "2024-03-14", avgResponseTime: 130, uptime: 99.9, errors: 2 },
  { date: "2024-03-15", avgResponseTime: 140, uptime: 99.85, errors: 3 },
  { date: "2024-03-16", avgResponseTime: 135, uptime: 99.92, errors: 1 },
  { date: "2024-03-17", avgResponseTime: 128, uptime: 99.97, errors: 0 },
]

// Sample data for website performance
const websitePerformance = [
  {
    name: "Main Website",
    url: "https://example.com",
    avgResponseTime: 124,
    uptime: 99.98,
    errors: 0,
    trend: "stable",
  },
  {
    name: "API Service",
    url: "https://api.example.com",
    avgResponseTime: 89,
    uptime: 99.95,
    errors: 0,
    trend: "improving",
  },
  {
    name: "Customer Portal",
    url: "https://portal.example.com",
    avgResponseTime: 156,
    uptime: 99.9,
    errors: 2,
    trend: "degrading",
  },
  {
    name: "Documentation",
    url: "https://docs.example.com",
    avgResponseTime: 0,
    uptime: 98.45,
    errors: 1,
    trend: "critical",
  },
  {
    name: "Blog",
    url: "https://blog.example.com",
    avgResponseTime: 110,
    uptime: 99.99,
    errors: 0,
    trend: "stable",
  },
  {
    name: "E-commerce Store",
    url: "https://store.example.com",
    avgResponseTime: 320,
    uptime: 99.8,
    errors: 3,
    trend: "degrading",
  },
]

// Sample data for recent reports
const recentReports = [
  {
    id: 1,
    title: "Weekly Performance Report",
    date: "2024-03-17",
    type: "performance",
    format: "PDF",
    size: "1.2 MB",
  },
  {
    id: 2,
    title: "Monthly Uptime Summary",
    date: "2024-03-01",
    type: "uptime",
    format: "PDF",
    size: "2.4 MB",
  },
  {
    id: 3,
    title: "Error Log Analysis",
    date: "2024-03-15",
    type: "errors",
    format: "CSV",
    size: "850 KB",
  },
  {
    id: 4,
    title: "Response Time Trends",
    date: "2024-03-10",
    type: "performance",
    format: "PDF",
    size: "1.8 MB",
  },
  {
    id: 5,
    title: "SSL Certificate Report",
    date: "2024-03-05",
    type: "security",
    format: "PDF",
    size: "1.1 MB",
  },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [animateChart, setAnimateChart] = useState(false)
  const { toast } = useToast()

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      setAnimateChart(true)
      toast({
        title: "Reports Refreshed",
        description: "All report data has been updated.",
        duration: 3000,
      })
    }, 1000)
  }

  const handleDownload = (reportId: number) => {
    toast({
      title: "Report Downloaded",
      description: "Your report has been downloaded successfully.",
      duration: 3000,
    })
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
          <h1 className="text-2xl font-bold tracking-tight gradient-text">Reports</h1>
          <p className="text-muted-foreground">View analytics and performance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle className="gradient-text">Response Time Trends</CardTitle>
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
                                height: animateChart ? `${(data.avgResponseTime / 200) * 100}%` : "0%",
                                transitionDelay: `${index * 50}ms`,
                              }}
                              initial={{ height: 0 }}
                              animate={{
                                height: `${(data.avgResponseTime / 200) * 100}%`,
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
                      key={website.name}
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
                            className={`text-sm font-medium ${
                              website.avgResponseTime > 200
                                ? "text-yellow-500"
                                : website.avgResponseTime > 300
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
                            className={`text-sm font-medium ${
                              website.uptime < 99.9
                                ? "text-yellow-500"
                                : website.uptime < 99
                                  ? "text-destructive"
                                  : "text-green-500"
                            }`}
                          >
                            {website.uptime}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Errors</p>
                          <p
                            className={`text-sm font-medium ${
                              website.errors > 0
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
                          <Link href={`/dashboard/website/${websitePerformance.indexOf(website) + 1}`}>
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
          </TabsContent>

          <TabsContent value="uptime" className="space-y-6">
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle className="gradient-text">Uptime Trends</CardTitle>
                <CardDescription>Uptime percentage across all monitored websites</CardDescription>
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
                                {data.uptime}%
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
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle className="gradient-text">Error Trends</CardTitle>
                <CardDescription>Number of errors across all monitored websites</CardDescription>
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
                              className="w-full bg-gradient-to-t from-destructive/80 to-destructive/40 mx-[1px] rounded-t-sm"
                              style={{
                                height: animateChart ? `${(data.errors / 5) * 100}%` : "0%",
                                transitionDelay: `${index * 50}ms`,
                              }}
                              initial={{ height: 0 }}
                              animate={{
                                height: `${(data.errors / 5) * 100}%`,
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
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Access your previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:bg-primary/5 hover:border-primary/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          {report.type === "performance" ? (
                            <LineChart className="h-5 w-5 text-primary" />
                          ) : report.type === "uptime" ? (
                            <ArrowUp className="h-5 w-5 text-green-500" />
                          ) : report.type === "errors" ? (
                            <ArrowDown className="h-5 w-5 text-destructive" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(report.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span>{report.format}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10"
                          onClick={() => handleDownload(report.id)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full hover:bg-primary/10 hover:border-primary/30">
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


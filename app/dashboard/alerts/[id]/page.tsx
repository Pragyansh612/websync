"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, AlertCircle, Clock, Globe, Check, X, TrendingDown, TrendingUp, Activity, Brain, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/components/ui/use-toast"

interface Alert {
  id: string
  website_id: string
  website_name: string
  website_url: string
  type: string
  severity: string
  description: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
}

interface MonitoringLog {
  id: string
  website_id: string
  check_id: string | null
  log_level: string
  message: string
  ai_analysis: string | null
  created_at: string
}

interface AIAnalysis {
  summary: string
  insights: string[]
  recommendations: string[]
  severity: string
  possibleCauses: string[]
}

export default function AlertDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  
  const [alert, setAlert] = useState<Alert | null>(null)
  const [relatedLogs, setRelatedLogs] = useState<MonitoringLog[]>([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(false)

  const alertId = params.id as string

  useEffect(() => {
    async function fetchAlertDetails() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        const userId = (await supabase.auth.getUser()).data.user?.id

        // Fetch alert details with website info
        const { data: alertData, error: alertError } = await supabase
          .from('alerts')
          .select(`
            *,
            websites!inner(id, name, url, user_id)
          `)
          .eq('id', alertId)
          .eq('websites.user_id', userId)
          .single()

        if (alertError) throw alertError

        const formattedAlert: Alert = {
          id: alertData.id,
          website_id: alertData.website_id,
          website_name: alertData.websites.name || 'Unnamed Website',
          website_url: alertData.websites.url,
          type: alertData.type,
          severity: alertData.severity,
          description: alertData.description,
          is_resolved: alertData.is_resolved,
          created_at: alertData.created_at,
          resolved_at: alertData.resolved_at
        }

        setAlert(formattedAlert)

        // Fetch related monitoring logs (last 24 hours around the alert time)
        const alertTime = new Date(alertData.created_at)
        const startTime = new Date(alertTime.getTime() - 24 * 60 * 60 * 1000) // 24 hours before
        const endTime = new Date(alertTime.getTime() + 24 * 60 * 60 * 1000) // 24 hours after

        const { data: logsData, error: logsError } = await supabase
          .from('monitoring_logs')
          .select('*')
          .eq('website_id', alertData.website_id)
          .gte('created_at', startTime.toISOString())
          .lte('created_at', endTime.toISOString())
          .order('created_at', { ascending: false })
          .limit(50)

        if (logsError) throw logsError

        setRelatedLogs(logsData || [])
      } catch (error) {
        console.error('Error fetching alert details:', error)
        toast({
          title: "Error",
          description: "Failed to load alert details. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (alertId) {
      fetchAlertDetails()
    }
  }, [alertId, router, toast, supabase])

  const handleResolveAlert = async () => {
    if (!alert) return

    try {
      setResolving(true)
      const { error } = await supabase
        .from('alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alert.id)

      if (error) throw error

      setAlert(prev => prev ? {
        ...prev,
        is_resolved: true,
        resolved_at: new Date().toISOString()
      } : null)

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
    } finally {
      setResolving(false)
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

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

  const parseAIAnalysis = (analysisString: string | null): AIAnalysis | null => {
    if (!analysisString) return null
    try {
      return JSON.parse(analysisString)
    } catch {
      return null
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <X className="h-4 w-4 text-destructive" />
      case 'warning':
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'warning':
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    }
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading alert details...</p>
        </div>
      </div>
    )
  }

  if (!alert) {
    return (
      <div className="container py-6">
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Alert not found</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/alerts">Back to Alerts</Link>
          </Button>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">Alert Details</h1>
            <p className="text-muted-foreground">Detailed analysis and logs for this alert</p>
          </div>
        </div>
        {!alert.is_resolved && (
          <Button
            onClick={handleResolveAlert}
            disabled={resolving}
            className="btn-shine"
          >
            {resolving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Resolving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Resolve Alert
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alert Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card gradient-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getSeverityIcon(alert.severity)}
                  Alert Overview
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    !alert.is_resolved
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-green-500/10 text-green-500 border-green-500/30"
                  }
                >
                  {!alert.is_resolved ? "Active" : "Resolved"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{alert.website_name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.website_url}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Severity</p>
                  <Badge variant="outline" className={`mt-1 ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alert Type</p>
                  <p className="font-medium mt-1">{alert.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{getTimeAgo(alert.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{alert.description}</p>
              </div>

              {alert.resolved_at && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Check className="h-3 w-3 text-green-500" />
                      <span className="text-sm">{getTimeAgo(alert.resolved_at)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {relatedLogs.some(log => log.ai_analysis) && (
            <Card className="glass-card gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI Analysis
                </CardTitle>
                <CardDescription>
                  Intelligent insights and recommendations for this alert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedLogs
                  .filter(log => log.ai_analysis)
                  .slice(0, 1)
                  .map(log => {
                    const analysis = parseAIAnalysis(log.ai_analysis)
                    if (!analysis) return null

                    return (
                      <div key={log.id} className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Summary</p>
                          <p className="text-sm">{analysis.summary}</p>
                        </div>

                        {analysis.insights.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Key Insights</p>
                            <ul className="space-y-1">
                              {analysis.insights.map((insight, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.possibleCauses.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Possible Causes</p>
                            <ul className="space-y-1">
                              {analysis.possibleCauses.map((cause, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Recommendations</p>
                            <ul className="space-y-1">
                              {analysis.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Logs */}
        <div className="space-y-6">
          <Card className="glass-card gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Related Logs
              </CardTitle>
              <CardDescription>
                Monitoring logs around the time of this alert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relatedLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No related logs found
                  </p>
                ) : (
                  relatedLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="mt-0.5">
                        {log.log_level === 'error' ? (
                          <X className="h-4 w-4 text-destructive" />
                        ) : log.log_level === 'warning' ? (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{log.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(log.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {relatedLogs.length > 10 && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/logs?website=${alert.website_id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View All Logs
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card gradient-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href={`/dashboard/website/${alert.website_id}`}>
                  <Globe className="h-4 w-4 mr-2" />
                  View Website Details
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href={`/dashboard/logs?website=${alert.website_id}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  View All Logs
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href="/dashboard/alerts">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Alerts
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
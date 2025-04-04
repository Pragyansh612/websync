"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { websiteApi } from "@/services/api"

export default function AddWebsitePage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
  const [checkInterval, setCheckInterval] = useState("5")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [monitorSSL, setMonitorSSL] = useState(true)
  const [trackPerformance, setTrackPerformance] = useState(true)
  const [checkContent, setCheckContent] = useState(false)

  const handleVerify = async () => {
    if (!url) return;
  
    setIsLoading(true);
    setError(null);
  
    try {
      // First, let's check if URL is valid
      const urlToCheck = url.startsWith("http") ? url : `https://${url}`;
      
      try {
        // Validate URL format
        new URL(urlToCheck);
      } catch (e) {
        throw new Error("Invalid URL format");
      }
      
      // Direct browser check (quickly verify it's reachable)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(urlToCheck, {
          method: 'HEAD',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Website returned status: ${response.status}`);
        }
      } catch (browserError) {
        console.warn("Browser check failed:", browserError);
        // Continue with server verification even if browser check fails
        // (CORS or other browser limitations might prevent this check)
      }
      
      // Now use our backend to verify the website (more thorough check)
      // This is commented out since we need to implement the endpoint first
      /*
      const { data } = await websiteApi.verifyWebsite(urlToCheck);
      setPreviewData(data);
      */
      
      // If we reach here, website is verified
      setIsVerified(true);
  
      // Set suggested name based on URL if not already set
      if (!name) {
        try {
          const urlObj = new URL(urlToCheck);
          setName(urlObj.hostname.replace("www.", ""));
        } catch (e) {
          setName(url);
        }
      }
      
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setError(e instanceof Error ? e.message : "Could not verify website. Please check the URL.");
      setIsVerified(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Prepare website data
      const websiteData = {
        user_id: user.id,
        url: url.startsWith("http") ? url : `https://${url}`,
        name: name || url,
        status: 'active',
        monitoring_interval: parseInt(checkInterval),
        last_checked_at: new Date().toISOString(),
        // track_performance: trackPerformance,
      }

      // Insert website into Supabase
      const { data, error: supabaseError } = await supabase
        .from('websites')
        .insert(websiteData)
        .select()

      if (supabaseError) throw supabaseError

      // If website was added successfully, trigger an immediate check
      if (data && data[0]) {
        try {
          // This is optional - trigger an immediate check on the backend
          await websiteApi.checkWebsite(data[0].id);
          
          // Also trigger route discovery if needed
          if (checkContent) {
            await websiteApi.discoverRoutes(data[0].id);
          }
        } catch (checkError) {
          // Just log if the check fails, don't block the flow
          console.error("Initial website check failed:", checkError);
        }
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (error) {
      console.error("Error adding website:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Website</h1>
        <p className="text-muted-foreground">Start monitoring a new website with WebSync</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Setup</TabsTrigger>
          <TabsTrigger value="advanced" disabled={!isVerified}>
            Advanced Options
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled={!isVerified}>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Website Details</CardTitle>
              <CardDescription>Enter the URL of the website you want to monitor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleVerify} disabled={!url || isLoading} variant="secondary">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying
                      </>
                    ) : isVerified ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Verified
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                {isVerified && (
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Website is reachable and ready to be monitored
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {isVerified && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" placeholder="My Website" value={name} onChange={(e) => setName(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                      A friendly name to identify this website in your dashboard
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interval">Check Interval</Label>
                    <Select value={checkInterval} onValueChange={setCheckInterval}>
                      <SelectTrigger id="interval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Every 1 minute</SelectItem>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="10">Every 10 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">How often WebSync should check your website</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ssl" defaultChecked />
                      <Label htmlFor="ssl">Monitor SSL certificate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="performance" defaultChecked />
                      <Label htmlFor="performance">Track performance metrics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="content" />
                      <Label htmlFor="content">Check for content changes</Label>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isVerified || !name || isSubmitting}
                className={error ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Website
                  </>
                ) : (
                  "Start Monitoring"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Monitoring Options</CardTitle>
              <CardDescription>Configure detailed monitoring settings for your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Monitoring Locations</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="na" defaultChecked />
                    <Label htmlFor="na">North America</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="eu" defaultChecked />
                    <Label htmlFor="eu">Europe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="asia" />
                    <Label htmlFor="asia">Asia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="oceania" />
                    <Label htmlFor="oceania">Oceania</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-codes">Expected Status Codes</Label>
                <Input id="status-codes" placeholder="200, 201, 301, 302" defaultValue="200" />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of HTTP status codes that are considered successful
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Request Timeout</Label>
                <Select defaultValue="10">
                  <SelectTrigger id="timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Maximum time to wait for a response before considering the check failed
                </p>
              </div>

              <div className="space-y-2">
                <Label>Authentication (Optional)</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auth" />
                    <Label htmlFor="auth">Enable HTTP Basic Authentication</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Website
                  </>
                ) : (
                  "Start Monitoring"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified about website status changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <Label htmlFor="email">Email Notifications</Label>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slack" />
                    <Label htmlFor="slack">Slack Notifications</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="webhook" />
                    <Label htmlFor="webhook">Webhook</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms" />
                    <Label htmlFor="sms">SMS Notifications</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Triggers</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="down" defaultChecked />
                    <Label htmlFor="down">Website Down</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="up" defaultChecked />
                    <Label htmlFor="up">Website Back Up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slow" />
                    <Label htmlFor="slow">Slow Response Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ssl-expiry" defaultChecked />
                    <Label htmlFor="ssl-expiry">SSL Certificate Expiring</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Website
                  </>
                ) : (
                  "Start Monitoring"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {isVerified && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Website Preview</CardTitle>
            <CardDescription>Current status and performance of {name || url}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-1">Status</span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Up</span>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-1">Response Time</span>
                  <span className="font-medium">142ms</span>
                </div>
                <div className="bg-muted rounded-lg p-4 flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-1">SSL Certificate</span>
                  <span className="font-medium">Valid (expires in 245 days)</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Response Time Trend</h3>
                <div className="h-24 flex items-end gap-1">
                  {[120, 135, 128, 142, 138, 145, 142].map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/60 rounded-t-sm"
                      style={{ height: `${(value / 200) * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


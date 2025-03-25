"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bell, Check, Gauge, LineChart, Shield, Zap, AlertCircle, Brain, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect } from "react"

export default function Home() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const benefitsRef = useRef(null)
  const notificationsRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.3 })
  const notificationsInView = useInView(notificationsRef, { once: true, amount: 0.3 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  useEffect(() => {
    // Preload animations
    const preloadAnimations = () => {
      setTimeout(() => {
        document.querySelectorAll(".hero-animate-in").forEach((el) => {
          el.classList.add("visible")
        })
      }, 100)
    }

    preloadAnimations()
  }, [])

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-hero overflow-hidden" ref={heroRef}>
        <div className="container px-4 md:px-6 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <motion.div
            className="flex flex-col items-center justify-center text-center space-y-8 relative"
            variants={containerAnimation}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemAnimation}>
              <Badge className="inline-flex mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Monitoring
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none mb-4">
                <span className="gradient-text">WebSync</span>
              </h1>
              <p className="text-xl font-medium mb-6">Website Monitoring Reimagined</p>
              <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto">
                Detect issues before your users do. WebSync monitors your websites 24/7 and sends
                <span className="text-primary font-medium"> instant email notifications </span>
                when problems arise, with
                <span className="text-primary font-medium"> AI-powered error analysis </span>
                to help you fix issues quickly.
              </p>
            </motion.div>
            <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={itemAnimation}>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="gap-1 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:shadow-primary/20 btn-shine"
                >
                  Start Monitoring <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all hover:bg-primary/10 hover:border-primary/30"
                >
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground"
              variants={itemAnimation}
            >
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Free to use
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                No credit card required
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center mt-16"
            variants={itemAnimation}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.div
              className="relative w-full max-w-4xl h-[350px] md:h-[450px] rounded-lg overflow-hidden enhanced-glass-card"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[85%] h-[85%] glass rounded-lg shadow-lg p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold">WebSync Dashboard</div>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-md p-3 flex flex-col">
                        <div className="text-sm font-medium mb-2">Uptime</div>
                        <div className="text-2xl font-bold">99.9%</div>
                        <div className="mt-auto h-8 bg-primary/10 rounded-md relative overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-primary w-[99%]"
                            initial={{ width: 0 }}
                            animate={{ width: "99%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-md p-3 flex flex-col">
                        <div className="text-sm font-medium mb-2">Response Time</div>
                        <div className="text-2xl font-bold">124ms</div>
                        <div className="mt-auto h-8 bg-primary/10 rounded-md relative overflow-hidden">
                          <div className="h-full w-full flex items-end">
                            {[...Array(10)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-full h-[30%] bg-primary mx-[1px]"
                                initial={{ height: "0%" }}
                                animate={{
                                  height: `${Math.max(20, Math.min(100, 30 + Math.sin(i * 0.8) * 20))}%`,
                                }}
                                transition={{
                                  duration: 0.5,
                                  delay: 0.5 + i * 0.1,
                                  ease: "easeOut",
                                }}
                              ></motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-md p-3 col-span-2">
                        <div className="text-sm font-medium mb-2">Monitored Sites</div>
                        <div className="space-y-2">
                          <motion.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-sm">example.com</span>
                            </div>
                            <span className="text-xs text-muted-foreground">2s ago</span>
                          </motion.div>
                          <motion.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              <span className="text-sm">dashboard.app</span>
                            </div>
                            <span className="text-xs text-muted-foreground">5s ago</span>
                          </motion.div>
                          <motion.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                              <span className="text-sm">api.service.io</span>
                            </div>
                            <span className="text-xs text-muted-foreground">30s ago</span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Notification & AI Analysis Section */}
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 dark:bg-muted/10 relative overflow-hidden"
        ref={notificationsRef}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={notificationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Instant Notifications & <span className="gradient-text">AI Analysis</span>
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[800px]">
              Get alerted immediately when issues occur and receive detailed AI-powered insights to fix problems fast
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Notification Card */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: -30 }}
              animate={notificationsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="enhanced-glass-card h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Instant Email Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    Never miss a critical issue with real-time alerts sent directly to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Website Down Alert</h4>
                          <span className="text-xs text-muted-foreground">2 minutes ago</span>
                        </div>
                        <p className="text-sm">
                          Your website api.example.com is currently down. We've detected a server connection timeout.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="text-xs text-primary">Email notification sent to admin@example.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Email alerts sent within seconds of detecting an issue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Customizable notification preferences and thresholds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Integrations with Slack, SMS, and webhooks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Escalation policies for critical issues</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Analysis Card */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, x: 30 }}
              animate={notificationsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="enhanced-glass-card h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>AI-Powered Error Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Our AI analyzes errors to determine root causes and provide actionable insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-medium">AI Analysis Results</h4>
                        <div className="ai-analysis-wave my-2 bg-primary/5 rounded-md"></div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs">1</span>
                            </div>
                            <p className="text-sm">Database connection timeout detected in your API server</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs">2</span>
                            </div>
                            <p className="text-sm">High CPU usage (95%) on database server preceding the outage</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs">3</span>
                            </div>
                            <p className="text-sm">
                              Recommended action: Optimize database query on line 127 in api/users.js
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">AI Analysis Features:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Root cause identification using machine learning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Pattern recognition to detect recurring issues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Actionable recommendations to fix problems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Predictive analytics to prevent future issues</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden" ref={howItWorksRef}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How <span className="gradient-text">WebSync</span> Works
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[800px]">
              Our AI-powered platform continuously monitors your websites to ensure optimal performance
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3 mt-12"
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {[
              {
                step: "1",
                title: "Add Your Websites",
                description: "Simply enter your website URLs and configure your monitoring preferences.",
                delay: 0,
              },
              {
                step: "2",
                title: "AI Monitoring Begins",
                description: "Our AI-powered system starts monitoring your websites from multiple global locations.",
                delay: 0.1,
              },
              {
                step: "3",
                title: "Get Instant Alerts",
                description:
                  "Receive email notifications when issues are detected, with detailed diagnostics and recommendations.",
                delay: 0.2,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                variants={itemAnimation}
                transition={{ delay: item.delay }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:shadow-primary/20 btn-shine"
              >
                Try It Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 dark:bg-muted/10 relative overflow-hidden"
        ref={featuresRef}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Monitoring Features
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Everything you need to keep your websites running smoothly
              </p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {[
              {
                icon: <Shield className="h-6 w-6 text-primary mb-2" />,
                title: "AI-Powered Issue Detection",
                description: "Our AI identifies potential issues before they affect your users",
                content:
                  "Advanced machine learning algorithms analyze patterns to predict and detect anomalies in your website's performance.",
              },
              {
                icon: <Zap className="h-6 w-6 text-primary mb-2" />,
                title: "Real-time Monitoring",
                description: "24/7 monitoring with instant alerts when issues are detected",
                content:
                  "Continuous checks from multiple global locations ensure your website is always available to users worldwide.",
              },
              {
                icon: <LineChart className="h-6 w-6 text-primary mb-2" />,
                title: "Performance Analytics",
                description: "Detailed insights into your website's performance",
                content:
                  "Track load times, uptime, and other critical metrics with interactive graphs and customizable dashboards.",
              },
              {
                icon: <Bell className="h-6 w-6 text-primary mb-2" />,
                title: "Custom Alerts",
                description: "Get notified your way when issues arise",
                content:
                  "Configure alerts via email, SMS, Slack, or webhooks with customizable thresholds and schedules.",
              },
              {
                icon: <Gauge className="h-6 w-6 text-primary mb-2" />,
                title: "Performance Optimization",
                description: "Actionable recommendations to improve your site",
                content:
                  "Get AI-powered suggestions to optimize loading times, reduce errors, and enhance user experience.",
              },
              {
                icon: (
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
                    className="h-6 w-6 text-primary mb-2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                ),
                title: "API & Webhook Integration",
                description: "Connect with your existing tools and workflows",
                content:
                  "Seamlessly integrate with your development pipeline, CI/CD tools, and other services via our robust API.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemAnimation}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="enhanced-glass-card h-full">
                  <CardHeader className="pb-2">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/features">
              <Button size="lg" className="btn-hover shadow-sm hover:shadow-lg hover:shadow-primary/10 btn-shine">
                View All Features <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden" ref={benefitsRef}>
        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose <span className="gradient-text">WebSync</span>
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-[800px]">
              Join thousands of developers and businesses who trust WebSync for their monitoring needs
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {[
              {
                title: "Proactive Monitoring",
                description: "Detect issues before your users do with AI-powered predictive analytics.",
              },
              {
                title: "Save Development Time",
                description: "Focus on building features, not fixing unexpected downtime issues.",
              },
              {
                title: "Improve User Experience",
                description: "Ensure your websites are always fast, reliable, and available.",
              },
              {
                title: "Reduce Operational Costs",
                description: "Minimize the impact of outages and performance issues on your business.",
              },
            ].map((benefit, index) => (
              <motion.div key={index} className="flex flex-col items-center text-center" variants={itemAnimation}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="w-full py-12 md:py-24 lg:py-32 border-t bg-gradient-hero relative overflow-hidden"
        ref={ctaRef}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[30%] right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to monitor your websites?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of developers and businesses who trust WebSync for their monitoring needs.
              </p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:shadow-primary/20 btn-shine"
                >
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all hover:bg-primary/10 hover:border-primary/30"
                >
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Free forever plan
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Cancel anytime
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


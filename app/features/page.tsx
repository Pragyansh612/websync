"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Code,
  Cpu,
  Database,
  Globe,
  LineChart,
  Lock,
  MessageSquare,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function FeaturesPage() {
  const headerRef = useRef(null)
  const mainFeatureRef = useRef(null)
  const featureGridRef = useRef(null)
  const advancedFeaturesRef = useRef(null)
  const ctaRef = useRef(null)

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const mainFeatureInView = useInView(mainFeatureRef, { once: true, amount: 0.3 })
  const featureGridInView = useInView(featureGridRef, { once: true, amount: 0.2 })
  const advancedFeaturesInView = useInView(advancedFeaturesRef, { once: true, amount: 0.3 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 })

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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero overflow-hidden" ref={headerRef}>
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
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={containerAnimation}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="gradient-text">WebSync</span> Features
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed mt-4">
                Discover all the powerful tools and capabilities that make WebSync the leading AI-powered website
                monitoring platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="w-full py-12 md:py-24" ref={mainFeatureRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid gap-6 lg:grid-cols-2 lg:gap-12"
            initial="hidden"
            animate={mainFeatureInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            <motion.div className="space-y-4" variants={itemAnimation}>
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">Core Monitoring</div>
              <h2 className="text-3xl font-bold tracking-tight">AI-Powered Issue Detection</h2>
              <p className="text-muted-foreground md:text-lg/relaxed">
                Our advanced AI algorithms continuously analyze your website's performance patterns to identify
                potential issues before they impact your users. By learning from historical data, WebSync can predict
                anomalies and alert you to take preventive action.
              </p>
              <ul className="grid gap-2 py-4">
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Predictive anomaly detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Pattern recognition for error prediction</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Automated root cause analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Self-improving monitoring accuracy</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              variants={itemAnimation}
              whileInView={{
                scale: [0.95, 1],
                opacity: [0.5, 1],
                transition: { duration: 0.8, ease: "easeOut" },
              }}
            >
              <div className="relative w-full h-[350px] rounded-lg overflow-hidden shadow-xl enhanced-glass-card enhanced-gradient-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-background rounded-lg shadow-lg p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold">AI Issue Detection</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="bg-muted rounded-md p-3 flex flex-col">
                        <div className="text-sm font-medium mb-2">Anomaly Detection</div>
                        <div className="h-24 bg-primary/10 rounded-md relative overflow-hidden">
                          <motion.div
                            className="absolute inset-0 flex items-end"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            {[...Array(24)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-full bg-primary/60 mx-[1px]"
                                style={{
                                  height: `${Math.max(5, Math.min(100, 30 + Math.sin(i * 0.5) * 20 + (i === 18 ? 50 : 0)))}%`,
                                  backgroundColor: i === 18 ? "hsl(var(--destructive))" : "",
                                }}
                                initial={{ height: 0 }}
                                animate={{
                                  height: `${Math.max(5, Math.min(100, 30 + Math.sin(i * 0.5) * 20 + (i === 18 ? 50 : 0)))}%`,
                                }}
                                transition={{
                                  duration: 0.5,
                                  delay: 0.5 + i * 0.03,
                                  ease: "easeOut",
                                }}
                              ></motion.div>
                            ))}
                          </motion.div>
                          {/* Anomaly marker */}
                          <motion.div
                            className="absolute top-2 right-16 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                          >
                            Anomaly Detected
                          </motion.div>
                        </div>
                      </div>
                      <div className="bg-muted rounded-md p-3">
                        <div className="text-sm font-medium mb-2">AI Analysis</div>
                        <div className="space-y-2">
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.7 }}
                          >
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm">Unusual spike in response time detected</span>
                          </motion.div>
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.9 }}
                          >
                            <Cpu className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Possible server resource constraint</span>
                          </motion.div>
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 2.1 }}
                          >
                            <Database className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Database query optimization recommended</span>
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

      {/* Feature Grid */}
      <section className="w-full py-12 md:py-24 bg-muted/50" ref={featureGridRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={featureGridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Comprehensive Monitoring Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Everything you need to keep your websites running smoothly and your users happy
              </p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
            initial="hidden"
            animate={featureGridInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {[
              {
                icon: <Zap className="h-6 w-6 text-primary mb-2" />,
                title: "Real-time Website Monitoring",
                description: "24/7 monitoring with instant alerts",
                details:
                  "Monitor your websites from multiple global locations with customizable check intervals as low as 10 seconds. Get instant notifications when issues are detected.",
                bullets: ["Global monitoring network", "Customizable check intervals", "Instant downtime detection"],
              },
              {
                icon: <LineChart className="h-6 w-6 text-primary mb-2" />,
                title: "Performance Analytics & Graphs",
                description: "Detailed insights into your website's performance",
                details:
                  "Track load times, uptime, and other critical metrics with interactive graphs and customizable dashboards. Analyze trends over time to identify areas for improvement.",
                bullets: ["Interactive performance graphs", "Historical data analysis", "Customizable dashboards"],
              },
              {
                icon: <Bell className="h-6 w-6 text-primary mb-2" />,
                title: "Custom Alerts & Notifications",
                description: "Get notified your way when issues arise",
                details:
                  "Configure alerts email with customizable thresholds and schedules. Set up escalation policies for critical issues.",
                bullets: ["Multiple notification channels", "Customizable alert thresholds", "Escalation policies"],
              },
              // {
              //   icon: <Code className="h-6 w-6 text-primary mb-2" />,
              //   title: "Webhook & API Integrations",
              //   description: "Connect with your existing tools and workflows",
              //   details:
              //     "Seamlessly integrate with your development pipeline, CI/CD tools, and other services via our robust API and webhook support.",
              //   bullets: ["RESTful API access", "Webhook notifications", "Integration with popular services"],
              // },
              {
                icon: <Smartphone className="h-6 w-6 text-primary mb-2" />,
                title: "Mobile App & Responsive Dashboard",
                description: "Monitor your websites on the go",
                details:
                  "Access your monitoring dashboard from any device with our responsive web interface and dedicated mobile apps for iOS and Android.",
                bullets: ["iOS and Android apps", "Push notifications", "Fully responsive dashboard"],
              },
              {
                icon: <Lock className="h-6 w-6 text-primary mb-2" />,
                title: "SSL Certificate Monitoring",
                description: "Never miss an expiring SSL certificate",
                details:
                  "Monitor SSL certificate validity and get alerts before they expire. Ensure your website remains secure and trusted by users.",
                bullets: [
                  "Certificate expiration alerts",
                  "SSL configuration validation",
                  "Security vulnerability checks",
                ],
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
                <Card className="h-full enhanced-glass-card enhanced-gradient-border overflow-hidden border-border/40">
                  <CardHeader className="pb-2">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.details}</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {feature.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5" ref={ctaRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to start monitoring?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Join thousands of developers and businesses who trust WebSync for their website monitoring needs.
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
                  className="enhanced-glass-card bg-primary/90 text-primary-foreground border-primary/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:shadow-primary/20 btn-shine"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-button border-white/30 dark:border-white/10 hover:bg-primary/10 hover:border-primary/30"
                >
                  View Demo Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


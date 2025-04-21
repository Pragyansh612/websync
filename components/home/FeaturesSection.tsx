"use client"

import { useRef } from "react"
import { m, useInView, useReducedMotion, LazyMotion, domAnimation } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Shield, Zap, LineChart, Bell, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function FeaturesSection() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { 
    once: true, 
    amount: 0.1,
    margin: "0px 0px -10% 0px" // Trigger earlier on mobile
  })
  const prefersReducedMotion = useReducedMotion()

  // Simplified animations for better performance
  const containerAnimation = prefersReducedMotion 
    ? { visible: {}, hidden: {} }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
            ease: "easeOut",
          },
        },
      }

  const itemAnimation = prefersReducedMotion
    ? { visible: {}, hidden: {} }
    : {
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        },
      }

  return (
    <LazyMotion features={domAnimation}>
      <section 
        className="w-full py-8 sm:py-10 lg:py-14 relative overflow-hidden backdrop-blur-sm will-change-transform" 
        ref={featuresRef}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-950/30 dark:to-black/30 -z-10" />

        {/* Simplified decorative elements for better performance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gray-300/10 dark:bg-gray-700/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gray-400/10 dark:bg-gray-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <m.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="space-y-2 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent p-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                Powerful Monitoring Features
              </h2>
              <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
                Everything you need to keep your websites running smoothly
              </p>
            </div>
          </m.div>

          <m.div
            className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-12"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {[
              {
                icon: (
                  <Shield className="h-6 w-6 text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))] mb-2" />
                ),
                title: "AI-Powered Issue Detection",
                description: "Our AI identifies potential issues before they affect your users",
                content:
                  "Advanced machine learning algorithms analyze patterns to predict and detect anomalies in your website's performance.",
              },
              {
                icon: (
                  <Zap className="h-6 w-6 text-[hsl(var(--accent-teal))] dark:text-[hsl(var(--accent-slate))] mb-2" />
                ),
                title: "Real-time Monitoring",
                description: "24/7 monitoring with instant alerts when issues are detected",
                content:
                  "Continuous checks from multiple global locations ensure your website is always available to users worldwide.",
              },
              {
                icon: <LineChart className="h-6 w-6 text-gray-800 dark:text-gray-200 mb-2" />,
                title: "Performance Analytics",
                description: "Detailed insights into your website's performance",
                content:
                  "Track load times, uptime, and other critical metrics with interactive graphs and customizable dashboards.",
              },
              {
                icon: <Bell className="h-6 w-6 text-gray-800 dark:text-gray-200 mb-2" />,
                title: "Custom Alerts",
                description: "Get notified your way when issues arise",
                content:
                  "Configure alerts via email, SMS, Slack, or webhooks with customizable thresholds and schedules.",
              },
              {
                icon: <Gauge className="h-6 w-6 text-gray-800 dark:text-gray-200 mb-2" />,
                title: "Performance Optimization",
                description: "Actionable recommendations to improve your site",
                content:
                  "Get AI-powered suggestions to optimize loading times, reduce errors, and enhance user experience.",
              },
            ].map((feature, index) => (
              <m.div
                key={index}
                variants={itemAnimation}
                whileHover={prefersReducedMotion ? {} : {
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="feature-card-container"
              >
                <Card className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/20 dark:border-gray-800/20 shadow-lg rounded-xl hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="p-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 w-fit">{feature.icon}</div>
                    <CardTitle className="mt-2 text-gray-900 dark:text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.content}</p>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </m.div>

          <m.div
            className="flex justify-center mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 15 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="/features">
              <Button
                size="lg"
                className="premium-button-accent glow-teal shadow-sm transition-all hover:shadow-lg hover:shadow-[hsl(var(--accent-teal))]/20 hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[hsl(var(--accent-slate))]/0 via-[hsl(var(--accent-teal))]/30 to-[hsl(var(--accent-slate))]/0 dark:from-[hsl(var(--accent-teal))]/0 dark:via-[hsl(var(--accent-slate))]/30 dark:to-[hsl(var(--accent-teal))]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                View All Features <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  )
}
"use client"

import { useRef } from "react"
import { m, useInView, useReducedMotion } from "framer-motion" // Added useReducedMotion
import Link from "next/link"
import { ArrowRight, Zap, Shield, LineChart, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BentoGridSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 }) // Reduced amount to trigger earlier
  const prefersReducedMotion = useReducedMotion() // For accessibility

  // Animation variants - optimized for smoother transitions
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 15 }, // Reduced y distance for smoother appearance
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
  }

  return (
    <section className="w-full py-6 sm:py-8 md:py-12 lg:py-14 relative overflow-hidden" ref={ref}>
      <div className="container px-4 md:px-6 mx-auto">
        {/* Section Header with improved responsive padding */}
        <m.div
          className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2 max-w-[800px] px-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Why smart teams choose <span className="text-slate-700 dark:text-slate-300">WebSync</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl/relaxed">
              Keep your websites running smoothly with our comprehensive monitoring platform
            </p>
          </div>
        </m.div>

        {/* Grid layout with improved responsive spacing */}
        <m.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          {/* Main feature - spans 2 columns and 2 rows with improved responsive layout */}
          <m.div
            className="sm:col-span-2 sm:row-span-2 relative group"
            variants={itemAnimation}
            whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className="h-full premium-glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col">
              <div className="p-2 sm:p-3 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm w-fit mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">AI-Powered Issue Detection</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
                Our AI identifies potential issues before they affect your users, analyzing patterns to predict and
                detect anomalies in your website's performance.
              </p>
              <div className="mt-auto">
                <div className="h-[140px] sm:h-[180px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden relative">
                  <m.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    <div className="w-[92%] h-[92%] bg-white/90 dark:bg-slate-900/90 rounded-lg p-3 sm:p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          AI Analysis
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">Potential issue detected</span>
                          </div>
                          <span className="text-xs text-slate-500">2m ago</span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <m.div
                            className="h-full bg-yellow-500"
                            initial={{ width: "0%" }}
                            animate={isInView ? { width: "65%" } : { width: "0%" }}
                            transition={{ delay: 0.6, duration: 1 }}
                          ></m.div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Database query on api.example.com is showing increased latency
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">Recommendation</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Optimize query in users.js line 127 to improve response time
                        </p>
                      </div>
                    </div>
                  </m.div>
                </div>
                <div className="mt-4 sm:mt-6 flex justify-end">
                  <Link href="/features">
                    <Button variant="ghost" className="group">
                      Learn more
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </m.div>

          {/* Regular features - single cell items with improved spacing */}
          <m.div
            className="relative group"
            variants={itemAnimation}
            whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className="h-full premium-glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col">
              <div className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm w-fit mb-3">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                24/7 monitoring with instant alerts when issues are detected, from multiple global locations.
              </p>
            </div>
          </m.div>

          <m.div
            className="relative group"
            variants={itemAnimation}
            whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className="h-full premium-glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col">
              <div className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm w-fit mb-3">
                <LineChart className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Performance Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                Track load times, uptime, and other critical metrics with interactive dashboards.
              </p>
            </div>
          </m.div>

          <m.div
            className="relative group"
            variants={itemAnimation}
            whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className="h-full premium-glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col">
              <div className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm w-fit mb-3">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Custom Alerts</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                Get notified your way when issues arise via email, SMS, Slack, or webhooks.
              </p>
            </div>
          </m.div>

          {/* Wide feature - spans 2 columns with improved mobile layout */}
          <m.div
            className="sm:col-span-2 relative group"
            variants={itemAnimation}
            whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
          >
            <div className="h-full premium-glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center">
              <div className="md:w-1/2 mb-4 md:mb-0 md:pr-6">
                <div className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm w-fit mb-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Continuous Uptime Checks</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  Monitor your websites around the clock with checks every minute from multiple global locations.
                </p>
              </div>
              <div className="md:w-1/2 h-[80px] sm:h-[100px] bg-slate-100 dark:bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden">
                <m.div
                  className="h-full w-full flex items-end justify-around px-2"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {[...Array(12)].map((_, i) => (
                    <m.div
                      key={i}
                      className="w-[4px] sm:w-[5px] bg-slate-700 dark:bg-slate-300 rounded-t-sm"
                      initial={{ height: "0%" }}
                      animate={
                        isInView
                          ? { height: `${Math.max(20, Math.min(90, 30 + Math.sin(i * 0.8) * 60))}%` }
                          : { height: "0%" }
                      }
                      transition={{
                        delay: 0.6 + i * 0.04,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    ></m.div>
                  ))}
                </m.div>
              </div>
            </div>
          </m.div>
        </m.div>

        {/* Call to action with improved responsive margins */}
        <m.div
          className="flex justify-center mt-8 sm:mt-10 md:mt-12"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/features">
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </m.div>
      </div>
    </section>
  )
}
"use client"

import { useRef } from "react"
import { m, useInView, useReducedMotion, LazyMotion, domAnimation } from "framer-motion"
import { Bell, Check, AlertCircle, Brain, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1,
    margin: "0px 0px -10% 0px" // Trigger earlier on mobile
  })
  const prefersReducedMotion = useReducedMotion()

  // Optimized animation variants with smoother easing
  const fadeIn = prefersReducedMotion 
    ? { visible: {}, hidden: {} }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
      }

  const fadeInUp = prefersReducedMotion
    ? { visible: {}, hidden: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
      }

  // More subtle and efficient animations for background elements
  const bgAnimation1 = prefersReducedMotion
    ? {}
    : {
        scale: [1, 1.05, 1],
        opacity: [0.3, 0.4, 0.3],
      }

  const bgAnimation2 = prefersReducedMotion
    ? {}
    : {
        scale: [1.05, 1, 1.05],
        opacity: [0.3, 0.4, 0.3],
      }

  return (
    <LazyMotion features={domAnimation}>
      <section className="w-full  relative overflow-hidden will-change-transform" ref={ref}>
        {/* Simplified background blur elements for better performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none backdrop-blur-md">
          <m.div
            className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-gray-500/10 blur-3xl"
            animate={bgAnimation1}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <m.div
            className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-gray-600/10 blur-3xl"
            animate={bgAnimation2}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          {/* Simplified dots pattern for better performance */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <m.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Instant Notifications & AI Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 md:text-xl max-w-[800px]">
              Get alerted immediately when issues occur and receive detailed AI-powered insights to fix problems fast
            </p>
          </m.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
            {/* Notification Card with enhanced glass effect */}
            <m.div
              className="flex flex-col"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ delay: 0.1 }}
              whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="relative premium-glass-card border border-white/30 dark:border-white/10 rounded-xl h-full overflow-hidden">
                {/* Subtle gradient border effect */}
                <div className="absolute inset-0 rounded-xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-gray-500/20 to-[hsl(var(--accent-slate))]/20 backdrop-blur-xl border border-white/20 dark:border-white/10">
                      <Bell className="h-6 w-6 text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))]" />
                    </div>
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                      Instant Email Notifications
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                    Never miss a critical issue with real-time alerts sent directly to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-lg p-4 border border-white/30 dark:border-white/5 shadow-inner relative overflow-hidden">
                    {/* Simplified glow effect for better performance */}
                    <m.div
                      className="absolute -inset-[100px] bg-gray-500/5 blur-3xl"
                      animate={prefersReducedMotion ? {} : {
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="flex items-start gap-3 relative z-10">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">Website Down Alert</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Your website api.example.com is currently down. We've detected a server connection timeout.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Mail className="h-4 w-4 text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))]" />
                          <span className="text-xs text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))]">
                            Email notification sent to admin@example.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Notification Features:</h4>
                    <ul className="space-y-2">
                      {[
                        "Email alerts sent within seconds of detecting an issue",
                        "Customizable notification preferences and thresholds",
                        "Integrations with Slack, SMS, and webhooks",
                        "Escalation policies for critical issues",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="p-1 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </m.div>

            {/* AI Analysis Card with enhanced glass effect */}
            <m.div
              className="flex flex-col"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ delay: 0.25 }}
              whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="relative premium-glass-card border border-white/30 dark:border-white/10 rounded-xl h-full overflow-hidden">
                {/* Subtle gradient border effect */}
                <div className="absolute inset-0 rounded-xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-gradient-to-br from-gray-600/20 to-[hsl(var(--accent-teal))]/20 backdrop-blur-xl border border-white/20 dark:border-white/10">
                      <Brain className="h-6 w-6 text-[hsl(var(--accent-teal))] dark:text-[hsl(var(--accent-slate))]" />
                    </div>
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                      AI-Powered Error Analysis
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                    Our AI analyzes errors to determine root causes and provide actionable insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-lg p-4 border border-white/30 dark:border-white/5 shadow-inner relative overflow-hidden">
                    {/* Simplified glow effect for better performance */}
                    <m.div
                      className="absolute -inset-[100px] bg-gray-600/5 blur-3xl"
                      animate={prefersReducedMotion ? {} : {
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    />

                    <div className="flex items-start gap-3 relative z-10">
                      <Brain className="h-5 w-5 text-gray-800 dark:text-gray-200 mt-1 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">AI Analysis Results</h4>
                        <div className="relative h-8 w-full my-2 bg-gradient-to-r from-gray-500/10 via-[hsl(var(--accent-slate))]/10 to-gray-500/10 dark:from-gray-800/20 dark:via-[hsl(var(--accent-teal))]/20 dark:to-gray-800/20 backdrop-blur-xl rounded-md overflow-hidden border border-white/30 dark:border-white/10">
                          <m.div
                            className="absolute inset-0 w-full"
                            initial={{ x: "-100%" }}
                            animate={prefersReducedMotion ? {} : { x: "100%" }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                          >
                            <div className="w-20 h-full bg-gradient-to-r from-transparent via-[hsl(var(--accent-slate))]/40 to-transparent dark:via-[hsl(var(--accent-teal))]/40"></div>
                          </m.div>
                        </div>
                        <div className="space-y-2">
                          {[
                            "Database connection timeout detected in your API server",
                            "High CPU usage (95%) on database server preceding the outage",
                            "Recommended action: Optimize database query on line 127 in api/users.js",
                          ].map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-gray-500/20 to-[hsl(var(--accent-slate))]/20 backdrop-blur-md flex items-center justify-center shrink-0 mt-0.5 border border-white/30 dark:border-white/10">
                                <span className="text-xs text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))]">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">AI Analysis Features:</h4>
                    <ul className="space-y-2">
                      {[
                        "Root cause identification using machine learning",
                        "Pattern recognition to detect recurring issues",
                        "Actionable recommendations to fix problems",
                        "Predictive analytics to prevent future issues",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="p-1 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20">
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  )
}
"use client"

import { useRef } from "react"
import { m, useInView, useReducedMotion } from "framer-motion"

export default function BenefitsSection() {
  const benefitsRef = useRef(null)
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const prefersReducedMotion = useReducedMotion()

  // Optimized animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Reduced stagger time for better performance
        delayChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const benefits = [
    {
      title: "Proactive Monitoring",
      description: "Detect issues before your users do with AI-powered predictive analytics.",
      icon: "📊",
    },
    {
      title: "Save Development Time",
      description: "Focus on building features, not fixing unexpected downtime issues.",
      icon: "⏱️",
    },
    {
      title: "Improve User Experience",
      description: "Ensure your websites are always fast, reliable, and available.",
      icon: "🚀",
    },
    {
      title: "Reduce Operational Costs",
      description: "Minimize the impact of outages and performance issues on your business.",
      icon: "💰",
    },
  ]

  // Vertical card layout for "how it works" section
  const verticalCards = [
    {
      title: "Step 1: Connect",
      description: "Add your website URLs to WebSync's monitoring platform in just a few clicks.",
      icon: "🔌",
    },
    {
      title: "Step 2: Monitor",
      description: "Our AI begins tracking your site's performance, uptime, and user experience metrics.",
      icon: "👁️",
    },
    {
      title: "Step 3: Analyze",
      description: "Advanced algorithms detect patterns and potential issues before they affect users.",
      icon: "🧠",
    },
    {
      title: "Step 4: Alert",
      description: "Receive instant notifications when issues are detected, with detailed diagnostics.",
      icon: "🚨",
    },
  ]

  return (
    <section className="w-full py-24 lg:py-32 relative overflow-hidden" ref={benefitsRef}>
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-50/80 to-gray-100/80 dark:from-gray-950/30 dark:to-black/30 -z-10" />

      {/* Decorative elements - optimized with reduced number of elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gray-300/10 dark:bg-gray-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-400/10 dark:bg-gray-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative">
        <m.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              WebSync
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 md:text-xl max-w-[800px]">
            Join thousands of developers and businesses who trust WebSync for their monitoring needs
          </p>
        </m.div>

        <m.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
          initial="hidden"
          animate={benefitsInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          {benefits.map((benefit, index) => (
            <m.div
              key={index}
              className="flex flex-col items-center text-center relative group"
              variants={itemAnimation}
            >
              <div className="absolute inset-0 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-white dark:to-gray-300 flex items-center justify-center mb-4 shadow-lg transform transition-transform group-hover:scale-110 duration-300">
                <span className="text-2xl">{benefit.icon}</span>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                {benefit.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 px-4 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                {benefit.description}
              </p>
            </m.div>
          ))}
        </m.div>

        {/* Vertical cards for "How it Works" adventure-like experience */}
        <m.div
          className="mt-24 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
            Your Monitoring Adventure
          </h3>

          <div className="relative">
            {/* Vertical line connecting cards */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-500 rounded-full"></div>

            <div className="space-y-16">
              {verticalCards.map((card, index) => (
                <m.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                >
                  {/* Connection dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-white dark:to-gray-300 border-4 border-white dark:border-gray-900 z-10 flex items-center justify-center">
                    <span className="text-white dark:text-gray-900 font-bold text-sm">{index + 1}</span>
                  </div>

                  {/* Card positioned alternately left and right */}
                  <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                    <m.div
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl p-6 shadow-lg"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transition: { duration: 0.3 },
                      }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-white dark:to-gray-300 flex items-center justify-center mr-4 shadow-md">
                          <span className="text-xl">{card.icon}</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{card.title}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
                    </m.div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </m.div>

        {/* Stats section */}
        <m.div
          className="mt-24 max-w-6xl mx-auto bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl p-8 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-2">
                99.9%
              </div>
              <p className="text-gray-600 dark:text-gray-300">Average Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-2">
                10,000+
              </div>
              <p className="text-gray-600 dark:text-gray-300">Websites Monitored</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-2">
                3M+
              </div>
              <p className="text-gray-600 dark:text-gray-300">Issues Detected</p>
            </div>
          </div>
        </m.div>

        {/* Testimonial */}
        <m.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl p-8 relative">
            <svg
              className="absolute text-gray-600/20 h-24 w-24 -top-4 -left-4"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>

            <p className="text-gray-700 dark:text-gray-300 text-lg italic relative z-10">
              "WebSync has completely transformed how we monitor our web applications. The AI-powered insights have
              helped us reduce downtime by 78% and improve our response time to critical issues."
            </p>

            <div className="mt-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-white dark:to-gray-300 flex items-center justify-center text-white dark:text-black font-bold">
                JD
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Jane Doe</h4>
                <p className="text-gray-600 dark:text-gray-400">CTO, Tech Innovators</p>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}

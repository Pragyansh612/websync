"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 })

  return (
    <section className="w-full py-24 lg:py-32 relative overflow-hidden" ref={ctaRef}>
      {/* Premium background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black -z-10">
        <div className="absolute inset-0 futuristic-dots opacity-30"></div>
      </div>

      {/* Animated accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/5 w-64 h-64 bg-[hsl(var(--accent-teal))]/10 dark:bg-[hsl(var(--accent-teal))]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-[hsl(var(--accent-slate))]/10 dark:bg-[hsl(var(--accent-slate))]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative">
        <motion.div
          className="max-w-5xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/50 dark:border-gray-800/50 rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          {/* Accent border with gradient */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(var(--accent-slate))] via-[hsl(var(--accent-teal))] to-[hsl(var(--accent-purple))] dark:from-[hsl(var(--accent-teal))] dark:via-[hsl(var(--accent-slate))] dark:to-[hsl(var(--accent-purple))]"></div>

          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-[hsl(var(--accent-teal))]/10 dark:bg-[hsl(var(--accent-teal))]/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-[hsl(var(--accent-slate))]/10 dark:bg-[hsl(var(--accent-slate))]/10 rounded-full blur-2xl"></div>

          <div className="flex flex-col items-center justify-center space-y-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <Sparkles className="h-5 w-5 text-[hsl(var(--accent-teal))] dark:text-[hsl(var(--accent-teal))]" />
              <span className="text-sm font-medium text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))]">
                Premium Monitoring
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                Ready to take your
                  monitoring
                to the next level?
              </h2>
            </motion.div>

            <motion.p
              className="max-w-[700px] text-gray-700 dark:text-gray-300 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of developers and businesses who trust WebSync for their monitoring needs. Start for free
              today and see the difference!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="premium-button-accent glow-teal gap-1 shadow-lg shadow-[hsl(var(--accent-teal))]/20 transition-all hover:shadow-xl hover:shadow-[hsl(var(--accent-teal))]/30 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[hsl(var(--accent-slate))]/0 via-[hsl(var(--accent-teal))]/30 to-[hsl(var(--accent-slate))]/0 dark:from-[hsl(var(--accent-teal))]/0 dark:via-[hsl(var(--accent-slate))]/30 dark:to-[hsl(var(--accent-teal))]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                  Get Started for Free <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(var(--accent-slate))]/50 dark:border-[hsl(var(--accent-teal))]/50 text-[hsl(var(--accent-slate))] dark:text-[hsl(var(--accent-teal))] transition-all hover:bg-[hsl(var(--accent-slate))]/5 dark:hover:bg-[hsl(var(--accent-teal))]/5 hover:border-[hsl(var(--accent-slate))] dark:hover:border-[hsl(var(--accent-teal))]"
                >
                  View Dashboard
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
              initial="hidden"
              animate={ctaInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.6,
                  },
                },
              }}
            >
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-white/50 dark:border-gray-800/50"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <Check className="mr-2 h-5 w-5 text-[hsl(var(--accent-teal))] dark:text-[hsl(var(--accent-teal))]" />
                  <span className="text-gray-800 dark:text-gray-200">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          className="absolute -bottom-8 left-1/4 transform -translate-x-1/2 hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full py-2 px-4 border border-white/50 dark:border-gray-800/50 shadow-lg text-sm text-gray-800 dark:text-gray-200 flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            24/7 Monitoring
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-8 right-1/4 transform translate-x-1/2 hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full py-2 px-4 border border-white/50 dark:border-gray-800/50 shadow-lg text-sm text-gray-800 dark:text-gray-200 flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent-teal))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--accent-teal))]"></span>
            </span>
            AI-Powered Analytics
          </div>
        </motion.div>
      </div>
    </section>
  )
}

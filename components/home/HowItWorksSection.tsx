"use client"

import Link from "next/link"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HowItWorksSection() {
  const sectionRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref)

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="w-full py-20 md:py-24 lg:py-32 relative overflow-hidden" ref={ref}>
      {/* Enhanced glass effect background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none backdrop-blur-xl">
        {/* Main gradient blobs */}
        <motion.div
          className="absolute top-[30%] left-[10%] w-[40%] h-[40%] rounded-full bg-gray-500/10 blur-3xl"
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
          className="absolute bottom-[20%] right-[15%] w-[35%] h-[35%] rounded-full bg-gray-600/10 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Futuristic grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>

        {/* Subtle glass effect overlay */}
        <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-md"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              WebSync
            </span>{" "}
            Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 md:text-xl max-w-[800px]">
            Our AI-powered platform continuously monitors your websites to ensure optimal performance
          </p>
        </motion.div>

        <motion.div
          className="grid gap-12 md:grid-cols-3 mt-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {[
            {
              step: "1",
              title: "Add Your Websites",
              description: "Simply enter your website URLs and configure your monitoring preferences.",
              delay: 0,
              gradient: "from-gray-900 to-gray-700 dark:from-white dark:to-gray-300",
              bgGlow: "from-gray-500/30 to-gray-700/30 dark:from-gray-300/20 dark:to-gray-500/20",
            },
            {
              step: "2",
              title: "AI Monitoring Begins",
              description: "Our AI-powered system starts monitoring your websites from multiple global locations.",
              delay: 0.1,
              gradient: "from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400",
              bgGlow: "from-gray-500/30 to-gray-700/30 dark:from-gray-300/20 dark:to-gray-500/20",
            },
            {
              step: "3",
              title: "Get Instant Alerts",
              description:
                "Receive email notifications when issues are detected, with detailed diagnostics and recommendations.",
              delay: 0.2,
              gradient: "from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white",
              bgGlow: "from-gray-500/30 to-gray-700/30 dark:from-gray-300/20 dark:to-gray-500/20",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              variants={staggerItem}
              transition={{ delay: item.delay }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="mb-6 relative">
                {/* Premium glass style number indicator */}
                <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl flex items-center justify-center z-10 relative shadow-xl shadow-gray-500/10 border border-white/30 dark:border-white/10 premium-glass-card">
                  <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}>
                    {item.step}
                  </span>
                </div>

                {/* Animated glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.bgGlow} blur-xl`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                />

                {/* Orbit effect (adding a futuristic touch) */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 5 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/10 dark:border-white/5"></div>
                </motion.div>
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 5 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/5 dark:border-white/3"></div>
                </motion.div>
              </div>

              <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black backdrop-blur-sm shadow-lg shadow-gray-500/20 transition-all hover:shadow-xl hover:shadow-gray-500/30 hover:-translate-y-1 border border-white/20 dark:border-white/10 premium-btn-shine relative overflow-hidden"
            >
              Try It Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

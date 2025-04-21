"use client"

import Link from "next/link"
import { useRef } from "react"
import { m, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 }) // Reduced amount to trigger earlier
  const prefersReducedMotion = useReducedMotion()

  // Optimized animation variants with responsive considerations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 }, // Reduced distance for smoother animation
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 15 }, // Reduced distance for smoother animation
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="w-full relative overflow-hidden" ref={ref}>
      {/* Enhanced glass effect background elements - refined for better performance and aesthetics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none backdrop-blur-md">
        {/* Main gradient blobs - optimized for better performance */}
        <m.div
          className="absolute top-[30%] left-[10%] w-[35%] md:w-[40%] h-[35%] md:h-[40%] rounded-full bg-gray-500/10 blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <m.div
          className="absolute bottom-[20%] right-[15%] w-[30%] md:w-[35%] h-[30%] md:h-[35%] rounded-full bg-gray-600/10 blur-3xl"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1.08, 1, 1.08],
                  opacity: [0.2, 0.4, 0.2],
                }
          }
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Responsive futuristic grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1px)] sm:bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:18px_18px] sm:bg-[length:20px_20px]"></div>

        {/* Subtle glass effect overlay */}
        <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-sm"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <m.div
          className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-10 md:mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            How{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              WebSync
            </span>{" "}
            Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-[800px] mt-2">
            Our AI-powered platform continuously monitors your websites to ensure optimal performance
          </p>
        </m.div>

        <m.div
          className="grid gap-8 sm:gap-10 md:gap-12 sm:grid-cols-2 md:grid-cols-3 mt-12 sm:mt-14 md:mt-16"
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
            <m.div
              key={index}
              className="flex flex-col items-center text-center group"
              variants={staggerItem}
              transition={{ delay: item.delay }}
              whileHover={prefersReducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
            >
              <div className="mb-5 sm:mb-6 relative">
                {/* Premium glass style number indicator with improved aesthetics */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl flex items-center justify-center z-10 relative shadow-xl shadow-gray-500/10 border border-white/30 dark:border-white/10 premium-glass-card transition-shadow duration-300 group-hover:shadow-gray-500/20">
                  <span className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}>
                    {item.step}
                  </span>
                </div>

                {/* Refined animated glow effect - better for performance and aesthetics */}
                <m.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.bgGlow} blur-xl`}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.15, 1],
                          opacity: [0.5, 0.7, 0.5],
                        }
                  }
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: index * 0.4,
                  }}
                />

                {/* Simplified orbit effect - only shown on non-mobile and for users without reduced motion preferences */}
                {!prefersReducedMotion && (
                  <>
                    <m.div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none hidden sm:block"
                      style={{ zIndex: 5 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 h-20 sm:h-24 rounded-full border border-white/10 dark:border-white/5"></div>
                    </m.div>
                    <m.div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none hidden sm:block"
                      style={{ zIndex: 5 }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-28 h-24 sm:h-28 rounded-full border border-white/5 dark:border-white/3"></div>
                    </m.div>
                  </>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{item.description}</p>
            </m.div>
          ))}
        </m.div>

        <m.div
          className="flex justify-center mt-10 sm:mt-12 md:mt-16"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black backdrop-blur-sm shadow-lg shadow-gray-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/30 hover:-translate-y-1 border border-white/20 dark:border-white/10 premium-btn-shine relative overflow-hidden"
            >
              Try It Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </m.div>
      </div>
    </section>
  )
}
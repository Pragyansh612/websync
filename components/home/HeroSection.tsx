"use client"

import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { ArrowRight, Check, Zap, LineChart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animation variants
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const getMouseParallax = (factor = 1) => {
    if (typeof window === "undefined") return { x: 0, y: 0 }

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    return {
      x: ((mousePosition.x - centerX) / 50) * factor,
      y: ((mousePosition.y - centerY) / 50) * factor,
    }
  }

  const features = [
    {
      icon: <Zap className="h-4 w-4 text-black dark:text-white" />,
      text: "Real-time alerts",
    },
    {
      icon: <LineChart className="h-4 w-4 text-black dark:text-white" />,
      text: "Performance tracking",
    },
    {
      icon: <Clock className="h-4 w-4 text-black dark:text-white" />,
      text: "24/7 monitoring",
    },
  ]

  return (
    <section className="w-full py-4 md:py-6 lg:py-8 xl:py-10 overflow-hidden futuristic-bg grid-lines" ref={heroRef}>
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gray-500/20 to-gray-700/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center text-center space-y-8 relative"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem} className="relative z-10">
            <motion.div
              className="inline-flex mb-4 bg-black/5 backdrop-blur-lg border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-full px-4 py-1.5 premium-glass-element"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="relative flex h-2 w-2 mr-2 self-center"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
              </motion.span>
              <span className="text-black dark:text-white text-sm font-medium">AI-Powered Monitoring</span>
            </motion.div>

            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl xl:text-8xl/none mb-4 neon-glow">WebSync</h1>

            <p
              className="text-xl font-medium mb-6 text-black/80 dark:text-white/80"
              data-text="Website Monitoring Reimagined"
            >
              Website Monitoring Reimagined
            </p>

            <motion.div
              className="max-w-[750px] mx-auto premium-glass-card p-8 rounded-xl shadow-lg border-opacity-50 backdrop-blur-lg futuristic-border"
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${getMouseParallax(-0.5).y}deg) rotateY(${getMouseParallax(0.5).x}deg)`,
              }}
              transition={{ duration: 0.1 }}
            >
              <p className="text-black/70 dark:text-white/70 md:text-xl">
                Detect issues before your users do. WebSync monitors your websites 24/7 and sends
                <span className="text-black dark:text-white font-medium"> instant email notifications </span>
                when problems arise, with
                <span className="text-black dark:text-white font-medium"> AI-powered error analysis </span>
                to help you fix issues quickly.
              </p>
            </motion.div>
          </motion.div>

          <motion.div className="flex flex-col gap-3 min-[400px]:flex-row" variants={staggerItem}>
            <Link href="/signup">
              <Button size="lg" className="futuristic-button premium-btn-shine gap-1 text-base px-8 py-6">
                Start Monitoring <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="premium-button-outline text-base px-8 py-6">
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 premium-glass-card py-3 px-6 rounded-full"
            variants={staggerItem}
          >
            {features.map((feature, index) => (
              <motion.div key={index} className="flex items-center" whileHover={{ scale: 1.05 }}>
                {feature.icon}
                <span className="ml-2 text-sm text-black/80 dark:text-white/80">{feature.text}</span>
              </motion.div>
            ))}
            <div className="flex items-center">
              <Check className="h-4 w-4 text-black dark:text-white" />
              <span className="ml-2 text-sm text-black/80 dark:text-white/80">Free trial</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="flex items-center justify-center mt-16"
          variants={scaleIn}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          <div className="relative w-full max-w-5xl h-[350px] md:h-[500px] rounded-2xl overflow-hidden scan-line">
            <motion.div
              className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/90 to-gray-100/80 dark:from-gray-900/90 dark:to-black/80 border border-white/50 dark:border-gray-800/50 rounded-2xl shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(2000px) rotateX(${getMouseParallax(-0.2).y}deg) rotateY(${getMouseParallax(0.2).x}deg)`,
              }}
              transition={{ duration: 0.1 }}
              animate={{
                boxShadow: [
                  "0 25px 50px rgba(0, 0, 0, 0.1)",
                  "0 25px 50px rgba(0, 0, 0, 0.15)",
                  "0 25px 50px rgba(0, 0, 0, 0.1)",
                ],
                borderColor: ["rgba(255, 255, 255, 0.5)", "rgba(230, 230, 230, 0.5)", "rgba(255, 255, 255, 0.5)"],
              }}
              // transition={{
              //   duration: 8,
              //   repeat: Number.POSITIVE_INFINITY,
              //   ease: "easeInOut",
              // }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[92%] h-[92%] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col border border-gray-200/50 dark:border-gray-700/50 premium-gradient-border">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-lg font-bold text-black dark:text-white flex items-center">
                      <motion.span
                        className="bg-black dark:bg-white h-4 w-4 rounded-full mr-2"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      ></motion.span>
                      WebSync Dashboard
                    </div>
                    <div className="flex space-x-2">
                      <motion.div className="w-3 h-3 rounded-full bg-red-500" whileHover={{ scale: 1.2 }}></motion.div>
                      <motion.div
                        className="w-3 h-3 rounded-full bg-yellow-500"
                        whileHover={{ scale: 1.2 }}
                      ></motion.div>
                      <motion.div
                        className="w-3 h-3 rounded-full bg-green-500"
                        whileHover={{ scale: 1.2 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-gray-900/80 rounded-lg p-4 flex flex-col shadow-sm border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md premium-glass-element">
                      <div className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Uptime</div>
                      <div className="text-3xl font-bold text-black dark:text-white">99.9%</div>
                      <div className="mt-auto h-10 bg-gray-100 dark:bg-gray-800/30 rounded-md relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 w-[99%]"
                          initial={{ width: 0 }}
                          animate={{ width: "99%" }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-900/80 rounded-lg p-4 flex flex-col shadow-sm border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md premium-glass-element">
                      <div className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Response Time</div>
                      <div className="text-3xl font-bold text-black dark:text-white">124ms</div>
                      <div className="mt-auto h-10 bg-gray-100 dark:bg-gray-800/30 rounded-md relative overflow-hidden">
                        <div className="h-full w-full flex items-end">
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-full h-[30%] bg-gradient-to-t from-black to-gray-700 dark:from-white dark:to-gray-300 mx-[1px]"
                              initial={{ height: "0%" }}
                              animate={{
                                height: `${Math.max(20, Math.min(100, 30 + Math.sin(i * 0.8) * 20))}%`,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: 0.5 + i * 0.1,
                                ease: "easeOut",
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "mirror",
                                repeatDelay: 2,
                              }}
                            ></motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-900/80 rounded-lg p-4 flex flex-col shadow-sm border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md premium-glass-element">
                      <div className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Total Checks</div>
                      <div className="text-3xl font-bold text-black dark:text-white">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1.2 }}
                        >
                          128,457
                        </motion.span>
                      </div>
                      <div className="mt-auto h-10 bg-gray-100 dark:bg-gray-800/30 rounded-md relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300"
                          initial={{ width: "0%" }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-900/80 rounded-lg p-4 col-span-1 md:col-span-3 shadow-sm border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md premium-glass-element">
                      <div className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">Monitored Sites</div>
                      <div className="space-y-3">
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1 }}
                        >
                          <div className="flex items-center">
                            <motion.div
                              className="w-2 h-2 rounded-full bg-green-500 mr-2"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 0,
                              }}
                            ></motion.div>
                            <span className="text-sm text-black dark:text-white">example.com</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2s ago</span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.2 }}
                        >
                          <div className="flex items-center">
                            <motion.div
                              className="w-2 h-2 rounded-full bg-green-500 mr-2"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 0.5,
                              }}
                            ></motion.div>
                            <span className="text-sm text-black dark:text-white">dashboard.app</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">5s ago</span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.4 }}
                        >
                          <div className="flex items-center">
                            <motion.div
                              className="w-2 h-2 rounded-full bg-yellow-500 mr-2"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 1,
                              }}
                            ></motion.div>
                            <span className="text-sm text-black dark:text-white">api.service.io</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">30s ago</span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.6 }}
                        >
                          <div className="flex items-center">
                            <motion.div
                              className="w-2 h-2 rounded-full bg-red-500 mr-2"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 0,
                              }}
                            ></motion.div>
                            <span className="text-sm text-black dark:text-white">status.cloud.dev</span>
                          </div>
                          <motion.span
                            className="text-xs text-red-500 font-medium"
                            animate={{
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            Alert triggered
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

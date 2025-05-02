"use client"

import Link from "next/link"
import { useRef, useState, useEffect, useMemo } from "react"
import { type MotionStyle, m, useInView, useReducedMotion } from "framer-motion"
import { ArrowRight, Check, Zap, LineChart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import ParticleField from "../ui/ParticleField"

// const getCardStyle = (i: number): MotionStyle => ({
//   opacity: 1,
//   scale: 0.95,
//   x: 0,
//   // Add more motion-style-compliant props as needed
// });


// Features data - moved outside component to prevent re-creation on each render
const features = [
  {
    icon: <Zap className="h-4 w-4 text-slate-900 dark:text-white" />,
    text: "Real-time alerts",
  },
  {
    icon: <LineChart className="h-4 w-4 text-slate-900 dark:text-white" />,
    text: "Performance tracking",
  },
  {
    icon: <Clock className="h-4 w-4 text-slate-900 dark:text-white" />,
    text: "24/7 monitoring",
  },
];

// Animation variants - moved outside to prevent recreation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.1 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    setIsMounted(true)
    checkMobile()

    // Debounced resize handler
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  useEffect(() => {
    // Check for dark mode on mount
    const checkDarkMode = () => {
      // Check if 'dark' class is on the document or for system preference
      const isDark = document.documentElement.classList.contains('dark') || 
                    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Optional: Listen for changes if you have a theme toggle
    const darkModeObserver = new MutationObserver(checkDarkMode);
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      darkModeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isMounted]);

  // Highly optimized mouse tracking with debounce and conditional execution
  useEffect(() => {
    if (isMobile || prefersReducedMotion || !isMounted) return;

    let rafId: any = null;
    let lastUpdateTime = 0;
    const THROTTLE_MS = 50; // Only update every 50ms

    const handleMouseMove = (e: any) => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_MS) return;

      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Schedule the state update
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdateTime = now;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMounted, isMobile, prefersReducedMotion]);

  // Memoize the parallax calculation
  const mouseParallax = useMemo(() => {
    if (!isMounted || isMobile || prefersReducedMotion || typeof window === "undefined") {
      return { x: 0, y: 0 };
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return {
      x: ((mousePosition.x - centerX) / 50),
      y: ((mousePosition.y - centerY) / 50),
    };
  }, [mousePosition, isMounted, isMobile, prefersReducedMotion]);

  // Skip parallax effects on mobile completely
  const getCardStyle = (factor = 1): MotionStyle => {
    if (isMobile || prefersReducedMotion) return {};

    return {
      transformStyle: "preserve-3d" as const, // Type assertion needed for transformStyle
      x: 0, // Add basic MotionStyle properties
      y: 0,
      scale: 1,
      // Transform as custom CSS value using transform string
      transform: `perspective(1000px) rotateX(${mouseParallax.y * -0.5 * factor}deg) rotateY(${mouseParallax.x * 0.5 * factor}deg)`
    };
  };

  const getMouseParallax = (factor = 1) => {
    if (!isMounted || typeof window === "undefined") {
      return { x: 0, y: 0 }
    }

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    return {
      x: ((mousePosition.x - centerX) / 50) * factor,
      y: ((mousePosition.y - centerY) / 50) * factor,
    }
  }

  return (
    <section
      className="w-full pt-4 pb-6 md:py-10 lg:py-14 overflow-hidden grid-lines"
      ref={heroRef}
      // Add content-visibility to improve rendering performance
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}
    >

      <div className="grid-lines-container dark:hidden" />

      {/* Particles for Dark Mode */}
      {isDarkMode && isMounted && !prefersReducedMotion && (
        <ParticleField
          count={100}
          speed={0.3}
          density="medium"
          colors={["#e2e8f0", "#94a3b8", "#cbd5e1"]}
          interactive={true}
          interactionStrength={1.2}
          gridBased={true} // Use the grid-based layout for intersection points
        />
      )}
      <div className="container px-4 md:px-6 relative z-10">
        <m.div
          className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 relative"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <m.div variants={staggerItem} className="relative z-10">
            <m.div
              className="inline-flex mb-4 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 premium-glass-element"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <m.span
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-600 dark:bg-slate-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-700 dark:bg-slate-300"></span>
              </m.span>
              <span className="text-slate-900 dark:text-white text-sm font-medium">AI-Powered Monitoring</span>
            </m.div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight sm:text-6xl xl:text-8xl/none mb-4">WebSync</h1>

            <p className="text-lg md:text-xl font-medium mb-6 text-slate-700 dark:text-slate-300">
              Website Monitoring for the Modern Web
            </p>

            <m.div
              className="max-w-[750px] mx-auto premium-glass-card p-8 rounded-xl shadow-lg border-opacity-50 backdrop-blur-lg"
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${getMouseParallax(-0.5).y}deg) rotateY(${getMouseParallax(0.5).x}deg)`,
              }}
              transition={{ duration: 0.1 }}
            >
              <p className="text-slate-700 dark:text-slate-300 md:text-xl">
                Detect issues before your users do. WebSync monitors your websites 24/7 and sends
                <span className="text-slate-900 dark:text-white font-medium"> instant notifications </span>
                when problems arise, with
                <span className="text-slate-900 dark:text-white font-medium"> AI-powered error analysis </span>
                to help you fix issues quickly.
              </p>
            </m.div>
          </m.div>

          <m.div className="flex flex-col gap-3 min-[400px]:flex-row" variants={staggerItem}>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 gap-1 text-base px-6 py-5 md:px-8 md:py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Start Monitoring <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-base px-6 py-5 md:px-8 md:py-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                View Dashboard
              </Button>
            </Link>
          </m.div>

          <m.div
            className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6 premium-glass-card py-2 md:py-3 px-4 md:px-6 rounded-full"
            variants={staggerItem}
          >
            {features.map((feature, index) => (
              <m.div key={index} className="flex items-center" whileHover={{ scale: 1.05 }}>
                {feature.icon}
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{feature.text}</span>
              </m.div>
            ))}
            <m.div className="flex items-center" whileHover={{ scale: 1.05 }}>
              <Check className="h-4 w-4 text-slate-900 dark:text-white" />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Free</span>
            </m.div>
          </m.div>
        </m.div>

        {/* Dashboard Preview - Only render once mounted */}
        {isMounted && (
          <m.div
            className="flex items-center justify-center mt-12 md:mt-16"
            variants={scaleIn}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            whileHover={!isMobile && !prefersReducedMotion ? {
              y: -5,
              transition: { duration: 0.3 },
            } : {}}
          >
            <div
              className="relative w-full max-w-5xl h-[280px] md:h-[350px] lg:h-[500px] rounded-2xl overflow-hidden scan-line optimize-paint"
              // Force a height to avoid layout shift
              style={{ minHeight: isMobile ? "280px" : "350px" }}
            >
              <m.div
                className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/90 to-slate-100/80 dark:from-slate-900/90 dark:to-black/80 border border-white/50 dark:border-slate-800/50 rounded-2xl shadow-2xl transform-gpu"
                style={getCardStyle(0.2)}
                transition={{ duration: 0.1 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Calculate sizes based on percentages to be more responsive */}
                  <div className="w-[92%] h-[92%] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 flex flex-col border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center">
                        <m.span
                          className="bg-slate-900 dark:bg-white h-3 w-3 md:h-4 md:w-4 rounded-full mr-2"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        ></m.span>
                        WebSync Dashboard
                      </div>
                      <div className="flex space-x-2">
                        <m.div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500" whileHover={{ scale: 1.2 }}></m.div>
                        <m.div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500" whileHover={{ scale: 1.2 }}></m.div>
                        <m.div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500" whileHover={{ scale: 1.2 }}></m.div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 overflow-hidden">
                      {/* Use smaller, more responsive sizes for mobile */}
                      <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3 md:p-4 flex flex-col shadow-sm border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md premium-glass-element">
                        <div className="text-xs md:text-sm font-medium mb-1 md:mb-2 text-slate-500 dark:text-slate-400">Uptime</div>
                        <div className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">99.9%</div>
                        <div className="mt-auto h-6 md:h-10 bg-slate-100 dark:bg-slate-800/30 rounded-md relative overflow-hidden">
                          <m.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 w-[99%]"
                            initial={{ width: 0 }}
                            animate={heroInView ? { width: "99%" } : { width: 0 }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          ></m.div>
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3 md:p-4 flex flex-col shadow-sm border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md premium-glass-element">
                        <div className="text-xs md:text-sm font-medium mb-1 md:mb-2 text-slate-500 dark:text-slate-400">Response Time</div>
                        <div className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">124ms</div>
                        <div className="mt-auto h-6 md:h-10 bg-slate-100 dark:bg-slate-800/30 rounded-md relative overflow-hidden">
                          <div className="h-full w-full flex items-end">
                            {[...Array(8)].map((_, i) => (
                              <m.div
                                key={i}
                                className="w-full h-[30%] bg-gradient-to-t from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mx-[1px]"
                                initial={{ height: "0%" }}
                                animate={heroInView ? {
                                  height: `${Math.max(20, Math.min(100, 30 + Math.sin(i * 0.8) * 20))}%`,
                                } : { height: "0%" }}
                                transition={{
                                  duration: 0.5,
                                  delay: 0.5 + i * 0.1,
                                  ease: "easeOut",
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "mirror",
                                  repeatDelay: 2,
                                }}
                              ></m.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3 md:p-4 flex flex-col shadow-sm border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md premium-glass-element">
                        <div className="text-xs md:text-sm font-medium mb-1 md:mb-2 text-slate-500 dark:text-slate-400">Total Checks</div>
                        <div className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">
                          <m.span
                            initial={{ opacity: 0 }}
                            animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                          >
                            128,457
                          </m.span>
                        </div>
                        <div className="mt-auto h-6 md:h-10 bg-slate-100 dark:bg-slate-800/30 rounded-md relative overflow-hidden">
                          <m.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300"
                            initial={{ width: "0%" }}
                            animate={heroInView ? { width: "85%" } : { width: "0%" }}
                            transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                          ></m.div>
                        </div>
                      </div>

                      {/* Hide this section on very small screens to improve performance */}
                      <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3 md:p-4 col-span-1 md:col-span-3 shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md premium-glass-element hidden sm:block">
                        <div className="text-xs md:text-sm font-medium mb-2 md:mb-3 text-slate-500 dark:text-slate-400">Monitored Sites</div>
                        <div className="space-y-2 md:space-y-3">
                          <m.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <div className="flex items-center">
                              <m.div
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
                              ></m.div>
                              <span className="text-xs md:text-sm text-slate-900 dark:text-white">example.com</span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">2s ago</span>
                          </m.div>
                          <m.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                          >
                            <div className="flex items-center">
                              <m.div
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
                              ></m.div>
                              <span className="text-xs md:text-sm text-slate-900 dark:text-white">dashboard.app</span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">5s ago</span>
                          </m.div>
                          <m.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                          >
                            <div className="flex items-center">
                              <m.div
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
                              ></m.div>
                              <span className="text-xs md:text-sm text-slate-900 dark:text-white">api.service.io</span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">30s ago</span>
                          </m.div>
                          <m.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                          >
                            <div className="flex items-center">
                              <m.div
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
                              ></m.div>
                              <span className="text-xs md:text-sm text-slate-900 dark:text-white">status.cloud.dev</span>
                            </div>
                            <m.span
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
                              Alert
                            </m.span>
                          </m.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </div>
    </section>
  )
}
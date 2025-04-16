"use client"

import { useRef, useEffect, useState, ReactNode } from "react"
import { LazyMotion, domAnimation, m, useInView } from "framer-motion"

import HeroSection from "@/components/home/HeroSection"
import NotificationsSection from "@/components/home/NotificationsSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import BenefitsSection from "@/components/home/BenefitsSection"
import CtaSection from "@/components/home/CtaSection"

// Optimized background animation component

interface AnimatedSectionProps {
  children: ReactNode
  id: string
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <m.div
        className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <m.div
        className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <m.div
        className="absolute top-[40%] left-[15%] w-[25%] h-[25%] rounded-full bg-purple-400/5 dark:bg-purple-500/10 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  )
}

// Optimized section wrapper with scroll-triggered animations
const AnimatedSection = ({ children, id }: AnimatedSectionProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.2, once: true })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  return (
    <section ref={ref} id={id} className="relative">
      <m.div
        initial={{ opacity: 0, y: 50 }}
        animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </section>
  )
}

export default function Home() {
  // Use LazyMotion to reduce initial bundle size
  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
        {/* Optimized background elements - loaded once and cached */}
        <AnimatedBackground />

        {/* Main Content with optimized animations */}
        <div className="relative z-10">
          <HeroSection />

          <AnimatedSection id="notifications">
            <NotificationsSection />
          </AnimatedSection>

          <AnimatedSection id="how-it-works">
            <HowItWorksSection />
          </AnimatedSection>

          <AnimatedSection id="features">
            <FeaturesSection />
          </AnimatedSection>

          <AnimatedSection id="benefits">
            <BenefitsSection />
          </AnimatedSection>

          <AnimatedSection id="cta">
            <CtaSection />
          </AnimatedSection>
        </div>
      </div>
    </LazyMotion>
  )
}

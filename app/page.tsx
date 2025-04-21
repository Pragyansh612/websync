"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"

import HeroSection from "@/components/home/HeroSection"

// Dynamic imports with proper loading strategies
const BentoGridSection = dynamic(() => import("@/components/home/BentoGridSection"), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-slate-50/20 dark:bg-slate-900/20 backdrop-blur rounded-lg" />
})
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection"), { ssr: false })
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"), { ssr: false })
const NotificationsSection = dynamic(() => import("@/components/home/NotificationsSection"), { ssr: false })
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"), { ssr: false })
// Removed BenefitsSection since it duplicates other content
const CtaSection = dynamic(() => import("@/components/home/CtaSection"), { ssr: false })

// Optimized minimal animated background component
const AnimatedBackground = () => {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <m.div
        className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-slate-400/5 dark:bg-slate-500/5 blur-3xl"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Improved intersection observer section for smoother loading
function LazySection({ children, id, priority = false }:any) {
  const [isVisible, setIsVisible] = useState(priority)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    // Skip for SSR or if already visible
    if (typeof window === 'undefined' || isVisible) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          // Add small delay for smoother appearance
          setTimeout(() => setIsVisible(true), 100)
          setHasIntersected(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '200px 0px', threshold: 0.05 }
    )

    const element = document.getElementById(id)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [id, isVisible, hasIntersected])

  return (
    <section id={id} className="relative">
      {isVisible ? children : <div className="min-h-[200px] flex items-center justify-center" />}
    </section>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted ? (
        <LazyMotion features={domAnimation} strict>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <AnimatedBackground />

            {/* Main Content with optimized flow */}
            <div className="relative z-10">
              {/* Above the fold content */}
              <HeroSection />

              {/* Strategically ordered sections */}
              <div className="space-y-16 md:space-y-24">
                <LazySection id="bento" priority={true}>
                  <BentoGridSection />
                </LazySection>

                <LazySection id="how-it-works">
                  <HowItWorksSection />
                </LazySection>

                <LazySection id="features">
                  <FeaturesSection />
                </LazySection>

                <LazySection id="notifications">
                  <NotificationsSection />
                </LazySection>

                <LazySection id="testimonials">
                  <TestimonialsSection />
                </LazySection>

                {/* Removed BenefitsSection as it duplicates content */}

                <LazySection id="cta">
                  <CtaSection />
                </LazySection>
              </div>
            </div>
          </div>
        </LazyMotion>
      ) : (
        /* Improved initial loading state */
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="relative z-10">
            <HeroSection />
            <div className="space-y-16 md:space-y-24">
              <section id="bento" className="min-h-[300px] flex items-center justify-center"></section>
              <section id="how-it-works" className="min-h-[200px]"></section>
            </div>
          </div>
        </div>
      )}
    </>
  )
}